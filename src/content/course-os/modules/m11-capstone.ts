import type { Module } from '@/content/types';

export const m11: Module = {
  id: 'os-m11',
  slug: 'capstone',
  order: 11,
  title: 'Capstone & What’s Next',
  subtitle: 'The whole OS, on one page',
  icon: 'cap',
  lessons: [
    {
      id: 'os-m11-l1',
      title: 'The big picture',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'You made it through the operating system. If you can explain this list out loud, you’re ready for the interview:' },
        { type: 'ol', items: [
          'The OS is a **resource manager** + **abstraction layer**; apps reach it via **system calls** (user mode → kernel mode).',
          'A **process** is a running program (tracked by a **PCB**); **threads** share its memory. They move through **states** and cost a **context switch** to swap.',
          '**CPU scheduling** (FCFS, SJF, Round Robin, Priority) trades off **waiting time, turnaround, response, and fairness**.',
          '**Synchronization** (mutexes, semaphores, monitors) prevents **race conditions** in the **critical section**.',
          '**Deadlock** needs all **4 Coffman conditions**; handle by prevention, avoidance (**Banker’s**), detection, or ignoring it.',
          '**Memory**: logical→physical via the **MMU**; **paging** kills external fragmentation; **segmentation** matches program structure.',
          '**Virtual memory** uses **demand paging**; **page replacement** (FIFO/LRU/Optimal) minimises **page faults**; too little RAM → **thrashing**.',
          '**File systems** organise data (directory trees; contiguous/linked/indexed allocation).',
          '**Disk scheduling** (FCFS/SSTF/SCAN/LOOK) minimises head movement; **I/O** evolves polling → interrupts → **DMA**.',
        ] },
        { type: 'callout', variant: 'key', text: 'Take the **Final Exam** (sidebar) for a mixed set across all of these. Replay any widget — the scheduler, page replacement, the disk head — until the trade-offs feel obvious.' },
      ],
    },
    {
      id: 'os-m11-l2',
      title: 'Go deeper (all free)',
      minutes: 3,
      blocks: [
        { type: 'ul', items: [
          '**OSTEP — *Operating Systems: Three Easy Pieces*** — a beloved, free online textbook.',
          '**Neso Academy / Gate Smashers** (YouTube) — clear OS explainers, great for revision.',
          '**TutorialsPoint OS tutorial** — the long-form text reference for every topic here.',
        ] },
        { type: 'callout', variant: 'tip', text: 'Best next step: install a Linux VM and watch real processes (`ps`, `top`), memory (`free`), and scheduling in action. Seeing the concepts on a live system makes them stick.' },
        { type: 'callout', variant: 'info', title: 'One non-OS term, for completeness', text: '**Cookies** are small pieces of text a website stores in your browser to remember you between visits. They’re a *web* concept (not part of the operating system) — included here only because they often show up in mixed CS notes.' },
      ],
    },
  ],
  quiz: [
    { id: 'os-m11-q1', type: 'single', prompt: 'Best one-line description of an OS?', options: ['A programming language', 'A resource manager and abstraction layer between apps and hardware', 'A web browser', 'A type of CPU'], correct: [1], explanation: 'It manages resources (CPU, memory, I/O) and abstracts the hardware for programs.' },
    { id: 'os-m11-q2', type: 'multi', prompt: 'Which reduce page faults / improve memory performance?', options: ['Good page-replacement (LRU)', 'Enough frames for the working set', 'A tiny time quantum', 'Locality of reference'], correct: [0, 1, 3], explanation: 'LRU, sufficient frames, and locality all help; a tiny quantum is a scheduling concept, not a memory fix.' },
  ],
  resources: [
    { label: 'OSTEP — Operating Systems: Three Easy Pieces (free book)', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', kind: 'article', free: true },
    { label: 'TutorialsPoint — OS Quick Guide', url: 'https://www.tutorialspoint.com/operating_system/os_quick_guide.htm', kind: 'article', free: true },
  ],
};
