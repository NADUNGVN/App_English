import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { env } from "../../config/env";
import { HttpError } from "../../lib/httpError";
import {
  coerceTimingReviewDocument,
  getBaseReviewLesson,
  listeningReviewWorkspaceRoot,
  saveTimingReviewDocument,
} from "./listening.review";
import type { ListeningTimingReviewDocument } from "./listening.types";

const categoryId = "bbc-learning-english";
const audioRoot = path.join(listeningReviewWorkspaceRoot, ".tmp", "audio");
const workerScriptPath = path.join(
  listeningReviewWorkspaceRoot,
  "tools",
  "generate_word_timing_drafts.py",
);
const reviewRoot = path.join(listeningReviewWorkspaceRoot, "review");
const repoRoot = path.resolve(listeningReviewWorkspaceRoot, "..", "..");

export type TimingRecognitionJobStatus =
  | "QUEUED"
  | "PREPARING_AUDIO"
  | "DOWNLOADING_AUDIO"
  | "LOADING_MODEL"
  | "TRANSCRIBING"
  | "ALIGNING"
  | "SAVING_DRAFT"
  | "COMPLETED"
  | "FAILED";

export type TimingRecognitionStats = {
  interpolatedWordCount: number;
  modelWordCount: number;
  segmentFallbackWordCount: number;
  totalWordCount: number;
};

export type TimingRecognitionJob = {
  device: string;
  error?: string;
  finishedAt?: string;
  jobId: string;
  lessonId: string;
  message: string;
  model: string;
  progress: number;
  startedAt: string;
  status: TimingRecognitionJobStatus;
  stats?: TimingRecognitionStats;
  stdout?: string;
  updatedAt: string;
};

type InternalTimingRecognitionJob = TimingRecognitionJob & {
  document?: ListeningTimingReviewDocument;
  stderr?: string;
  updatedBy: string;
};

type CommandResult = {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
};

type CommandOptions = {
  cwd?: string;
  onStdoutLine?: (line: string) => void;
  timeoutMs?: number;
};

const terminalStatuses = new Set<TimingRecognitionJobStatus>(["COMPLETED", "FAILED"]);
const timingJobs = new Map<string, InternalTimingRecognitionJob>();
const activeLessonJobs = new Map<string, string>();

const stageProgress: Record<TimingRecognitionJobStatus, number> = {
  ALIGNING: 78,
  COMPLETED: 100,
  DOWNLOADING_AUDIO: 18,
  FAILED: 100,
  LOADING_MODEL: 38,
  PREPARING_AUDIO: 10,
  QUEUED: 0,
  SAVING_DRAFT: 90,
  TRANSCRIBING: 56,
};

function nowIso() {
  return new Date().toISOString();
}

function resolveLocalPath(value: string) {
  if (path.isAbsolute(value)) {
    return value;
  }

  return path.resolve(repoRoot, value);
}

function getPythonCommand() {
  if (env.LISTENING_TIMING_PYTHON) {
    return resolveLocalPath(env.LISTENING_TIMING_PYTHON);
  }

  const localVenvPython = path.join(repoRoot, ".venv", "Scripts", "python.exe");

  if (existsSync(localVenvPython)) {
    return localVenvPython;
  }

  return "python";
}

function buildAudioUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function getAudioPath(videoId: string) {
  return path.join(audioRoot, `${videoId}.wav`);
}

async function hasUsableFile(filePath: string) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile() && fileStat.size > 0;
  } catch {
    return false;
  }
}

function emitBufferedLines(
  nextChunk: string,
  currentBuffer: string,
  onLine?: (line: string) => void,
) {
  const merged = currentBuffer + nextChunk;
  const lines = merged.split(/\r?\n/);
  const nextBuffer = lines.pop() ?? "";

  if (onLine) {
    lines.forEach((line) => {
      if (line.trim()) {
        onLine(line);
      }
    });
  }

  return nextBuffer;
}

function runCommand(command: string, args: string[], options: CommandOptions = {}) {
  return new Promise<CommandResult>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      shell: false,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    let stdoutBuffer = "";
    let finished = false;
    const timeout =
      options.timeoutMs && options.timeoutMs > 0
        ? setTimeout(() => {
            if (finished) {
              return;
            }

            child.kill("SIGTERM");
          }, options.timeoutMs)
        : null;

    child.stdout.on("data", (chunk) => {
      const text = String(chunk);
      stdout += text;
      stdoutBuffer = emitBufferedLines(text, stdoutBuffer, options.onStdoutLine);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      reject(
        new HttpError(503, "Unable to start timing worker command", {
          command,
          message: error.message,
        }),
      );
    });
    child.on("close", (code, signal) => {
      finished = true;
      if (timeout) {
        clearTimeout(timeout);
      }

      if (stdoutBuffer.trim() && options.onStdoutLine) {
        options.onStdoutLine(stdoutBuffer);
      }

      resolve({ code, signal, stdout, stderr });
    });
  });
}

