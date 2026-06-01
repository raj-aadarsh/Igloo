import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-scaling';
import { m2 } from './modules/m2-estimation';
import { m3 } from './modules/m3-caching';
import { m4 } from './modules/m4-databases';
import { m5 } from './modules/m5-replication-sharding';
import { m6 } from './modules/m6-cap-consistency';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6].sort((a, b) => a.order - b.order);

export const hldCourse: Course = {
  id: 'course-hld',
  title: 'High-Level / System Design',
  tagline: 'Architect systems that scale to millions — and ace the system design round.',
  modules,
};

export const hldTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const hldPlannedTopics: string[] = [
  'Messaging & async processing',
  'Networking, APIs & API gateways',
  'Microservices & architecture patterns',
  'Reliability & observability',
  'Case study: URL shortener',
  'Case studies: Twitter feed & Chat',
  'Case studies: YouTube, Uber & more',
  'Capstone & interview recap',
];

export function hldAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
