import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'hr-m5',
  slug: 'questions-and-closing',
  order: 5,
  title: 'Questions to Ask & Closing',
  subtitle: 'Finish strong + recap',
  icon: 'handshake',
  lessons: [
    {
      id: 'hr-m5-l1',
      title: 'The questions YOU ask',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Every interview ends with "So, do you have any questions for us?" — and it’s not a formality. Great questions show genuine interest, that you’ve done your homework, and that *you’re* evaluating fit too. Always bring 2–3.' },
        { type: 'keyterms', title: 'Strong questions to ask', terms: [
          { term: 'About the role', def: '"What does success look like in the first 90 days?" · "What are the biggest challenges facing the team right now?"' },
          { term: 'About growth', def: '"How do engineers grow / get mentored here?" · "What does the career path look like?"' },
          { term: 'About the team & culture', def: '"How does the team collaborate day to day?" · "How are decisions made / disagreements handled?"' },
          { term: 'About the interviewer', def: '"What do you enjoy most about working here?" — people love sharing, and it builds rapport.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Avoid (early-stage): leading with salary/perks/time-off, or asking something a 30-second look at their website answers. Save compensation for the recruiter/offer stage unless they raise it.' },
      ],
    },
    {
      id: 'hr-m5-l2',
      title: 'Closing & follow-up',
      minutes: 4,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'End with enthusiasm', def: 'Briefly reaffirm your interest: "I’ve really enjoyed this — I’m excited about the role and would love to contribute to X."' },
          { term: 'Ask about next steps', def: 'It’s fine to ask the timeline / what happens next. Shows engagement and gives you clarity.' },
          { term: 'Send a thank-you note', def: 'A short, personalised thank-you email within 24 hours is a small touch that’s remembered — reference something specific you discussed.' },
          { term: 'Reflect afterwards', def: 'Jot down what was asked and what you’d improve — your prep gets sharper every interview.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Rejection isn’t failure — it’s data. Ask for feedback, refine a weak story, and go again. Interviewing is a skill that compounds with every rep.' },
      ],
    },
    {
      id: 'hr-m5-l3',
      title: 'The whole course in one page',
      minutes: 4,
      blocks: [
        { type: 'keyterms', title: 'Behavioral interview, distilled', terms: [
          { term: 'Mindset', def: 'A conversation to show you’re capable, self-aware & easy to work with — not a test.' },
          { term: 'Structure', def: 'STAR every story. Weight the Action, quantify the Result, say "I".' },
          { term: 'Core questions', def: 'Tell-me-about-yourself (Present→Past→Future), strengths/weaknesses, why-this-company — prepare these cold.' },
          { term: 'Story bank', def: '5–6 real STAR stories tagged to competencies (leadership, conflict, failure, initiative…).' },
          { term: 'Delivery', def: 'Concise, honest, positive, enthusiastic. Never badmouth; never lie.' },
          { term: 'Close', def: 'Ask 2–3 thoughtful questions, reaffirm interest, send a thank-you.' },
        ] },
        { type: 'callout', variant: 'key', text: 'That’s a wrap — the behavioral round, demystified. Combined with everything else in Igloo (DSA, CS fundamentals, Core Java, LLD, System Design, DevOps, Git), you’re now ready for every stage of an SDE interview, from the first commit to the final "any questions for us?". Go get the offer. 🧊' },
      ],
    },
  ],
  quiz: [
    { id: 'hr-m5-q1', type: 'single', prompt: 'When the interviewer asks if YOU have questions, you should…', options: ['Decline politely', 'Ask 2–3 thoughtful questions about the role/team/growth', 'Only ask about salary', 'Ask something their homepage answers'], correct: [1], explanation: 'Thoughtful questions show genuine interest and that you’re assessing fit too.' },
    { id: 'hr-m5-q2', type: 'single', prompt: 'A question best avoided in an early-stage interview is…', options: ['"What does success look like in 90 days?"', 'Leading with salary, perks & time off', '"How does the team collaborate?"', '"What are the team’s big challenges?"'], correct: [1], explanation: 'Compensation/perks are best left to the recruiter/offer stage unless raised.' },
    { id: 'hr-m5-q3', type: 'single', prompt: 'A good post-interview habit is…', options: ['Forget it immediately', 'Send a personalised thank-you within ~24 hours', 'Email daily to follow up', 'Demand instant feedback'], correct: [1], explanation: 'A short, specific thank-you note is a remembered, low-effort touch.' },
    { id: 'hr-m5-q4', type: 'single', prompt: 'The right way to view a rejection is…', options: ['Proof you’ll never make it', 'Data — get feedback, refine, and try again', 'A reason to stop interviewing', 'Always the interviewer’s fault'], correct: [1], explanation: 'Interviewing is a skill; each attempt (and feedback) makes you better.' },
    { id: 'hr-m5-q5', type: 'single', prompt: 'The one-line essence of the behavioral round is…', options: ['Memorise perfect scripts', 'Show you’re capable, self-aware & easy to work with', 'Talk as much as possible', 'Only your GPA matters'], correct: [1], explanation: 'It’s about demonstrating competence + collaboration + self-awareness, structured via STAR.' },
  ],
  resources: [
    { label: 'Questions to ask your interviewer', url: 'https://www.themuse.com/advice/51-interview-questions-you-should-be-asking', kind: 'article', free: true },
  ],
};
