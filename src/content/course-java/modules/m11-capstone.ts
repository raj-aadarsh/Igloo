import type { Module } from '@/content/types';

export const m11: Module = {
  id: 'java-m11',
  slug: 'capstone',
  order: 11,
  title: 'Capstone & Interview Recap',
  subtitle: 'Tie it all together',
  icon: 'trophy',
  lessons: [
    {
      id: 'java-m11-l1',
      title: 'The whole map',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'You’ve covered Core Java from "how a .java file becomes a running program" to threads and the garbage collector. The layers, top to bottom:' },
        { type: 'ol', items: [
          '**Run model** — javac → bytecode → JVM (classloader → runtime areas → execution engine + JIT). JVM ⊂ JRE ⊂ JDK.',
          '**Language** — primitives vs references, control flow, immutable Strings & the pool, StringBuilder.',
          '**OOP** — encapsulation, inheritance, polymorphism (override vs overload), abstraction (interface vs abstract class).',
          '**Object contract** — ==/equals/hashCode, immutability, enums, records, Comparable/Comparator.',
          '**Exceptions** — checked vs unchecked, try/catch/finally, try-with-resources.',
          '**Collections** — List/Set/Map/Queue, their complexity, and how HashMap really works.',
          '**Generics** — compile-time safety, wildcards (PECS), type erasure.',
          '**Functional** — lambdas, functional interfaces, the Streams pipeline, Optional.',
          '**Concurrency** — threads & states, synchronized/volatile/atomics, deadlock, executors, the JMM.',
          '**Memory** — stack vs heap, generational GC, classloaders.',
        ] },
        { type: 'callout', variant: 'key', text: 'If you can explain each of these to a friend and back it with a quick code example, you’re ready for the Java portion of almost any interview.' },
      ],
    },
    {
      id: 'java-m11-l2',
      title: 'Rapid-fire cheat-sheet',
      minutes: 5,
      blocks: [
        { type: 'keyterms', title: 'Answer each in one breath', terms: [
          { term: 'Why are Strings immutable?', def: 'Security, thread-safety, the String pool, cached hashCode.' },
          { term: '== vs equals()', def: 'Reference identity vs logical value (override equals + hashCode together).' },
          { term: 'equals/hashCode contract', def: 'Equal objects must have equal hash codes — or hash collections break.' },
          { term: 'Overloading vs overriding', def: 'Compile-time (different params) vs runtime (same signature, dynamic dispatch).' },
          { term: 'Interface vs abstract class', def: 'Many "can-do" contracts (no state) vs one "is-a" with shared state/code.' },
          { term: 'Checked vs unchecked', def: 'Compiler-enforced (Exception) vs not (RuntimeException).' },
          { term: 'How HashMap works', def: 'Bucket array; hash→index; collisions chain/treeify; resize at 0.75 load factor.' },
          { term: 'volatile vs synchronized', def: 'Visibility only vs visibility + atomicity (mutual exclusion).' },
          { term: 'Stack vs heap', def: 'Per-thread frames (locals/refs) vs shared object storage (GC’d).' },
          { term: 'fail-fast iterator', def: 'Throws ConcurrentModificationException on structural change during iteration.' },
        ] },
      ],
    },
    {
      id: 'java-m11-l3',
      title: 'Last lap in the playground',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'One final play. Run each example, then change something and predict the output before hitting Run — that prediction loop is how the concepts stick. When you’re confident, take the Final Exam. ☕' },
        { type: 'widget', widget: 'java-playground' },
        { type: 'callout', variant: 'tip', text: 'After this, the natural next steps are Low-Level Design (applying OOP to design real classes) and System Design. You’ve built the foundation — go use it.' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m11-q1', type: 'single', prompt: 'Why are Strings immutable in Java?', options: ['To save CPU', 'Security, thread-safety, pooling & cached hashCode', 'They’re not', 'To allow subclassing'], correct: [1], explanation: 'Immutability enables safe sharing, the String pool, thread-safety, and hashCode caching.' },
    { id: 'java-m11-q2', type: 'single', prompt: 'Overriding is decided at ___, overloading at ___.', options: ['compile / runtime', 'runtime / compile', 'both runtime', 'both compile'], correct: [1], explanation: 'Overriding = runtime (dynamic dispatch); overloading = compile time.' },
    { id: 'java-m11-q3', type: 'single', prompt: 'A correct equals/hashCode pair matters most for…', options: ['Inheritance', 'Hash-based collections (HashMap/HashSet)', 'Streams', 'Threads'], correct: [1], explanation: 'Hash collections rely on the contract to locate entries correctly.' },
    { id: 'java-m11-q4', type: 'single', prompt: 'Which gives both visibility and atomicity?', options: ['volatile', 'synchronized / Atomic*', 'transient', 'final'], correct: [1], explanation: 'synchronized (or Atomic classes) provide both; volatile is visibility-only.' },
    { id: 'java-m11-q5', type: 'single', prompt: 'PECS stands for…', options: ['Produce Early, Consume Slowly', 'Producer Extends, Consumer Super', 'Primitive Erasure Compile Safety', 'Pool Each Created String'], correct: [1], explanation: 'Producer Extends, Consumer Super — the wildcard rule of thumb.' },
    { id: 'java-m11-q6', type: 'single', prompt: 'Objects live on the ___; local references live on the ___.', options: ['stack / heap', 'heap / stack', 'heap / heap', 'metaspace / stack'], correct: [1], explanation: 'Objects on the shared heap; locals/references on each thread’s stack.' },
  ],
  resources: [
    { label: 'Baeldung — Java Interview Questions', url: 'https://www.baeldung.com/java-interview-questions', kind: 'article', free: true },
    { label: 'Effective Java (Joshua Bloch) — the canonical best-practices book', url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/', kind: 'docs', free: false },
  ],
};
