import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'os-m6',
  slug: 'memory-management',
  order: 6,
  title: 'Memory Management',
  subtitle: 'Giving every process its space',
  icon: 'layers',
  lessons: [
    {
      id: 'os-m6-l1',
      title: 'Logical vs physical, and allocation',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A process works with **logical (virtual) addresses**; the **MMU** (memory management unit) hardware translates these to **physical addresses** in RAM at runtime. This indirection is what lets each process believe it has its own clean address space.' },
        { type: 'keyterms', terms: [
          { term: 'Logical address', def: 'The address a program generates (relative to its own space).' },
          { term: 'Physical address', def: 'The actual location in RAM.' },
          { term: 'MMU', def: 'Hardware that maps logical → physical addresses (using base/limit registers, or a page table).' },
        ] },
        { type: 'h3', text: 'Contiguous allocation & the fitting problem' },
        { type: 'p', text: 'In **contiguous** allocation, each process gets one continuous block. When a process needs memory, where do we put it among the free holes? Try the strategies:' },
        { type: 'widget', widget: 'memory-fit' },
      ],
    },
    {
      id: 'os-m6-l2',
      title: 'Fragmentation',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'External fragmentation', def: 'Enough total free memory exists, but it’s split into scattered small holes — none big enough for the request.' },
          { term: 'Internal fragmentation', def: 'Memory given to a process is slightly larger than needed; the leftover inside the block is wasted.' },
          { term: 'Compaction', def: 'Shuffle allocated blocks together to merge free holes into one big block (expensive).' },
        ] },
        { type: 'callout', variant: 'key', text: '**External** = wasted space *between* allocations (scattered holes). **Internal** = wasted space *inside* an allocation (rounding up). Paging eliminates external fragmentation; it’s the key reason it exists.' },
      ],
    },
    {
      id: 'os-m6-l3',
      title: 'Paging & segmentation',
      minutes: 7,
      blocks: [
        { type: 'h2', text: 'Paging' },
        { type: 'p', text: '**Paging** splits logical memory into fixed-size **pages** and physical memory into same-size **frames**. A **page table** maps each page → frame. Because any page can go in any free frame, **external fragmentation disappears** (you only lose a little to internal fragmentation in the last page).' },
        { type: 'p', text: 'A logical address = **(page number, offset)**. The page number indexes the page table to find the frame; the offset is added in. A **TLB** (translation lookaside buffer) caches recent translations so this is fast.' },
        { type: 'keyterms', terms: [
          { term: 'Page / Frame', def: 'Fixed-size chunk of logical memory / physical memory (same size).' },
          { term: 'Page table', def: 'Per-process map from page number to frame number.' },
          { term: 'TLB', def: 'A cache of recent page→frame translations to avoid hitting the page table every time.' },
        ] },
        { type: 'h2', text: 'Segmentation' },
        { type: 'p', text: '**Segmentation** divides memory into variable-size, logical units that match the program’s structure (code, stack, heap). Addresses are **(segment, offset)**. It’s programmer-friendly but suffers external fragmentation. Real systems often combine both (**paged segmentation**).' },
        { type: 'callout', variant: 'tip', text: 'Paging = fixed-size, no external fragmentation, invisible to the programmer. Segmentation = variable-size, matches logical structure, can fragment. Know the contrast — it’s a classic interview question.' },
      ],
    },
  ],
  quiz: [
    { id: 'os-m6-q1', type: 'single', prompt: 'Which hardware translates logical addresses to physical addresses at runtime?', options: ['ALU', 'MMU', 'TLB cache only', 'Disk controller'], correct: [1], explanation: 'The Memory Management Unit performs logical→physical translation.' },
    { id: 'os-m6-q2', type: 'single', prompt: 'Free memory exists but is scattered in small holes too small to use. This is…', options: ['Internal fragmentation', 'External fragmentation', 'Thrashing', 'A page fault'], correct: [1], explanation: 'Scattered unusable holes = external fragmentation.' },
    { id: 'os-m6-q3', type: 'single', prompt: 'Paging mainly eliminates which problem?', options: ['Internal fragmentation', 'External fragmentation', 'Deadlock', 'Race conditions'], correct: [1], explanation: 'Any page fits any frame, so external fragmentation goes away (a little internal remains).' },
    { id: 'os-m6-q4', type: 'single', prompt: 'Best Fit chooses…', options: ['The first hole that fits', 'The smallest hole that fits', 'The largest hole', 'A random hole'], correct: [1], explanation: 'Best Fit picks the smallest hole large enough — minimizing immediate leftover.' },
    { id: 'os-m6-q5', type: 'single', prompt: 'A key difference: paging uses ____ blocks while segmentation uses ____ blocks.', options: ['variable / fixed', 'fixed / variable', 'fixed / fixed', 'variable / variable'], correct: [1], explanation: 'Paging = fixed-size pages; segmentation = variable-size logical segments.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Memory Management', url: 'https://www.tutorialspoint.com/operating_system/os_memory_management.htm', kind: 'article', free: true },
    { label: 'TutorialsPoint — Virtual Memory (Paging)', url: 'https://www.tutorialspoint.com/operating_system/os_virtual_memory.htm', kind: 'article', free: true },
  ],
};
