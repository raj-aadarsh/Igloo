import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'dbms-m2',
  slug: 'er-model',
  order: 2,
  title: 'The ER Model',
  subtitle: 'Designing a schema with entities & relationships',
  icon: 'network',
  lessons: [
    {
      id: 'dbms-m2-l1',
      title: 'Entities & attributes',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'An **ER (Entity-Relationship) diagram** is a conceptual, graphical blueprint of your data — drawn *before* you create tables. It has three pieces: **entity sets, attributes, and relationships**.' },
        { type: 'keyterms', title: 'Entity sets', terms: [
          { term: 'Entity set', def: 'A collection of similar things (e.g. all Students). Drawn as a rectangle.' },
          { term: 'Strong entity set', def: 'Has enough attributes to identify itself — i.e. it has a primary key (underlined).' },
          { term: 'Weak entity set', def: 'Can’t be identified on its own; relies on a strong entity. It has only a partial key (a discriminator, dashed underline).' },
        ] },
        { type: 'keyterms', title: 'Attribute types', terms: [
          { term: 'Simple', def: 'Can’t be split further (e.g. Age).' },
          { term: 'Composite', def: 'Made of sub-parts (e.g. Name → first, last; Address).' },
          { term: 'Multivalued', def: 'Can hold several values (e.g. PhoneNumbers) — drawn as a double oval.' },
          { term: 'Derived', def: 'Computed from others (e.g. Age from DOB) — dashed oval.' },
          { term: 'Key', def: 'Uniquely identifies an entity (e.g. Roll_No) — underlined.' },
        ] },
      ],
    },
    {
      id: 'dbms-m2-l2',
      title: 'Relationships & cardinality',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **relationship** associates entities. Its **degree** = how many entity sets take part: **unary** (1), **binary** (2, most common), **ternary** (3), **n-ary**.' },
        { type: 'p', text: 'The **cardinality** says *how many* of each can relate. Switch between the three you’ll be asked about — and see how each maps to actual tables:' },
        { type: 'widget', widget: 'er-cardinality' },
        { type: 'callout', variant: 'key', text: 'The mapping rule to memorise: **1:N → foreign key on the "many" side**. **M:N → a separate junction table** holding both foreign keys. 1:1 → foreign key (often with a UNIQUE) on either side.' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m2-q1', type: 'single', prompt: 'A weak entity set is one that…', options: ['Has too many attributes', 'Cannot be uniquely identified by its own attributes (no primary key)', 'Has no attributes', 'Is always 1:1'], correct: [1], explanation: 'A weak entity lacks a primary key of its own; it has a partial key (discriminator) and depends on a strong entity.' },
    { id: 'dbms-m2-q2', type: 'single', prompt: 'Age computed from Date of Birth is which kind of attribute?', options: ['Composite', 'Multivalued', 'Derived', 'Key'], correct: [2], explanation: 'Derived attributes are computed from other attributes.' },
    { id: 'dbms-m2-q3', type: 'single', prompt: 'A many-to-many (M:N) relationship is implemented with…', options: ['A foreign key on the many side', 'A separate junction table holding both foreign keys', 'A unique constraint', 'No extra structure'], correct: [1], explanation: 'M:N needs a junction/bridge table with the two foreign keys (e.g. Enrollment).' },
    { id: 'dbms-m2-q4', type: 'single', prompt: 'A relationship involving exactly two entity sets has degree…', options: ['Unary', 'Binary', 'Ternary', 'N-ary'], correct: [1], explanation: 'Two participating entity sets = a binary relationship (the most common).' },
  ],
  resources: [
    { label: 'GeeksforGeeks — ER Model', url: 'https://www.geeksforgeeks.org/introduction-of-er-model/', kind: 'article', free: true },
  ],
};
