import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'hr-m1',
  slug: 'star-method',
  order: 1,
  title: 'The STAR Method',
  subtitle: 'Structure that wins',
  icon: 'handshake',
  lessons: [
    {
      id: 'hr-m1-l1',
      title: 'STAR, hands-on',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**STAR** is the framework for every "tell me about a time…" question. It turns a rambling story into a crisp, evidence-backed answer. Toggle the weak vs STAR answer below:' },
        { type: 'widget', widget: 'star-builder' },
        { type: 'keyterms', title: 'S · T · A · R', terms: [
          { term: 'Situation', def: 'Briefly set the context (1–2 sentences). Where & when.' },
          { term: 'Task', def: 'Your specific responsibility or the challenge you owned.' },
          { term: 'Action', def: 'What YOU did, concretely, step by step. The biggest part — and say "I", not just "we".' },
          { term: 'Result', def: 'The outcome, quantified where possible, plus what you learned.' },
        ] },
      ],
    },
    {
      id: 'hr-m1-l2',
      title: 'Doing STAR well',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Weight the Action', def: 'Situation + Task should be ~20% (quick setup); Action ~60% (the substance); Result ~20%. Don’t over-explain the backstory.' },
          { term: 'Say "I", not "we"', def: 'They’re hiring YOU. Be clear about your personal contribution even within a team effort.' },
          { term: 'Quantify the Result', def: '"Reduced bugs by 30%", "saved 5 hours/week", "shipped 2 weeks early". Numbers make it memorable & credible.' },
          { term: 'End with learning', def: 'A sentence on what you took away shows growth & self-awareness — especially vital for failure/conflict stories.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Common STAR mistakes: spending 80% on the Situation, never stating the Result, saying "we" so much the interviewer can’t tell what YOU did, or picking a story so trivial it shows nothing. Pick stories with real stakes.' },
        { type: 'callout', variant: 'tip', text: 'Keep each STAR answer to ~1.5–2 minutes. Practise the timing out loud — long answers lose the room; one-line answers reveal nothing.' },
      ],
    },
  ],
  quiz: [
    { id: 'hr-m1-q1', type: 'single', prompt: 'STAR stands for…', options: ['Situation, Task, Action, Result', 'Story, Time, Answer, Review', 'Skill, Task, Aim, Reward', 'Situation, Topic, Aim, Reflection'], correct: [0], explanation: 'Situation · Task · Action · Result.' },
    { id: 'hr-m1-q2', type: 'single', prompt: 'Which part of STAR should take the most time?', options: ['Situation', 'Task', 'Action', 'Result'], correct: [2], explanation: 'Action is the substance — what YOU actually did. Weight it heaviest.' },
    { id: 'hr-m1-q3', type: 'single', prompt: 'Within a team story you should mostly say…', options: ['"we"', '"I" — your personal contribution', '"they"', 'nothing about yourself'], correct: [1], explanation: 'They’re hiring you, so make your individual actions clear.' },
    { id: 'hr-m1-q4', type: 'single', prompt: 'A strong Result is…', options: ['"It went fine."', 'Quantified ("cut load time 40%") + what you learned', '"We were happy."', 'Skipped to save time'], correct: [1], explanation: 'Quantified outcomes are credible and memorable; add a takeaway.' },
    { id: 'hr-m1-q5', type: 'single', prompt: 'A common STAR mistake is…', options: ['Quantifying the result', 'Spending too long on the Situation and never stating the Result', 'Saying "I"', 'Keeping it under 2 minutes'], correct: [1], explanation: 'Over-long setup with no clear result is the classic failure mode.' },
    { id: 'hr-m1-q6', type: 'single', prompt: 'Ideal length for a STAR answer is roughly…', options: ['10 seconds', '1.5–2 minutes', '8–10 minutes', 'As long as possible'], correct: [1], explanation: 'About 1.5–2 minutes — structured and concise.' },
  ],
  resources: [
    { label: 'The STAR method explained', url: 'https://www.themuse.com/advice/star-interview-method', kind: 'article', free: true },
  ],
};
