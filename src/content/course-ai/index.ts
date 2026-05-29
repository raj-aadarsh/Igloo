import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-orientation';
import { m1 } from './modules/m1-foundations';
import { m2 } from './modules/m2-ml-core';
import { m3 } from './modules/m3-neural-nets';
import { m4 } from './modules/m4-transformers-llms';
import { m5 } from './modules/m5-prompting-rag';
import { m6 } from './modules/m6-agents';
import { m7 } from './modules/m7-industry';
import { m8 } from './modules/m8-building';
import { m9 } from './modules/m9-responsible';
import { m10 } from './modules/m10-capstone';

const modules: Module[] = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10].sort((a, b) => a.order - b.order);

export const course: Course = {
  id: 'course-ai',
  title: 'The Complete AI Map',
  tagline: 'Zero → Confident: understand and explain all of AI.',
  modules,
};

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function moduleLessonIds(m: Module): string[] {
  return m.lessons.map((l) => l.id);
}

/** Total lessons across the whole course. */
export const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Every quiz question in the course (used to seed the final exam). */
export function allQuestions() {
  return modules.flatMap((m) => m.quiz.map((q) => ({ ...q, moduleTitle: m.title, moduleSlug: m.slug })));
}
