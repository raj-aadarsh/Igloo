import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-scaling';
import { m2 } from './modules/m2-estimation';
import { m3 } from './modules/m3-caching';
import { m4 } from './modules/m4-databases';
import { m5 } from './modules/m5-replication-sharding';
import { m6 } from './modules/m6-cap-consistency';
import { m7 } from './modules/m7-messaging';
import { m8 } from './modules/m8-networking-apis';
import { m9 } from './modules/m9-microservices';
import { m10 } from './modules/m10-reliability';
import { m11 } from './modules/m11-url-shortener';
import { m12 } from './modules/m12-feed-and-chat';
import { m13 } from './modules/m13-rapid-designs';
import { m14 } from './modules/m14-capstone';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14].sort((a, b) => a.order - b.order);

export const hldCourse: Course = {
  id: 'course-hld',
  title: 'High-Level / System Design',
  tagline: 'Architect systems that scale to millions — and ace the system design round.',
  modules,
};

export const hldTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const hldPlannedTopics: string[] = [];

export function hldAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
