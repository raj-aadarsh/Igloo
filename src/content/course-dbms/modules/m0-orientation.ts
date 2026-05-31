import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'dbms-m0',
  slug: 'welcome',
  order: 0,
  title: 'Welcome to DBMS',
  subtitle: 'How this course works',
  icon: 'compass',
  lessons: [
    {
      id: 'dbms-m0-l1',
      title: 'Start here',
      minutes: 3,
      blocks: [
        { type: 'p', text: 'Databases are everywhere, and DBMS is a guaranteed interview topic. This course keeps it **visual and hands-on**: poke a relation to learn its parts, watch a messy table get normalized step by step, build ER relationships, run real **SQL** in your browser later on.' },
        { type: 'h2', text: 'What you’ll be able to do' },
        { type: 'ul', items: [
          'Design schemas with the **ER model**, keys & constraints.',
          'Explain **functional dependencies** and **normalize** to 1NF → BCNF.',
          'Reason about **transactions, ACID, schedules & serializability**.',
          'Read/write the **SQL** that interviews love: joins, GROUP BY/HAVING, aggregates, subqueries.',
        ] },
        { type: 'callout', variant: 'tip', text: 'Play with every widget and take the short quiz at the end of each module (unlimited attempts). The normalization stepper and the SQL playground are the stars.' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m0-q1', type: 'single', prompt: 'Best way to learn here?', options: ['Memorize syntax', 'Use the interactive widgets, then quiz yourself', 'Skip to the exam', 'Read only'], correct: [1], explanation: 'The widgets build intuition; the quizzes lock it in.' },
  ],
  resources: [
    { label: 'GeeksforGeeks — DBMS', url: 'https://www.geeksforgeeks.org/dbms/', kind: 'article', free: true },
  ],
};
