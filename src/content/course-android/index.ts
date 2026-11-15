import type { Course, Module } from '@/content/types';
import { m0 } from './modules/m0-architecture';
import { m1 } from './modules/m1-boot-sequence';
import { m2 } from './modules/m2-app-process';
import { m3 } from './modules/m3-components';
import { m4 } from './modules/m4-context-intents';
import { m5 } from './modules/m5-binder';
import { m6 } from './modules/m6-jni-hal';
import { m7 } from './modules/m7-system-services';
import { m8 } from './modules/m8-input-systemui';
import { m9 } from './modules/m9-multiuser';
import { m10 } from './modules/m10-stability';
import { m11 } from './modules/m11-security-builds';
import { m12 } from './modules/m12-graphics';
import { m13 } from './modules/m13-aosp-tree';
import { m14 } from './modules/m14-memory';
import { m15 } from './modules/m15-props-settings';
import { m16 } from './modules/m16-patch-porting';
import { m17 } from './modules/m17-triage-map';
import { m18 } from './modules/m18-java-crashes';
import { m19 } from './modules/m19-freezes';
import { m20 } from './modules/m20-native-crashes';
import { m21 } from './modules/m21-kernel-boot';
import { m22 } from './modules/m22-memory-issues';
import { m23 } from './modules/m23-ui-input-issues';
import { m24 } from './modules/m24-security-issues';
import { m25 } from './modules/m25-xts-regressions';

const modules: Module[] = [
  m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16,
  m17, m18, m19, m20, m21, m22, m23, m24, m25,
].sort((a, b) => a.order - b.order);

export const androidCourse: Course = {
  id: 'course-android',
  title: 'Android Framework',
  tagline: 'How Android really works — from the power button to the pixels.',
  modules,
};

export const androidTotalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

// ---------------------------------------------------------------------------
// The course is organised in phases. Phase sections group the modules on the
// overview page; later phases appear as planned topics until authored.
// ---------------------------------------------------------------------------

export interface AndroidPhase {
  id: string;
  title: string;
  /** compact label for the sidebar */
  short: string;
  desc: string;
  moduleIds: string[];
}

export const androidPhases: AndroidPhase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1 · Foundations',
    short: 'Foundations',
    desc: 'The core building blocks — how the system is layered, boots, and runs your app.',
    moduleIds: ['android-m0', 'android-m1', 'android-m2', 'android-m3', 'android-m4', 'android-m5', 'android-m6'],
  },
  {
    id: 'phase-2',
    title: 'Phase 2 · Deep Internals & Debugging',
    short: 'Deep Internals',
    desc: 'Inside the services that run the show — and the evidence they leave when things break.',
    moduleIds: ['android-m7', 'android-m8', 'android-m9', 'android-m10', 'android-m11'],
  },
  {
    id: 'phase-3',
    title: 'Phase 3 · Platform Glue',
    short: 'Platform Glue',
    desc: 'The concepts between theory and real bug-fixing: rendering, the source tree, memory, configuration and the patch workflow.',
    moduleIds: ['android-m12', 'android-m13', 'android-m14', 'android-m15', 'android-m16'],
  },
  {
    id: 'phase-4',
    title: 'Phase 4 · Issue Triage & Debugging',
    short: 'Issue Debugging',
    desc: 'The 8 families of Android issues — how each is detected, where its evidence lands, and how to read every line.',
    moduleIds: [
      'android-m17', 'android-m18', 'android-m19', 'android-m20', 'android-m21',
      'android-m22', 'android-m23', 'android-m24', 'android-m25',
    ],
  },
];

/** Topics still being authored, grouped by the phase they belong to. */
export const androidPlannedPhases: { title: string; topics: string[] }[] = [];

export function androidAllQuestions() {
  return modules.flatMap((m) => m.quiz);
}
