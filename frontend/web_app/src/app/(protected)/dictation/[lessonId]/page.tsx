import { DictationPage } from "../../../../views/app/DictationPage";

type PageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { lessonId } = await params;

  return <DictationPage initialLessonId={lessonId} />;
}
