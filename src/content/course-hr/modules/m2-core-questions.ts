import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'hr-m2',
  slug: 'core-questions',
  order: 2,
  title: 'The Core Questions',
  subtitle: 'The ones you’ll always be asked',
  icon: 'handshake',
  lessons: [
    {
      id: 'hr-m2-l1',
      title: 'The question bank',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The good news: behavioral questions are remarkably predictable. Browse the bank — each card shows what the interviewer is *really* probing and how to answer:' },
        { type: 'widget', widget: 'question-bank' },
        { type: 'callout', variant: 'key', text: 'Almost every question maps to one of four buckets: about you, your motivation, your past behaviour, and your closing questions. Prepare one solid answer per common question and you’ve covered 90% of any behavioral round.' },
      ],
    },
    {
      id: 'hr-m2-l2',
      title: '"Tell me about yourself" — nail the opener',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'This is almost always the first question, it sets the tone, and most people fumble it by reciting their résumé or their childhood. Use the **Present → Past → Future** formula:' },
        { type: 'keyterms', terms: [
          { term: 'Present', def: 'Who you are now: "I’m a final-year CS student / backend developer who…"' },
          { term: 'Past', def: 'Relevant background that got you here: a key project, internship, or skill — only what’s relevant.' },
          { term: 'Future', def: 'Why you’re excited about THIS role: connect your trajectory to the job.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Keep it to 60–90 seconds, focused on professional/relevant points, and end by pointing at the role. Rehearse it until it’s smooth — a strong opener buys you goodwill for the whole interview.' },
        { type: 'callout', variant: 'warning', text: 'Don’t: dump your whole life story, list every job, or go over two minutes. This is a highlight reel pointed at the role, not an autobiography.' },
      ],
    },
  ],
  quiz: [
    { id: 'hr-m2-q1', type: 'single', prompt: '"Tell me about yourself" is best answered with…', options: ['Your full life story', 'Present → Past → Future, focused & ~60–90s', 'Your salary expectations', 'A list of every job you’ve had'], correct: [1], explanation: 'A concise Present→Past→Future highlight reel aimed at the role.' },
    { id: 'hr-m2-q2', type: 'single', prompt: 'When asked "Why do you want to work here?", you should…', options: ['Give a generic answer', 'Reference something specific about the company + how it fits you', 'Talk only about salary', 'Say "I need a job"'], correct: [1], explanation: 'Specific, researched motivation shows genuine interest and fit.' },
    { id: 'hr-m2-q3', type: 'single', prompt: 'For "greatest weakness", the best approach is…', options: ['"I’m a perfectionist"', 'A real, non-critical weakness + concrete steps to improve', 'Deny having any', 'Name a core job skill you lack'], correct: [1], explanation: 'Show self-awareness and active improvement; avoid clichés and disqualifying weaknesses.' },
    { id: 'hr-m2-q4', type: 'single', prompt: 'Most behavioral questions fall into how many buckets?', options: ['About you, motivation, behavioral, closing', 'Just one', 'Ten unrelated types', 'Only technical'], correct: [0], explanation: 'Four buckets cover almost everything — making prep very tractable.' },
    { id: 'hr-m2-q5', type: 'single', prompt: 'A good "tell me about yourself" is roughly…', options: ['10 seconds', '60–90 seconds', '5 minutes', 'As long as needed'], correct: [1], explanation: 'About a minute to ninety seconds — a tight, role-focused summary.' },
  ],
  resources: [
    { label: 'Common interview questions & answers', url: 'https://www.themuse.com/advice/interview-questions-and-answers', kind: 'article', free: true },
  ],
};
