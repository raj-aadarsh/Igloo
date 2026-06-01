import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'hld-m2',
  slug: 'capacity-estimation',
  order: 2,
  title: 'Back-of-the-Envelope Estimation',
  subtitle: 'Numbers that justify your design',
  icon: 'server',
  lessons: [
    {
      id: 'hld-m2-l1',
      title: 'Latency numbers to internalise',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Good design intuition rests on knowing the *relative* cost of operations. The absolute numbers shift over time, but the **orders of magnitude** are timeless:' },
        { type: 'widget', widget: 'latency-numbers' },
        { type: 'callout', variant: 'key', text: 'The whole reason caches, CDNs, and replicas exist: memory is ~100,000× faster than a cross-continent round trip. Keep hot data in memory and physically near users.' },
      ],
    },
    {
      id: 'hld-m2-l2',
      title: 'Estimating QPS, storage & bandwidth',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Early in the interview you convert the scale into concrete numbers. Play with the estimator — change DAU or the write ratio and watch the load shift:' },
        { type: 'widget', widget: 'capacity-estimator' },
        { type: 'keyterms', title: 'The chain of math', terms: [
          { term: 'QPS (queries/sec)', def: 'daily requests ÷ 86,400. Then estimate peak QPS as ~2–3× the average.' },
          { term: 'Read/Write ratio', def: 'Most consumer apps are read-heavy (often 10:1 or more) — this directly motivates caching and read replicas.' },
          { term: 'Storage', def: 'writes/day × item size × retention. Big numbers → you’ll need to shard.' },
          { term: 'Bandwidth', def: 'QPS × payload size = bytes/sec in & out — tells you about CDNs and network cost.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Handy constants: ~100K seconds/day (86,400 ≈ 10^5), 1 KB ≈ 10^3 B, 1 M users × 10 req ≈ 10^7/day ≈ ~115 QPS. Round aggressively — interviewers want the order of magnitude, not decimals.' },
      ],
    },
    {
      id: 'hld-m2-l3',
      title: 'From numbers to decisions',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'Estimates are only useful if they *drive the architecture*. Each result points at a technique:' },
        { type: 'ul', items: [
          'High read:write ratio → add a **cache** + **read replicas**.',
          'Peak QPS ≫ one server can handle → **horizontal scaling** behind a **load balancer**.',
          'Storage in the TB–PB range → **shard/partition** the database.',
          'Large media + global users → **CDN** + object storage (e.g. S3).',
          'Spiky / bursty writes → absorb with a **message queue** (async processing).',
        ] },
        { type: 'callout', variant: 'key', text: 'This is the interview move: "~500K peak QPS and a 50:1 read ratio, so I’ll put a cache in front and use read replicas, sharding the writes by user_id." Numbers → justified components. That sentence is the whole point of estimation.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m2-q1', type: 'single', prompt: 'Roughly how many seconds are in a day (used for QPS math)?', options: ['~3,600', '~86,400 (~10^5)', '~1,000,000', '~10,000'], correct: [1], explanation: '86,400 s/day, often rounded to ~10^5 for quick estimates.' },
    { id: 'hld-m2-q2', type: 'single', prompt: 'Peak QPS is usually estimated as…', options: ['Equal to average', '2–3× the average', '100× the average', 'Half the average'], correct: [1], explanation: 'A peak factor of ~2–3× average is a common rule of thumb.' },
    { id: 'hld-m2-q3', type: 'single', prompt: 'A 50:1 read:write ratio most directly suggests…', options: ['Sharding writes only', 'Caching + read replicas', 'Dropping the database', 'More load balancers'], correct: [1], explanation: 'Read-heavy workloads are served well by caches and read replicas.' },
    { id: 'hld-m2-q4', type: 'single', prompt: 'Storage estimate is computed as…', options: ['QPS × 86,400', 'writes/day × item size × retention', 'DAU × latency', 'bandwidth ÷ QPS'], correct: [1], explanation: 'Storage = number of writes over the retention period × the size of each item.' },
    { id: 'hld-m2-q5', type: 'single', prompt: 'Why do back-of-the-envelope estimates matter in the interview?', options: ['To show off arithmetic', 'They justify which components/scaling techniques you choose', 'They are required by SQL', 'They replace the design'], correct: [1], explanation: 'Estimates turn vague scale into concrete drivers for caching, sharding, CDNs, etc.' },
    { id: 'hld-m2-q6', type: 'single', prompt: 'Terabytes–petabytes of storage most strongly implies…', options: ['Vertical scaling', 'Sharding/partitioning the data', 'A single big database', 'Disabling the cache'], correct: [1], explanation: 'Data that exceeds one machine must be partitioned (sharded) across many.' },
  ],
  resources: [
    { label: 'Latency numbers every programmer should know', url: 'https://gist.github.com/jboner/2841832', kind: 'article', free: true },
  ],
};
