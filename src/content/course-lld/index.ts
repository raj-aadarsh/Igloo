import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-uml';
import { m2 } from './modules/m2-solid';
import { m3 } from './modules/m3-principles';
import { m4 } from './modules/m4-creational';
import { m5 } from './modules/m5-structural';
import { m6 } from './modules/m6-behavioral';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6].sort((a, b) => a.order - b.order);

export const lldCourse: Course = {
  id: 'course-lld',
  title: 'Low-Level Design (LLD)',
  tagline: 'Design clean, extensible classes — and ace the machine-coding round.',
  modules,
};

export const lldTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const lldPlannedTopics: string[] = [
  'The LLD interview framework',
  'Case study: Parking Lot',
  'Case studies: Elevator, Vending Machine, BookMyShow, Splitwise',
  'Case studies: Tic-Tac-Toe, Rate Limiter, Logger',
  'Capstone & interview recap',
];

export function lldAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
