import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'dbms-m6',
  slug: 'transactions-concurrency',
  order: 6,
  title: 'Transactions & Concurrency',
  subtitle: 'ACID, schedules & serializability',
  icon: 'repeat',
  lessons: [
    {
      id: 'dbms-m6-l1',
      title: 'What is a transaction?',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A **transaction** is a single logical unit of work — a sequence of read/write operations that must execute as an all-or-nothing whole. The classic example: transferring ₹100 from account A to B is *two* writes (debit A, credit B) that must both happen or neither.' },
        { type: 'analogy', text: 'Think of a transaction like sending a package: either it’s fully delivered or it comes back to you. There’s no "half-delivered" — that would be money vanishing into thin air.' },
        { type: 'p', text: 'Every transaction moves through a lifecycle of states. Click each state to see what it means:' },
        { type: 'widget', widget: 'transaction-states' },
        { type: 'keyterms', terms: [
          { term: 'COMMIT', def: 'Make all of the transaction’s changes permanent and visible to others.' },
          { term: 'ROLLBACK / ABORT', def: 'Undo all changes — return the database to the state before the transaction started.' },
          { term: 'Active', def: 'The transaction is executing its operations.' },
          { term: 'Committed vs Aborted', def: 'Two terminal outcomes: success made durable, or everything undone.' },
        ] },
      ],
    },
    {
      id: 'dbms-m6-l2',
      title: 'The ACID properties',
      minutes: 5,
      blocks: [
        { type: 'callout', variant: 'key', text: 'ACID is the contract a DBMS makes about transactions. It is the single most-asked DBMS interview topic — know each letter cold.' },
        { type: 'keyterms', title: 'A-C-I-D', terms: [
          { term: 'Atomicity', def: 'All-or-nothing. If any step fails, the whole transaction is rolled back. Enforced by the recovery manager (logs/undo).' },
          { term: 'Consistency', def: 'A transaction takes the DB from one valid state to another, preserving all constraints (keys, checks, balances).' },
          { term: 'Isolation', def: 'Concurrent transactions don’t step on each other; the result is as if they ran one-at-a-time. Enforced by the concurrency-control manager (locks/timestamps).' },
          { term: 'Durability', def: 'Once committed, changes survive crashes/power loss. Enforced by writing to non-volatile storage + logs.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Mnemonic for which subsystem enforces what: Atomicity & Durability → recovery/logging; Isolation → concurrency control; Consistency → all of them together (plus your constraints).' },
      ],
    },
    {
      id: 'dbms-m6-l3',
      title: 'Concurrency problems',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'When transactions interleave without isolation, things break. Interviewers love these three (four) anomalies:' },
        { type: 'keyterms', terms: [
          { term: 'Dirty read', def: 'T2 reads data written by T1 before T1 commits — and T1 then aborts. T2 read a value that never officially existed.' },
          { term: 'Lost update', def: 'Two transactions read the same value and both write back; one update silently overwrites the other.' },
          { term: 'Unrepeatable read', def: 'T1 reads a row twice and gets different values because T2 modified it in between.' },
          { term: 'Phantom read', def: 'T1 re-runs a range query and sees new rows that T2 inserted/deleted in between.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'These map directly to SQL isolation levels: READ UNCOMMITTED allows dirty reads; READ COMMITTED prevents them; REPEATABLE READ prevents unrepeatable reads; SERIALIZABLE prevents phantoms too.' },
      ],
    },
    {
      id: 'dbms-m6-l4',
      title: 'Schedules & serializability',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **schedule** is the order in which operations of concurrent transactions execute. A **serial** schedule runs transactions one fully after another (safe but slow). The goal of concurrency control: allow *interleaving* for speed while keeping the result equivalent to *some* serial order — this is **serializability**.' },
        { type: 'keyterms', title: 'Types of equivalence', terms: [
          { term: 'Conflict serializable', def: 'Can be turned into a serial schedule by swapping non-conflicting operations. Tested with a precedence graph — serializable ⇔ the graph has no cycle.' },
          { term: 'View serializable', def: 'A weaker, broader notion based on reads-from and final-write equivalence. Every conflict-serializable schedule is view-serializable, but not vice-versa.' },
          { term: 'Conflicting operations', def: 'Two ops conflict if they belong to different transactions, act on the same data item, and at least one is a WRITE.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Precedence (serializability) graph: a node per transaction, an edge Ti → Tj when an op of Ti conflicts with and precedes an op of Tj. No cycle ⇒ conflict-serializable.' },
        { type: 'keyterms', title: 'Recoverability of schedules', terms: [
          { term: 'Recoverable', def: 'A transaction commits only after every transaction it read from has committed. Prevents committing on dirty data.' },
          { term: 'Cascadeless (ACA)', def: 'Transactions read only committed data, so aborts never cascade to others.' },
          { term: 'Strict', def: 'No transaction may read OR write an item until the last writer commits/aborts. Strongest — makes recovery simple (just restore before-images).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Hierarchy to remember: Strict ⊆ Cascadeless ⊆ Recoverable. Strict schedules are the easiest to recover from.' },
      ],
    },
    {
      id: 'dbms-m6-l5',
      title: 'Locking & deadlocks',
      minutes: 4,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Shared (S) lock', def: 'Read lock — many transactions can hold it on the same item simultaneously.' },
          { term: 'Exclusive (X) lock', def: 'Write lock — only one transaction can hold it; blocks all other locks.' },
          { term: 'Two-Phase Locking (2PL)', def: 'Each transaction has a growing phase (only acquires locks) then a shrinking phase (only releases). Guarantees conflict-serializability.' },
          { term: 'Strict 2PL', def: 'Holds all exclusive locks until commit/abort — guarantees strict, cascadeless schedules. The most common real-world protocol.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Locking can cause **deadlock** (T1 waits on T2, T2 waits on T1). DBMS handle it with deadlock detection (wait-for graph + abort a victim) or prevention schemes (wait-die, wound-wait).' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m6-q1', type: 'single', prompt: 'Which ACID property guarantees committed changes survive a crash?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correct: [3], explanation: 'Durability ensures committed data is persisted to non-volatile storage and survives failures.' },
    { id: 'dbms-m6-q2', type: 'single', prompt: '"All-or-nothing" execution of a transaction is which property?', options: ['Atomicity', 'Isolation', 'Durability', 'Consistency'], correct: [0], explanation: 'Atomicity = the transaction either fully completes or is fully rolled back.' },
    { id: 'dbms-m6-q3', type: 'single', prompt: 'A schedule is conflict-serializable if and only if its precedence graph…', options: ['Has a cycle', 'Has no cycle', 'Is fully connected', 'Has exactly one node'], correct: [1], explanation: 'No cycle in the precedence graph ⇔ the schedule is conflict-serializable.' },
    { id: 'dbms-m6-q4', type: 'single', prompt: 'Reading a value written by another transaction that later aborts is a…', options: ['Phantom read', 'Lost update', 'Dirty read', 'Unrepeatable read'], correct: [2], explanation: 'A dirty read reads uncommitted data that may be rolled back.' },
    { id: 'dbms-m6-q5', type: 'single', prompt: 'Strict 2PL holds exclusive locks until…', options: ['The growing phase ends', 'The first read', 'Commit or abort', 'A deadlock occurs'], correct: [2], explanation: 'Strict 2PL keeps X-locks until the transaction commits/aborts, guaranteeing strict schedules.' },
    { id: 'dbms-m6-q6', type: 'single', prompt: 'Which schedule type guarantees an abort never cascades to other transactions?', options: ['Recoverable', 'Cascadeless', 'Serial only', 'Non-recoverable'], correct: [1], explanation: 'Cascadeless schedules let transactions read only committed data, so aborts don’t cascade.' },
    { id: 'dbms-m6-q7', type: 'multi', prompt: 'Which SQL isolation level prevents phantom reads? (select all that apply)', options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], correct: [3], explanation: 'Only SERIALIZABLE prevents phantom reads; REPEATABLE READ stops unrepeatable reads but not phantoms (in the standard).' },
  ],
  resources: [
    { label: 'GeeksforGeeks — ACID Properties', url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/', kind: 'article', free: true },
    { label: 'GeeksforGeeks — Conflict Serializability', url: 'https://www.geeksforgeeks.org/conflict-serializability-in-dbms/', kind: 'article', free: true },
  ],
};
