import { request } from "../lib/apiClient";
import type {
  VocabularyCategory,
  VocabularyCollectionDetail,
  VocabularyCollectionList,
  VocabularyLocale,
  VocabularyReviewAnswerResult,
  VocabularyReviewQuality,
  VocabularyReviewQueue,
  VocabularySetDetail,
  VocabularyStats,
} from "../server/modules/vocabulary/vocabulary.types";

type ListCollectionsParams = {
  category?: "ALL" | VocabularyCategory;
  locale?: VocabularyLocale;
};

type LocaleParams = {
  locale?: VocabularyLocale;
};

type ReviewDueParams = LocaleParams & {
  collectionSlug?: string;
  limit?: number;
  setSlug?: string;
};

type ReviewAnswerInput = {
  quality: VocabularyReviewQuality;
  responseMs?: number;
  wordId: string;
};

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export const vocabularyRepository = {
  listCollections(params: ListCollectionsParams = {}) {
    return request<VocabularyCollectionList>(
      withQuery("/vocabulary/collections", {
        category: params.category,
        locale: params.locale,
      }),
      { method: "GET" },
    );
  },

  getCollection(collectionSlug: string, params: LocaleParams = {}) {
    return request<VocabularyCollectionDetail>(
      withQuery(`/vocabulary/collections/${collectionSlug}`, {
        locale: params.locale,
      }),
      { method: "GET" },
    );
  },

  getSet(collectionSlug: string, setSlug: string, params: LocaleParams = {}) {
    return request<VocabularySetDetail>(
      withQuery(`/vocabulary/collections/${collectionSlug}/sets/${setSlug}`, {
        locale: params.locale,
      }),
      { method: "GET" },
    );
  },

  getStats(params: LocaleParams = {}) {
    return request<VocabularyStats>(
      withQuery("/vocabulary/stats", {
        locale: params.locale,
      }),
      { method: "GET" },
    );
  },

  getDue(params: ReviewDueParams = {}) {
    return request<VocabularyReviewQueue>(
      withQuery("/vocabulary/review/due", {
        collectionSlug: params.collectionSlug,
        limit: params.limit,
        locale: params.locale,
        setSlug: params.setSlug,
      }),
      { method: "GET" },
    );
  },

  answer(input: ReviewAnswerInput) {
    return request<VocabularyReviewAnswerResult>("/vocabulary/review/answer", {
      body: input,
      method: "POST",
    });
  },
};
