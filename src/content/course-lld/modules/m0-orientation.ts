import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'lld-m0',
  slug: 'what-is-lld',
  order: 0,
  title: 'What is Low-Level Design?',
  subtitle: 'The interview round everyone fears',
  icon: 'drafting-compass',
  lessons: [
    {
      id: 'lld-m0-l1',
      title: 'LLD vs HLD — where you are',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**Low-Level Design (LLD)** is the art of turning a feature into well-structured *classes, objects, and their interactions* — the blueprint a developer codes from. It’s the bridge between high-level architecture and actual code.' },
        { type: 'keyterms', terms: [
          { term: 'High-Level Design (HLD)', def: 'The 30,000-ft view: services, databases, load balancers, queues, how systems scale. "What are the boxes and how do they talk?"' },
          { term: 'Low-Level Design (LLD)', def: 'The class-level view inside one box: classes, interfaces, methods, relationships, and design patterns. "How is this component structured in code?"' },
          { term: 'DSA', def: 'Algorithms & data structures for a single function. LLD is bigger — it’s about organising many classes well.' },
        ] },
        { type: 'analogy', text: 'Building a house: HLD is the architectural plan (rooms, plumbing, electrical layout). LLD is the detailed blueprint of each room — exact dimensions, where every fixture goes. DSA is choosing the strongest, cheapest material for a single beam.' },
        { type: 'callout', variant: 'key', text: 'You’ve already learned the raw materials — OOP, in the Core Java course. LLD is the discipline of *combining* those materials into clean, extensible designs. That skill is what this course builds.' },
      ],
    },
    {
      id: 'lld-m0-l2',
      title: 'The LLD / machine-coding interview',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'At FAANG and most product companies, LLD shows up as a dedicated round (sometimes called **machine coding** or **object-oriented design**). You’re given an open-ended prompt like *"Design a parking lot"* and asked to design (and often code) it in 60–90 minutes.' },
        { type: 'keyterms', title: 'What interviewers actually score', terms: [
          { term: 'Requirement clarification', def: 'Do you ask smart questions and scope the problem before coding? Jumping straight to code is a red flag.' },
          { term: 'Clean class design', def: 'Sensible classes, correct relationships, good names, proper encapsulation.' },
          { term: 'Extensibility (SOLID)', def: 'Can your design absorb a new requirement without rewrites? This is what separates juniors from seniors.' },
          { term: 'Right use of patterns', def: 'Applying a design pattern where it fits — not forcing one everywhere.' },
          { term: 'Working, readable code', def: 'In machine-coding rounds, it must compile and run for the core cases.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'The #1 mistake: coding before clarifying. The #2 mistake: over-engineering — cramming in patterns you don’t need. Good design is the *simplest* thing that cleanly meets the requirements and bends without breaking.' },
      ],
    },
    {
      id: 'lld-m0-l3',
      title: 'How to think about good design',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Every technique in this course serves two goals you’ll hear again and again: **low coupling** (modules barely depend on each other) and **high cohesion** (each module does one focused job). Flip between a tangled and a clean design:' },
        { type: 'widget', widget: 'coupling-cohesion' },
        { type: 'p', text: 'Good design is judged by how easily it **changes**. Real software lives for years and requirements never stop arriving. The whole game of LLD is: *make the likely changes cheap.*' },
        { type: 'keyterms', terms: [
          { term: 'Readability', def: 'Code is read far more than written. Clear names & structure beat cleverness.' },
          { term: 'Extensibility', def: 'New features slot in by adding code, not rewriting it.' },
          { term: 'Maintainability', def: 'Bugs are easy to isolate; one change doesn’t ripple everywhere.' },
          { term: 'Testability', def: 'Pieces can be tested in isolation (a sign of low coupling).' },
        ] },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m0-q1', type: 'single', prompt: 'Low-Level Design is primarily about…', options: ['Choosing servers and databases', 'Structuring classes, objects & their interactions', 'Optimising a single algorithm', 'Network protocols'], correct: [1], explanation: 'LLD is the class-level blueprint of a component; HLD is the system/architecture view.' },
    { id: 'lld-m0-q2', type: 'single', prompt: 'The two guiding goals of good design are…', options: ['High coupling, low cohesion', 'Low coupling, high cohesion', 'Many classes, few methods', 'Speed over everything'], correct: [1], explanation: 'Low coupling + high cohesion make code easy to change, test, and reuse.' },
    { id: 'lld-m0-q3', type: 'single', prompt: 'In an LLD interview, the FIRST thing you should do is…', options: ['Start coding immediately', 'Clarify requirements and scope', 'Pick a design pattern', 'Draw the database schema'], correct: [1], explanation: 'Clarifying requirements before coding is what interviewers look for first.' },
    { id: 'lld-m0-q4', type: 'single', prompt: 'Good design is best measured by…', options: ['Lines of code', 'How many patterns it uses', 'How easily it accommodates change', 'How fast it was written'], correct: [2], explanation: 'Designs are judged on how cheaply they absorb new/changing requirements.' },
    { id: 'lld-m0-q5', type: 'single', prompt: 'Over-engineering means…', options: ['Writing too few classes', 'Forcing in patterns/abstractions you don’t need', 'Clarifying requirements too much', 'Using interfaces'], correct: [1], explanation: 'Cramming in unnecessary patterns/abstraction is as harmful as under-designing.' },
  ],
  resources: [
    { label: 'Refactoring.Guru — design basics', url: 'https://refactoring.guru/design-patterns', kind: 'article', free: true },
    { label: 'Grokking the Low Level Design Interview (overview)', url: 'https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles', kind: 'course', free: false },
  ],
};
