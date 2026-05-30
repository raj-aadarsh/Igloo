import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'os-m0',
  slug: 'welcome',
  order: 0,
  title: 'Welcome to OS',
  subtitle: 'How this course works',
  icon: 'compass',
  lessons: [
    {
      id: 'os-m0-l1',
      title: 'Start here',
      minutes: 3,
      blocks: [
        { type: 'p', text: 'Operating Systems is one of the most-loved interview topics — and one of the most *visual*. So this course leans on **interactive diagrams** instead of walls of text: poke a scheduler, watch a process change state, step through page replacement. Read less, understand more.' },
        { type: 'h2', text: 'What you’ll walk away with' },
        { type: 'ul', items: [
          'A clear mental model of what an OS actually does and how its pieces fit.',
          'The interview classics: **processes & threads, CPU scheduling, synchronization, deadlocks, memory & virtual memory, file systems, disk scheduling, and I/O**.',
          'The vocabulary and the "why", so you can answer follow-up questions, not just recite definitions.',
        ] },
        { type: 'callout', variant: 'tip', title: 'How to use it', text: 'Play with every widget — drag, click, switch options. Then take the short quiz at the end of each module (unlimited attempts). Mark lessons done to track progress on this device.' },
        { type: 'callout', variant: 'info', text: 'Reference & further reading links (e.g. TutorialsPoint) are listed at the end of each module if you want the long-form text version of any topic.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'os-m0-q1',
      type: 'single',
      prompt: 'What’s the best way to use this course?',
      options: ['Memorize every definition', 'Play with the interactive widgets, then quiz yourself', 'Skip to the exam', 'Read only'],
      correct: [1],
      explanation: 'The widgets build intuition fast; the quizzes lock it in. That’s the loop.',
    },
  ],
  resources: [
    { label: 'TutorialsPoint — Operating System tutorial', url: 'https://www.tutorialspoint.com/operating_system/index.htm', kind: 'article', free: true },
  ],
};