async function ensureAudioDownloaded(videoId: string, onStatus?: (message: string) => void) {
  const audioPath = getAudioPath(videoId);

  if (await hasUsableFile(audioPath)) {
    onStatus?.("Using cached review audio.");
    return audioPath;
  }

  await mkdir(audioRoot, { recursive: true });
  onStatus?.("Downloading YouTube audio with yt-dlp.");

  const result = await runCommand(
    "yt-dlp",
    [
      "-f",
      "ba",
      "-x",
      "--audio-format",
      "wav",
      "--audio-quality",
      "0",
      "-o",
      audioPath.replace(/\.wav$/i, ".%(ext)s"),
      buildAudioUrl(videoId),
    ],
    {
      cwd: repoRoot,
      timeoutMs: 1000 * 60 * 8,
    },
  );

  if (result.code !== 0 || !(await hasUsableFile(audioPath))) {
    throw new HttpError(503, "Unable to prepare review audio", {
      code: result.code,
      stderr: result.stderr.slice(-2000),
      stdout: result.stdout.slice(-1000),
    });
  }

  return audioPath;
}

function toPublicJob(job: InternalTimingRecognitionJob): TimingRecognitionJob {
  return {
    device: job.device,
    error: job.error,
    finishedAt: job.finishedAt,
    jobId: job.jobId,
    lessonId: job.lessonId,
    message: job.message,
    model: job.model,
    progress: job.progress,
    startedAt: job.startedAt,
    status: job.status,
    stats: job.stats,
    stdout: job.stdout,
    updatedAt: job.updatedAt,
  };
}

function updateJob(
  jobId: string,
  patch: Partial<Omit<InternalTimingRecognitionJob, "jobId" | "lessonId" | "startedAt">>,
) {
  const current = timingJobs.get(jobId);

  if (!current) {
    return null;
  }

  const status = patch.status ?? current.status;
  const next: InternalTimingRecognitionJob = {
    ...current,
    ...patch,
    progress: patch.progress ?? stageProgress[status],
    updatedAt: nowIso(),
  };

  timingJobs.set(jobId, next);
  return next;
}

function parseProgressLine(line: string) {
  try {
    const payload = JSON.parse(line) as {
      message?: unknown;
      stage?: unknown;
      type?: unknown;
    };

    if (payload.type !== "timing-progress" || typeof payload.stage !== "string") {
      return null;
    }

    return {
      message: typeof payload.message === "string" ? payload.message : payload.stage,
      stage: payload.stage as TimingRecognitionJobStatus,
    };
  } catch {
    return null;
  }
}

function getStats(document: ListeningTimingReviewDocument): TimingRecognitionStats {
  let interpolatedWordCount = 0;
  let modelWordCount = 0;
  let segmentFallbackWordCount = 0;
  let totalWordCount = 0;

  document.segments.forEach((segment) => {
    segment.words.forEach((word) => {
      totalWordCount += 1;

      if (word.source === "MODEL") {
        modelWordCount += 1;
      } else if (word.source === "INTERPOLATED") {
        interpolatedWordCount += 1;
      } else if (word.source === "SEGMENT_FALLBACK") {
        segmentFallbackWordCount += 1;
      }
    });
  });

  return {
    interpolatedWordCount,
    modelWordCount,
    segmentFallbackWordCount,
    totalWordCount,
  };
}

function formatError(error: unknown) {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to run timing recognition";
}

