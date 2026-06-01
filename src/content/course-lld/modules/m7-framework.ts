import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'lld-m7',
  slug: 'lld-framework',
  order: 7,
  title: 'The LLD Interview Framework',
  subtitle: 'A repeatable way to design anything',
  icon: 'workflow',
  lessons: [
    {
      id: 'lld-m7-l1',
      title: 'The 6-step process',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The reason LLD feels "really hard" is that it’s open-ended — there’s no single answer. The fix is a **repeatable process**. Follow these six steps every time and you’ll never freeze at "design a parking lot":' },
        { type: 'ol', items: [
          '**Clarify requirements** — ask questions, list functional requirements, and state your assumptions out loud. Agree on scope before any code.',
          '**Identify entities** — pull the core *nouns* from the requirements; these become your classes & attributes.',
          '**Define relationships** — connect entities with the right UML relationship (is-a, has-a, uses). Draw the class diagram.',
          '**Define behaviour (APIs)** — the *verbs* become methods. Sketch the key public methods and how a request flows through them.',
          '**Apply patterns & SOLID** — spot where things will vary and slot in the right pattern (Strategy, Factory, State…). Keep it minimal.',
          '**Handle edge cases & concurrency** — nulls, invalid input, and shared mutable state (locks where two threads touch the same resource).',
        ] },
        { type: 'callout', variant: 'key', text: 'Narrate every step out loud in the interview. The interviewer is scoring your *thinking*, not just the final diagram. "Let me first clarify the requirements…" earns points immediately.' },
      ],
    },
    {
      id: 'lld-m7-l2',
      title: 'Step 2 in action: nouns & verbs',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'The classic trick to get unstuck: **nouns become classes, verbs become methods.** Toggle the highlighting on a real prompt:' },
        { type: 'widget', widget: 'noun-extraction' },
        { type: 'callout', variant: 'tip', text: 'After extracting, prune: merge synonyms, drop nouns that are really just attributes (a "fee" might be a field on Ticket, not a class), and keep only entities with real behaviour or identity.' },
      ],
    },
    {
      id: 'lld-m7-l3',
      title: 'Clarifying questions that score points',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Step 1 is where most candidates lose marks by skipping it. Build a habit of asking these (adapt to the problem):' },
        { type: 'keyterms', terms: [
          { term: 'Scope & scale', def: 'How many users/items? One location or many? Do we need to persist data or keep it in memory for this round?' },
          { term: 'Core use cases', def: 'What are the must-have flows? (e.g. park → pay → exit.) What’s explicitly out of scope?' },
          { term: 'Variation points', def: 'What’s likely to change/extend? (New vehicle types? New payment methods?) These tell you where to put abstractions.' },
          { term: 'Concurrency', def: 'Can multiple actors act at once (two cars, one spot)? If yes, you’ll need thread-safety.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Don’t gold-plate. If persistence, auth, or distributed scaling are out of scope, say so and move on. The interviewer wants a clean in-memory design in the time given, not a production system.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m7-q1', type: 'single', prompt: 'The FIRST step of the LLD process is…', options: ['Pick design patterns', 'Clarify requirements & scope', 'Write the classes', 'Optimise performance'], correct: [1], explanation: 'Always clarify requirements and scope before designing or coding.' },
    { id: 'lld-m7-q2', type: 'single', prompt: 'In the noun/verb heuristic, verbs typically become…', options: ['Classes', 'Methods', 'Packages', 'Interfaces only'], correct: [1], explanation: 'Nouns → classes/attributes; verbs → methods/behaviour.' },
    { id: 'lld-m7-q3', type: 'single', prompt: 'Identifying "variation points" early helps you…', options: ['Write less code', 'Decide where to put abstractions/patterns', 'Avoid testing', 'Skip requirements'], correct: [1], explanation: 'Knowing what will change tells you where interfaces/patterns (e.g. Strategy) belong.' },
    { id: 'lld-m7-q4', type: 'single', prompt: 'Why narrate your steps aloud in the interview?', options: ['To fill time', 'The interviewer scores your thinking/process, not just the result', 'It’s required by UML', 'To memorise patterns'], correct: [1], explanation: 'LLD rounds evaluate your reasoning and communication, not only the final design.' },
    { id: 'lld-m7-q5', type: 'single', prompt: 'A noun that has no behaviour and just stores a value should usually be…', options: ['Its own class always', 'A field/attribute on another class', 'An interface', 'A pattern'], correct: [1], explanation: 'Not every noun is a class — many are attributes. Prune after extraction.' },
  ],
  resources: [
    { label: 'Grokking the OOD/LLD interview', url: 'https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles', kind: 'course', free: false },
  ],
};
