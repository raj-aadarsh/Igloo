import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-behavioral-round';
import { m1 } from './modules/m1-star-method';
import { m2 } from './modules/m2-core-questions';
import { m3 } from './modules/m3-story-bank';
import { m4 } from './modules/m4-delivery';
import { m5 } from './modules/m5-closing';

const modules: Module[] = [m0, m1, m2, m3, m4, m5].sort((a, b) => a.order - b.order);

export const hrCourse: Course = {
  id: 'course-hr',
  title: 'Behavioral / HR Prep',
  tagline: 'Win the round that decides the offer — STAR stories, common questions & confident delivery.',
  modules,
};

export const hrTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const hrPlannedTopics: string[] = [];

export function hrAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
