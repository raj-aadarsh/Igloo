import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-how-java-runs';
import { m1 } from './modules/m1-language-basics';
import { m2 } from './modules/m2-oop-basics';

const modules: Module[] = [m0, m1, m2].sort((a, b) => a.order - b.order);

export const javaCourse: Course = {
  id: 'course-java',
  title: 'Core Java Concepts',
  tagline: 'OOP, collections, the JVM & the Java that interviews demand.',
  modules,
};

export const javaTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const javaPlannedTopics: string[] = [
  'OOP II — Inheritance, Polymorphism & Interfaces',
  'The Object contract (equals/hashCode), enums & immutability',
  'Exceptions',
  'Collections Framework (+ HashMap internals)',
  'Generics',
  'Functional Java — Lambdas & Streams',
  'Multithreading & Concurrency',
  'JVM internals & Garbage Collection',
  'Capstone & interview recap',
];

export function javaAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
