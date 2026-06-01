import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'hld-m5',
  slug: 'replication-and-sharding',
  order: 5,
  title: 'Replication, Sharding & Consistent Hashing',
  subtitle: 'Scale data across machines',
  icon: 'database',
  lessons: [
    {
      id: 'hld-m5-l1',
      title: 'Replication',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Replication** keeps copies of the same data on multiple machines — for read scaling, fault tolerance, and durability. If one node dies, another has the data.' },
        { type: 'keyterms', terms: [
          { term: 'Leader–follower (primary–replica)', def: 'Writes go to the leader; reads can be served by many read-replicas. Scales reads and gives failover. The most common setup.' },
          { term: 'Multi-leader', def: 'Several nodes accept writes (e.g. per region). Higher write availability, but you must resolve write conflicts.' },
          { term: 'Leaderless (quorum)', def: 'Any node accepts reads/writes; consistency comes from quorums (Dynamo/Cassandra style).' },
          { term: 'Sync vs async replication', def: 'Sync: wait for replicas before acknowledging (safe, slower). Async: ack immediately, replicate after (fast, risks losing recent writes on failure → "replication lag").' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Replication lag is a classic gotcha: after writing to the leader, an immediate read from a lagging replica may not see the write. Fix with read-your-writes (route a user’s reads to the leader briefly) or read from the leader for critical paths.' },
      ],
    },
    {
      id: 'hld-m5-l2',
      title: 'Sharding (partitioning)',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Replication copies *all* data to every replica — so it doesn’t help when the dataset is too big for one machine. **Sharding** splits the data into partitions, each on a different node, so the whole set scales horizontally (and writes scale too).' },
        { type: 'keyterms', title: 'Sharding strategies', terms: [
          { term: 'Range-based', def: 'Partition by key ranges (A–M, N–Z). Simple & good for range scans, but prone to hot spots (uneven ranges).' },
          { term: 'Hash-based', def: 'Partition by hash(key) % N. Spreads load evenly, but range queries become hard and resharding remaps everything.' },
          { term: 'Geographic / entity-based', def: 'Shard by region or by tenant/user — keeps related data together and close to users.' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'Shard key choice', def: 'The most important decision — a bad key causes hot spots (e.g. sharding by date sends all "today" traffic to one shard).' },
          { term: 'Hot spot / celebrity problem', def: 'One shard gets disproportionate load (a viral user). Mitigate with finer keys, salting, or dedicated handling.' },
          { term: 'Cross-shard queries / joins', def: 'Become expensive (scatter-gather) — a real cost of sharding to call out.' },
        ] },
      ],
    },
    {
      id: 'hld-m5-l3',
      title: 'Consistent hashing',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Naive hash sharding (`hash(key) % N`) has a fatal flaw: change N (add/remove a node) and *almost every key* remaps — a catastrophic reshuffle. **Consistent hashing** solves this. Add and remove nodes and watch:' },
        { type: 'widget', widget: 'consistent-hashing' },
        { type: 'keyterms', terms: [
          { term: 'The hash ring', def: 'Nodes and keys are hashed onto a circle; each key belongs to the first node clockwise. Adding/removing a node only reassigns the keys in that one arc (~1/N of keys).' },
          { term: 'Virtual nodes', def: 'Each physical node is placed at many points on the ring, so load spreads evenly and removing a node redistributes its keys across many others (not just one neighbour).' },
          { term: 'Where it’s used', def: 'Distributed caches (Memcached clients), DynamoDB & Cassandra partitioning, CDNs, load balancers — anywhere nodes join/leave dynamically.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The one-liner: consistent hashing minimises key movement when the cluster resizes — only ~1/N keys move instead of nearly all. That’s why it’s a system-design staple.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m5-q1', type: 'single', prompt: 'In leader–follower replication, writes go to…', options: ['Any replica', 'Only the leader (reads can use replicas)', 'The CDN', 'All nodes equally'], correct: [1], explanation: 'Writes hit the leader; read-replicas scale reads and provide failover.' },
    { id: 'hld-m5-q2', type: 'single', prompt: 'Asynchronous replication risks…', options: ['Slow writes', 'Losing recent writes / stale reads on lagging replicas', 'No fault tolerance', 'Too much consistency'], correct: [1], explanation: 'Async acks before replicating, so replicas can lag and a failure may lose recent writes.' },
    { id: 'hld-m5-q3', type: 'single', prompt: 'The key difference: replication vs sharding is…', options: ['They are identical', 'Replication copies all data to multiple nodes; sharding splits data across nodes', 'Sharding copies data', 'Replication splits data'], correct: [1], explanation: 'Replication = copies of the whole dataset; sharding = partitions of it on different nodes.' },
    { id: 'hld-m5-q4', type: 'single', prompt: 'The biggest risk of a poor shard key is…', options: ['Too many joins', 'Hot spots (uneven load on one shard)', 'Slow replication', 'Smaller storage'], correct: [1], explanation: 'A bad shard key concentrates traffic on one shard (e.g. sharding by date).' },
    { id: 'hld-m5-q5', type: 'single', prompt: 'Consistent hashing’s main benefit is that when N changes…', options: ['All keys remap', 'Only ~1/N of keys move', 'No keys can be found', 'Reads get slower'], correct: [1], explanation: 'Only the keys in the affected arc move — about 1/N — instead of nearly all.' },
    { id: 'hld-m5-q6', type: 'single', prompt: 'Virtual nodes in a hash ring are used to…', options: ['Reduce durability', 'Spread load evenly and smooth redistribution', 'Avoid replication', 'Replace sharding'], correct: [1], explanation: 'Placing each node at many ring points balances load and redistributes a removed node’s keys widely.' },
  ],
  resources: [
    { label: 'Consistent hashing explained', url: 'https://www.toptal.com/big-data/consistent-hashing', kind: 'article', free: true },
  ],
};
