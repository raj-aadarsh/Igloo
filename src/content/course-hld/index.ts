import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-scaling';
import { m2 } from './modules/m2-estimation';

const modules: Module[] = [m0, m1, m2].sort((a, b) => a.order - b.order);

export const hldCourse: Course = {
  id: 'course-hld',
  title: 'High-Level / System Design',
  tagline: 'Architect systems that scale to millions — and ace the system design round.',
  modules,
};

export const hldTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const hldPlannedTopics: string[] = [
  'Caching & CDNs',
  'Databases: SQL vs NoSQL',
  'Replication, Sharding & Consistent Hashing',
  'CAP theorem & consistency models',
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
