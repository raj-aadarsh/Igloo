import { course, totalLessons } from '@/content/course-ai';
import { useProgress } from './ProgressProvider';

export function useCourseProgress() {
  const { completedLessons } = useProgress();

  const doneCount = (lessonIds: string[]) => lessonIds.filter((id) => completedLessons[id]).length;

  const perModule = course.modules.map((m) => {
    const ids = m.lessons.map((l) => l.id);
    const done = doneCount(ids);
    return { module: m, done, total: ids.length, complete: done === ids.length && ids.length > 0 };
  });

  const totalDone = perModule.reduce((acc, m) => acc + m.done, 0);
  const overallPct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;

  return { perModule, totalDone, totalLessons, overallPct };
}
