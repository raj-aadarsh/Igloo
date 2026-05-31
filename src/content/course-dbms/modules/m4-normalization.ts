import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'dbms-m4',
  slug: 'normalization',
  order: 4,
  title: 'Functional Dependencies & Normalization',
  subtitle: 'Killing redundancy the principled way',
  icon: 'layers',
  lessons: [
    {
      id: 'dbms-m4-l1',
      title: 'Functional dependencies',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **functional dependency** `X → Y` means: any two rows with the same `X` must have the same `Y`. ("X determines Y.") Example: `roll_no → name` — the roll number fixes the name.' },
        { type: 'keyterms', terms: [
          { term: 'Trivial FD', def: 'X → Y where Y ⊆ X (the right side is part of the left). Always holds, e.g. {name, age} → name.' },
          { term: 'Non-trivial FD', def: 'X → Y where Y is not a subset of X — the interesting kind that drives design.' },
          { term: 'Closure (X⁺)', def: 'The set of ALL attributes you can functionally determine from X. If X⁺ = all attributes, X is a super key.' },
          { term: 'Prime vs non-prime attribute', def: 'Prime = part of some candidate key; non-prime = not part of any candidate key.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Closure is the workhorse: compute X⁺ to test whether X is a (super/candidate) key and to check which FDs hold.' },
      ],
    },
    {
      id: 'dbms-m4-l2',
      title: 'Decomposition',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Normalization works by **decomposing** a big table into smaller ones. A good decomposition keeps two guarantees:' },
        { type: 'keyterms', terms: [
          { term: 'Lossless join', def: 'Joining the pieces back gives exactly the original table — no spurious extra rows, no lost data. (R1 ⋈ R2 = R.) This is mandatory.' },
          { term: 'Dependency preservation', def: 'Every original functional dependency can still be enforced on the smaller tables without re-joining. (Desirable.)' },
          { term: 'Lossy decomposition', def: 'A bad split where the join produces *extra* (wrong) rows — information is effectively lost. Avoid!' },
        ] },
        { type: 'callout', variant: 'key', text: 'Rule: a decomposition is lossless if the common attribute(s) of the two pieces form a key of at least one of them.' },
      ],
    },
    {
      id: 'dbms-m4-l3',
      title: 'Normal forms — watch it happen',
      minutes: 7,
      blocks: [
        { type: 'p', text: '**Normalization** removes redundancy by enforcing progressively stricter **normal forms**. Step a messy table from unnormalized → 1NF → 2NF → 3NF and see exactly what each form fixes:' },
        { type: 'widget', widget: 'normalization-steps' },
        { type: 'keyterms', terms: [
          { term: '1NF', def: 'Every cell is atomic — no multi-valued or repeating fields.' },
          { term: '2NF', def: '1NF + no **partial dependency** (no non-prime attribute depends on only part of a composite key).' },
          { term: '3NF', def: '2NF + no **transitive dependency** (a non-prime attribute mustn’t depend on another non-prime attribute).' },
          { term: 'BCNF', def: 'A stricter 3NF: for every non-trivial FD A → B, A must be a super key.' },
        ] },
        { type: 'callout', variant: 'tip', title: 'Memory hook', text: '"The key, the whole key, and nothing but the key." 1NF = atomic values; **2NF = the *whole* key** (no partial deps); **3NF = nothing but the key** (no transitive deps). BCNF tightens it further.' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m4-q1', type: 'single', prompt: 'The FD {name, age} → name is…', options: ['Non-trivial', 'Trivial (RHS ⊆ LHS)', 'A partial dependency', 'Invalid'], correct: [1], explanation: 'The right side is a subset of the left → trivial FD.' },
    { id: 'dbms-m4-q2', type: 'single', prompt: '1NF requires that…', options: ['No transitive dependencies', 'Every cell holds a single atomic value', 'Every determinant is a super key', 'No partial dependencies'], correct: [1], explanation: '1NF = atomic cells (no multi-valued/repeating fields).' },
    { id: 'dbms-m4-q3', type: 'single', prompt: '2NF specifically removes…', options: ['Multi-valued attributes', 'Partial dependencies (on part of a composite key)', 'Transitive dependencies', 'Foreign keys'], correct: [1], explanation: '2NF = 1NF + no partial dependency of a non-prime attribute on part of a key.' },
    { id: 'dbms-m4-q4', type: 'single', prompt: 'A lossless-join decomposition guarantees that…', options: ['Joining the pieces re-creates exactly the original table', 'No FDs are preserved', 'Extra rows appear on join', 'Data is compressed'], correct: [0], explanation: 'Lossless join = the natural join of the sub-relations equals the original (no spurious rows).' },
    { id: 'dbms-m4-q5', type: 'single', prompt: 'BCNF demands that for every non-trivial FD A → B…', options: ['B is a key', 'A is a super key', 'A is non-prime', 'B is atomic'], correct: [1], explanation: 'In BCNF the determinant A of every non-trivial FD must be a super key.' },
  ],
  resources: [
    { label: 'GeeksforGeeks — Normalization & Normal Forms', url: 'https://www.geeksforgeeks.org/introduction-of-database-normalization/', kind: 'article', free: true },
    { label: 'GeeksforGeeks — Functional Dependency', url: 'https://www.geeksforgeeks.org/functional-dependency-and-attribute-closure/', kind: 'article', free: true },
  ],
};
