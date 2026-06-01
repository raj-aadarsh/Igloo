import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-git-basics';
import { m1 } from './modules/m1-branching';
import { m2 } from './modules/m2-merge-vs-rebase';

const modules: Module[] = [m0, m1, m2].sort((a, b) => a.order - b.order);

export const gitCourse: Course = {
  id: 'course-git',
  title: 'Git & GitHub',
  tagline: 'Version control you’ll use every day — branches, merges & collaboration.',
  modules,
};

export const gitTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const gitPlannedTopics: string[] = [
  'GitHub & collaboration (remotes, PRs, forks)',
  'Undoing mistakes & a command cheat-sheet',
];

export function gitAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
