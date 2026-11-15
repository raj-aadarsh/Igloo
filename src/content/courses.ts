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
import { dsaCourse, totalProblems as dsaProblems, totalSubCourses } from './course-dsa';
import { osCourse, osTotalLessons } from './course-os';
import { cnCourse, cnTotalLessons } from './course-cn';
import { dbmsCourse, dbmsTotalLessons } from './course-dbms';
import { javaCourse, javaTotalLessons } from './course-java';
import { lldCourse, lldTotalLessons } from './course-lld';
import { hldCourse, hldTotalLessons } from './course-hld';
import { devopsCourse, devopsTotalLessons } from './course-devops';
import { gitCourse, gitTotalLessons } from './course-git';
import { hrCourse, hrTotalLessons } from './course-hr';
import { androidCourse, androidTotalLessons } from './course-android';

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
  {
    id: dsaCourse.id,
    title: dsaCourse.title,
    tagline: dsaCourse.tagline,
    icon: 'cap',
    accent: 'brand',
    status: 'available',
    overviewPath: '/dsa',
    moduleCount: totalSubCourses,
    lessonCount: dsaProblems,
    extras: [{ label: 'Interview Arena', to: '/dsa/arena' }],
  },
  {
    id: osCourse.id,
    title: osCourse.title,
    tagline: osCourse.tagline,
    icon: 'cpu',
    accent: 'brand',
    status: 'available',
    overviewPath: '/os',
    moduleCount: osCourse.modules.length,
    lessonCount: osTotalLessons,
    extras: [{ label: 'Final Exam', to: '/os/exam' }],
  },
  {
    id: cnCourse.id,
    title: cnCourse.title,
    tagline: cnCourse.tagline,
    icon: 'network',
    accent: 'brand',
    status: 'available',
    overviewPath: '/cn',
    moduleCount: cnCourse.modules.length,
    lessonCount: cnTotalLessons,
    extras: [{ label: 'Final Exam', to: '/cn/exam' }],
  },
  {
    id: dbmsCourse.id,
    title: dbmsCourse.title,
    tagline: dbmsCourse.tagline,
    icon: 'database',
    accent: 'brand',
    status: 'available',
    overviewPath: '/dbms',
    moduleCount: dbmsCourse.modules.length,
    lessonCount: dbmsTotalLessons,
    extras: [{ label: 'Final Exam', to: '/dbms/exam' }],
  },
  {
    id: javaCourse.id,
    title: javaCourse.title,
    tagline: javaCourse.tagline,
    icon: 'coffee',
    accent: 'brand',
    status: 'available',
    overviewPath: '/java',
    moduleCount: javaCourse.modules.length,
    lessonCount: javaTotalLessons,
    extras: [{ label: 'Final Exam', to: '/java/exam' }],
  },
  {
    id: lldCourse.id,
    title: lldCourse.title,
    tagline: lldCourse.tagline,
    icon: 'drafting-compass',
    accent: 'brand',
    status: 'available',
    overviewPath: '/lld',
    moduleCount: lldCourse.modules.length,
    lessonCount: lldTotalLessons,
    extras: [{ label: 'Final Exam', to: '/lld/exam' }],
  },
  {
    id: hldCourse.id,
    title: hldCourse.title,
    tagline: hldCourse.tagline,
    icon: 'server',
    accent: 'brand',
    status: 'available',
    overviewPath: '/hld',
    moduleCount: hldCourse.modules.length,
    lessonCount: hldTotalLessons,
    extras: [{ label: 'Final Exam', to: '/hld/exam' }],
  },
  {
    id: devopsCourse.id,
    title: devopsCourse.title,
    tagline: devopsCourse.tagline,
    icon: 'infinity',
    accent: 'brand',
    status: 'available',
    overviewPath: '/devops',
    moduleCount: devopsCourse.modules.length,
    lessonCount: devopsTotalLessons,
    extras: [{ label: 'Final Exam', to: '/devops/exam' }],
  },
  {
    id: gitCourse.id,
    title: gitCourse.title,
    tagline: gitCourse.tagline,
    icon: 'git-branch',
    accent: 'brand',
    status: 'available',
    overviewPath: '/git',
    moduleCount: gitCourse.modules.length,
    lessonCount: gitTotalLessons,
    extras: [{ label: 'Final Exam', to: '/git/exam' }],
  },
  {
    id: hrCourse.id,
    title: hrCourse.title,
    tagline: hrCourse.tagline,
    icon: 'handshake',
    accent: 'brand',
    status: 'available',
    overviewPath: '/hr',
    moduleCount: hrCourse.modules.length,
    lessonCount: hrTotalLessons,
    extras: [{ label: 'Final Exam', to: '/hr/exam' }],
  },
  {
    id: androidCourse.id,
    title: androidCourse.title,
    tagline: androidCourse.tagline,
    icon: 'smartphone',
    accent: 'brand',
    status: 'available',
    overviewPath: '/android',
    moduleCount: androidCourse.modules.length,
    lessonCount: androidTotalLessons,
    extras: [{ label: 'Final Exam', to: '/android/exam' }],
  },
  // ↓ Placeholder slot — signals Igloo is a general platform. Add real courses
  //   (any topic) by following the steps in the header comment.
  {
    id: 'coming-soon',
    title: 'Our next course',
    tagline: '',
    icon: 'sparkles',
    accent: 'accent',
    status: 'coming-soon',
    moduleCount: 0,
    lessonCount: 0,
  },
];

export const availableCourses = courses.filter((c) => c.status === 'available');
