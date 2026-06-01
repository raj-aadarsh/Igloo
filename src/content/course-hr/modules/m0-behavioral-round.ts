import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'hr-m0',
  slug: 'the-behavioral-round',
  order: 0,
  title: 'The Behavioral Round',
  subtitle: 'Why "soft" skills decide offers',
  icon: 'handshake',
  lessons: [
    {
      id: 'hr-m0-l1',
      title: 'What it is & why it matters',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'You’ve cleared the technical rounds — now the **behavioral / HR interview** decides whether they actually want to *work with you*. It’s where many strong coders lose offers, simply because they never prepared for it.' },
        { type: 'keyterms', terms: [
          { term: 'What it assesses', def: 'Communication, teamwork, ownership, how you handle conflict & failure, motivation, and "culture fit" — can this person collaborate and grow here?' },
          { term: 'The premise', def: 'Past behaviour predicts future behaviour. So they ask about real situations you’ve been in, not hypotheticals.' },
          { term: 'Who runs it', def: 'A recruiter, hiring manager, or senior engineer — and at big tech, a dedicated values/culture round (e.g. Amazon’s Leadership Principles).' },
        ] },
        { type: 'callout', variant: 'key', text: 'Reframe it: the behavioral round isn’t a test to pass, it’s a conversation to show you’re capable, self-aware, and easy to work with. Technical skill gets you in the room; this is what gets you the offer.' },
      ],
    },
    {
      id: 'hr-m0-l2',
      title: 'The mindset & preparation',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Behavioral interviews *feel* unpredictable, but they’re actually the most **prepare-able** round — the questions are well known. The secret isn’t winging it; it’s having a small bank of strong stories ready.' },
        { type: 'ol', items: [
          'Know the **common questions** (next module has the bank) — they barely change between companies.',
          'Prepare **5–6 real stories** from your projects/internships/teamwork that you can flex to many questions.',
          'Structure every story with **STAR** so it’s clear and concise.',
          'Research the **company & role** so your motivation answers are specific.',
          'Practise **out loud** — ideally mock interviews — until it feels natural, not memorised.',
        ] },
        { type: 'keyterms', terms: [
          { term: 'Be specific, not generic', def: '"I improved performance by 40%" beats "I’m results-driven." Evidence > adjectives.' },
          { term: 'Be honest', def: 'Don’t invent stories — interviewers probe with follow-ups, and rehearsed lies fall apart. Real beats perfect.' },
          { term: 'Stay positive', def: 'Never badmouth a past team/manager/company — how you talk about others signals how you’ll talk about them.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Golden ratio: a couple of hours preparing a story bank + saying it aloud will do more for your offer rate than another LeetCode grind, once your technical prep is solid.' },
      ],
    },
  ],
  quiz: [
    { id: 'hr-m0-q1', type: 'single', prompt: 'The behavioral round mainly assesses…', options: ['Coding speed', 'Communication, teamwork, ownership & culture fit', 'System design', 'SQL knowledge'], correct: [1], explanation: 'It evaluates how you work with others and handle real situations — the "will we want to work with you" factors.' },
    { id: 'hr-m0-q2', type: 'single', prompt: 'Behavioral questions are based on the premise that…', options: ['Hypotheticals reveal skill', 'Past behaviour predicts future behaviour', 'Everyone lies', 'Only grades matter'], correct: [1], explanation: 'That’s why they ask about real past situations rather than hypotheticals.' },
    { id: 'hr-m0-q3', type: 'single', prompt: 'The best preparation is to…', options: ['Wing it — it’s unpredictable', 'Prepare a small bank of real STAR stories and practise aloud', 'Memorise word-for-word scripts', 'Only research salary'], correct: [1], explanation: 'A flexible story bank + out-loud practice beats both winging it and rote memorisation.' },
    { id: 'hr-m0-q4', type: 'single', prompt: 'Which answer is strongest?', options: ['"I’m very results-driven."', '"I cut the page load time by 40% by adding caching."', '"I work hard."', '"I’m a team player."', ], correct: [1], explanation: 'Specific, quantified evidence beats generic adjectives every time.' },
    { id: 'hr-m0-q5', type: 'single', prompt: 'Talking about a past manager or company, you should…', options: ['Badmouth them if they were bad', 'Stay positive & professional, even about negatives', 'Avoid all mention of the past', 'Exaggerate conflicts'], correct: [1], explanation: 'How you speak about others signals how you’ll speak about this team — keep it constructive.' },
  ],
  resources: [
    { label: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', kind: 'article', free: true },
  ],
};
