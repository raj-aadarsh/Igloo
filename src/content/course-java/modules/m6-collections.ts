import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'java-m6',
  slug: 'collections',
  order: 6,
  title: 'Collections Framework',
  subtitle: 'List, Set, Map, Queue & HashMap internals',
  icon: 'boxes',
  lessons: [
    {
      id: 'java-m6-l1',
      title: 'The big picture: List, Set, Map, Queue',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The **Collections Framework** is a set of interfaces + implementations for storing groups of objects. The root interfaces:' },
        { type: 'keyterms', terms: [
          { term: 'List (ordered, duplicates ok)', def: 'ArrayList (backed by a resizable array — fast random access, slow middle inserts) vs LinkedList (doubly-linked — fast inserts/removes at ends, slow random access).' },
          { term: 'Set (no duplicates)', def: 'HashSet (no order, O(1)), LinkedHashSet (insertion order), TreeSet (sorted, O(log n)).' },
          { term: 'Map (key → value)', def: 'HashMap (no order, O(1)), LinkedHashMap (insertion/access order), TreeMap (sorted by key, O(log n)). (Map isn’t a Collection but is part of the framework.)' },
          { term: 'Queue / Deque', def: 'FIFO/LIFO structures: ArrayDeque (fast stack/queue), PriorityQueue (heap-ordered).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Picking interview cheat: need indexed access → ArrayList. Uniqueness → HashSet. Key-value → HashMap. Sorted → TreeMap/TreeSet. Stack/queue → ArrayDeque. Priority → PriorityQueue.' },
      ],
    },
    {
      id: 'java-m6-l2',
      title: 'ArrayList vs LinkedList & complexity',
      minutes: 5,
      blocks: [
        { type: 'code', code: `import java.util.*;

List<Integer> list = new ArrayList<>();
list.add(1); list.add(2); list.add(3);
list.get(1);            // O(1) random access

Deque<Integer> stack = new ArrayDeque<>();
stack.push(10); stack.pop();   // LIFO, O(1)

Map<String,Integer> map = new HashMap<>();
map.put("a", 1);
map.getOrDefault("b", 0);
map.merge("a", 1, Integer::sum);  // a -> 2` },
        { type: 'keyterms', title: 'Complexity you should quote', terms: [
          { term: 'ArrayList', def: 'get/set O(1); add at end amortised O(1); insert/remove in middle O(n).' },
          { term: 'LinkedList', def: 'add/remove at ends O(1); get(index) O(n). Rarely the right default.' },
          { term: 'HashMap / HashSet', def: 'get/put/contains average O(1), worst O(n) (or O(log n) with treeified buckets in Java 8+).' },
          { term: 'TreeMap / TreeSet', def: 'O(log n) — backed by a red-black tree, keeps keys sorted.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Fail-fast iterators: modifying a collection while iterating it (other than via the iterator’s own remove) throws ConcurrentModificationException. Use Iterator.remove(), removeIf(), or a concurrent collection.' },
      ],
    },
    {
      id: 'java-m6-l3',
      title: 'How HashMap actually works',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'HashMap is the most-dissected class in Java interviews. It’s an **array of buckets**; a key’s `hashCode()` (spread to mix bits) picks the bucket via `hash & (capacity − 1)`. Add keys below and watch them land — equal hashes **collide** into a chain:' },
        { type: 'widget', widget: 'hashmap-internals' },
        { type: 'keyterms', terms: [
          { term: 'Bucket & collision', def: 'Multiple keys can map to one bucket; they’re stored as a linked chain (then a balanced tree once a bucket holds ≥8 entries, in Java 8+).' },
          { term: 'Load factor (0.75)', def: 'When size > capacity × loadFactor, the map resizes (doubles capacity) and rehashes all entries — amortising O(1) operations.' },
          { term: 'get(key) steps', def: '1) hash the key → bucket, 2) walk the chain/tree comparing with equals(). This is why a correct equals/hashCode pair is mandatory.' },
          { term: 'HashMap vs Hashtable vs ConcurrentHashMap', def: 'HashMap: not synchronized, allows one null key. Hashtable: legacy, fully synchronized. ConcurrentHashMap: thread-safe with fine-grained locking — the modern concurrent choice.' },
        ] },
      ],
    },
  ],
  quiz: [
    { id: 'java-m6-q1', type: 'single', prompt: 'For frequent random access by index, prefer…', options: ['LinkedList', 'ArrayList', 'HashSet', 'TreeMap'], correct: [1], explanation: 'ArrayList gives O(1) get(index); LinkedList is O(n).' },
    { id: 'java-m6-q2', type: 'single', prompt: 'Average time complexity of HashMap get/put is…', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correct: [2], explanation: 'Average O(1); worst case O(n) or O(log n) with treeified buckets.' },
    { id: 'java-m6-q3', type: 'single', prompt: 'When does a HashMap resize?', options: ['Never', 'When size exceeds capacity × load factor (0.75)', 'On every put', 'When a key is removed'], correct: [1], explanation: 'Exceeding the load-factor threshold triggers a doubling + rehash.' },
    { id: 'java-m6-q4', type: 'single', prompt: 'A collision in a HashMap means…', options: ['Two equal keys', 'Two keys hashing to the same bucket', 'The map is full', 'A null value'], correct: [1], explanation: 'Different keys mapping to the same bucket collide and are chained/treeified.' },
    { id: 'java-m6-q5', type: 'single', prompt: 'Modifying a list while iterating (not via the iterator) typically throws…', options: ['NullPointerException', 'ConcurrentModificationException', 'IllegalStateException', 'Nothing'], correct: [1], explanation: 'Fail-fast iterators throw ConcurrentModificationException.' },
    { id: 'java-m6-q6', type: 'single', prompt: 'Which is the modern thread-safe map?', options: ['HashMap', 'Hashtable', 'ConcurrentHashMap', 'TreeMap'], correct: [2], explanation: 'ConcurrentHashMap offers thread-safety with fine-grained locking; Hashtable is legacy.' },
  ],
  resources: [
    { label: 'Baeldung — How HashMap works', url: 'https://www.baeldung.com/java-hashmap-advanced', kind: 'article', free: true },
    { label: 'Oracle — Collections Framework', url: 'https://docs.oracle.com/javase/tutorial/collections/', kind: 'docs', free: true },
  ],
};
