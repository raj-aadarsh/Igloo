import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'os-m5',
  slug: 'deadlocks',
  order: 5,
  title: 'Deadlocks',
  subtitle: 'When everyone waits forever',
  icon: 'network',
  lessons: [
    {
      id: 'os-m5-l1',
      title: 'The four conditions & the RAG',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A **deadlock** is when a set of processes are all stuck, each waiting for a resource another is holding — so none can proceed. Toggle the **Resource Allocation Graph** to see a deadlock cycle form and break:' },
        { type: 'widget', widget: 'deadlock-rag' },
        { type: 'p', text: 'Deadlock needs **all four** Coffman conditions to hold at once:' },
        { type: 'keyterms', terms: [
          { term: 'Mutual exclusion', def: 'A resource is held by only one process at a time.' },
          { term: 'Hold and wait', def: 'A process holds resources while waiting for more.' },
          { term: 'No preemption', def: 'Resources can’t be forcibly taken away.' },
          { term: 'Circular wait', def: 'A cycle of processes each waiting for the next’s resource.' },
        ] },
        { type: 'callout', variant: 'key', text: 'A **cycle** in the Resource Allocation Graph means deadlock when there’s one instance per resource. Break **any** of the four conditions and deadlock can’t happen.' },
      ],
    },
    {
      id: 'os-m5-l2',
      title: 'Handling deadlocks',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'There are four strategies — prevent, avoid, detect-and-recover, or ignore.' },
        { type: 'keyterms', terms: [
          { term: 'Prevention', def: 'Design the system so one of the four conditions can never hold (e.g. request all resources up front → no hold-and-wait; order resources → no circular wait).' },
          { term: 'Avoidance (Banker’s algorithm)', def: 'Only grant a request if the system stays in a "safe state" (a sequence exists where everyone can finish). Needs to know max resource needs in advance.' },
          { term: 'Detection & recovery', def: 'Let deadlocks happen, detect cycles periodically, then recover (kill a process or preempt a resource).' },
          { term: 'Ignorance (Ostrich algorithm)', def: 'Pretend it won’t happen — what most general-purpose OSes (Linux, Windows) actually do, because deadlocks are rare and prevention is costly.' },
        ] },
        { type: 'callout', variant: 'tip', title: 'Banker’s algorithm in one line', text: 'Before granting resources, simulate: "if I give this, can every process still finish in some order?" If yes (safe state), grant it; if not, make the process wait.' },
        { type: 'callout', variant: 'info', title: 'Deadlock vs Livelock vs Starvation', text: '**Deadlock**: stuck, nothing moves. **Livelock**: processes keep changing state in response to each other but make no progress (two people stepping aside in a hallway forever). **Starvation**: a process waits indefinitely while others are served.' },
      ],
    },
  ],
  quiz: [
    { id: 'os-m5-q1', type: 'single', prompt: 'How many Coffman conditions must hold for a deadlock?', options: ['Any one', 'Exactly two', 'All four', 'At least three'], correct: [2], explanation: 'All four (mutual exclusion, hold-and-wait, no preemption, circular wait) must hold simultaneously.' },
    { id: 'os-m5-q2', type: 'single', prompt: 'The Banker’s algorithm is a method of deadlock…', options: ['Prevention', 'Avoidance', 'Detection', 'Recovery'], correct: [1], explanation: 'Banker’s grants requests only if the system remains in a safe state — that’s avoidance.' },
    { id: 'os-m5-q3', type: 'single', prompt: 'Most general-purpose OSes handle deadlock by…', options: ['Banker’s algorithm', 'Ignoring it (ostrich approach)', 'Preventing mutual exclusion', 'Disabling interrupts'], correct: [1], explanation: 'Deadlocks are rare; Linux/Windows largely ignore them rather than pay constant prevention costs.' },
    { id: 'os-m5-q4', type: 'single', prompt: 'Two processes keep reacting to each other but make no progress. This is…', options: ['Deadlock', 'Livelock', 'Starvation', 'Thrashing'], correct: [1], explanation: 'Livelock: states keep changing but no useful progress is made.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Introduction to Deadlock', url: 'https://www.tutorialspoint.com/operating_system/os_deadlock_introduction.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Deadlock Avoidance (Banker’s)', url: 'https://www.tutorialspoint.com/operating_system/os_deadlock_avoidance.htm', kind: 'article', free: true },
  ],
};
