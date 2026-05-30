import type { DsaCourse, Problem, SubCourse } from './types';
import { arrays } from './topics/arrays';
import { strings } from './topics/strings';
import { hashing } from './topics/hashing';
import { twoPointers } from './topics/two-pointers';
import { stacks } from './topics/stacks';
import { queues } from './topics/queues';
import { linkedLists } from './topics/linked-lists';
import { recursion } from './topics/recursion';
import { binarySearch } from './topics/binary-search';
import { sorting } from './topics/sorting';
import { trees } from './topics/trees';
import { heaps } from './topics/heaps';
import { graphs } from './topics/graphs';
import { dynamicProgramming } from './topics/dynamic-programming';
import { greedy } from './topics/greedy';
import { arenaExtraProblems } from './arena';

// Available sub-courses (more added over time). Keep them ordered.
const subCourses: SubCourse[] = [arrays, strings, hashing, twoPointers, stacks, queues, linkedLists, recursion, binarySearch, sorting, trees, heaps, graphs, dynamicProgramming, greedy].sort((a, b) => a.order - b.order);

export const dsaCourse: DsaCourse = {
  id: 'course-dsa',
  title: 'DSA Dojo',
  tagline: 'From the basics to cracking the coding interview — one data structure at a time.',
  subCourses,
};

// All core topics are authored. (Add future topics here to show them as "coming soon".)
export const plannedTopics: { title: string; icon: string }[] = [];

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
