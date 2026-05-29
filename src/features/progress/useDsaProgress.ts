import { dsaCourse } from '@/content/course-dsa';
import { useProgress } from './ProgressProvider';

// Per-sub-course progress for the DSA course. A badge is earned when every Learn
// lesson is done AND every problem is solved.
export function useDsaProgress() {
  const { completedLessons, solvedProblems } = useProgress();

  const perSub = dsaCourse.subCourses.map((sub) => {
    const lessonIds = sub.learn.map((l) => l.id);
    const lessonsDone = lessonIds.filter((id) => completedLessons[id]).length;
    const problemIds = sub.problems.map((p) => p.id);
    const problemsSolved = problemIds.filter((id) => solvedProblems[id]).length;
    const earned =
      lessonsDone === lessonIds.length &&
      problemsSolved === problemIds.length &&
      lessonIds.length + problemIds.length > 0;
    return {
      sub,
      lessonsDone,
      lessonsTotal: lessonIds.length,
      problemsSolved,
      problemsTotal: problemIds.length,
      earned,
    };
  });

  const badgesEarned = perSub.filter((s) => s.earned).length;
  return { perSub, badgesEarned };
}
