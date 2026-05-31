import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'dbms-m1',
  slug: 'foundations',
  order: 1,
  title: 'Databases & the Relational Model',
  subtitle: 'Why a DBMS — and what a table really is',
  icon: 'database',
  lessons: [
    {
      id: 'dbms-m1-l1',
      title: 'What is a DBMS (and why not just files)?',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A **database** is an organised collection of related data. A **DBMS** (Database Management System) is the software that stores, secures, and retrieves that data for many users and applications at once.' },
        { type: 'p', text: 'Before DBMSs, apps stored data in plain files — which caused real pain. A DBMS exists to solve these **file-system problems**:' },
        { type: 'keyterms', title: 'Problems a DBMS fixes', terms: [
          { term: 'Redundancy & inconsistency', def: 'The same data copied in many files drifts out of sync.' },
          { term: 'Hard data access & isolation', def: 'Data scattered across files/formats is awkward to query.' },
          { term: 'Integrity problems', def: 'No central way to enforce rules (e.g. "age > 0").' },
          { term: 'Atomicity of updates', def: 'A crash mid-update can leave half-finished, corrupt data.' },
          { term: 'Concurrency & security', def: 'Many users editing at once, with controlled access, is hard with raw files.' },
        ] },
        { type: 'callout', variant: 'key', text: 'In one line: a DBMS gives you **structured storage + integrity + concurrent multi-user access + security + recovery** — all the things raw files don’t.' },
      ],
    },
    {
      id: 'dbms-m1-l2',
      title: 'The relational model',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'The dominant model is **relational**: data lives in **relations** (tables) of **tuples** (rows) and **attributes** (columns). Tap each part:' },
        { type: 'widget', widget: 'relational-anatomy' },
        { type: 'keyterms', terms: [
          { term: 'Relation / Tuple / Attribute', def: 'Table / row / column.' },
          { term: 'Degree', def: 'Number of attributes (columns).' },
          { term: 'Cardinality', def: 'Number of tuples (rows).' },
          { term: 'Domain', def: 'The set of allowed values for an attribute.' },
          { term: 'Schema vs Instance', def: 'Schema = the design (structure, types) — changes rarely. Instance = the actual data at a moment — changes constantly.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Relational databases (MySQL, PostgreSQL, Oracle) use tables + SQL. "NoSQL" databases (MongoDB, Redis) trade the strict schema for flexibility/scale — but relational is the interview default.' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m1-q1', type: 'multi', prompt: 'Which problems does a DBMS solve vs plain files?', options: ['Data redundancy/inconsistency', 'Concurrent multi-user access', 'Making the CPU faster', 'Integrity & security'], correct: [0, 1, 3], explanation: 'A DBMS tackles redundancy, concurrency, integrity, and security; it doesn’t speed up the CPU.' },
    { id: 'dbms-m1-q2', type: 'single', prompt: 'In the relational model, a "tuple" is a…', options: ['Column', 'Row (record)', 'Table', 'Constraint'], correct: [1], explanation: 'A tuple is a row; an attribute is a column; a relation is the whole table.' },
    { id: 'dbms-m1-q3', type: 'single', prompt: 'A table’s "degree" is…', options: ['Number of rows', 'Number of columns (attributes)', 'Number of keys', 'Number of foreign keys'], correct: [1], explanation: 'Degree = number of attributes; cardinality = number of tuples.' },
    { id: 'dbms-m1-q4', type: 'single', prompt: 'The schema vs instance distinction is…', options: ['Both change constantly', 'Schema = design (rarely changes); instance = current data (changes often)', 'They’re the same', 'Instance = the design'], correct: [1], explanation: 'Schema is the structure; the instance is the data populating it right now.' },
  ],
  resources: [
    { label: 'GeeksforGeeks — Introduction to DBMS', url: 'https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/', kind: 'article', free: true },
  ],
};
