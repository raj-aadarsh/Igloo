import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-git-basics';
import { m1 } from './modules/m1-branching';
import { m2 } from './modules/m2-merge-vs-rebase';
import { m3 } from './modules/m3-github';
import { m4 } from './modules/m4-undoing';

const modules: Module[] = [m0, m1, m2, m3, m4].sort((a, b) => a.order - b.order);

export const gitCourse: Course = {
  id: 'course-git',
  title: 'Git & GitHub',
  tagline: 'Version control you’ll use every day — branches, merges & collaboration.',
  modules,
};

export const gitTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const gitPlannedTopics: string[] = [];

export function gitAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
