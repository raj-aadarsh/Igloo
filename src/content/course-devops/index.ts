import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-what-is-devops';
import { m1 } from './modules/m1-containers-docker';
import { m2 } from './modules/m2-docker-practice';
import { m3 } from './modules/m3-cicd';
import { m4 } from './modules/m4-deployment-strategies';
import { m5 } from './modules/m5-kubernetes';

const modules: Module[] = [m0, m1, m2, m3, m4, m5].sort((a, b) => a.order - b.order);

export const devopsCourse: Course = {
  id: 'course-devops',
  title: 'DevOps Essentials',
  tagline: 'Ship faster & safer — containers, CI/CD, Kubernetes, cloud & observability.',
  modules,
};

export const devopsTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

/** Topics still being authored — shown as "coming soon" on the overview. */
export const devopsPlannedTopics: string[] = [
  'Infrastructure as Code (Terraform)',
  'Cloud fundamentals (AWS)',
  'Monitoring & observability',
  'Capstone & interview recap',
];

export function devopsAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
