import type { DsaCourse, Problem, SubCourse } from './types';
import { arrays } from './topics/arrays';
import { strings } from './topics/strings';
import { arenaExtraProblems } from './arena';

// Available sub-courses (more added over time). Keep them ordered.
const subCourses: SubCourse[] = [arrays, strings].sort((a, b) => a.order - b.order);

export const dsaCourse: DsaCourse = {
  id: 'course-dsa',
  title: 'DSA Dojo',
  tagline: 'From the basics to cracking the coding interview — one data structure at a time.',
  subCourses,
};

// Topics we’ll add next — shown as "coming soon" on the overview so the path is clear.
export const plannedTopics: { title: string; icon: string }[] = [
  { title: 'Hashing (Map & Set)', icon: 'database' },
  { title: 'Two Pointers & Sliding Window', icon: 'workflow' },
  { title: 'Stacks', icon: 'layers' },
  { title: 'Queues & Deques', icon: 'workflow' },
  { title: 'Linked Lists', icon: 'network' },
  { title: 'Recursion & Backtracking', icon: 'workflow' },
  { title: 'Binary Search', icon: 'search' },
  { title: 'Sorting', icon: 'layers' },
  { title: 'Trees & BST', icon: 'network' },
  { title: 'Heaps / Priority Queue', icon: 'layers' },
  { title: 'Graphs', icon: 'network' },
  { title: 'Dynamic Programming', icon: 'boxes' },
  { title: 'Greedy', icon: 'sparkles' },
];

export function getSubCourse(slug: string): SubCourse | undefined {
  return subCourses.find((s) => s.slug === slug);
}

/** Every problem flagged for the Interview Arena, plus the standalone boss problems. */
export function arenaProblems(): Problem[] {
  const fromTopics = subCourses.flatMap((s) => s.problems.filter((p) => p.isInterview));
  return [...fromTopics, ...arenaExtraProblems];
}

/** Find any problem by id, whether it lives in a sub-course or the arena. */
export function findProblem(id: string): { problem: Problem; subSlug: string } | undefined {
  for (const s of subCourses) {
    const p = s.problems.find((p) => p.id === id);
    if (p) return { problem: p, subSlug: s.slug };
  }
  const a = arenaExtraProblems.find((p) => p.id === id);
  if (a) return { problem: a, subSlug: 'arena' };
  return undefined;
}

export const totalProblems = subCourses.reduce((acc, s) => acc + s.problems.length, 0) + arenaExtraProblems.length;
export const totalSubCourses = subCourses.length;
