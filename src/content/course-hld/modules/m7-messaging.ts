import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'hld-m7',
  slug: 'messaging-and-async',
  order: 7,
  title: 'Messaging & Async Processing',
  subtitle: 'Decouple with queues & events',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m7-l1',
      title: 'Why async? Message queues',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Not everything must happen *during* a request. A **message queue** lets a producer hand off work and move on, while consumers process it later — decoupling the two sides in time. Press "burst" and watch the queue buffer the spike:' },
        { type: 'widget', widget: 'message-queue' },
        { type: 'keyterms', terms: [
          { term: 'Producer / Consumer', def: 'Producer publishes messages; consumer(s) process them independently. Neither needs the other to be online at the same moment.' },
          { term: 'Decoupling & buffering', def: 'The queue absorbs traffic spikes (smoothing), so a slow downstream service doesn’t break the user-facing request.' },
          { term: 'Async work', def: 'Push slow tasks (emails, image processing, analytics) off the request path → faster responses for users.' },
          { term: 'Backpressure', def: 'When consumers fall behind, the growing queue signals you to scale consumers or shed load.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Design tip: any task that’s slow, bursty, or can fail-and-retry independently belongs behind a queue — "send notification", "transcode video", "update search index", "process payment webhook".' },
      ],
    },
    {
      id: 'hld-m7-l2',
      title: 'Queues vs pub/sub, and delivery guarantees',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Work queue (point-to-point)', def: 'Each message is processed by exactly ONE consumer — distribute tasks across workers (RabbitMQ, SQS).' },
          { term: 'Pub/Sub (publish-subscribe)', def: 'Each message is broadcast to ALL subscribers — fan-out events to many services (Kafka topics, SNS). This is the Observer pattern at system scale.' },
          { term: 'Kafka', def: 'A durable, partitioned, replayable log. High-throughput streaming; consumers track their own offset and can re-read history.' },
        ] },
        { type: 'keyterms', title: 'Delivery semantics', terms: [
          { term: 'At-most-once', def: 'May drop messages, never duplicates. Rarely acceptable.' },
          { term: 'At-least-once', def: 'Never drops, but may duplicate — the common default. Consumers must handle repeats.' },
          { term: 'Exactly-once', def: 'The ideal, but hard/expensive in distributed systems — usually emulated via at-least-once + idempotency.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Because most queues are at-least-once, make consumers idempotent: processing the same message twice has the same effect as once (e.g. dedupe by a message/idempotency key). This single idea saves countless production bugs.' },
      ],
    },
    {
      id: 'hld-m7-l3',
      title: 'Event-driven architecture',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Take pub/sub to its conclusion and services communicate by emitting and reacting to **events** rather than calling each other directly — an **event-driven architecture (EDA)**.' },
        { type: 'keyterms', terms: [
          { term: 'Event', def: 'A fact that happened ("OrderPlaced", "PaymentReceived"). Producers emit; interested services react — without knowing who listens.' },
          { term: 'Loose coupling', def: 'Add a new consumer (e.g. analytics) without touching producers. Highly extensible.' },
          { term: 'Choreography vs orchestration', def: 'Choreography: services react to events independently. Orchestration: a central coordinator directs the flow.' },
          { term: 'Trade-off', def: 'Great decoupling & scalability, but harder to trace/debug (flows are implicit) and you must handle eventual consistency.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'In an interview, reach for async/events when you spot: slow side-effects, spiky load, fan-out to multiple systems, or a need to decouple teams/services. Then mention idempotency and a dead-letter queue for poison messages.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m7-q1', type: 'single', prompt: 'The main benefit of putting work behind a message queue is…', options: ['Stronger consistency', 'Decoupling + buffering (absorb spikes, faster responses)', 'Less storage', 'Avoiding databases'], correct: [1], explanation: 'Queues decouple producer/consumer in time and buffer bursts, keeping the request path fast.' },
    { id: 'hld-m7-q2', type: 'single', prompt: 'In a work queue (point-to-point), each message is processed by…', options: ['All consumers', 'Exactly one consumer', 'No consumer', 'The producer'], correct: [1], explanation: 'Work queues distribute each message to a single worker; pub/sub broadcasts to all.' },
    { id: 'hld-m7-q3', type: 'single', prompt: 'Pub/Sub delivers each message to…', options: ['One consumer', 'All subscribers (fan-out)', 'The database', 'The load balancer'], correct: [1], explanation: 'Publish-subscribe broadcasts each event to every subscriber.' },
    { id: 'hld-m7-q4', type: 'single', prompt: 'Most real queues guarantee…', options: ['Exactly-once for free', 'At-least-once (so consumers may see duplicates)', 'At-most-once always', 'No delivery'], correct: [1], explanation: 'At-least-once is the common default, which is why idempotency matters.' },
    { id: 'hld-m7-q5', type: 'single', prompt: 'To safely handle duplicate message delivery, make consumers…', options: ['Faster', 'Idempotent', 'Stateful', 'Synchronous'], correct: [1], explanation: 'Idempotent processing means repeats have no extra effect (dedupe by key).' },
    { id: 'hld-m7-q6', type: 'single', prompt: 'A downside of event-driven architecture is…', options: ['Tight coupling', 'Harder to trace/debug implicit flows', 'It can’t scale', 'It needs SQL'], correct: [1], explanation: 'EDA decouples well but makes end-to-end flows implicit and harder to trace.' },
  ],
  resources: [
    { label: 'Kafka — introduction', url: 'https://kafka.apache.org/intro', kind: 'docs', free: true },
  ],
};
