import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'hr-m4',
  slug: 'dos-donts-delivery',
  order: 4,
  title: 'Delivery: Dos & Don’ts',
  subtitle: 'How you say it matters too',
  icon: 'handshake',
  lessons: [
    {
      id: 'hr-m4-l1',
      title: 'Dos & don’ts',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: '✅ Do', terms: [
          { term: 'Be concise & structured', def: 'STAR keeps you on track; aim for ~2-minute answers. Pause to think before answering — silence is fine.' },
          { term: 'Be specific & honest', def: 'Real examples, real numbers. Interviewers probe with follow-ups, so authenticity holds up.' },
          { term: 'Show enthusiasm', def: 'Energy and genuine interest in the role are remembered as much as content.' },
          { term: 'Listen & clarify', def: 'If a question is unclear, ask. Answer what’s actually asked, not what you rehearsed.' },
        ] },
        { type: 'keyterms', title: '❌ Don’t', terms: [
          { term: 'Ramble or memorise robotically', def: 'Both lose the room. Know your points; speak naturally.' },
          { term: 'Badmouth anyone', def: 'Never trash a past employer, manager, or teammate — it’s an instant red flag.' },
          { term: 'Lie or exaggerate', def: 'Follow-up questions expose it, and it destroys trust instantly.' },
          { term: 'Say "I have no questions"', def: 'It signals disinterest. Always have a few ready (next module).' },
        ] },
        { type: 'callout', variant: 'key', text: 'The meta-skill behind all of these: be someone they’d want on the team — clear, honest, positive, and easy to talk to. Competence + likeability wins offers.' },
      ],
    },
    {
      id: 'hr-m4-l2',
      title: 'Communication & virtual interviews',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Body language', def: 'Sit up, make eye contact, smile, don’t fidget. Confident posture reads as confidence.' },
          { term: 'Pace & filler words', def: 'Slow down; a brief pause beats "um, like, you know". Breathe — it’s a conversation, not a quiz.' },
          { term: 'It’s a two-way street', def: 'You’re also evaluating them. That mindset calms nerves and comes across as confidence.' },
        ] },
        { type: 'keyterms', title: 'For video / remote interviews', terms: [
          { term: 'Tech check', def: 'Test camera, mic, and internet beforehand. Have a backup (phone number) ready.' },
          { term: 'Look at the camera', def: 'Not the screen — it simulates eye contact. Frame yourself well-lit, head-and-shoulders.' },
          { term: 'Quiet, tidy space', def: 'Minimise noise/interruptions; a clean, neutral background keeps the focus on you.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'It’s okay to be nervous and to pause. "That’s a great question, let me think for a second" is a perfectly strong response — far better than rushing into a messy answer.' },
      ],
    },
  ],
  quiz: [
    { id: 'hr-m4-q1', type: 'single', prompt: 'Which is an instant red flag?', options: ['Pausing to think', 'Badmouthing a past employer', 'Asking a clarifying question', 'Giving a quantified result'], correct: [1], explanation: 'Trashing past employers/teammates signals you’ll do the same about them.' },
    { id: 'hr-m4-q2', type: 'single', prompt: 'When asked "Any questions for us?", you should…', options: ['Say no to seem easygoing', 'Always have 2–3 thoughtful questions ready', 'Ask only about salary', 'End the interview'], correct: [1], explanation: '"No questions" reads as disinterest; thoughtful questions show engagement.' },
    { id: 'hr-m4-q3', type: 'single', prompt: 'In a video interview, you should look at…', options: ['The screen', 'The camera (it simulates eye contact)', 'Your notes', 'Away from the screen'], correct: [1], explanation: 'Looking at the camera approximates eye contact with the interviewer.' },
    { id: 'hr-m4-q4', type: 'single', prompt: 'A good way to handle a tough question is to…', options: ['Rush an answer immediately', 'Pause briefly to think before answering', 'Change the subject', 'Make something up'], correct: [1], explanation: 'A short, composed pause beats a rushed, messy answer.' },
    { id: 'hr-m4-q5', type: 'single', prompt: 'The meta-goal across all delivery tips is to…', options: ['Sound the smartest', 'Come across as competent AND someone they’d want to work with', 'Talk the most', 'Memorise scripts'], correct: [1], explanation: 'Competence + likeability/clarity is what earns the offer.' },
  ],
  resources: [
    { label: 'Video interview tips', url: 'https://www.themuse.com/advice/video-interview-tips', kind: 'article', free: true },
  ],
};
