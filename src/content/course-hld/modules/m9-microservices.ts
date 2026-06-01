import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'hld-m9',
  slug: 'microservices-and-patterns',
  order: 9,
  title: 'Microservices & Architecture Patterns',
  subtitle: 'Monolith → services → CQRS & Saga',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m9-l1',
      title: 'Monolith vs microservices',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **monolith** is one deployable app; **microservices** split it into small, independently deployable services owned by separate teams. Neither is "better" — it’s a trade-off.' },
        { type: 'keyterms', terms: [
          { term: 'Monolith', def: 'Simple to build, test, and deploy early on; one codebase, easy local transactions. But it gets hard to scale teams and selectively scale parts as it grows.' },
          { term: 'Microservices', def: 'Independent deploys, per-service scaling, team autonomy, tech diversity. Cost: distributed-system complexity — network calls, partial failure, data spread across services.' },
          { term: 'Bounded context', def: 'Split services around business capabilities (Orders, Payments, Inventory), each owning its data — not around technical layers.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Common interview wisdom: start with a (well-structured) monolith and extract microservices when team size / scaling pain justifies it. Premature microservices add huge complexity for little gain — the distributed-systems tax is real.' },
      ],
    },
    {
      id: 'hld-m9-l2',
      title: 'Microservice data patterns',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The hard part of microservices is data: each service owns its database, so you can’t just JOIN or run one ACID transaction across them.' },
        { type: 'keyterms', terms: [
          { term: 'Database per service', def: 'Each service owns and hides its data; others access it only via the service’s API. Keeps services decoupled.' },
          { term: 'Saga pattern', def: 'A distributed "transaction" as a sequence of local transactions linked by events; if one step fails, run compensating actions to undo prior steps. Replaces cross-service ACID.' },
          { term: 'CQRS', def: 'Command Query Responsibility Segregation — separate the write model from read models, so each is optimised independently (e.g. denormalised read views).' },
          { term: 'Event sourcing', def: 'Store the system’s state as an append-only log of events; current state is derived by replaying them. Gives a full audit trail and time-travel — at the cost of complexity.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Saga is the go-to answer for "how do you do a transaction across microservices?" — you don’t use 2-phase commit; you chain local transactions with compensating actions (e.g. cancel order if payment fails).' },
      ],
    },
    {
      id: 'hld-m9-l3',
      title: 'Putting the architecture together',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A typical large-scale architecture stacks the pieces you’ve learned:' },
        { type: 'ol', items: [
          'Clients → **CDN** (static) → **DNS/GeoDNS** → **Load balancer**.',
          '**API gateway** (auth, rate limiting, routing) in front of **microservices**.',
          'Services use **caches** (Redis) and their **own databases** (replicated & sharded).',
          'Slow/spiky work flows through **message queues** (async); events fan out via **pub/sub**.',
          'Cross-cutting: **service discovery**, config, and **observability** (next lesson).',
        ] },
        { type: 'callout', variant: 'tip', text: 'In an interview, narrate this top-down and only deep-dive where the problem is hard. You don’t need every box — include what the requirements justify, and say why. That restraint reads as senior.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m9-q1', type: 'single', prompt: 'A common, pragmatic starting point for a new system is…', options: ['Hundreds of microservices', 'A well-structured monolith, extracting services later', 'No backend', 'Event sourcing everywhere'], correct: [1], explanation: 'Start monolith-first; extract microservices when scaling/team pain justifies the complexity.' },
    { id: 'hld-m9-q2', type: 'single', prompt: 'In microservices, each service should ideally…', options: ['Share one big database', 'Own its own data, exposed only via its API', 'Skip databases', 'Use only SQL'], correct: [1], explanation: 'Database-per-service keeps services decoupled; others go through the API.' },
    { id: 'hld-m9-q3', type: 'single', prompt: 'How do you implement a "transaction" spanning multiple microservices?', options: ['One big ACID transaction', 'The Saga pattern (local transactions + compensating actions)', 'A shared lock', 'You can’t do anything'], correct: [1], explanation: 'Sagas chain local transactions with compensations instead of distributed ACID.' },
    { id: 'hld-m9-q4', type: 'single', prompt: 'CQRS separates…', options: ['Cache from DB', 'The write model from the read model(s)', 'Clients from servers', 'Auth from routing'], correct: [1], explanation: 'CQRS splits commands (writes) from queries (reads) so each is optimised separately.' },
    { id: 'hld-m9-q5', type: 'single', prompt: 'Event sourcing stores state as…', options: ['Only the latest snapshot', 'An append-only log of events, replayed to derive state', 'A cache', 'A single row'], correct: [1], explanation: 'State is the result of replaying an immutable event log — full audit & time-travel.' },
    { id: 'hld-m9-q6', type: 'single', prompt: 'The biggest cost of microservices is…', options: ['They can’t scale', 'Distributed-system complexity (network, partial failure, data spread)', 'They need a monolith', 'They forbid caching'], correct: [1], explanation: 'You trade simplicity for distributed-system complexity and operational overhead.' },
  ],
  resources: [
    { label: 'microservices.io — patterns', url: 'https://microservices.io/patterns/index.html', kind: 'article', free: true },
  ],
};
