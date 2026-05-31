import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'dbms-m5',
  slug: 'relational-algebra',
  order: 5,
  title: 'Relational Algebra',
  subtitle: 'The math behind every SQL query',
  icon: 'workflow',
  lessons: [
    {
      id: 'dbms-m5-l1',
      title: 'The operators',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Relational algebra** is a *procedural* query language: each operator takes one or two relations and produces a new relation. SQL is essentially a friendly wrapper over these operators. Try each one:' },
        { type: 'widget', widget: 'relational-algebra' },
        { type: 'keyterms', title: 'Core (basic) operators', terms: [
          { term: 'σ Selection', def: 'Keep rows matching a condition (like SQL WHERE).' },
          { term: 'π Projection', def: 'Keep chosen columns, remove duplicates (like SQL SELECT cols).' },
          { term: '× Cross product', def: 'Every row of R paired with every row of S (m × n rows).' },
          { term: '∪ Union, − Difference', def: 'Set union / set difference of union-compatible relations.' },
          { term: 'ρ Rename', def: 'Rename a relation or its attributes.' },
        ] },
      ],
    },
    {
      id: 'dbms-m5-l2',
      title: 'Extended operators & joins',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: '∩ Intersection', def: 'Rows present in both relations (derivable from difference).' },
          { term: '⋈ Conditional / Equi join', def: 'Cross product followed by a selection; equi-join uses only equality conditions.' },
          { term: '⋈ Natural join', def: 'Joins on all common attributes and removes the duplicate column automatically.' },
          { term: 'Outer joins (⟕ ⟖ ⟗)', def: 'Left / right / full — keep unmatched rows from one or both sides, padding missing values with NULL.' },
          { term: '÷ Division', def: 'A ÷ B returns the rows of A associated with EVERY row of B (used for "find X related to all Y" queries).' },
        ] },
        { type: 'callout', variant: 'key', text: 'Map RA → SQL: **σ = WHERE**, **π = SELECT columns**, **× = FROM two tables**, **⋈ = JOIN**, **∪ = UNION**. If you understand the algebra, SQL queries stop feeling like magic.' },
        { type: 'callout', variant: 'tip', text: 'Row-count tricks interviewers ask: |R ∪ S| is between max(m,n) and m+n; |R ∩ S| is between 0 and min(m,n); |R × S| = m × n.' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m5-q1', type: 'single', prompt: 'Which relational-algebra operator corresponds to SQL’s WHERE clause?', options: ['Projection π', 'Selection σ', 'Union ∪', 'Rename ρ'], correct: [1], explanation: 'Selection (σ) filters rows by a condition — exactly what WHERE does.' },
    { id: 'dbms-m5-q2', type: 'single', prompt: 'Projection (π) operates on…', options: ['Rows', 'Columns (and removes duplicates)', 'Whole tables', 'Indexes'], correct: [1], explanation: 'π keeps selected columns and de-duplicates the result.' },
    { id: 'dbms-m5-q3', type: 'single', prompt: 'A natural join differs from an equi-join because it…', options: ['Keeps unmatched rows', 'Matches on common attributes and drops the duplicate column', 'Is a cross product', 'Cannot use equality'], correct: [1], explanation: 'Natural join auto-matches common attributes and removes the duplicated column.' },
    { id: 'dbms-m5-q4', type: 'single', prompt: 'A LEFT OUTER JOIN keeps…', options: ['Only matching rows', 'All rows of the left relation (NULLs for unmatched right)', 'All rows of the right relation', 'No rows'], correct: [1], explanation: 'Left outer join returns all left-side rows, padding right-side attributes with NULL when unmatched.' },
    { id: 'dbms-m5-q5', type: 'single', prompt: 'The maximum number of rows in R × S (|R|=m, |S|=n) is…', options: ['m + n', 'max(m, n)', 'm × n', 'min(m, n)'], correct: [2], explanation: 'A cross product pairs every row of R with every row of S → m × n.' },
  ],
  resources: [
    { label: 'GeeksforGeeks — Relational Algebra', url: 'https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/', kind: 'article', free: true },
  ],
};
