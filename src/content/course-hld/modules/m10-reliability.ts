import type { Module } from '@/content/types';

export const m10: Module = {
  id: 'hld-m10',
  slug: 'reliability-and-observability',
  order: 10,
  title: 'Reliability & Observability',
  subtitle: 'Survive failure, see what’s happening',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m10-l1',
      title: 'Designing for failure',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'At scale, failure is constant — disks die, networks drop, services hang. Reliable systems *expect* it. The golden rule: **no single point of failure (SPOF)** on the critical path.' },
        { type: 'keyterms', terms: [
          { term: 'Redundancy & failover', def: 'Run ≥2 of everything (servers, LBs, DB replicas) so one failing doesn’t take you down. Failover promotes a standby automatically.' },
          { term: 'Health checks', def: 'Continuously probe components; route away from unhealthy ones (the LB’s job).' },
          { term: 'Retries with backoff + jitter', def: 'Retry transient failures, but with exponential backoff and randomness — naive instant retries cause a "retry storm" that worsens the outage.' },
          { term: 'Graceful degradation', def: 'Shed non-essential features under stress (e.g. skip recommendations) rather than failing entirely.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Pair retries with idempotency (from the messaging module): if a write might be retried, it must be safe to apply twice.' },
      ],
    },
    {
      id: 'hld-m10-l2',
      title: 'The circuit breaker',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'When a downstream service is failing, hammering it (and making users wait for timeouts) makes things worse. A **circuit breaker** detects the failure and "trips" — failing fast and giving the service room to recover. Drive it:' },
        { type: 'widget', widget: 'circuit-breaker' },
        { type: 'callout', variant: 'key', text: 'Closed = normal; Open = fail fast (protect the system); Half-open = cautiously test recovery. This prevents cascading failures, where one slow service drags down everything calling it.' },
      ],
    },
    {
      id: 'hld-m10-l3',
      title: 'Observability & a probabilistic trick',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'You can’t operate what you can’t see. **Observability** is how you understand a live system — its "three pillars":' },
        { type: 'keyterms', terms: [
          { term: 'Metrics', def: 'Numeric time-series (QPS, latency p99, error rate, CPU). Power dashboards & alerts.' },
          { term: 'Logs', def: 'Timestamped event records for debugging. Aggregate them centrally (you can’t SSH into 1,000 boxes).' },
          { term: 'Tracing', def: 'Follow one request across many services (distributed tracing) to find where latency/errors come from.' },
          { term: 'SLA / SLO / SLI', def: 'SLI = what you measure (e.g. p99 latency); SLO = your target (e.g. 99.9%); SLA = the contractual promise to customers.' },
        ] },
        { type: 'p', text: 'A favourite scale trick worth knowing — the **Bloom filter**:' },
        { type: 'keyterms', terms: [
          { term: 'Bloom filter', def: 'A tiny probabilistic set: "definitely not present" or "maybe present" (no false negatives, some false positives). Used to skip pointless lookups — e.g. "is this key even in the DB/cache?" before a costly read.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Mentioning a Bloom filter to avoid disk/DB hits (as Cassandra & CDNs do) is a great way to show depth in a deep-dive.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m10-q1', type: 'single', prompt: 'The golden rule of reliability is…', options: ['Use the fastest CPU', 'No single point of failure (run redundant components)', 'Cache everything', 'Avoid replicas'], correct: [1], explanation: 'Eliminate SPOFs with redundancy + failover on the critical path.' },
    { id: 'hld-m10-q2', type: 'single', prompt: 'Retries should use exponential backoff + jitter to…', options: ['Be faster', 'Avoid a synchronized "retry storm" that worsens the outage', 'Save storage', 'Improve consistency'], correct: [1], explanation: 'Backoff and randomness prevent clients from retrying in lockstep and overwhelming the service.' },
    { id: 'hld-m10-q3', type: 'single', prompt: 'A circuit breaker in the OPEN state…', options: ['Forwards all requests', 'Fails fast without calling the failing service', 'Retries forever', 'Caches responses'], correct: [1], explanation: 'OPEN fails fast to protect the system and let the downstream recover.' },
    { id: 'hld-m10-q4', type: 'single', prompt: 'The three pillars of observability are…', options: ['CPU, RAM, disk', 'Metrics, logs, traces', 'SQL, NoSQL, cache', 'Read, write, delete'], correct: [1], explanation: 'Metrics, logs, and distributed traces together explain a live system.' },
    { id: 'hld-m10-q5', type: 'single', prompt: 'A Bloom filter can tell you…', options: ['Exactly which items are present', '"Definitely not present" or "maybe present" (no false negatives)', 'The value of a key', 'The latency of a request'], correct: [1], explanation: 'Bloom filters give no false negatives but allow false positives — great for skipping useless lookups.' },
    { id: 'hld-m10-q6', type: 'single', prompt: 'An SLO is…', options: ['The contractual customer promise', 'Your internal target for a metric (e.g. 99.9%)', 'The raw measurement', 'A type of cache'], correct: [1], explanation: 'SLI = measurement, SLO = internal target, SLA = external contract.' },
  ],
  resources: [
    { label: 'Google SRE Book (free)', url: 'https://sre.google/books/', kind: 'docs', free: true },
  ],
};
