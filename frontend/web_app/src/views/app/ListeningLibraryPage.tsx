"use client";

import {
  ArrowLeft,
  BookOpen,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Clock,
  Fire,
  FunnelSimple,
  Headphones,
  PlayCircle,
  SquaresFour,
  TrendUp,
  YoutubeLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  mode?: "category" | "overview";
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

function buildCategoryWorkspaceHref(
  categoryId: string,
  level: ListeningLevelFilter,
) {
  const searchParams = new URLSearchParams();

  if (level !== ALL_LEVEL_ID) {
    searchParams.set("level", level);
  }

  const query = searchParams.toString();

  return `/dictation/categories/${categoryId}${query ? `?${query}` : ""}`;
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
    isComplete:
      lesson.segmentCount > 0 &&
      progress.completeSegments.size >= lesson.segmentCount,
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
      className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98] ${
        selected
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-sand-200 bg-white/75 text-slate-600 hover:border-brand-200 hover:text-ink-950"
      }`}
      href={buildLibraryHref(categoryId, selectedLevel)}
    >
      {label}
      {category?.isHot ? (
        <Fire aria-hidden="true" size={13} weight="fill" />
      ) : null}
      {category ? (
        <span
          className={`font-mono text-[0.7rem] ${
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
  href,
  level,
  selected,
}: {
  href: string;
  level: ListeningCatalogLevel;
  selected: boolean;
}) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-semibold transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98] ${
        selected
          ? "bg-brand-500 text-white"
          : "bg-transparent text-slate-500 hover:bg-white hover:text-ink-950"
      }`}
      href={href}
    >
      {level.id === ALL_LEVEL_ID ? level.label : level.id}
      {level.id !== ALL_LEVEL_ID && level.count > 0 ? (
        <span
          className={`font-mono text-[0.7rem] ${
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
  layout = "rail",
  progress,
}: {
  lesson: ListeningLessonSummary;
  locale: "vi" | "en";
  layout?: "grid" | "rail";
  progress: LessonProgress;
}) {
  const title = pickText(lesson.title, locale);
  const description = pickText(lesson.description, locale);
  const isMetadataOnly =
    lesson.contentStatus === "METADATA_ONLY" || lesson.segmentCount === 0;
  const statusLabel =
    isMetadataOnly
      ? locale === "vi"
        ? "Đang chuẩn bị"
        : "Preparing"
      : progress.checkedCount === 0
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
      className={`group block focus-visible:outline-none ${
        layout === "grid"
          ? "min-w-0"
          : "w-[min(78vw,15rem)] shrink-0 snap-start sm:w-[14.5rem] xl:w-[14.75rem]"
      }`}
      href={`/dictation/${lesson.id}`}
    >
      <article className="h-full overflow-hidden rounded-[1.15rem] border border-sand-200 bg-white shadow-[0_20px_42px_-36px_rgba(120,53,15,0.24)] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[2px] group-hover:border-brand-200 group-hover:shadow-[0_24px_48px_-36px_rgba(120,53,15,0.3)] group-focus-visible:ring-4 group-focus-visible:ring-brand-100 group-active:translate-y-[1px] group-active:scale-[0.99]">
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
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-950/52 to-transparent" />
          <span className="absolute left-2.5 top-2.5 rounded-[0.6rem] bg-brand-500 px-2 py-0.5 text-[0.7rem] font-bold text-white shadow-[0_12px_26px_-18px_rgba(120,53,15,0.55)]">
            {lesson.level}
          </span>
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-[0.5rem] bg-rose-50/95 px-2 py-0.5 text-[0.7rem] font-semibold text-red-700 shadow-[0_12px_24px_-18px_rgba(127,29,29,0.35)] ring-1 ring-white/70 backdrop-blur">
            <YoutubeLogo
              aria-hidden="true"
              className="shrink-0"
              size={12}
              weight="fill"
            />
            Youtube
          </span>
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-ink-950/72 px-2 py-0.5 text-[0.7rem] font-semibold text-white backdrop-blur">
            <Clock aria-hidden="true" size={12} weight="duotone" />
            {lesson.durationMinutes} min
          </span>
        </div>

        <div className="grid min-h-[9.25rem] gap-2.5 p-3">
          <div>
            <p className="line-clamp-2 min-h-[2.65rem] text-[0.9rem] font-semibold leading-[1.42] tracking-[-0.02em] text-ink-950">
              {title}
            </p>
            <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-relaxed text-slate-500">
              {description}
            </p>
          </div>

          <div className="flex min-w-0 items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-slate-400">
                {lesson.source}
              </p>
              <p className="mt-0.5 text-[0.78rem] font-medium text-slate-500">
                {isMetadataOnly
                  ? locale === "vi"
                    ? "Đang chuẩn bị nội dung"
                    : "Content in preparation"
                  : `${lesson.segmentCount} ${
                      locale === "vi" ? "phân đoạn" : "segments"
                    }`}
              </p>
            </div>
            <span
              className={`inline-flex min-w-0 max-w-[7.25rem] shrink items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.7rem] font-semibold ${
                isMetadataOnly
                  ? "bg-brand-50 text-brand-800"
                  : progress.isComplete
                  ? "bg-emerald-50 text-emerald-700"
                  : progress.checkedCount > 0
                    ? "bg-amber-50 text-amber-800"
                    : "bg-sand-100 text-slate-500"
              }`}
            >
              {isMetadataOnly ? (
                <Clock aria-hidden="true" className="shrink-0" size={12} weight="duotone" />
              ) : progress.isComplete ? (
                <CheckCircle aria-hidden="true" className="shrink-0" size={12} weight="fill" />
              ) : (
                <PlayCircle aria-hidden="true" className="shrink-0" size={12} weight="duotone" />
              )}
              <span className="min-w-0 truncate">{statusLabel}</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function LessonRail({
  getProgress,
  lessons,
  locale,
  sectionId,
}: {
  getProgress: (lesson: ListeningLessonSummary) => LessonProgress;
  lessons: ListeningLessonSummary[];
  locale: "vi" | "en";
  sectionId: string;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);

  const updateScrollState = useCallback(() => {
    const rail = railRef.current;

    if (!rail) {
      setCanScrollNext(false);
      setCanScrollPrevious(false);
      return;
    }

    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);

    setCanScrollPrevious(rail.scrollLeft > 4);
    setCanScrollNext(rail.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;

    updateScrollState();

    if (!rail) {
      return;
    }

    rail.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      rail.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [lessons.length, updateScrollState]);

  const scrollRail = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      behavior: "smooth",
      left: direction * Math.max(rail.clientWidth - 96, 260),
    });
  }, []);

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="scrollbar-hidden -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3"
      >
        {lessons.map((lesson) => (
          <LessonCard
            key={`${sectionId}-${lesson.id}`}
            lesson={lesson}
            locale={locale}
            progress={getProgress(lesson)}
          />
        ))}
      </div>

      {canScrollPrevious ? (
        <button
          aria-label={locale === "vi" ? "Xem bài trước" : "Show previous lessons"}
          className="absolute left-1 top-[42%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-sand-200 bg-white/95 text-slate-700 shadow-[0_18px_34px_-24px_rgba(120,53,15,0.4)] backdrop-blur transition-[border-color,color,transform] duration-300 hover:scale-[1.04] hover:border-brand-200 hover:text-ink-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:scale-[0.97] md:flex"
          type="button"
          onClick={() => scrollRail(-1)}
        >
          <CaretLeft aria-hidden="true" size={18} weight="bold" />
        </button>
      ) : null}

      {canScrollNext ? (
        <button
          aria-label={locale === "vi" ? "Xem thêm bài ở bên phải" : "Show more lessons"}
          className="absolute right-1 top-[42%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-sand-200 bg-white/95 text-slate-700 shadow-[0_18px_34px_-24px_rgba(120,53,15,0.4)] backdrop-blur transition-[border-color,color,transform] duration-300 hover:scale-[1.04] hover:border-brand-200 hover:text-ink-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:scale-[0.97] md:flex"
          type="button"
          onClick={() => scrollRail(1)}
        >
          <CaretRight aria-hidden="true" size={18} weight="bold" />
        </button>
      ) : null}
    </div>
  );
}

