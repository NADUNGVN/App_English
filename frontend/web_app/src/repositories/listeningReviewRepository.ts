import { request } from "../lib/apiClient";
import type {
  ListeningLessonDetail,
  ListeningReviewLessonSummary,
  ListeningTimingReviewDocument,
  TimingRecognitionJob,
} from "../server/modules/listening/listening.types";

type ReviewLessonListResponse = {
  lessons: ListeningReviewLessonSummary[];
};

type ReviewLessonResponse = {
  lesson: ListeningLessonDetail;
  document: ListeningTimingReviewDocument;
};

type ReviewDocumentResponse = {
  document: ListeningTimingReviewDocument;
};

type TimingJobResponse = {
  job: TimingRecognitionJob;
};

type RecognizeTimingResponse = {
  document: ListeningTimingReviewDocument;
  job: {
    device: string;
    model: string;
    status: "completed";
    stdout?: string;
  };
};

export const listeningReviewRepository = {
  listLessons() {
    return request<ReviewLessonListResponse>("/internal/listening-review/lessons", {
      method: "GET",
    });
  },
  getLesson(lessonId: string) {
    return request<ReviewLessonResponse>(
      `/internal/listening-review/lessons/${lessonId}`,
      {
        method: "GET",
      },
    );
  },
  saveLesson(lessonId: string, document: ListeningTimingReviewDocument) {
    return request<ReviewDocumentResponse>(
      `/internal/listening-review/lessons/${lessonId}`,
      {
        body: document,
        method: "PUT",
      },
    );
  },
  approveLesson(lessonId: string) {
    return request<ReviewDocumentResponse>(
      `/internal/listening-review/lessons/${lessonId}/approve`,
      {
        method: "POST",
      },
    );
  },
  getAudioUrl(lessonId: string) {
    return `/api/internal/listening-review/lessons/${lessonId}/audio`;
  },
  getTimingJob(jobId: string) {
    return request<TimingJobResponse>(`/internal/listening-review/timing-jobs/${jobId}`, {
      method: "GET",
    });
  },
  recognizeTiming(lessonId: string) {
    return request<RecognizeTimingResponse>(
      `/internal/listening-review/lessons/${lessonId}/recognize-timing`,
      {
        method: "POST",
      },
    );
  },
  startTimingJob(lessonId: string) {
    return request<TimingJobResponse>(
      `/internal/listening-review/lessons/${lessonId}/timing-jobs`,
      {
        method: "POST",
      },
    );
  },
};