async function executeTimingRecognitionJob(jobId: string) {
  const job = timingJobs.get(jobId);

  if (!job) {
    return;
  }

  const lesson = getBaseReviewLesson(job.lessonId);
  const pythonCommand = getPythonCommand();

  try {
    if (!existsSync(workerScriptPath)) {
      throw new HttpError(503, "Timing worker script was not found", {
        workerScriptPath,
      });
    }

    updateJob(jobId, {
      message: "Preparing review audio.",
      status: "PREPARING_AUDIO",
    });

    const audioPath = getAudioPath(lesson.youtubeVideoId);
    if (!(await hasUsableFile(audioPath))) {
      updateJob(jobId, {
        message: "Downloading YouTube audio with yt-dlp.",
        status: "DOWNLOADING_AUDIO",
      });
    }

    await ensureAudioDownloaded(lesson.youtubeVideoId, (message) =>
      updateJob(jobId, { message }),
    );

    const result = await runCommand(
      pythonCommand,
      [
        workerScriptPath,
        "--category",
        categoryId,
        "--lesson-id",
        lesson.id,
        "--limit",
        "1",
        "--model",
        job.model,
        "--device",
        job.device,
        "--progress-json",
      ],
      {
        cwd: repoRoot,
        onStdoutLine: (line) => {
          const progress = parseProgressLine(line);

          if (!progress || !(progress.stage in stageProgress)) {
            return;
          }

          const nextStage =
            progress.stage === "COMPLETED" ? "SAVING_DRAFT" : progress.stage;
          const currentJob = timingJobs.get(jobId);

          if (currentJob && stageProgress[nextStage] < currentJob.progress) {
            return;
          }

          updateJob(jobId, {
            message: progress.message,
            status: nextStage,
          });
        },
        timeoutMs: 1000 * 60 * 45,
      },
    );

    if (result.code !== 0) {
      throw new HttpError(503, "Unable to run timing recognition", {
        code: result.code,
        pythonCommand,
        stderr: result.stderr.slice(-3000),
        stdout: result.stdout.slice(-1500),
      });
    }

    updateJob(jobId, {
      message: "Saving timing draft for review.",
      status: "SAVING_DRAFT",
    });

    const reviewPath = path.join(reviewRoot, lesson.categoryId, `${lesson.id}.json`);
    const payload = JSON.parse(await readFile(reviewPath, "utf8")) as unknown;
    const document = coerceTimingReviewDocument(payload) as ListeningTimingReviewDocument;
    const savedDocument = await saveTimingReviewDocument(lesson.id, document, job.updatedBy);
    const stats = getStats(savedDocument);

    updateJob(jobId, {
      document: savedDocument,
      finishedAt: nowIso(),
      message: `Timing draft completed: ${stats.modelWordCount}/${stats.totalWordCount} words from model.`,
      stats,
      status: "COMPLETED",
      stdout: result.stdout.slice(-1500),
    });
  } catch (error) {
    updateJob(jobId, {
      error: formatError(error),
      finishedAt: nowIso(),
      message: "Timing recognition failed.",
      status: "FAILED",
    });
  } finally {
    const activeJobId = activeLessonJobs.get(job.lessonId);

    if (activeJobId === jobId) {
      activeLessonJobs.delete(job.lessonId);
    }
  }
}

export async function getTimingReviewAudioFile(lessonId: string) {
  const lesson = getBaseReviewLesson(lessonId);
  const filePath = await ensureAudioDownloaded(lesson.youtubeVideoId);
  const fileStat = await stat(filePath);

  return {
    contentType: "audio/wav",
    filePath,
    size: fileStat.size,
  };
}

export function getTimingRecognitionJob(jobId: string) {
  const job = timingJobs.get(jobId);

  if (!job) {
    throw new HttpError(404, "Timing job was not found");
  }

  return toPublicJob(job);
}

export function getTimingRecognitionJobDocument(jobId: string) {
  const job = timingJobs.get(jobId);

  if (!job || !job.document) {
    return null;
  }

  return job.document;
}

export function startTimingRecognitionJob(lessonId: string, updatedBy: string) {
  const existingJobId = activeLessonJobs.get(lessonId);
  const existingJob = existingJobId ? timingJobs.get(existingJobId) : null;

  if (existingJob && !terminalStatuses.has(existingJob.status)) {
    return toPublicJob(existingJob);
  }

  getBaseReviewLesson(lessonId);

  const timestamp = nowIso();
  const job: InternalTimingRecognitionJob = {
    device: env.LISTENING_TIMING_DEVICE ?? "cpu",
    jobId: randomUUID(),
    lessonId,
    message: "Queued timing recognition.",
    model: env.LISTENING_TIMING_MODEL ?? "large-v3",
    progress: stageProgress.QUEUED,
    startedAt: timestamp,
    status: "QUEUED",
    updatedAt: timestamp,
    updatedBy,
  };

  timingJobs.set(job.jobId, job);
  activeLessonJobs.set(lessonId, job.jobId);
  void executeTimingRecognitionJob(job.jobId);

  return toPublicJob(job);
}

export async function runTimingRecognitionForLesson(lessonId: string, updatedBy: string) {
  const job = startTimingRecognitionJob(lessonId, updatedBy);

  while (!terminalStatuses.has(getTimingRecognitionJob(job.jobId).status)) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const completedJob = getTimingRecognitionJob(job.jobId);
  const document = getTimingRecognitionJobDocument(job.jobId);

  if (completedJob.status === "FAILED" || !document) {
    throw new HttpError(503, completedJob.error ?? "Unable to run timing recognition");
  }

  return {
    document,
    job: {
      device: completedJob.device,
      model: completedJob.model,
      status: "completed" as const,
      stdout: completedJob.stdout,
    },
  };
}
