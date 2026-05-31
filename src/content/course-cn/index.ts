import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-foundations';
import { m2 } from './modules/m2-link-layer';
import { m3 } from './modules/m3-network-layer';
import { m4 } from './modules/m4-transport';
import { m5 } from './modules/m5-application';
import { m6 } from './modules/m6-security';
import { m7 } from './modules/m7-capstone';
import { m8 } from './modules/m8-web-dev';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8].sort((a, b) => a.order - b.order);

export const cnCourse: Course = {
  id: 'course-cn',
  title: 'Computer Networks',
  tagline: 'From cables to the cloud — see how the internet actually works.',
  modules,
};

export const cnTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** All core topics are authored. (Add future topics here to show "coming soon".) */
export const cnPlannedTopics: string[] = [];

export function cnAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
