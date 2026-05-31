import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'dbms-m7',
  slug: 'indexing-storage',
  order: 7,
  title: 'Indexing & Storage',
  subtitle: 'How databases find rows fast',
  icon: 'list-tree',
  lessons: [
    {
      id: 'dbms-m7-l1',
      title: 'Why indexes exist',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'Without an index, finding a row means a **full table scan** — reading every row, O(n). An **index** is an auxiliary data structure (like a book’s index) that maps a search key to the location of its rows, turning lookups into O(log n) or O(1).' },
        { type: 'analogy', text: 'A textbook index lets you jump straight to "normalization → page 214" instead of flipping through all 400 pages. A DB index does exactly that for rows.' },
        { type: 'callout', variant: 'key', text: 'Index trade-off: faster reads (SELECT/WHERE/JOIN), but slower writes (every INSERT/UPDATE/DELETE must also update the index) and extra storage. Index the columns you search/join on — not every column.' },
      ],
    },
    {
      id: 'dbms-m7-l2',
      title: 'Types of indexes',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Primary index', def: 'Built on the ordering key of a sorted file (usually the primary key). Sparse — one entry per data block.' },
          { term: 'Clustering index', def: 'On a non-key field by which the file is physically ordered. Rows with the same value sit together.' },
          { term: 'Secondary index', def: 'On a non-ordering field. Dense — one entry per record. You can have many secondary indexes per table.' },
          { term: 'Dense vs Sparse', def: 'Dense = an index entry for every record. Sparse = an entry for only some records (e.g. one per block). Sparse indexes are smaller; dense ones can answer existence without touching data.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'A table can have only ONE primary/clustering index (data can be physically sorted just one way) but MANY secondary indexes.' },
      ],
    },
    {
      id: 'dbms-m7-l3',
      title: 'B-trees & B+ trees',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Almost every real database (MySQL InnoDB, PostgreSQL, Oracle) uses a **B+ tree** for its indexes. It’s a balanced, multi-way search tree kept shallow so a lookup touches very few disk blocks. Click a key to watch the search path:' },
        { type: 'widget', widget: 'btree-index' },
        { type: 'keyterms', title: 'B-tree vs B+ tree', terms: [
          { term: 'B-tree', def: 'Stores keys AND data pointers in every node (internal + leaf). A key appears once.' },
          { term: 'B+ tree', def: 'Stores data pointers ONLY in leaves; internal nodes hold copies of keys just for routing. Leaves are linked in a list.' },
          { term: 'Why B+ wins for DBs', def: 'Linked leaves make range scans (BETWEEN, ORDER BY) trivial; internal nodes hold more keys (no data) so the tree is shorter → fewer disk I/Os.' },
          { term: 'Balanced & multi-way', def: 'All leaves at the same depth; each node has many children (high fan-out), so height stays tiny even for billions of rows — O(log n) lookups.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Interview one-liner: "B+ trees keep all data in linked leaves at equal depth, giving O(log n) point lookups AND efficient range queries with very few disk reads."' },
      ],
    },
    {
      id: 'dbms-m7-l4',
      title: 'Hashing & a note on storage',
      minutes: 4,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Hash index', def: 'Maps a key through a hash function to a bucket — O(1) for equality lookups (=), but useless for range queries (<, >, BETWEEN).' },
          { term: 'Static vs Dynamic hashing', def: 'Static hashing has a fixed number of buckets (overflow chains hurt as data grows). Dynamic hashing (extendible/linear) grows buckets on demand.' },
          { term: 'B+ tree vs Hash', def: 'Use B+ tree for ranges & sorting; use hash for pure equality lookups. Most DBs default to B+ tree because it handles both reasonably.' },
        ] },
        { type: 'callout', variant: 'info', text: 'Storage hierarchy reminder: data lives in blocks/pages on disk; the DB reads whole blocks, so indexing is all about minimizing the number of block reads (disk I/O dominates query cost).' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m7-q1', type: 'single', prompt: 'Which index structure do most relational databases use by default?', options: ['Hash table', 'B+ tree', 'Linked list', 'Bitmap only'], correct: [1], explanation: 'B+ trees are the default — balanced, shallow, and great for both point and range queries.' },
    { id: 'dbms-m7-q2', type: 'single', prompt: 'In a B+ tree, actual data pointers are stored…', options: ['In every node', 'Only in internal nodes', 'Only in leaf nodes', 'In the root only'], correct: [2], explanation: 'B+ trees keep data pointers only in leaves; internal nodes route. Leaves are linked for range scans.' },
    { id: 'dbms-m7-q3', type: 'single', prompt: 'How many clustering/primary indexes can a single table have?', options: ['Exactly one', 'Up to two', 'Unlimited', 'Zero'], correct: [0], explanation: 'Data can be physically ordered only one way, so there’s at most one clustering/primary index.' },
    { id: 'dbms-m7-q4', type: 'single', prompt: 'A hash index is a poor choice for which query?', options: ['WHERE id = 5', 'WHERE age BETWEEN 20 AND 30', 'Exact-match lookup', 'WHERE email = ?'], correct: [1], explanation: 'Hash indexes only help equality; range queries need a B+ tree’s ordered, linked leaves.' },
    { id: 'dbms-m7-q5', type: 'single', prompt: 'A dense index has…', options: ['One entry per data block', 'One entry per record', 'No entries', 'One entry total'], correct: [1], explanation: 'Dense = an index entry for every record; sparse = one per block.' },
    { id: 'dbms-m7-q6', type: 'single', prompt: 'The main downside of adding an index is…', options: ['Slower SELECTs', 'Slower writes + extra storage', 'It breaks foreign keys', 'It prevents joins'], correct: [1], explanation: 'Indexes speed reads but every write must maintain them, and they consume storage.' },
  ],
  resources: [
    { label: 'GeeksforGeeks — Indexing in DBMS', url: 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/', kind: 'article', free: true },
    { label: 'GeeksforGeeks — B+ Tree', url: 'https://www.geeksforgeeks.org/introduction-of-b-tree/', kind: 'article', free: true },
  ],
};
