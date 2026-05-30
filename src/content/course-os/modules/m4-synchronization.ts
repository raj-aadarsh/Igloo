import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'os-m4',
  slug: 'synchronization',
  order: 4,
  title: 'Process Synchronization',
  subtitle: 'Sharing data without chaos',
  icon: 'workflow',
  lessons: [
    {
      id: 'os-m4-l1',
      title: 'Race conditions & the critical section',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'When two threads touch the same shared data at the same time, the result depends on the exact timing — a **race condition**. The classic example: two threads both do `count = count + 1`, but their reads and writes interleave, so one update is lost.' },
        { type: 'p', text: 'The piece of code that accesses shared data is the **critical section**. We must ensure only **one** thread is inside it at a time — **mutual exclusion**.' },
        { type: 'keyterms', title: 'A correct solution needs 3 properties', terms: [
          { term: 'Mutual exclusion', def: 'At most one process in the critical section at a time.' },
          { term: 'Progress', def: 'If no one is inside, a waiting process must be able to get in (no needless blocking).' },
          { term: 'Bounded waiting', def: 'A process can’t be made to wait forever (no starvation).' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Race conditions are nasty because they’re **intermittent** — the bug appears only on unlucky timing, so it can pass tests and fail in production.' },
      ],
    },
    {
      id: 'os-m4-l2',
      title: 'The tools: locks, semaphores, monitors',
      minutes: 7,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Mutex / Lock', def: 'A binary “key” — acquire before the critical section, release after. Only the holder may enter.' },
          { term: 'Semaphore', def: 'An integer with atomic wait (P, decrement) and signal (V, increment). Binary semaphore ≈ mutex; counting semaphore tracks N available resources.' },
          { term: 'Monitor', def: 'A higher-level construct (in languages like Java) that bundles shared data with automatically-locked methods + condition variables.' },
        ] },
        { type: 'p', text: 'Famous low-level **software** solutions you may be asked to name: **Peterson’s algorithm** (two-process mutual exclusion using `flag[]` + `turn`), and the hardware primitive **Test-and-Set** (an atomic read-modify-write instruction the CPU provides).' },
        { type: 'callout', variant: 'key', text: 'Mental model: a **mutex** is one key (ownership); a **counting semaphore** is a box of N permits. Use a semaphore when you have N identical resources or need signalling between threads.' },
        { type: 'callout', variant: 'warning', title: 'Busy-waiting vs blocking', text: 'A **spinlock** loops ("busy-waits") until the lock is free — fine if the wait is microscopic, wasteful otherwise. Blocking locks put the thread to sleep and wake it later.' },
      ],
    },
    {
      id: 'os-m4-l3',
      title: 'Classic problems',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Interviews love three classic synchronization puzzles. The first one — **Producer–Consumer** — is right here to play with: produce until the buffer is full, consume until it’s empty.' },
        { type: 'widget', widget: 'producer-consumer' },
        { type: 'ul', items: [
          '**Producer–Consumer (bounded buffer)** — a producer fills a shared buffer, a consumer empties it. Two counting semaphores (`empty`, `full`) + a `mutex` coordinate it.',
          '**Dining Philosophers** — 5 philosophers, 5 forks; each needs both neighbouring forks to eat. Naively grabbing the left fork first can **deadlock**. Fixes: limit diners, or pick up forks in a global order.',
          '**Readers–Writers** — many readers can read at once, but a writer needs exclusive access. The challenge is avoiding starvation of writers (or readers).',
        ] },
        { type: 'callout', variant: 'tip', text: 'The dining philosophers problem is really a **deadlock** demo in disguise — which is exactly where we go next.' },
      ],
    },
  ],
  quiz: [
    { id: 'os-m4-q1', type: 'single', prompt: 'A bug that appears only when two threads interleave in an unlucky order is called…', options: ['A deadlock', 'A race condition', 'Thrashing', 'A page fault'], correct: [1], explanation: 'Timing-dependent corruption of shared data is a race condition.' },
    { id: 'os-m4-q2', type: 'single', prompt: 'Which guarantees only one process is in the critical section at a time?', options: ['Progress', 'Bounded waiting', 'Mutual exclusion', 'Aging'], correct: [2], explanation: 'Mutual exclusion is the "one at a time" property.' },
    { id: 'os-m4-q3', type: 'single', prompt: 'How does a counting semaphore differ from a mutex?', options: ['It’s slower', 'It can allow up to N concurrent holders (N permits)', 'It never blocks', 'It’s only for disks'], correct: [1], explanation: 'A counting semaphore tracks N available units; a mutex is binary (one holder).' },
    { id: 'os-m4-q4', type: 'single', prompt: 'In producer–consumer, what happens when the buffer is full?', options: ['The consumer blocks', 'The producer blocks (waits on the empty semaphore)', 'Data is overwritten', 'A page fault occurs'], correct: [1], explanation: 'A full buffer blocks the producer until the consumer frees a slot.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Process Synchronization', url: 'https://www.tutorialspoint.com/operating_system/os_process_synchronization.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Semaphores', url: 'https://www.tutorialspoint.com/operating_system/os_semaphores.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Dining Philosophers Problem', url: 'https://www.tutorialspoint.com/operating_system/os_dining_philosophers_problem.htm', kind: 'article', free: true },
  ],
};
