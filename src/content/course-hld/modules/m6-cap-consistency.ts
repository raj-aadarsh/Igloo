import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'hld-m6',
  slug: 'cap-and-consistency',
  order: 6,
  title: 'CAP & Consistency',
  subtitle: 'The fundamental trade-off',
  icon: 'database',
  lessons: [
    {
      id: 'hld-m6-l1',
      title: 'The CAP theorem',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The **CAP theorem** says a distributed system can guarantee at most **two** of: **C**onsistency, **A**vailability, **P**artition tolerance. Explore the trade-off:' },
        { type: 'widget', widget: 'cap-theorem' },
        { type: 'keyterms', terms: [
          { term: 'Consistency (C)', def: 'Every read returns the most recent write (or an error). All nodes agree.' },
          { term: 'Availability (A)', def: 'Every request gets a (non-error) response — the system stays up.' },
          { term: 'Partition tolerance (P)', def: 'The system keeps working despite dropped/delayed messages between nodes (a network partition).' },
        ] },
        { type: 'callout', variant: 'key', text: 'The real-world reading: networks fail, so P is non-negotiable for any distributed system. CAP therefore collapses to a single question — during a partition, do you choose Consistency (CP) or Availability (AP)?' },
      ],
    },
    {
      id: 'hld-m6-l2',
      title: 'Consistency models & PACELC',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Consistency isn’t all-or-nothing — there’s a spectrum, and you pick the weakest level your product can tolerate (weaker = faster & more available).' },
        { type: 'keyterms', terms: [
          { term: 'Strong consistency', def: 'Reads always see the latest write. Simple to reason about, but costs latency/availability (often CP).' },
          { term: 'Eventual consistency', def: 'Replicas converge "eventually"; a read may be briefly stale. Powers AP systems (feeds, DNS, shopping carts).' },
          { term: 'Read-your-writes', def: 'A user always sees their own latest writes (even if others see them later). Common practical middle ground.' },
          { term: 'Causal / monotonic', def: 'Preserve cause→effect order, or never go "backwards" in time — useful for comments/threads.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'PACELC extends CAP: if there’s a Partition, choose A or C; Else (normal operation) choose Latency or Consistency. It captures the everyday trade-off CAP ignores — even with no partition, more consistency usually means more latency.' },
      ],
    },
    {
      id: 'hld-m6-l3',
      title: 'Quorums & tunable consistency',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Leaderless/replicated stores let you *tune* consistency per request using **quorums**.' },
        { type: 'keyterms', terms: [
          { term: 'N, W, R', def: 'N = replicas per item; W = replicas that must ack a write; R = replicas read from.' },
          { term: 'Quorum rule W + R > N', def: 'If writes and reads overlap on at least one replica, a read is guaranteed to see the latest write — strong consistency, tunably.' },
          { term: 'Tunable consistency', def: 'Lower W/R → faster, more available, weaker consistency. Higher → stronger, slower. Pick per operation (e.g. strong for payments, eventual for likes).' },
        ] },
        { type: 'callout', variant: 'key', text: 'Interview-ready framing: "This is read-heavy and a few seconds of staleness is fine, so I’ll pick an AP store with eventual consistency and read-your-writes for the author. For payments I’ll use a CP/strongly-consistent path." Matching the consistency level to the feature is exactly the judgment they’re testing.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m6-q1', type: 'single', prompt: 'CAP says a distributed system can guarantee at most…', options: ['All three of C, A, P', 'Two of C, A, P', 'One of C, A, P', 'None'], correct: [1], explanation: 'At most two of Consistency, Availability, Partition tolerance.' },
    { id: 'hld-m6-q2', type: 'single', prompt: 'Why is partition tolerance (P) effectively mandatory?', options: ['It’s the easiest', 'Networks inevitably drop/delay messages, so real distributed systems must tolerate partitions', 'It improves latency', 'It’s required by SQL'], correct: [1], explanation: 'Network partitions are unavoidable, so distributed systems must tolerate them — leaving the C-vs-A choice.' },
    { id: 'hld-m6-q3', type: 'single', prompt: 'An AP system during a partition will…', options: ['Return errors to stay consistent', 'Keep responding, possibly with stale data', 'Shut down', 'Block all writes'], correct: [1], explanation: 'AP favours availability — it answers with possibly-stale data and reconciles later.' },
    { id: 'hld-m6-q4', type: 'single', prompt: 'Eventual consistency means…', options: ['Reads never update', 'Replicas converge over time; reads may be briefly stale', 'Strong guarantees', 'No replication'], correct: [1], explanation: 'Replicas converge eventually; a read can be temporarily stale.' },
    { id: 'hld-m6-q5', type: 'single', prompt: 'The quorum rule for strong consistency is…', options: ['W + R > N', 'W + R < N', 'W = R', 'N = 1'], correct: [0], explanation: 'If W + R > N, read and write replica sets overlap, guaranteeing the latest write is seen.' },
    { id: 'hld-m6-q6', type: 'single', prompt: 'PACELC adds the insight that, even with no partition, you trade…', options: ['Storage vs CPU', 'Latency vs Consistency', 'Reads vs writes', 'SQL vs NoSQL'], correct: [1], explanation: 'Else (no partition): choose Latency or Consistency — the everyday trade-off CAP omits.' },
  ],
  resources: [
    { label: 'CAP theorem (and PACELC)', url: 'https://www.educative.io/blog/what-is-cap-theorem', kind: 'article', free: true },
  ],
};
