import type { Module } from '@/content/types';

export const m11: Module = {
  id: 'lld-m11',
  slug: 'capstone',
  order: 11,
  title: 'Capstone & Interview Recap',
  subtitle: 'Walk in ready to design anything',
  icon: 'trophy',
  lessons: [
    {
      id: 'lld-m11-l1',
      title: 'The whole method, in one page',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'You now have everything to *write LLD yourself*. The method never changes — only the problem does:' },
        { type: 'ol', items: [
          'Clarify requirements & assumptions (and scope out what’s not needed).',
          'Extract entities (nouns → classes) and behaviour (verbs → methods).',
          'Draw relationships with correct UML (is-a, has-a, uses; hollow vs filled diamond).',
          'Spot the variation points and apply the right pattern — minimally.',
          'Apply SOLID; aim for low coupling, high cohesion.',
          'Handle edge cases & concurrency; then state how you’d extend it.',
        ] },
        { type: 'callout', variant: 'key', text: 'If you can do those six steps out loud while sketching classes, you can pass the round. The case studies were just this method applied to different nouns.' },
      ],
    },
    {
      id: 'lld-m11-l2',
      title: 'Pattern → problem cheat-sheet',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'When you see… reach for…', terms: [
          { term: 'Interchangeable algorithms (pay, sort, price, split)', def: 'Strategy' },
          { term: 'One instance / shared config / logger', def: 'Singleton (sparingly; prefer DI)' },
          { term: 'Hide which concrete class is created', def: 'Factory / Abstract Factory' },
          { term: 'Many optional params / immutable object', def: 'Builder' },
          { term: 'Add features at runtime without subclassing', def: 'Decorator' },
          { term: 'Simplify a complex subsystem', def: 'Facade' },
          { term: 'Incompatible interface to integrate', def: 'Adapter' },
          { term: 'Part-whole tree (files, menus)', def: 'Composite' },
          { term: 'Behaviour changes with status; replace status if/else', def: 'State' },
          { term: 'Notify many dependents on change (pub/sub)', def: 'Observer' },
          { term: 'Undo/redo, queued/loggable actions', def: 'Command (+ Memento)' },
          { term: 'Try handlers in order (middleware, log levels)', def: 'Chain of Responsibility' },
          { term: 'Control access / lazy-load / cache', def: 'Proxy' },
        ] },
      ],
    },
    {
      id: 'lld-m11-l3',
      title: 'Dos, don’ts & practice set',
      minutes: 6,
      blocks: [
        { type: 'keyterms', title: 'In the room', terms: [
          { term: 'DO clarify first', def: 'Ask 3–5 sharp questions and state assumptions before designing.' },
          { term: 'DO think aloud', def: 'Narrate trade-offs; the process is the score.' },
          { term: 'DO start simple', def: 'A clean working core beats a half-built "perfect" design.' },
          { term: 'DON’T over-engineer', def: 'No pattern unless it removes real pain. KISS + YAGNI.' },
          { term: 'DON’T skip concurrency/edge cases', def: 'At least name them — it signals seniority.' },
        ] },
        { type: 'p', text: '**Practice set** — design each with the 6-step method (most appear in real FAANG/product rounds):' },
        { type: 'ul', items: [
          'Parking Lot · Elevator system · Vending Machine · ATM',
          'BookMyShow / movie booking · Splitwise · Food-delivery (Swiggy) cart & order',
          'Tic-Tac-Toe · Chess · Snakes & Ladders · Deck of cards',
          'Rate Limiter · Logging framework · Notification service · In-memory cache (LRU)',
          'Library management · Hotel booking · Ride-hailing (Uber) matching',
        ] },
        { type: 'callout', variant: 'tip', text: 'For each: write the requirements, nouns→classes, the class diagram, the patterns you’d use, and one extension. Do five of these and the round will feel routine.' },
        { type: 'p', text: 'One last lap — run the pattern implementations until each feels obvious, then take the Final Exam:' },
        { type: 'widget', widget: 'lld-playground' },
        { type: 'callout', variant: 'key', text: 'Next stop on your roadmap: System Design (HLD) — where these well-designed components become services that scale. You’ve built the foundation; go design.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m11-q1', type: 'single', prompt: 'The single most important first move in any LLD interview is…', options: ['Pick patterns', 'Clarify requirements & scope', 'Write code fast', 'Draw the DB'], correct: [1], explanation: 'Clarifying requirements frames everything and is explicitly scored.' },
    { id: 'lld-m11-q2', type: 'single', prompt: 'You need undo/redo of user actions. Reach for…', options: ['Command', 'Facade', 'Flyweight', 'Builder'], correct: [0], explanation: 'Command objects encapsulate actions with execute/undo.' },
    { id: 'lld-m11-q3', type: 'single', prompt: 'Behaviour that changes with a status field (and a growing if/else) calls for…', options: ['State', 'Adapter', 'Proxy', 'Singleton'], correct: [0], explanation: 'State turns each status into a class handling its own behaviour & transitions.' },
    { id: 'lld-m11-q4', type: 'single', prompt: 'The biggest LLD interview anti-pattern is…', options: ['Asking questions', 'Over-engineering with unnecessary patterns/abstraction', 'Naming patterns', 'Drawing UML'], correct: [1], explanation: 'Forcing patterns/abstraction you don’t need (violating KISS/YAGNI) is a top failure mode.' },
    { id: 'lld-m11-q5', type: 'single', prompt: 'Across nearly every case study, the dominant useful pattern was…', options: ['Visitor', 'Strategy (encapsulate the variation point)', 'Flyweight', 'Memento'], correct: [1], explanation: 'Identifying what varies and making it a Strategy solved pricing, payment, split, rate-limiting, win-checking…' },
    { id: 'lld-m11-q6', type: 'single', prompt: 'A strong close to any design is to…', options: ['Stop at the first class', 'Explain how new requirements slot in by adding classes (OCP)', 'List unrelated patterns', 'Rewrite everything'], correct: [1], explanation: 'Showing easy, modification-free extension demonstrates senior-level design.' },
  ],
  resources: [
    { label: 'Refactoring.Guru — full pattern catalog', url: 'https://refactoring.guru/design-patterns/catalog', kind: 'article', free: true },
    { label: 'awesome-low-level-design (problems & solutions)', url: 'https://github.com/ashishps1/awesome-low-level-design', kind: 'project', free: true },
  ],
};
