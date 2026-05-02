"use client";

import {
  BookOpen,
  CheckCircle,
  Clock,
  Fire,
  FunnelSimple,
  Headphones,
  PlayCircle,
  SquaresFour,
  TrendUp,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import {
  createEmptyListeningProgress,
  loadListeningProgress,
  type ListeningProgressState,
} from "../../lib/listeningProgressStorage";
import type {
  ListeningCatalog,
  ListeningCatalogCategory,
  ListeningCatalogLevel,
  ListeningLessonSummary,
  ListeningLevelFilter,
  LocalizedText,
} from "../../server/modules/listening/listening.types";

const ALL_CATEGORY_ID = "all";
const ALL_LEVEL_ID: ListeningLevelFilter = "ALL";

type ListeningLibraryPageProps = {
  catalog: ListeningCatalog;
  selectedCategoryId: string;
  selectedLevel: ListeningLevelFilter;
};

type AppContextValue = {
  locale: "vi" | "en";
};

type LessonProgress = {
  averageAccuracy: number;
  checkedCount: number;
  isComplete: boolean;
};

function pickText(value: LocalizedText, locale: "vi" | "en") {
  return value[locale] ?? value.vi;
}

function buildLibraryHref(categoryId: string, level: ListeningLevelFilter) {
  const searchParams = new URLSearchParams();

  if (categoryId !== ALL_CATEGORY_ID) {
    searchParams.set("category", categoryId);
  }

  if (level !== ALL_LEVEL_ID) {
    searchParams.set("level", level);
  }

  const query = searchParams.toString();

  return query ? `/dictation?${query}` : "/dictation";
}

function buildProgressByLesson(progress: ListeningProgressState) {
  return Object.values(progress.segmentResults).reduce(
    (map, result) => {
      const current = map.get(result.lessonId) ?? {
        accuracyTotal: 0,
        checkedSegments: new Set<string>(),
        completeSegments: new Set<string>(),
        resultCount: 0,
      };

      current.checkedSegments.add(result.segmentId);
      current.accuracyTotal += result.accuracy;
      current.resultCount += 1;

      if (result.isComplete) {
        current.completeSegments.add(result.segmentId);
      }

      map.set(result.lessonId, current);

      return map;
    },
    new Map<
      string,
      {
        accuracyTotal: number;
        checkedSegments: Set<string>;
        completeSegments: Set<string>;
        resultCount: number;
      }
    >(),
  );
}

function getLessonProgress(
  lesson: ListeningLessonSummary,
  progressByLesson: ReturnType<typeof buildProgressByLesson>,
): LessonProgress {
  const progress = progressByLesson.get(lesson.id);

  if (!progress) {
    return {
      averageAccuracy: 0,
      checkedCount: 0,
      isComplete: false,
    };
  }

  return {
    averageAccuracy:
      progress.resultCount > 0
        ? Math.round(progress.accuracyTotal / progress.resultCount)
        : 0,
    checkedCount: progress.checkedSegments.size,
    isComplete: progress.completeSegments.size >= lesson.segmentCount,
  };
}

function getUniqueLessons(catalog: ListeningCatalog) {
  const lessons = new Map<string, ListeningLessonSummary>();

  catalog.sections.forEach((section) => {
    section.lessons.forEach((lesson) => {
      lessons.set(lesson.id, lesson);
    });
  });

  return [...lessons.values()];
}

function CategoryChip({
  category,
  label,
  selected,
  selectedLevel,
}: {
  category: ListeningCatalogCategory | null;
  label: string;
  selected: boolean;
  selectedLevel: ListeningLevelFilter;
}) {
  const categoryId = category?.id ?? ALL_CATEGORY_ID;

  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98] ${
        selected
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-sand-200 bg-white/75 text-slate-600 hover:border-brand-200 hover:text-ink-950"
      }`}
      href={buildLibraryHref(categoryId, selectedLevel)}
    >
      {label}
      {category?.isHot ? (
        <Fire aria-hidden="true" size={15} weight="fill" />
      ) : null}
      {category ? (
        <span
          className={`font-mono text-xs ${
            selected ? "text-white/78" : "text-slate-400"
          }`}
        >
          {category.count}
        </span>
      ) : null}
    </Link>
  );
}

function LevelChip({
  categoryId,
  level,
  selected,
}: {
  categoryId: string;
  level: ListeningCatalogLevel;
  selected: boolean;
}) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98] ${
        selected
          ? "bg-brand-500 text-white"
          : "bg-transparent text-slate-500 hover:bg-white hover:text-ink-950"
      }`}
      href={buildLibraryHref(categoryId, level.id)}
    >
      {level.id === ALL_LEVEL_ID ? level.label : level.id}
      {level.id !== ALL_LEVEL_ID && level.count > 0 ? (
        <span
          className={`font-mono text-xs ${
            selected ? "text-white/78" : "text-slate-400"
          }`}
        >
          {level.count}
        </span>
      ) : null}
    </Link>
  );
}