function LessonGrid({
  getProgress,
  lessons,
  locale,
  sectionId,
}: {
  getProgress: (lesson: ListeningLessonSummary) => LessonProgress;
  lessons: ListeningLessonSummary[];
  locale: "vi" | "en";
  sectionId: string;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(13.75rem,1fr))] gap-3 pb-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={`${sectionId}-${lesson.id}`}
          layout="grid"
          lesson={lesson}
          locale={locale}
          progress={getProgress(lesson)}
        />
      ))}
    </div>
  );
}

export function ListeningLibraryPage({
  catalog,
  mode = "overview",
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
  const isCategoryWorkspace =
    mode === "category" && selectedCategoryId !== ALL_CATEGORY_ID;
  const selectedCategory = catalog.categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const pageTitle =
    isCategoryWorkspace && selectedCategory
      ? pickText(selectedCategory.label, locale)
      : copy.heading;
  const pageSubtitle = isCategoryWorkspace
    ? `${catalog.totalLessons} ${copy.lessons}`
    : copy.subtitle;
  const getProgressForLesson = useCallback(
    (lesson: ListeningLessonSummary) =>
      getLessonProgress(lesson, progressByLesson),
    [progressByLesson],
  );

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 -mx-3 border-b border-sand-200 bg-[rgba(248,245,239,0.96)] px-3 py-3 backdrop-blur-xl sm:-mx-4 sm:px-4 lg:-mx-5 lg:px-5 lg:py-3.5 xl:-mx-6 xl:px-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr),auto] xl:items-start">
          <div className="flex min-w-0 items-start gap-3">
            {isCategoryWorkspace ? (
              <Link
                aria-label={locale === "vi" ? "Quay lại thư viện nghe" : "Back to listening library"}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] border border-sand-200 bg-white text-slate-700 transition-[border-color,color,transform] duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98]"
                href="/dictation"
              >
                <ArrowLeft aria-hidden="true" size={20} weight="bold" />
              </Link>
            ) : null}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] border border-sand-200 bg-white text-ink-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <Headphones aria-hidden="true" size={22} weight="duotone" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[1.35rem] font-semibold leading-[1.12] tracking-[-0.04em] text-ink-950 sm:text-[1.55rem]">
                {pageTitle}
              </h1>
              <p className="mt-0.5 text-[0.8125rem] font-medium leading-relaxed text-slate-500">
                {pageSubtitle}
              </p>
            </div>
          </div>

          {!isCategoryWorkspace ? (
          <div className="grid gap-2 text-[0.8125rem] font-semibold text-slate-500 sm:grid-cols-3 xl:min-w-[27rem]">
            <div className="flex items-center gap-1.5 rounded-[0.9rem] border border-sand-200 bg-white/75 px-2.5 py-1.5">
              <BookOpen aria-hidden="true" size={16} weight="duotone" />
              <span className="font-mono text-ink-950">{stats.activeCount}</span>
              <span>{copy.active}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-[0.9rem] border border-sand-200 bg-white/75 px-2.5 py-1.5">
              <CheckCircle
                aria-hidden="true"
                className="text-emerald-600"
                size={16}
                weight="duotone"
              />
              <span className="font-mono text-ink-950">{stats.completedCount}</span>
              <span>{copy.completed}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-[0.9rem] border border-sand-200 bg-white/75 px-2.5 py-1.5">
              <TrendUp aria-hidden="true" size={16} weight="duotone" />
              <span className="font-mono text-ink-950">{stats.averageAccuracy}%</span>
              <span>{copy.average}</span>
            </div>
          </div>
          ) : null}
        </div>

        <div className="mt-3.5 min-w-0 border-t border-sand-200 pt-3">
          {isCategoryWorkspace ? (
            <div className="scrollbar-hidden -mx-1 flex min-w-0 snap-x gap-2 overflow-x-auto px-1 pb-1">
              {catalog.levels.map((level) => (
                <LevelChip
                  key={level.id}
                  href={buildCategoryWorkspaceHref(selectedCategoryId, level.id)}
                  level={{
                    ...level,
                    label: level.id === ALL_LEVEL_ID ? copy.allLevels : level.label,
                  }}
                  selected={selectedLevel === level.id}
                />
              ))}
            </div>
          ) : (
            <>
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

              <div className="mt-2.5 flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="scrollbar-hidden -mx-1 flex min-w-0 snap-x gap-2 overflow-x-auto px-1 pb-1">
                  {catalog.levels.map((level) => (
                    <LevelChip
                      key={level.id}
                      href={buildLibraryHref(selectedCategoryId, level.id)}
                      level={{
                        ...level,
                        label: level.id === ALL_LEVEL_ID ? copy.allLevels : level.label,
                      }}
                      selected={selectedLevel === level.id}
                    />
                  ))}
                </div>
                <Link
                  className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 rounded-[0.9rem] border border-sand-200 bg-white px-3 text-[0.8125rem] font-semibold text-slate-700 transition-[border-color,color,transform] duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98]"
                  href="/dictation"
                >
                  <SquaresFour aria-hidden="true" size={15} weight="duotone" />
                  {copy.viewCategory}
                </Link>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="py-4 lg:py-5">
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
          <div className="space-y-6 pb-2">
            {catalog.sections.map((section) => (
              <section key={section.id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    {!isCategoryWorkspace && section.categoryId ? (
                      <p className="type-eyebrow-label">{copy.sections}</p>
                    ) : null}
                    <h2 className="mt-0.5 text-[1.1rem] font-semibold leading-[1.18] tracking-[-0.03em] text-ink-950 sm:text-[1.25rem]">
                      {isCategoryWorkspace ? pageTitle : pickText(section.title, locale)}
                      <span className="ml-2 align-middle font-mono text-xs text-slate-400">
                        {section.count}
                      </span>
                    </h2>
                  </div>
                  {!isCategoryWorkspace && section.categoryId ? (
                    <Link
                      className="hidden shrink-0 text-[0.8125rem] font-semibold text-brand-700 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:inline-flex"
                      href={buildCategoryWorkspaceHref(section.categoryId, selectedLevel)}
                    >
                      {copy.viewMore}
                    </Link>
                  ) : null}
                </div>

                {isCategoryWorkspace ? (
                  <LessonGrid
                    getProgress={getProgressForLesson}
                    lessons={section.lessons}
                    locale={locale}
                    sectionId={section.id}
                  />
                ) : (
                  <LessonRail
                    getProgress={getProgressForLesson}
                    lessons={section.lessons}
                    locale={locale}
                    sectionId={section.id}
                  />
                )}

                {!isCategoryWorkspace && section.categoryId ? (
                  <Link
                    className="mt-1 inline-flex min-h-8 items-center rounded-[0.9rem] border border-sand-200 bg-white px-3 text-[0.8125rem] font-semibold text-brand-700 transition-[border-color,color,transform] duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 active:translate-y-[1px] active:scale-[0.98] sm:hidden"
                    href={buildCategoryWorkspaceHref(section.categoryId, selectedLevel)}
                  >
                    {copy.viewMore}
                  </Link>
                ) : null}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
