import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'java-m9',
  slug: 'concurrency',
  order: 9,
  title: 'Multithreading & Concurrency',
  subtitle: 'Threads, synchronization & the memory model',
  icon: 'repeat',
  lessons: [
    {
      id: 'java-m9-l1',
      title: 'Threads & their lifecycle',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **thread** is an independent path of execution within a process. Java makes concurrency first-class — but it’s also where the hardest bugs live.' },
        { type: 'code', code: `// Prefer implementing Runnable over extending Thread
Runnable task = () -> System.out.println("Running on " +
        Thread.currentThread().getName());
Thread t = new Thread(task);
t.start();    // start() spawns a new thread; run() would NOT
t.join();     // wait for t to finish` },
        { type: 'callout', variant: 'warning', text: 'Common trap: calling run() directly executes the code on the CURRENT thread (no concurrency). You must call start() to actually spawn a new thread.' },
        { type: 'p', text: 'A thread moves through six states (java.lang.Thread.State). Tap each:' },
        { type: 'widget', widget: 'thread-lifecycle' },
      ],
    },
    {
      id: 'java-m9-l2',
      title: 'Race conditions & synchronization',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Race condition', def: 'Two threads access shared mutable state concurrently and the result depends on timing (e.g. count++ is read-modify-write — not atomic).' },
          { term: 'synchronized', def: 'Acquires an object’s monitor lock so only one thread runs the block/method at a time → mutual exclusion. Provides atomicity AND visibility.' },
          { term: 'volatile', def: 'Guarantees VISIBILITY — reads/writes go to main memory so other threads see the latest value. It does NOT provide atomicity (volatile count++ is still racy).' },
          { term: 'Atomic classes', def: 'AtomicInteger, AtomicLong, etc. provide lock-free atomic operations (incrementAndGet) via CAS.' },
        ] },
        { type: 'code', code: `class Counter {
    private int count = 0;
    public synchronized void inc() { count++; }  // atomic + visible
    public synchronized int get() { return count; }
}` },
        { type: 'callout', variant: 'key', text: 'volatile vs synchronized — the classic question: volatile = visibility only (good for flags); synchronized/Atomic = visibility + atomicity (good for compound actions like count++).' },
      ],
    },
    {
      id: 'java-m9-l3',
      title: 'Deadlock & higher-level concurrency',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Deadlock', def: 'Thread A holds lock 1 and waits for lock 2 while thread B holds lock 2 and waits for lock 1 — both stuck forever. Avoid by always acquiring locks in a consistent global order.' },
          { term: 'wait() / notify()', def: 'Low-level thread coordination on an object’s monitor (must hold the lock; call inside synchronized).' },
          { term: 'ExecutorService / thread pool', def: 'Don’t create threads by hand — submit tasks to a managed pool (Executors.newFixedThreadPool). Reuses threads, bounds concurrency.' },
          { term: 'Future / Callable', def: 'Callable<T> returns a value; submitting it gives a Future<T> you can get() later. CompletableFuture composes async pipelines.' },
          { term: 'Concurrent collections', def: 'ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue — thread-safe without coarse external locking.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Modern guidance: prefer high-level tools (ExecutorService, ConcurrentHashMap, Atomic*, CompletableFuture) over hand-rolled synchronized + wait/notify. Less error-prone.' },
        { type: 'callout', variant: 'info', text: 'The Java Memory Model (JMM) defines the "happens-before" rules that make writes by one thread visible to another. synchronized, volatile, and Thread.start/join all establish happens-before edges.' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m9-q1', type: 'single', prompt: 'To actually start a new thread you call…', options: ['run()', 'start()', 'execute()', 'go()'], correct: [1], explanation: 'start() spawns a new thread; run() just executes on the current thread.' },
    { id: 'java-m9-q2', type: 'single', prompt: 'volatile guarantees…', options: ['Atomicity', 'Visibility (but not atomicity)', 'Both', 'Neither'], correct: [1], explanation: 'volatile ensures visibility across threads but not atomic compound actions.' },
    { id: 'java-m9-q3', type: 'single', prompt: 'count++ across threads is unsafe because it…', options: ['Is too slow', 'Is a non-atomic read-modify-write', 'Needs volatile only', 'Throws an exception'], correct: [1], explanation: 'It’s three steps (read, add, write); interleaving causes lost updates. Use synchronized or AtomicInteger.' },
    { id: 'java-m9-q4', type: 'single', prompt: 'A reliable way to avoid deadlock is to…', options: ['Use more threads', 'Acquire locks in a consistent global order', 'Never use synchronized', 'Increase thread priority'], correct: [1], explanation: 'Consistent lock ordering prevents the circular wait that causes deadlock.' },
    { id: 'java-m9-q5', type: 'single', prompt: 'Which provides visibility AND atomicity for count++?', options: ['volatile', 'synchronized or AtomicInteger', 'A plain int', 'transient'], correct: [1], explanation: 'synchronized (or AtomicInteger via CAS) gives both; volatile alone does not.' },
    { id: 'java-m9-q6', type: 'single', prompt: 'Instead of creating threads manually, you should usually use…', options: ['An ExecutorService / thread pool', 'More new Thread() calls', 'Thread.sleep', 'finalize()'], correct: [0], explanation: 'A managed pool reuses threads and bounds concurrency — safer and more efficient.' },
  ],
  resources: [
    { label: 'Oracle — Concurrency tutorial', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/', kind: 'docs', free: true },
    { label: 'Baeldung — volatile vs synchronized', url: 'https://www.baeldung.com/java-volatile-vs-synchronized', kind: 'article', free: true },
  ],
};
