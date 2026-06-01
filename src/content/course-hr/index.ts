import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-behavioral-round';
import { m1 } from './modules/m1-star-method';
import { m2 } from './modules/m2-core-questions';

const modules: Module[] = [m0, m1, m2].sort((a, b) => a.order - b.order);

export const hrCourse: Course = {
  id: 'course-hr',
  title: 'Behavioral / HR Prep',
  tagline: 'Win the round that decides the offer — STAR stories, common questions & confident delivery.',
  modules,
};

export const hrTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const hrPlannedTopics: string[] = [
  'Your story bank ("tell me about a time…")',
  'Dos, don’ts & confident delivery',
  'Questions to ask + closing + recap',
];

export function hrAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
