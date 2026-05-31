import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-foundations';
import { m2 } from './modules/m2-processes';
import { m3 } from './modules/m3-scheduling';
import { m4 } from './modules/m4-synchronization';
import { m5 } from './modules/m5-deadlocks';
import { m6 } from './modules/m6-memory';
import { m7 } from './modules/m7-virtual-memory';
import { m8 } from './modules/m8-file-systems';
import { m9 } from './modules/m9-disk-scheduling';
import { m10 } from './modules/m10-io';
import { m11 } from './modules/m11-capstone';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11].sort((a, b) => a.order - b.order);

export const osCourse: Course = {
  id: 'course-os',
  title: 'Operating Systems',
  tagline: 'Understand how your computer really works — visually.',
  modules,
};

export const osTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** All core OS topics are authored. (Add future topics here to show "coming soon".) */
export const osPlannedTopics: string[] = [];

export function osAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
