import { request } from "../lib/apiClient";
import type {
  DictationCheckInput,
  DictationCheckResult,
  ListeningCatalog,
  ListeningLevelFilter,
  ListeningLessonDetail,
  ListeningLessonSummary,
} from "../server/modules/listening/listening.types";

type ListLessonsResponse = {
  lessons: ListeningLessonSummary[];
};

type LessonDetailResponse = {
  lesson: ListeningLessonDetail;
};

type ListeningCatalogResponse = {
  catalog: ListeningCatalog;
};

type CheckDictationResponse = {
  result: DictationCheckResult;
};

type CatalogFilters = {
  category?: string;
  level?: ListeningLevelFilter;
};

function buildCatalogPath(filters: CatalogFilters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.category && filters.category !== "all") {
    searchParams.set("category", filters.category);
  }

  if (filters.level && filters.level !== "ALL") {
    searchParams.set("level", filters.level);
  }

  const query = searchParams.toString();

  return query ? `/listening/catalog?${query}` : "/listening/catalog";
}

export const listeningRepository = {
  getCatalog(filters?: CatalogFilters) {
    return request<ListeningCatalogResponse>(buildCatalogPath(filters), {
      method: "GET",
    });
  },
  listLessons() {
    return request<ListLessonsResponse>("/listening/lessons", {
      method: "GET",
    });
  },
  getLesson(lessonId: string) {
    return request<LessonDetailResponse>(`/listening/lessons/${lessonId}`, {
      method: "GET",
    });
  },
  checkDictation(input: DictationCheckInput) {
    return request<CheckDictationResponse>("/listening/check", {
      body: input,
      method: "POST",
    });
  },
};
