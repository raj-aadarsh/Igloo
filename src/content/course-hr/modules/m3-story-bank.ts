import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'hr-m3',
  slug: 'story-bank',
  order: 3,
  title: 'Your Story Bank',
  subtitle: '"Tell me about a time…"',
  icon: 'handshake',
  lessons: [
    {
      id: 'hr-m3-l1',
      title: 'Prepare stories, not answers',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The biggest unlock in behavioral prep: you can’t predict every question, but they all map to a handful of **competencies**. Prepare ~5–6 strong stories that each cover several, and you can answer almost anything. Tap each competency:' },
        { type: 'widget', widget: 'competency-matrix' },
        { type: 'callout', variant: 'key', text: 'One rich story can answer many questions. A tough project where you led, hit a deadline, and recovered from a setback covers leadership, pressure, AND failure — just emphasise the angle the question asks for.' },
      ],
    },
    {
      id: 'hr-m3-l2',
      title: 'Building & flexing your stories',
      minutes: 5,
      blocks: [
        { type: 'ol', items: [
          'List 5–6 real experiences with genuine stakes (projects, internships, team/college work, open source).',
          'Write each in **STAR** — bullet points, not a script.',
          'Tag each story with the competencies it demonstrates (use the grid above).',
          'For a given question, pick the best-fit story and emphasise the relevant angle.',
        ] },
        { type: 'keyterms', terms: [
          { term: 'Even as a fresher', def: 'No job experience? Use course projects, hackathons, group assignments, club/volunteer work, self-built side projects. The structure & lessons are what matter, not the prestige.' },
          { term: 'Conflict stories', def: 'Show you listened, found common ground, and reached a good outcome — never that you "won" or that the other person was an idiot.' },
          { term: 'Failure stories', def: 'Pick a genuine failure, own your part fully, and spend most of the answer on what you learned and changed. Avoid disguised brags ("I worked too hard").' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Avoid: a "failure" that’s secretly a humblebrag, a conflict where you’re the hero and everyone else is dumb, or a story so trivial it shows nothing. Real stakes + honest reflection win.' },
      ],
    },
  ],
  quiz: [
    { id: 'hr-m3-q1', type: 'single', prompt: 'The smartest prep strategy is to prepare…', options: ['A scripted answer for every possible question', '~5–6 flexible STAR stories that each cover multiple competencies', 'Nothing — improvise', 'Only a failure story'], correct: [1], explanation: 'A small bank of flexible stories covers the many questions that map to shared competencies.' },
    { id: 'hr-m3-q2', type: 'single', prompt: 'For a conflict story, you should show…', options: ['That you won the argument', 'Listening, finding common ground, and a constructive resolution', 'That the other person was incompetent', 'That you avoided the conflict'], correct: [1], explanation: 'Interviewers want empathy, communication, and a good outcome — not "I was right".' },
    { id: 'hr-m3-q3', type: 'single', prompt: 'A good failure story spends most time on…', options: ['Blaming circumstances', 'What you learned and changed afterwards', 'How it wasn’t really your fault', 'A disguised brag'], correct: [1], explanation: 'Ownership + growth is the point of a failure question.' },
    { id: 'hr-m3-q4', type: 'single', prompt: 'As a fresher with no job, good story sources are…', options: ['You can’t answer behavioral questions', 'Course projects, hackathons, team assignments, side projects', 'Only paid work counts', 'Made-up stories'], correct: [1], explanation: 'Academic, project, and volunteer experiences work fine — structure and lessons matter most.' },
    { id: 'hr-m3-q5', type: 'single', prompt: 'One strong story can…', options: ['Only answer one exact question', 'Cover several competencies by emphasising different angles', 'Never be reused', 'Replace all preparation'], correct: [1], explanation: 'Flex the same story to leadership, pressure, or failure depending on what’s asked.' },
  ],
  resources: [
    { label: 'Behavioral questions — preparation guide', url: 'https://www.themuse.com/advice/behavioral-interview-questions-answers-examples', kind: 'article', free: true },
  ],
};
