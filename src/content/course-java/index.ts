import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-how-java-runs';
import { m1 } from './modules/m1-language-basics';
import { m2 } from './modules/m2-oop-basics';
import { m3 } from './modules/m3-oop-advanced';
import { m4 } from './modules/m4-object-contract';
import { m5 } from './modules/m5-exceptions';
import { m6 } from './modules/m6-collections';
import { m7 } from './modules/m7-generics';
import { m8 } from './modules/m8-functional';
import { m9 } from './modules/m9-concurrency';
import { m10 } from './modules/m10-jvm-memory';
import { m11 } from './modules/m11-capstone';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11].sort((a, b) => a.order - b.order);

export const javaCourse: Course = {
  id: 'course-java',
  title: 'Core Java Concepts',
  tagline: 'OOP, collections, the JVM & the Java that interviews demand.',
  modules,
};

export const javaTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const javaPlannedTopics: string[] = [];

export function javaAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
