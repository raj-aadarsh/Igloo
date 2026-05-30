import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-foundations';
import { m2 } from './modules/m2-processes';
import { m3 } from './modules/m3-scheduling';

const modules: Module[] = [m0, m1, m2, m3].sort((a, b) => a.order - b.order);

export const osCourse: Course = {
  id: 'course-os',
  title: 'Operating Systems',
  tagline: 'Understand how your computer really works — visually.',
  modules,
};

export const osTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const osPlannedTopics: string[] = [
  'Process Synchronization',
  'Deadlocks',
  'Memory Management',
  'Virtual Memory & Paging',
  'File Systems',
  'Disk Scheduling',
  'I/O Systems',
];

export function osAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
