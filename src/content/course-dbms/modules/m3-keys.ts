import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'dbms-m3',
  slug: 'keys-constraints',
  order: 3,
  title: 'Keys & Constraints',
  subtitle: 'How rows stay unique & data stays valid',
  icon: 'shield',
  lessons: [
    {
      id: 'dbms-m3-l1',
      title: 'Keys',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **key** is a set of attributes that uniquely identifies each row. There’s a whole family of them — and interviewers love the distinctions.' },
        { type: 'keyterms', terms: [
          { term: 'Super key', def: 'ANY set of attributes that uniquely identifies a tuple (may have extras).' },
          { term: 'Candidate key', def: 'A *minimal* super key — remove any attribute and it stops being unique.' },
          { term: 'Primary key', def: 'The candidate key the designer picks. Must be UNIQUE and NOT NULL.' },
          { term: 'Alternate key', def: 'The candidate keys not chosen as primary.' },
          { term: 'Composite key', def: 'A key made of two or more attributes together.' },
          { term: 'Foreign key', def: 'An attribute that references the primary key of another table — the basis of relationships.' },
          { term: 'Unique key', def: 'Enforces uniqueness like a primary key, but MAY be NULL and isn’t the table’s main identifier.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Hierarchy to remember: every **candidate key** is a minimal **super key**; the **primary key** is one chosen candidate key; the rest become **alternate keys**. A **foreign key** points at another table’s primary key.' },
      ],
    },
    {
      id: 'dbms-m3-l2',
      title: 'Constraints',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**Constraints** are rules the DBMS enforces so the data stays correct, no matter what an application tries to insert.' },
        { type: 'keyterms', terms: [
          { term: 'Domain constraint', def: 'Each value must come from the attribute’s allowed domain (type/range), and be atomic.' },
          { term: 'Tuple uniqueness', def: 'All tuples (rows) in a relation must be distinct.' },
          { term: 'Key constraint', def: 'Primary key values must be unique and not null.' },
          { term: 'Entity integrity', def: 'No part of a primary key may be NULL.' },
          { term: 'Referential integrity', def: 'A foreign key must match an existing primary key value in the referenced table — or be NULL. (No "dangling" references.)' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Referential integrity is why you can’t delete a row that others point to without handling the foreign keys (e.g. `ON DELETE CASCADE` or `SET NULL`). It prevents orphaned records.' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m3-q1', type: 'single', prompt: 'A candidate key is best described as…', options: ['Any unique set of attributes', 'A minimal super key', 'The chosen primary key', 'A foreign key'], correct: [1], explanation: 'A candidate key is a minimal super key — no attribute can be removed while keeping uniqueness.' },
    { id: 'dbms-m3-q2', type: 'single', prompt: 'A primary key must be…', options: ['Unique but can be NULL', 'Unique and NOT NULL', 'NULL and unique', 'Composite only'], correct: [1], explanation: 'Primary keys are unique and NOT NULL (entity integrity).' },
    { id: 'dbms-m3-q3', type: 'single', prompt: 'Referential integrity requires that a foreign key value…', options: ['Is always NULL', 'Matches an existing primary key in the referenced table (or is NULL)', 'Is unique', 'Is the primary key'], correct: [1], explanation: 'A foreign key must reference an existing PK value (or be NULL) — no dangling references.' },
    { id: 'dbms-m3-q4', type: 'single', prompt: 'How does a UNIQUE key differ from a PRIMARY key?', options: ['It can’t be indexed', 'It may allow a NULL and isn’t the table’s main identifier', 'It must be composite', 'There is no difference'], correct: [1], explanation: 'UNIQUE enforces uniqueness but may permit a NULL and isn’t the chosen primary identifier.' },
  ],
  resources: [
    { label: 'GeeksforGeeks — Keys in DBMS', url: 'https://www.geeksforgeeks.org/types-of-keys-in-relational-model-candidate-super-primary-alternate-and-foreign/', kind: 'article', free: true },
  ],
};
