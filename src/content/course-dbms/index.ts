import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-foundations';
import { m2 } from './modules/m2-er-model';
import { m3 } from './modules/m3-keys';
import { m4 } from './modules/m4-normalization';
import { m5 } from './modules/m5-relational-algebra';
import { m6 } from './modules/m6-transactions';
import { m7 } from './modules/m7-indexing';
import { m8 } from './modules/m8-sql-basics';
import { m9 } from './modules/m9-sql-queries';
import { m10 } from './modules/m10-sql-joins';
import { m11 } from './modules/m11-capstone';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11].sort((a, b) => a.order - b.order);

export const dbmsCourse: Course = {
  id: 'course-dbms',
  title: 'Database Management (DBMS)',
  tagline: 'From ER diagrams to SQL — design data the right way.',
  modules,
};

export const dbmsTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const dbmsPlannedTopics: string[] = [];

export function dbmsAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
