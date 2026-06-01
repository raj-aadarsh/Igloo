import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-what-is-devops';
import { m1 } from './modules/m1-containers-docker';
import { m2 } from './modules/m2-docker-practice';

const modules: Module[] = [m0, m1, m2].sort((a, b) => a.order - b.order);

export const devopsCourse: Course = {
  id: 'course-devops',
  title: 'DevOps Essentials',
  tagline: 'Ship faster & safer — containers, CI/CD, Kubernetes, cloud & observability.',
  modules,
};

export const devopsTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const devopsPlannedTopics: string[] = [
  'CI/CD pipelines',
  'Deployment strategies (blue-green, canary, rolling)',
  'Kubernetes & orchestration',
  'Infrastructure as Code (Terraform)',
  'Cloud fundamentals (AWS)',
  'Monitoring & observability',
  'Capstone & interview recap',
];

export function devopsAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
