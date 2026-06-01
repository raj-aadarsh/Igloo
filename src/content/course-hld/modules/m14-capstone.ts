import type { Module } from '@/content/types';

export const m14: Module = {
  id: 'hld-m14',
  slug: 'capstone',
  order: 14,
  title: 'Capstone & Interview Recap',
  subtitle: 'Walk in and design anything',
  icon: 'trophy',
  lessons: [
    {
      id: 'hld-m14-l1',
      title: 'The framework + the toolkit',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'You now hold the whole toolkit. Every system design is the same method applied to a new problem — drive it with the framework, and reach into the toolkit where the problem is hard.' },
        { type: 'ol', items: [
          'Clarify **requirements** (functional + non-functional) and scope.',
          'Do **capacity estimation** (DAU → QPS → storage → bandwidth) to find bottlenecks.',
          'Sketch the **APIs** and the **data model** (SQL vs NoSQL, and why).',
          'Draw the **high-level architecture** (the skeleton below).',
          '**Deep-dive** the hard part; scale it with caching, replication, sharding, async.',
          'Call out **trade-offs**, failure modes, and bottlenecks.',
        ] },
        { type: 'widget', widget: 'architecture-canvas' },
        { type: 'callout', variant: 'key', text: 'No design needs every box. Include what the requirements justify, and explain why each is there. Restraint + reasoning reads as senior; a kitchen-sink diagram does not.' },
      ],
    },
    {
      id: 'hld-m14-l2',
      title: 'When-to-use cheat-sheet',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'See a need… reach for…', terms: [
          { term: 'Read-heavy / repeated reads', def: 'Cache (Redis) + read replicas; CDN for static/media.' },
          { term: 'Too much traffic for one server', def: 'Horizontal scaling + load balancer (keep servers stateless).' },
          { term: 'Data too big for one machine', def: 'Shard/partition; consistent hashing for elastic clusters.' },
          { term: 'Slow / spiky / fire-and-forget work', def: 'Message queue (async); pub/sub to fan out events.' },
          { term: 'Global users / large media', def: 'CDN + object storage; multi-region.' },
          { term: 'Need uptime over freshness', def: 'AP store, eventual consistency, read-your-writes.' },
          { term: 'Need correctness (money)', def: 'Strong consistency / ACID (CP); careful idempotency.' },
          { term: 'Cross-service transaction', def: 'Saga (compensating actions), not 2-phase commit.' },
          { term: 'Real-time push (chat, live)', def: 'WebSockets (+ presence registry); SSE for one-way.' },
          { term: 'Prevent cascading failure', def: 'Circuit breaker, retries w/ backoff, bulkheads, rate limiting.' },
        ] },
      ],
    },
    {
      id: 'hld-m14-l3',
      title: 'Dos, don’ts & practice set',
      minutes: 6,
      blocks: [
        { type: 'keyterms', title: 'In the room', terms: [
          { term: 'DO drive the structure', def: 'Lead with requirements → estimation → API → data → architecture → deep dive. Don’t wait to be prompted.' },
          { term: 'DO think in trade-offs', def: 'Every choice has a cost. Say what you gain and what you give up.' },
          { term: 'DO estimate', def: 'Numbers justify the architecture and reveal the bottleneck.' },
          { term: 'DON’T over-build', def: 'No component without a reason. Start simple; scale the part that needs it.' },
          { term: 'DON’T forget failure & bottlenecks', def: 'Name the SPOFs, the hot shard, the slow path — and how you’d handle them.' },
        ] },
        { type: 'p', text: '**Practice set** — design each with the framework (all are real FAANG questions):' },
        { type: 'ul', items: [
          'URL shortener · Pastebin · Key-value store · Distributed cache',
          'Twitter/Instagram feed · WhatsApp/Messenger chat · Notification service',
          'YouTube/Netflix · Uber/Lyft · Google Maps nearby · Typeahead/search',
          'Rate limiter · Web crawler · Google Drive/Dropbox · Ticketmaster',
          'Payment system · Ad click aggregator · Distributed message queue · Leaderboard',
        ] },
        { type: 'callout', variant: 'tip', text: 'Do five of these out loud, end-to-end, and the round becomes routine. Reuse the same skeleton; only the hard deep-dive changes per problem.' },
        { type: 'callout', variant: 'key', text: 'That’s the whole Igloo journey — from how a request flows to designing systems for millions. You’ve got DSA, OOP, the CS fundamentals, LLD, and now System Design. Go build something (and ace those interviews). 🧊' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m14-q1', type: 'single', prompt: 'A read-heavy workload with repeated reads most calls for…', options: ['Sharding writes', 'Caching + read replicas', 'A message queue', 'WebSockets'], correct: [1], explanation: 'Cache hot data and add read replicas to serve heavy read traffic.' },
    { id: 'hld-m14-q2', type: 'single', prompt: 'Data too large for a single machine requires…', options: ['Vertical scaling', 'Sharding/partitioning', 'A CDN', 'A circuit breaker'], correct: [1], explanation: 'Partition the data across nodes (often with consistent hashing).' },
    { id: 'hld-m14-q3', type: 'single', prompt: 'A cross-service transaction is handled with…', options: ['2-phase commit', 'A Saga (compensating actions)', 'A single ACID transaction', 'A cache'], correct: [1], explanation: 'Sagas chain local transactions with compensations across services.' },
    { id: 'hld-m14-q4', type: 'single', prompt: 'To prevent one failing dependency from cascading, use…', options: ['More threads', 'A circuit breaker (+ retries with backoff)', 'A bigger DB', 'GraphQL'], correct: [1], explanation: 'Circuit breakers fail fast and isolate failures; backoff avoids retry storms.' },
    { id: 'hld-m14-q5', type: 'single', prompt: 'The biggest system-design interview anti-pattern is…', options: ['Estimating capacity', 'Over-building components with no justification', 'Stating trade-offs', 'Drawing the architecture'], correct: [1], explanation: 'Adding components without reason (no scoping/justification) is a classic failure.' },
    { id: 'hld-m14-q6', type: 'single', prompt: 'What earns the most credit overall?', options: ['A huge diagram', 'Structured reasoning and justified trade-offs', 'Naming many tools', 'Perfect numbers'], correct: [1], explanation: 'Driving the framework and justifying trade-offs is the core of a strong design round.' },
  ],
  resources: [
    { label: 'System Design Primer (study guide)', url: 'https://github.com/donnemartin/system-design-primer', kind: 'project', free: true },
    { label: 'Designing Data-Intensive Applications (the book)', url: 'https://dataintensive.net/', kind: 'docs', free: false },
  ],
};
