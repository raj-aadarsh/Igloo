import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'hld-m0',
  slug: 'what-is-system-design',
  order: 0,
  title: 'What is System Design?',
  subtitle: 'The big-picture interview',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m0-l1',
      title: 'HLD, LLD & the request journey',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**High-Level Design (HLD)** — what interviewers simply call the **System Design** round — is about architecting a whole system: the *services, databases, caches, load balancers and queues*, and how they fit together to be **scalable, available, and reliable**.' },
        { type: 'keyterms', terms: [
          { term: 'HLD / System Design', def: 'The macro view: components and how they interact and scale. "What are the boxes, and how do they talk?"' },
          { term: 'LLD', def: 'The micro view inside one box: classes, objects, patterns (the previous course).' },
          { term: 'Non-functional requirements', def: 'The "-ilities" that dominate HLD: scalability, availability, latency, consistency, durability, cost.' },
        ] },
        { type: 'p', text: 'Almost every design starts from one skeleton — the path a request takes through a system. Tap through it (or hit "Send request"):' },
        { type: 'widget', widget: 'request-journey' },
        { type: 'callout', variant: 'key', text: 'Each hop in that journey is a whole topic in this course. Master the hops, and you can assemble them to design anything.' },
      ],
    },
    {
      id: 'hld-m0-l2',
      title: 'The system design interview framework',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'System design questions are deliberately vague ("Design Twitter"). The way to shine is a **structured framework**. Drive the conversation through these steps:' },
        { type: 'ol', items: [
          '**Requirements** — clarify *functional* (features: post tweet, follow, feed) and *non-functional* (scale, latency, availability, consistency). Pin down scope.',
          '**Capacity estimation** — back-of-the-envelope: users → QPS → storage → bandwidth. Reveals read/write ratio and bottlenecks.',
          '**API design** — the key endpoints (e.g. POST /tweet, GET /feed). The contract between client and system.',
          '**Data model** — entities, the schema, and crucially SQL vs NoSQL and why.',
          '**High-level architecture** — draw the boxes: clients, LB, services, cache, DB, queues. The core diagram.',
          '**Deep dive & scale** — pick the hard parts (the feed, hotspots, the bottleneck) and scale them: caching, sharding, replication, async.',
          '**Trade-offs & wrap-up** — state what you chose and *why*, and where it could fail (bottlenecks, SPOFs).',
        ] },
        { type: 'callout', variant: 'key', text: 'There is no single "right" answer — only well-justified trade-offs. Saying "I’ll favour availability over strong consistency here because a slightly stale feed is fine" scores far higher than a perfect-looking diagram with no reasoning.' },
      ],
    },
    {
      id: 'hld-m0-l3',
      title: 'The vocabulary of scale',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'These four terms anchor every non-functional discussion. Know them precisely — interviewers expect the exact words.' },
        { type: 'keyterms', terms: [
          { term: 'Scalability', def: 'The ability to handle growing load by adding resources — ideally by scaling *out* (more machines), not just *up*.' },
          { term: 'Availability', def: 'The fraction of time the system is up and serving. Measured in "nines": 99.9% ≈ 8.7 h downtime/year; 99.99% ≈ 52 min/year.' },
          { term: 'Latency vs Throughput', def: 'Latency = time for one request; Throughput = requests handled per second. You optimise both, and they trade off.' },
          { term: 'Reliability & Durability', def: 'Reliability = works correctly despite failures; Durability = once stored, data is never lost (e.g. via replication).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Rule of thumb you’ll reuse all course: there’s no free lunch. More consistency usually costs availability or latency; more durability costs write speed; caching trades freshness for speed. Design = choosing which trade-off fits the requirement.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m0-q1', type: 'single', prompt: 'In interviews, "System Design round" usually means…', options: ['Low-Level (class) design', 'High-Level Design (architecture)', 'Writing algorithms', 'Database tuning only'], correct: [1], explanation: 'The System Design round is HLD — architecting services, data, and scaling.' },
    { id: 'hld-m0-q2', type: 'single', prompt: 'The FIRST step of the system design framework is…', options: ['Draw the architecture', 'Clarify functional & non-functional requirements', 'Pick a database', 'Estimate storage'], correct: [1], explanation: 'Clarify requirements and scope before estimating or drawing anything.' },
    { id: 'hld-m0-q3', type: 'single', prompt: '99.99% availability is roughly how much downtime per year?', options: ['~8.7 hours', '~52 minutes', '~5 minutes', '~1 second'], correct: [1], explanation: 'Four nines ≈ 52 minutes/year; three nines (99.9%) ≈ 8.7 hours/year.' },
    { id: 'hld-m0-q4', type: 'single', prompt: 'Latency and throughput are…', options: ['The same thing', 'Time-per-request vs requests-per-second', 'Both measured in bytes', 'Unrelated to performance'], correct: [1], explanation: 'Latency = per-request time; throughput = requests/sec. Different axes that often trade off.' },
    { id: 'hld-m0-q5', type: 'single', prompt: 'What earns the most credit in a system design interview?', options: ['A perfect diagram', 'Memorised numbers', 'Well-justified trade-offs and reasoning', 'Naming many technologies'], correct: [2], explanation: 'There’s no single right answer — clear reasoning about trade-offs is what’s scored.' },
    { id: 'hld-m0-q6', type: 'single', prompt: 'Capacity estimation mainly converts…', options: ['Code into classes', 'Users → QPS → storage → bandwidth', 'Latency into throughput', 'SQL into NoSQL'], correct: [1], explanation: 'Back-of-the-envelope turns user numbers into QPS, storage, and bandwidth to expose bottlenecks.' },
  ],
  resources: [
    { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', kind: 'project', free: true },
    { label: 'ByteByteGo — system design basics', url: 'https://bytebytego.com/', kind: 'course', free: false },
  ],
};
