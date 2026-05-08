import { notFound } from "next/navigation";
import {
  listeningCategoryIdSchema,
  listeningLevelFilterSchema,
} from "../../../../../server/modules/listening/listening.schemas";
import { getListeningCatalog } from "../../../../../server/modules/listening/listening.service";
import type { ListeningLevelFilter } from "../../../../../server/modules/listening/listening.types";
import { ListeningLibraryPage } from "../../../../../views/app/ListeningLibraryPage";

type PageProps = {
  params: Promise<{
    categoryId: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseLevel(value: string | undefined): ListeningLevelFilter {
  const result = listeningLevelFilterSchema.safeParse(value ?? "ALL");

  return result.success ? result.data : "ALL";
}

export default async function Page({ params, searchParams }: PageProps) {
  const { categoryId: rawCategoryId } = await params;
  const categoryResult = listeningCategoryIdSchema.safeParse(rawCategoryId);

  if (!categoryResult.success || categoryResult.data === "all") {
    notFound();
  }

  const selectedCategoryId = categoryResult.data;
  const selectedLevel = parseLevel(
    getSearchValue((await searchParams)?.level),
  );
  const catalog = getListeningCatalog({
    categoryId: selectedCategoryId,
    level: selectedLevel,
  });
  const categoryExists = catalog.categories.some(
    (category) => category.id === selectedCategoryId,
  );

  if (!categoryExists) {
    notFound();
  }

  return (
    <ListeningLibraryPage
      catalog={catalog}
      mode="category"
      selectedCategoryId={selectedCategoryId}
      selectedLevel={selectedLevel}
    />
  );
}
