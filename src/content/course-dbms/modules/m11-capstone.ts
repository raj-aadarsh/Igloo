import type { Module } from '@/content/types';

export const m11: Module = {
  id: 'dbms-m11',
  slug: 'capstone',
  order: 11,
  title: 'Capstone & Interview Recap',
  subtitle: 'Tie it all together',
  icon: 'trophy',
  lessons: [
    {
      id: 'dbms-m11-l1',
      title: 'The journey, end to end',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'You’ve gone from "what is a database?" to writing real SQL. Here’s the whole pipeline a developer reasons about every day:' },
        { type: 'ol', items: [
          'Model the world with an **ER diagram** (entities, attributes, relationships, cardinality).',
          'Convert entities & relationships into **relations (tables)** with **keys** and **constraints**.',
          'Remove redundancy with **normalization** (1NF → 2NF → 3NF → BCNF) using functional dependencies.',
          'Reason about correctness with **relational algebra** — the math under SQL.',
          'Keep concurrent access safe with **transactions** (ACID), schedules & serializability.',
          'Make reads fast with **indexes** (B+ trees) — at the cost of slower writes.',
          'Actually talk to the data with **SQL** — DDL to define, DML to query & change.',
        ] },
        { type: 'callout', variant: 'key', text: 'The mental model interviewers reward: design → normalize → index → query. Each layer solves a different problem (correctness, redundancy, speed, access).' },
      ],
    },
    {
      id: 'dbms-m11-l2',
      title: 'Rapid-fire interview cheat-sheet',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'Things you should be able to answer in one breath', terms: [
          { term: 'Primary vs Candidate vs Super key', def: 'Super = any unique attr set; Candidate = minimal super key; Primary = the chosen candidate key.' },
          { term: 'Why normalize?', def: 'Eliminate insert/update/delete anomalies & redundancy. BCNF: every determinant is a candidate key.' },
          { term: 'ACID', def: 'Atomicity, Consistency, Isolation, Durability.' },
          { term: 'Conflict serializable?', def: 'Precedence graph has no cycle.' },
          { term: 'DELETE vs TRUNCATE vs DROP', def: 'Rows (filterable, rollback) / all rows fast (DDL) / whole table.' },
          { term: 'WHERE vs HAVING', def: 'Rows before grouping vs groups after aggregation.' },
          { term: 'Clustered vs non-clustered index', def: 'Defines physical row order (one per table) vs separate structure pointing to rows (many).' },
          { term: 'Why B+ tree for indexes?', def: 'Shallow, balanced, linked leaves → fast point AND range queries with few disk reads.' },
        ] },
      ],
    },
    {
      id: 'dbms-m11-l3',
      title: 'Final challenge',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'One last run through the playground. Make sure you can solve all 9 challenges — they touch SELECT, WHERE, DISTINCT, ORDER BY, BETWEEN, GROUP BY, HAVING, JOIN and LIKE. If any still has a grey number, nail it now. Then take the Final Exam. 🧊' },
        { type: 'widget', widget: 'sql-playground' },
        { type: 'callout', variant: 'tip', text: 'When you can read a schema, picture the joins, and write the query without looking things up — you’re interview-ready. Go ace it.' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m11-q1', type: 'single', prompt: 'The correct design order is roughly…', options: ['Index → query → model → normalize', 'Model (ER) → tables & keys → normalize → index → query', 'Query → normalize → model', 'Normalize → model → query'], correct: [1], explanation: 'Model the domain, derive tables/keys, normalize, then index and query.' },
    { id: 'dbms-m11-q2', type: 'single', prompt: 'A candidate key is…', options: ['Any unique attribute set', 'A minimal super key', 'Always a single column', 'The same as a foreign key'], correct: [1], explanation: 'A candidate key is a minimal super key (no removable attribute).' },
    { id: 'dbms-m11-q3', type: 'single', prompt: 'Adding an index typically makes…', options: ['Reads slower, writes faster', 'Reads faster, writes slower', 'Everything faster', 'No difference'], correct: [1], explanation: 'Indexes speed lookups but every write must maintain them.' },
    { id: 'dbms-m11-q4', type: 'single', prompt: 'A table is in BCNF when…', options: ['It has a primary key', 'For every FD X→Y, X is a superkey', 'It has no foreign keys', 'It is in 1NF only'], correct: [1], explanation: 'BCNF: every determinant (left side of an FD) is a superkey.' },
    { id: 'dbms-m11-q5', type: 'single', prompt: 'To filter aggregated groups you use…', options: ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'], correct: [1], explanation: 'HAVING filters groups after aggregation; WHERE filters rows before.' },
  ],
  resources: [
    { label: 'GeeksforGeeks — DBMS Interview Questions', url: 'https://www.geeksforgeeks.org/dbms-interview-questions/', kind: 'article', free: true },
    { label: 'Use The Index, Luke! — indexing deep dive', url: 'https://use-the-index-luke.com/', kind: 'docs', free: true },
  ],
};
