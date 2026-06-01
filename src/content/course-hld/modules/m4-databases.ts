import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'hld-m4',
  slug: 'sql-vs-nosql',
  order: 4,
  title: 'Databases: SQL vs NoSQL',
  subtitle: 'Pick the right store',
  icon: 'database',
  lessons: [
    {
      id: 'hld-m4-l1',
      title: 'Relational (SQL) databases',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Relational databases** (PostgreSQL, MySQL) store structured rows in tables with a fixed schema, related by keys, queried with SQL. They’re the default for most systems — and you already know them from the DBMS course.' },
        { type: 'keyterms', terms: [
          { term: 'Schema & relations', def: 'Strong, predefined structure; data normalised across related tables to avoid duplication.' },
          { term: 'ACID', def: 'Atomicity, Consistency, Isolation, Durability — strong transactional guarantees. Great when correctness is critical (payments, orders).' },
          { term: 'Joins & ad-hoc queries', def: 'Powerful querying across tables — a major SQL advantage.' },
          { term: 'Vertical-scaling bias', def: 'Traditionally scale up; scaling writes horizontally needs sharding (harder than for many NoSQL stores).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Default to SQL unless you have a concrete reason not to: strong consistency, rich queries, and decades of tooling make it the safe choice for most designs.' },
      ],
    },
    {
      id: 'hld-m4-l2',
      title: 'NoSQL: the four families',
      minutes: 7,
      blocks: [
        { type: 'p', text: '**NoSQL** databases trade some of SQL’s guarantees/structure for scale, flexibility, or specific data shapes. Four main types:' },
        { type: 'keyterms', terms: [
          { term: 'Key-Value (Redis, DynamoDB)', def: 'A giant hash map: get/put by key. Blazing fast; great for caches, sessions, counters.' },
          { term: 'Document (MongoDB, Couchbase)', def: 'Stores JSON-like documents with flexible schema. Good for content, catalogs, user profiles.' },
          { term: 'Wide-Column (Cassandra, HBase, Bigtable)', def: 'Rows with dynamic columns, optimised for massive write throughput and time-series/event data.' },
          { term: 'Graph (Neo4j)', def: 'Nodes and edges — built for highly connected data and relationship queries (social graphs, recommendations).' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'BASE', def: 'Basically Available, Soft state, Eventual consistency — NoSQL’s typical alternative to ACID, favouring availability & scale.' },
          { term: 'Flexible / schemaless', def: 'No fixed schema — fast to evolve, but the application must handle varied shapes.' },
          { term: 'Horizontal scale built-in', def: 'Many NoSQL stores shard & replicate across nodes natively — a key reason to reach for them at huge scale.' },
        ] },
      ],
    },
    {
      id: 'hld-m4-l3',
      title: 'Choosing — and indexing',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'Reach for SQL when…', terms: [
          { term: 'Strong consistency / transactions', def: 'Money, inventory, anything that must be exactly right.' },
          { term: 'Complex queries & joins', def: 'Reporting, ad-hoc analytics, relational data.' },
          { term: 'Structured, stable schema', def: 'Well-understood entities and relationships.' },
        ] },
        { type: 'keyterms', title: 'Reach for NoSQL when…', terms: [
          { term: 'Massive scale / write throughput', def: 'More than one machine can handle; built-in sharding helps.' },
          { term: 'Flexible / evolving schema', def: 'Varied, semi-structured, or rapidly changing data.' },
          { term: 'Simple access patterns', def: 'Mostly key lookups, or a specific shape (documents, graphs, time-series).' },
        ] },
        { type: 'callout', variant: 'key', text: 'It’s not either/or — large systems use polyglot persistence: SQL for orders, Redis for sessions/cache, Cassandra for the feed, a graph DB for the social graph. Pick per access pattern.' },
        { type: 'callout', variant: 'tip', text: 'Whatever the store, indexing is the #1 read-speed lever (recall B+ trees from DBMS). And denormalising (pre-joining/duplicating data) trades storage & write complexity for fast reads — a very common HLD move.' },
      ],
    },
  ],
  quiz: [
    { id: 'hld-m4-q1', type: 'single', prompt: 'ACID transactions are a hallmark of…', options: ['Key-value stores', 'Relational (SQL) databases', 'Graph databases only', 'CDNs'], correct: [1], explanation: 'Relational databases provide strong ACID transactional guarantees.' },
    { id: 'hld-m4-q2', type: 'single', prompt: 'Which NoSQL type is best for highly connected social-graph data?', options: ['Key-value', 'Document', 'Wide-column', 'Graph'], correct: [3], explanation: 'Graph databases model nodes/edges and excel at relationship queries.' },
    { id: 'hld-m4-q3', type: 'single', prompt: 'BASE stands for an approach that favours…', options: ['Strong consistency', 'Availability & eventual consistency', 'ACID transactions', 'Joins'], correct: [1], explanation: 'Basically Available, Soft state, Eventual consistency — trading strict consistency for availability/scale.' },
    { id: 'hld-m4-q4', type: 'single', prompt: 'Cassandra / wide-column stores are optimised for…', options: ['Complex joins', 'Massive write throughput & time-series data', 'Graph traversal', 'ACID payments'], correct: [1], explanation: 'Wide-column stores handle very high write volume and event/time-series workloads.' },
    { id: 'hld-m4-q5', type: 'single', prompt: 'Using different databases for different needs in one system is called…', options: ['Sharding', 'Polyglot persistence', 'Normalization', 'Replication'], correct: [1], explanation: 'Polyglot persistence = choosing the best store per access pattern.' },
    { id: 'hld-m4-q6', type: 'single', prompt: 'Denormalization trades…', options: ['Reads for writes', 'Storage & write complexity for faster reads', 'Consistency for joins', 'Nothing'], correct: [1], explanation: 'Duplicating/pre-joining data speeds reads at the cost of more storage and write upkeep.' },
  ],
  resources: [
    { label: 'MongoDB — SQL vs NoSQL', url: 'https://www.mongodb.com/nosql-explained/nosql-vs-sql', kind: 'article', free: true },
  ],
};
