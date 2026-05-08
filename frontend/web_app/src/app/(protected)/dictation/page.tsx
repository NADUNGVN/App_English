import { redirect } from "next/navigation";
import {
  listeningCategoryIdSchema,
  listeningLessonIdSchema,
  listeningLevelFilterSchema,
} from "../../../server/modules/listening/listening.schemas";
import {
  getListeningCatalog,
  isActiveListeningCategoryId,
} from "../../../server/modules/listening/listening.service";
import type { ListeningLevelFilter } from "../../../server/modules/listening/listening.types";
import { ListeningLibraryPage } from "../../../views/app/ListeningLibraryPage";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseCategoryId(value: string | undefined) {
  const result = listeningCategoryIdSchema.safeParse(value ?? "all");

  if (!result.success || result.data === "all") {
    return "all";
  }

  return isActiveListeningCategoryId(result.data) ? result.data : "all";
}

function parseLevel(value: string | undefined): ListeningLevelFilter {
  const result = listeningLevelFilterSchema.safeParse(value ?? "ALL");

  return result.success ? result.data : "ALL";
}

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const legacyLessonId = getSearchValue(params.lessonId);

  if (legacyLessonId && listeningLessonIdSchema.safeParse(legacyLessonId).success) {
    redirect(`/dictation/${legacyLessonId}`);
  }

  const selectedCategoryId = parseCategoryId(getSearchValue(params.category));
  const selectedLevel = parseLevel(getSearchValue(params.level));

  return (
    <ListeningLibraryPage
      catalog={getListeningCatalog({
        categoryId: selectedCategoryId,
        level: selectedLevel,
      })}
      selectedCategoryId={selectedCategoryId}
      selectedLevel={selectedLevel}
    />
  );
}
