import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-foundations';
import { m2 } from './modules/m2-er-model';
import { m3 } from './modules/m3-keys';
import { m4 } from './modules/m4-normalization';

const modules: Module[] = [m0, m1, m2, m3, m4].sort((a, b) => a.order - b.order);

export const dbmsCourse: Course = {
  id: 'course-dbms',
  title: 'Database Management (DBMS)',
  tagline: 'From ER diagrams to SQL — design data the right way.',
  modules,
};

export const dbmsTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const dbmsPlannedTopics: string[] = [
  'Relational Algebra',
  'Transactions, ACID & Schedules',
  'Indexing & B/B+ Trees',
  'SQL (with a live query playground)',
  'Capstone',
];

export function dbmsAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
