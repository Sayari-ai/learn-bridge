import { notFound } from "next/navigation";
import { getLesson, LESSONS } from "@/lib/content";
import LessonPlayer from "@/components/lesson/LessonPlayer";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({
  params,
}: PageProps<"/lesson/[lessonId]">) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  return <LessonPlayer lesson={lesson} />;
}
