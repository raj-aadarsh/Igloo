import type { Module } from '@/content/types';

export const m10: Module = {
  id: 'java-m10',
  slug: 'jvm-memory-gc',
  order: 10,
  title: 'JVM Memory & Garbage Collection',
  subtitle: 'Heap, stack, classloaders & GC',
  icon: 'cpu',
  lessons: [
    {
      id: 'java-m10-l1',
      title: 'Runtime memory areas',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'When the JVM runs your program it divides memory into well-defined regions. Knowing **stack vs heap** explains most "where does this variable live?" questions.' },
        { type: 'keyterms', terms: [
          { term: 'Heap', def: 'Where ALL objects live (everything created with new). Shared across threads. Garbage-collected. Divided into Young (Eden + Survivor) and Old generations.' },
          { term: 'Stack (per thread)', def: 'Holds stack frames for method calls: local variables, primitives, and references to heap objects. Pops as methods return. StackOverflowError if too deep (e.g. infinite recursion).' },
          { term: 'Metaspace', def: 'Class metadata (since Java 8, replaced "PermGen"). Lives in native memory and grows as needed.' },
          { term: 'PC register & native stack', def: 'Per-thread: the address of the current bytecode instruction, and the stack for native (JNI) calls.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Stack vs heap one-liner: local primitives & object references live on the (per-thread) stack; the objects themselves live on the (shared) heap. Reference types = reference on stack → object on heap.' },
      ],
    },
    {
      id: 'java-m10-l2',
      title: 'Garbage collection',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Java manages memory for you: the **garbage collector** automatically reclaims objects that are no longer reachable. You never `free()` — but you can still leak by keeping references alive.' },
        { type: 'keyterms', terms: [
          { term: 'Reachability & GC roots', def: 'An object is "alive" if reachable from a GC root (active thread stacks, static fields, JNI refs). Unreachable objects are eligible for collection.' },
          { term: 'Generational GC', def: 'Most objects die young, so the heap is split into Young and Old gens. Minor GC cleans the Young gen frequently & cheaply; survivors are promoted to Old, cleaned by less-frequent Major/Full GC.' },
          { term: 'Mark-and-sweep', def: 'The core idea: mark all reachable objects, then sweep (reclaim) the rest; often with compaction to reduce fragmentation.' },
          { term: 'Collectors', def: 'G1 (default since Java 9, low-pause regions), Parallel (throughput), ZGC/Shenandoah (very low pause, large heaps).' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Memory leaks still happen in Java: forgotten entries in a static Map/collection, unremoved listeners, or unclosed resources keep objects reachable so GC can’t reclaim them. "GC’d" ≠ "you can’t leak".' },
      ],
    },
    {
      id: 'java-m10-l3',
      title: 'Classloaders (quick tour)',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'Before code runs, **classloaders** load `.class` files into the JVM, following a delegation hierarchy:' },
        { type: 'keyterms', terms: [
          { term: 'Bootstrap → Platform → Application', def: 'Bootstrap loads core JDK classes; Platform loads platform modules; Application (System) loads your classpath classes.' },
          { term: 'Parent-delegation model', def: 'A loader first asks its parent to load a class; only if the parent can’t does it load the class itself. Prevents core classes being overridden and ensures uniqueness.' },
          { term: 'Load → Link → Initialize', def: 'Load the bytecode, link (verify + prepare + resolve), then initialize (run static initializers). A class is loaded lazily, on first use.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Tie it together: javac makes bytecode → classloader loads & verifies it → it lives in Metaspace, objects in the Heap, calls on the Stack → the execution engine (interpreter + JIT) runs it → GC reclaims dead heap objects.' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m10-q1', type: 'single', prompt: 'Objects created with `new` live on the…', options: ['Stack', 'Heap', 'Metaspace', 'PC register'], correct: [1], explanation: 'All objects live on the shared, garbage-collected heap.' },
    { id: 'java-m10-q2', type: 'single', prompt: 'Local primitive variables and references live on the…', options: ['Heap', 'Per-thread stack', 'Metaspace', 'Disk'], correct: [1], explanation: 'Each thread’s stack holds frames with locals, primitives, and references to heap objects.' },
    { id: 'java-m10-q3', type: 'single', prompt: 'Infinitely deep recursion causes…', options: ['OutOfMemoryError', 'StackOverflowError', 'A heap dump', 'A minor GC'], correct: [1], explanation: 'Each call adds a stack frame; running out of stack throws StackOverflowError.' },
    { id: 'java-m10-q4', type: 'single', prompt: 'Generational GC is based on the observation that…', options: ['Objects never die', 'Most objects die young', 'GC is free', 'Old objects die first'], correct: [1], explanation: 'The "weak generational hypothesis": most objects become garbage soon after allocation.' },
    { id: 'java-m10-q5', type: 'single', prompt: 'An object is eligible for GC when it is…', options: ['Set to null once', 'No longer reachable from any GC root', 'Larger than 1MB', 'In the Old generation'], correct: [1], explanation: 'Reachability from GC roots determines liveness; unreachable objects can be collected.' },
    { id: 'java-m10-q6', type: 'single', prompt: 'The parent-delegation model means a classloader…', options: ['Loads everything itself', 'Asks its parent to load a class before trying itself', 'Never loads core classes', 'Runs static blocks first'], correct: [1], explanation: 'Delegation up to the parent ensures core classes load once and can’t be shadowed.' },
  ],
  resources: [
    { label: 'Baeldung — JVM Memory model & GC', url: 'https://www.baeldung.com/jvm-garbage-collectors', kind: 'article', free: true },
  ],
};
