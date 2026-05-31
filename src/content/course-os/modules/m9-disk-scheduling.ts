import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'os-m9',
  slug: 'disk-scheduling',
  order: 9,
  title: 'Disk Scheduling',
  subtitle: 'Moving the disk head as little as possible',
  icon: 'database',
  lessons: [
    {
      id: 'os-m9-l1',
      title: 'Why it matters',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'On a spinning hard disk, the slowest step is **seek time** — physically moving the read/write head to the right track (cylinder). With many pending requests, the order you service them in hugely changes total head movement. The scheduler’s job: minimise that movement.' },
        { type: 'keyterms', terms: [
          { term: 'Seek time', def: 'Time to move the head to the target cylinder — the dominant cost.' },
          { term: 'Rotational latency', def: 'Time waiting for the platter to spin the right sector under the head.' },
          { term: 'Total head movement', def: 'Sum of cylinder distances travelled — the metric we minimise.' },
        ] },
        { type: 'callout', variant: 'info', text: 'On SSDs there’s no moving head, so seek-based scheduling barely matters — but it’s still a favourite interview topic and very visual.' },
      ],
    },
    {
      id: 'os-m9-l2',
      title: 'The algorithms — watch the head move',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Switch algorithms and watch the head’s path (and total movement) change for the same set of requests:' },
        { type: 'widget', widget: 'disk-scheduling' },
        { type: 'ul', items: [
          '**FCFS** — serve in arrival order. Fair, but the head can bounce wildly back and forth.',
          '**SSTF (Shortest Seek Time First)** — always serve the nearest request. Less movement, but far-away requests can **starve**.',
          '**SCAN (elevator)** — move in one direction servicing everything, reach the end, then reverse. Like a lift.',
          '**LOOK** — like SCAN, but reverse at the **last request** instead of the physical disk edge — usually the least movement.',
          '**C-SCAN** — a variant that jumps back to the start (instead of reversing) for more uniform wait times.',
        ] },
        { type: 'callout', variant: 'key', text: 'Recall order of "smartness": **FCFS** (fair, wasteful) → **SSTF** (greedy, can starve) → **SCAN/LOOK** (elevator, fair + efficient). LOOK typically wins on total movement.' },
      ],
    },
    {
      id: 'os-m9-l3',
      title: 'RAID — combining disks',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**RAID (Redundant Array of Independent Disks)** uses *multiple* disks together instead of one, for better **performance**, **data redundancy**, or both. Redundancy costs extra space but means a failed disk doesn’t lose your data.' },
        { type: 'keyterms', title: 'The levels you should know', terms: [
          { term: 'RAID 0 (Striping)', def: 'Data split across disks for speed. No redundancy — one disk fails, all data is lost.' },
          { term: 'RAID 1 (Mirroring)', def: 'Every disk is an exact copy. Great reliability, but you pay 2× the storage.' },
          { term: 'RAID 5 (Striping + distributed parity)', def: 'Block-level striping with parity spread across all disks. Survives **one** disk failure; good balance of speed, space, and safety.' },
          { term: 'RAID 6 (Two parity blocks)', def: 'Like RAID 5 but survives **two** simultaneous disk failures.' },
          { term: 'RAID 10 (1+0)', def: 'Mirror first, then stripe the mirrors — high performance *and* redundancy (at the cost of storage).' },
        ] },
        { type: 'callout', variant: 'info', title: 'Parity & other levels', text: '**Parity** is extra error-correcting data that lets a missing block be reconstructed. RAID **2/3/4** are earlier designs (bit-, byte-, and block-level striping with a *dedicated* parity disk); RAID 5 improved on them by **distributing** parity so no single parity disk becomes a bottleneck.' },
        { type: 'callout', variant: 'key', text: 'Quick recall: **0 = speed, no safety**; **1 = mirror (safety, 2× cost)**; **5 = striping + parity (survives 1 failure)**; **6 = survives 2**; **10 = mirror + stripe (best of both)**.' },
      ],
    },
  ],
  quiz: [
    { id: 'os-m9-q1', type: 'single', prompt: 'The dominant cost disk scheduling tries to reduce is…', options: ['CPU time', 'Seek time (head movement)', 'Page faults', 'Context switches'], correct: [1], explanation: 'Moving the head between cylinders (seek time) dominates on spinning disks.' },
    { id: 'os-m9-q2', type: 'single', prompt: 'Which algorithm always serves the closest request and can starve far ones?', options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'], correct: [1], explanation: 'SSTF is greedy on distance, so requests far from the busy region can wait indefinitely.' },
    { id: 'os-m9-q3', type: 'single', prompt: 'SCAN behaves like…', options: ['A random walk', 'An elevator (sweep to the end, then reverse)', 'FCFS', 'A stack'], correct: [1], explanation: 'SCAN sweeps in one direction to the end, then reverses — the "elevator" algorithm.' },
    { id: 'os-m9-q4', type: 'single', prompt: 'How does LOOK differ from SCAN?', options: ['It’s random', 'It reverses at the last request, not the disk edge', 'It never reverses', 'It ignores direction'], correct: [1], explanation: 'LOOK turns around at the furthest pending request instead of travelling all the way to the disk’s end.' },
    { id: 'os-m9-q5', type: 'single', prompt: 'Which RAID level gives striping with NO redundancy (fast, but a single failure loses everything)?', options: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6'], correct: [0], explanation: 'RAID 0 stripes for speed with no parity/mirror — zero fault tolerance.' },
    { id: 'os-m9-q6', type: 'single', prompt: 'RAID 5 can tolerate the failure of how many disks?', options: ['Zero', 'Exactly one', 'Two', 'All but one'], correct: [1], explanation: 'RAID 5 uses distributed parity to survive a single disk failure (RAID 6 survives two).' },
  ],
  resources: [
    { label: 'TutorialsPoint — Disk Scheduling Algorithms', url: 'https://www.tutorialspoint.com/operating_system/os_disk_scheduling_algorithms.htm', kind: 'article', free: true },
  ],
};
