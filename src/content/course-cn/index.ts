import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-foundations';
import { m2 } from './modules/m2-link-layer';
import { m3 } from './modules/m3-network-layer';

const modules: Module[] = [m0, m1, m2, m3].sort((a, b) => a.order - b.order);

export const cnCourse: Course = {
  id: 'course-cn',
  title: 'Computer Networks',
  tagline: 'From cables to the cloud — see how the internet actually works.',
  modules,
};

export const cnTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const cnPlannedTopics: string[] = [
  'Transport Layer (TCP & UDP)',
  'Application Layer (HTTP, DNS, DHCP)',
  'Network Security & TLS',
  'Capstone: What happens when you type a URL',
];

export function cnAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
