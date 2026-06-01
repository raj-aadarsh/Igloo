import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-how-java-runs';
import { m1 } from './modules/m1-language-basics';
import { m2 } from './modules/m2-oop-basics';
import { m3 } from './modules/m3-oop-advanced';
import { m4 } from './modules/m4-object-contract';
import { m5 } from './modules/m5-exceptions';
import { m6 } from './modules/m6-collections';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6].sort((a, b) => a.order - b.order);

export const javaCourse: Course = {
  id: 'course-java',
  title: 'Core Java Concepts',
  tagline: 'OOP, collections, the JVM & the Java that interviews demand.',
  modules,
};

export const javaTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const javaPlannedTopics: string[] = [
  'Generics',
  'Functional Java — Lambdas & Streams',
  'Multithreading & Concurrency',
  'JVM internals & Garbage Collection',
  'Capstone & interview recap',
];

export function javaAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