function LessonCard({
  lesson,
  locale,
  progress,
}: {
  lesson: ListeningLessonSummary;
  locale: "vi" | "en";
  progress: LessonProgress;
}) {
  const title = pickText(lesson.title, locale);
  const description = pickText(lesson.description, locale);
  const statusLabel =
    progress.checkedCount === 0
      ? locale === "vi"
        ? "Chưa bắt đầu"
        : "Not started"
      : progress.isComplete
        ? locale === "vi"
          ? "Đã hoàn thành"
          : "Completed"
        : locale === "vi"
          ? `${progress.checkedCount}/${lesson.segmentCount} đoạn`
          : `${progress.checkedCount}/${lesson.segmentCount} segments`;

  return (
    <Link
      aria-label={`${locale === "vi" ? "Mở bài nghe" : "Open listening lesson"} ${title}`}
      className="group block w-[min(78vw,18rem)] shrink-0 snap-start focus-visible:outline-none sm:w-[17.25rem] xl:w-[18rem]"
      href={`/dictation/${lesson.id}`}
    >
      <article className="h-full overflow-hidden rounded-[1.45rem] border border-sand-200 bg-white shadow-[0_24px_48px_-40px_rgba(120,53,15,0.26)] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[2px] group-hover:border-brand-200 group-hover:shadow-[0_28px_54px_-38px_rgba(120,53,15,0.32)] group-focus-visible:ring-4 group-focus-visible:ring-brand-100 group-active:translate-y-[1px] group-active:scale-[0.99]">
        <div className="relative aspect-[16/9] overflow-hidden bg-sand-100">
          <img
            alt={`${title} thumbnail`}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
            decoding="async"
            height={360}
            loading="lazy"
            src={lesson.thumbnailUrl}
            width={640}
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950/52 to-transparent" />
          <span className="absolute left-3 top-3 rounded-[0.7rem] bg-brand-500 px-2.5 py-1 text-xs font-bold text-white shadow-[0_12px_26px_-18px_rgba(120,53,15,0.55)]">
            {lesson.level}
          </span>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink-950/72 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Clock aria-hidden="true" size={14} weight="duotone" />
            {lesson.durationMinutes} min
          </span>
        </div>

        <div className="grid min-h-[11.35rem] gap-3 p-4">
          <div>
            <p className="line-clamp-2 min-h-[3.15rem] text-[1.02rem] font-semibold leading-[1.45] tracking-[-0.025em] text-ink-950">
              {title}
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                {lesson.source}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {lesson.segmentCount}{" "}
                {locale === "vi" ? "phân đoạn" : "segments"}
              </p>
            </div>
            <span
              className={`inline-flex max-w-[8.5rem] shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                progress.isComplete
                  ? "bg-emerald-50 text-emerald-700"
                  : progress.checkedCount > 0
                    ? "bg-amber-50 text-amber-800"
                    : "bg-sand-100 text-slate-500"
              }`}
            >
              {progress.isComplete ? (
                <CheckCircle aria-hidden="true" size={14} weight="fill" />
              ) : (
                <PlayCircle aria-hidden="true" size={14} weight="duotone" />
              )}
              <span className="truncate">{statusLabel}</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ListeningLibraryPage({
  catalog,
  selectedCategoryId,
  selectedLevel,
}: ListeningLibraryPageProps) {
  const appContext = useAppContext() as AppContextValue;
  const locale: "vi" | "en" = appContext.locale === "en" ? "en" : "vi";
  const [progress, setProgress] = useState<ListeningProgressState>(() =>
    createEmptyListeningProgress(),
  );
  const lessons = useMemo(() => getUniqueLessons(catalog), [catalog]);
  const progressByLesson = useMemo(() => buildProgressByLesson(progress), [progress]);
  const allLessonCount = catalog.categories.reduce(
    (total, category) => total + category.count,
    0,
  );

  useEffect(() => {
    setProgress(loadListeningProgress());
  }, []);

  const stats = useMemo(() => {
    const progresses = lessons.map((lesson) =>
      getLessonProgress(lesson, progressByLesson),
    );
    const activeCount = progresses.filter(
      (item) => item.checkedCount > 0 && !item.isComplete,
    ).length;
    const completedCount = progresses.filter((item) => item.isComplete).length;
    const accuracyItems = progresses.filter((item) => item.averageAccuracy > 0);
    const averageAccuracy =
      accuracyItems.length > 0
        ? Math.round(
            accuracyItems.reduce((total, item) => total + item.averageAccuracy, 0) /
              accuracyItems.length,
          )
        : 0;

    return {
      activeCount,
      averageAccuracy,
      completedCount,
    };
  }, [lessons, progressByLesson]);

  const copy = {
    vi: {
      active: "đang học",
      all: "Tất cả",
      allLevels: "Tất cả cấp độ",
      average: "trung bình",
      completed: "đã hoàn thành",
      emptyDescription:
        "Không có bài nghe nào khớp với bộ lọc hiện tại. Hãy chọn chủ đề hoặc cấp độ khác.",
      emptyTitle: "Chưa có bài nghe phù hợp",
      heading: "Luyện Dictation",
      lessons: "bài",
      sections: "Không gian luyện nghe",
      subtitle: "Chọn chủ đề để luyện kỹ năng nghe",
      viewCategory: "Xem chủ đề",
      viewMore: "Xem thêm",
    },
    en: {
      active: "in progress",
      all: "All",
      allLevels: "All levels",
      average: "average",
      completed: "completed",
      emptyDescription:
        "No listening lessons match the current filters. Try another topic or level.",
      emptyTitle: "No matching lessons",
      heading: "Dictation Practice",
      lessons: "lessons",
      sections: "Listening workspace",
      subtitle: "Choose a topic to train listening skills",
      viewCategory: "View Topics",
      viewMore: "View More",
    },
  }[locale];

  return (
    <div className="flex flex-col overflow-hidden rounded-shell border border-sand-200 bg-[rgb(255,252,247)] shadow-panel lg:h-full">
      <header className="shrink-0 border-b border-sand-200 bg-white/88 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8 lg:py-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr),auto] xl:items-start">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border border-sand-200 bg-white text-ink-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <Headphones aria-hidden="true" size={27} weight="duotone" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[1.65rem] font-semibold leading-[1.15] tracking-[-0.04em] text-ink-950 sm:text-[1.9rem]">
                {copy.heading}
              </h1>
              <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
                {copy.subtitle}
              </p>
            </div>
          </div>

          <div className="grid gap-2 text-sm font-semibold text-slate-500 sm:grid-cols-3 xl:min-w-[34rem]">
            <div className="flex items-center gap-2 rounded-[1rem] border border-sand-200 bg-white/75 px-3 py-2">
              <BookOpen aria-hidden="true" size={18} weight="duotone" />
              <span className="font-mono text-ink-950">{stats.activeCount}</span>
              <span>{copy.active}</span>
            </div>
            <div className="flex items-center gap-2 rounded-[1rem] border border-sand-200 bg-white/75 px-3 py-2">
              <CheckCircle
                aria-hidden="true"
                className="text-emerald-600"
                size={18}
                weight="duotone"
              />
              <span className="font-mono text-ink-950">{stats.completedCount}</span>
              <span>{copy.completed}</span>
            </div>
            <div className="flex items-center gap-2 rounded-[1rem] border border-sand-200 bg-white/75 px-3 py-2">
              <TrendUp aria-hidden="true" size={18} weight="duotone" />
              <span className="font-mono text-ink-950">{stats.averageAccuracy}%</span>
              <span>{copy.average}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 min-w-0 border-t border-sand-200 pt-4">
          <div className="scrollbar-hidden -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
            <CategoryChip
              category={null}
              label={`${copy.all} ${allLessonCount}`}
              selected={selectedCategoryId === ALL_CATEGORY_ID}
              selectedLevel={selectedLevel}
            />
            {catalog.categories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                label={pickText(category.label, locale)}
                selected={selectedCategoryId === category.id}
                selectedLevel={selectedLevel}
              />
            ))}
          </div>

          <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="scrollbar-hidden -mx-1 flex min-w-0 snap-x gap-2 overflow-x-auto px-1 pb-1">
              {catalog.levels.map((level) => (
                <LevelChip
                  key={level.id}
                  categoryId={selectedCategoryId}
                  level={{
                    ...level,
                    label: level.id === ALL_LEVEL_ID ? copy.allLevels : level.label,
                  }}
                  selected={selectedLevel === level.id}
                />
              ))}
            </div>
            <Link
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[1rem] border border-sand-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-[border-color,color,transform] duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98]"
              href="/dictation"
            >
              <SquaresFour aria-hidden="true" size={18} weight="duotone" />
              {copy.viewCategory}
            </Link>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        {catalog.sections.length === 0 ? (
          <div className="rounded-[1.45rem] border border-dashed border-sand-200 bg-white/65 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <FunnelSimple aria-hidden="true" size={24} weight="duotone" />
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-ink-950">
              {copy.emptyTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              {copy.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="space-y-8 pb-2">
            {catalog.sections.map((section) => (
              <section key={section.id}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    {section.categoryId ? (
                      <p className="type-eyebrow-label">{copy.sections}</p>
                    ) : null}
                    <h2 className="mt-1 text-[1.35rem] font-semibold leading-[1.2] tracking-[-0.035em] text-ink-950 sm:text-[1.55rem]">
                      {pickText(section.title, locale)}
                      <span className="ml-2 align-middle font-mono text-sm text-slate-400">
                        {section.count}
                      </span>
                    </h2>
                  </div>
                  {section.categoryId ? (
                    <Link
                      className="hidden shrink-0 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:inline-flex"
                      href={buildLibraryHref(section.categoryId, selectedLevel)}
                    >
                      {copy.viewMore}
                    </Link>
                  ) : null}
                </div>

                <div className="scrollbar-hidden -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-3">
                  {section.lessons.map((lesson) => (
                    <LessonCard
                      key={`${section.id}-${lesson.id}`}
                      lesson={lesson}
                      locale={locale}
                      progress={getLessonProgress(lesson, progressByLesson)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
