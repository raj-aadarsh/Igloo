import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'os-m8',
  slug: 'file-systems',
  order: 8,
  title: 'File Systems',
  subtitle: 'How data is named, organised & stored',
  icon: 'book',
  lessons: [
    {
      id: 'os-m8-l1',
      title: 'Files & directories',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A **file** is the OS’s abstraction for stored data — a named sequence of bytes, with **attributes** (metadata) the OS tracks separately from the contents.' },
        { type: 'keyterms', title: 'Typical file attributes', terms: [
          { term: 'Name & type', def: 'Human-readable name and (sometimes) a type/extension.' },
          { term: 'Location & size', def: 'Where the data lives on disk and how big it is.' },
          { term: 'Permissions', def: 'Who can read / write / execute it.' },
          { term: 'Timestamps', def: 'Created, last modified, last accessed.' },
        ] },
        { type: 'h3', text: 'Directory structures' },
        { type: 'ul', items: [
          '**Single-level** — one flat list of files. Simple, but name clashes and no organisation.',
          '**Two-level** — a directory per user. Avoids clashes between users.',
          '**Tree** — nested directories (what you use daily). Supports paths like `/home/user/file`.',
          '**Acyclic-graph** — allows shared files via **links** (e.g. symbolic/hard links).',
        ] },
        { type: 'callout', variant: 'tip', text: 'Metadata about a file (in Unix, the **inode**) is stored separately from the file’s name and contents — which is how one file can have multiple names (hard links).' },
      ],
    },
    {
      id: 'os-m8-l2',
      title: 'File allocation methods',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'How are a file’s blocks laid out on disk? Three classic schemes, each with a clear trade-off:' },
        { type: 'keyterms', terms: [
          { term: 'Contiguous', def: 'All blocks in a row. Fast sequential + random access, but causes external fragmentation and files can’t easily grow.' },
          { term: 'Linked', def: 'Each block points to the next (a chain). No fragmentation and easy growth, but random access is slow (must follow the chain) and a broken pointer loses the rest.' },
          { term: 'Indexed', def: 'An index block holds pointers to all the file’s blocks. Fast random access and no external fragmentation; costs an extra block per file. (Unix inodes use a multi-level version.)' },
        ] },
        { type: 'callout', variant: 'key', text: 'Quick recall: **Contiguous** = fast but rigid; **Linked** = flexible but slow random access; **Indexed** = the best of both (the basis of real file systems).' },
        { type: 'h3', text: 'Free-space management' },
        { type: 'p', text: 'The OS must also track which blocks are free. Common methods: a **bit vector / bitmap** (one bit per block — simple, fast to find runs) or a **linked list** of free blocks.' },
      ],
    },
  ],
  quiz: [
    { id: 'os-m8-q1', type: 'single', prompt: 'Which allocation method gives fast random access AND avoids external fragmentation?', options: ['Contiguous', 'Linked', 'Indexed', 'None'], correct: [2], explanation: 'Indexed allocation: the index block lets you jump to any block directly, with no contiguity requirement.' },
    { id: 'os-m8-q2', type: 'single', prompt: 'A major drawback of linked allocation is…', options: ['External fragmentation', 'Slow random access (must follow the chain)', 'Files can’t grow', 'It needs contiguous space'], correct: [1], explanation: 'Linked blocks must be traversed in order, so jumping to block N is O(N).' },
    { id: 'os-m8-q3', type: 'single', prompt: 'In Unix, the metadata for a file (size, permissions, block pointers) lives in…', options: ['The file name', 'The inode', 'The directory entry only', 'The boot sector'], correct: [1], explanation: 'The inode holds the file’s metadata and block pointers, separate from its name.' },
    { id: 'os-m8-q4', type: 'single', prompt: 'A bitmap for free-space management uses…', options: ['One pointer per file', 'One bit per disk block (free/used)', 'A tree of directories', 'An index block'], correct: [1], explanation: 'Each block maps to one bit: 1 = used, 0 = free (or vice versa).' },
  ],
  resources: [
    { label: 'TutorialsPoint — File System', url: 'https://www.tutorialspoint.com/operating_system/os_file_system.htm', kind: 'article', free: true },
  ],
};
