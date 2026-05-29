// ---------------------------------------------------------------------------
// Content types for the DSA course. It is code-first: each sub-course (one per
// data structure / topic) has "Learn" lessons (reusing the shared Block model)
// and "Problems" you actually write + run in the in-browser Python playground.
// ---------------------------------------------------------------------------
import type { Block, Lesson } from '@/content/types';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  /** fed to the program's stdin */
  stdin: string;
  /** expected stdout (compared trimmed) */
  expected: string;
  /** hidden tests aren't shown until run; they stop people hard-coding outputs */
  hidden?: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Solution {
  /** short label, e.g. "Brute force" or "Optimal (hash map)" */
  label: string;
  bigO: string; // e.g. "Time O(n) · Space O(n)"
  code: string;
  explanation: Block[];
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  /** rich problem statement */
  statement: Block[];
  examples: Example[];
  constraints: string[];
  /** the input/output contract, shown to the solver */
  ioNote: string;
  /** near-blank: the learner writes the whole program from scratch */
  starterCode: string;
  tests: TestCase[];
  hints: string[];
  /** taught after solving: brute first, then optimal */
  solutions: Solution[];
  /** if true, this problem also appears in the Interview Arena */
  isInterview?: boolean;
}

export interface Badge {
  name: string;
  emoji: string;
}

export interface SubCourse {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name (see components/ui/Icon)
  learn: Lesson[];
  problems: Problem[];
  badge: Badge;
}

export interface DsaCourse {
  id: string;
  title: string;
  tagline: string;
  subCourses: SubCourse[];
}
