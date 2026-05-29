// ---------------------------------------------------------------------------
// The Igloo course catalog.
//
// Igloo is a general learning platform — AI is simply the first course. To add
// another course later (AI-related or not):
//   1. Author its content (a Course object) the same way as src/content/course-ai.
//   2. Register it here with a CourseMeta entry (set status: 'available').
//   3. Point `overviewPath` at its route and wire that route in App.tsx.
// Each course can optionally bring its own extras (like the AI course's Atlas).
// ---------------------------------------------------------------------------
import { course as aiCourse, totalLessons as aiLessons } from './course-ai';

export interface CourseExtra {
  label: string;
  to: string;
}

export interface CourseMeta {
  id: string;
  title: string;
  tagline: string;
  /** lucide icon name registered in components/ui/Icon */
  icon: string;
  accent: 'brand' | 'accent' | 'emerald' | 'violet' | 'rose';
  status: 'available' | 'coming-soon';
  /** route to the course overview (only for available courses) */
  overviewPath?: string;
  moduleCount: number;
  lessonCount: number;
  /** course-specific reference sections (e.g. the AI Atlas) */
  extras?: CourseExtra[];
}

export const courses: CourseMeta[] = [
  {
    id: aiCourse.id,
    title: 'The Complete AI Map',
    tagline: aiCourse.tagline,
    icon: 'sparkles',
    accent: 'brand',
    status: 'available',
    overviewPath: '/learn',
    moduleCount: aiCourse.modules.length,
    lessonCount: aiLessons,
    extras: [
      { label: 'AI Atlas', to: '/atlas' },
      { label: 'Glossary', to: '/glossary' },
      { label: 'Final Exam', to: '/exam' },
    ],
  },
  // ↓ Placeholder slots — these signal Igloo is a general platform. Replace or
  //   add real courses (any topic) by following the steps in the header comment.
  {
    id: 'coming-soon',
    title: 'Our next course',
    tagline: '',
    icon: 'cap',
    accent: 'accent',
    status: 'coming-soon',
    moduleCount: 0,
    lessonCount: 0,
  },
];

export const availableCourses = courses.filter((c) => c.status === 'available');
