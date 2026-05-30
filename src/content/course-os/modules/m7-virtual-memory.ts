import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'os-m7',
  slug: 'virtual-memory',
  order: 7,
  title: 'Virtual Memory',
  subtitle: 'Running programs bigger than RAM',
  icon: 'boxes',
  lessons: [
    {
      id: 'os-m7-l1',
      title: 'Demand paging & page faults',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Virtual memory** lets a process use more memory than physically exists by keeping only the needed pages in RAM and the rest on disk (the **swap** area). With **demand paging**, a page is loaded only when it’s first accessed.' },
        { type: 'p', text: 'When a process accesses a page that isn’t in RAM, the MMU triggers a **page fault**: the OS pauses the process, fetches the page from disk into a free frame (evicting one if needed), updates the page table, and resumes.' },
        { type: 'keyterms', terms: [
          { term: 'Page fault', def: 'A trap raised when a referenced page isn’t in physical memory.' },
          { term: 'Demand paging', def: 'Load pages lazily, only when first referenced.' },
          { term: 'Locality of reference', def: 'Programs tend to reuse recent pages (temporal) and nearby ones (spatial) — which is why caching/paging works so well.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Page faults are expensive (disk is ~100,000× slower than RAM). Minimizing them is the whole game — which is why the replacement algorithm matters.' },
      ],
    },
    {
      id: 'os-m7-l2',
      title: 'Page replacement — play with it',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'When RAM is full and a new page is needed, which page do we evict? Switch algorithms and watch the **faults** change for the same reference string:' },
        { type: 'widget', widget: 'page-replacement' },
        { type: 'ul', items: [
          '**FIFO** — evict the oldest-loaded page. Simple, but can suffer **Belady’s anomaly** (more frames → *more* faults).',
          '**LRU (Least Recently Used)** — evict the page unused for the longest time. Great in practice (locality), but costly to track exactly.',
          '**Optimal (OPT)** — evict the page not needed for the longest time in the future. Fewest possible faults, but needs to see the future — used only as a benchmark.',
        ] },
        { type: 'keyterms', terms: [
          { term: 'Belady’s anomaly', def: 'For FIFO, adding more frames can paradoxically increase page faults. LRU and OPT never do this (they’re "stack algorithms").' },
          { term: 'Second-chance / Clock', def: 'A practical FIFO variant that gives recently-used pages a reprieve — an efficient LRU approximation.' },
        ] },
      ],
    },
    {
      id: 'os-m7-l3',
      title: 'Thrashing',
      minutes: 4,
      blocks: [
        { type: 'p', text: '**Thrashing** is when a system spends more time swapping pages in and out than doing real work — CPU utilization collapses. It happens when processes don’t have enough frames to hold their **working set** (the pages they actively use).' },
        { type: 'callout', variant: 'key', text: 'Cause: too many processes competing for too few frames → constant page faults. Fixes: the **working-set model** (give each process enough frames for its active pages) and **page-fault-frequency** control; ultimately, run fewer processes or add RAM.' },
        { type: 'analogy', text: 'A desk too small for your books: you spend all your time swapping books between the desk and the shelf instead of actually reading.' },
      ],
    },
  ],
  quiz: [
    { id: 'os-m7-q1', type: 'single', prompt: 'A page fault occurs when…', options: ['The CPU is idle', 'A referenced page isn’t in physical memory', 'Two processes deadlock', 'The disk is full'], correct: [1], explanation: 'It’s a trap raised when the needed page must be fetched from disk.' },
    { id: 'os-m7-q2', type: 'single', prompt: 'Which replacement algorithm gives the theoretical minimum faults?', options: ['FIFO', 'LRU', 'Optimal (OPT)', 'Second-chance'], correct: [2], explanation: 'OPT evicts the page used farthest in the future — optimal, but needs future knowledge.' },
    { id: 'os-m7-q3', type: 'single', prompt: 'Belady’s anomaly (more frames → more faults) can affect which algorithm?', options: ['LRU', 'Optimal', 'FIFO', 'None'], correct: [2], explanation: 'FIFO is not a stack algorithm, so it can exhibit Belady’s anomaly; LRU and OPT cannot.' },
    { id: 'os-m7-q4', type: 'single', prompt: 'A system spends almost all its time swapping pages instead of working. This is…', options: ['Thrashing', 'Starvation', 'A race condition', 'Compaction'], correct: [0], explanation: 'Thrashing: excessive paging collapses useful throughput.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Virtual Memory', url: 'https://www.tutorialspoint.com/operating_system/os_virtual_memory.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Page Replacement Algorithms', url: 'https://www.tutorialspoint.com/operating_system/os_page_replacement_algorithms.htm', kind: 'article', free: true },
  ],
};
