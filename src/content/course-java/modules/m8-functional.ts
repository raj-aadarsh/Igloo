import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'java-m8',
  slug: 'functional-java',
  order: 8,
  title: 'Functional Java',
  subtitle: 'Lambdas, functional interfaces & Streams',
  icon: 'workflow',
  lessons: [
    {
      id: 'java-m8-l1',
      title: 'Lambdas & functional interfaces',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Java 8 brought functional programming. A **lambda** is a concise anonymous function; it’s an instance of a **functional interface** (an interface with exactly one abstract method, marked `@FunctionalInterface`).' },
        { type: 'code', code: `// old: anonymous class
Runnable r1 = new Runnable() {
    public void run() { System.out.println("hi"); }
};
// new: lambda
Runnable r2 = () -> System.out.println("hi");

Comparator<String> byLen = (a, b) -> a.length() - b.length();` },
        { type: 'keyterms', title: 'Core functional interfaces (java.util.function)', terms: [
          { term: 'Function<T,R>', def: 'T → R. apply(). The mapper.' },
          { term: 'Predicate<T>', def: 'T → boolean. test(). The filter.' },
          { term: 'Consumer<T>', def: 'T → void. accept(). The side-effect.' },
          { term: 'Supplier<T>', def: '() → T. get(). The factory.' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'Method reference', def: 'Shorthand for a lambda that just calls a method: System.out::println, Integer::parseInt, String::length.' },
        ] },
      ],
    },
    {
      id: 'java-m8-l2',
      title: 'The Streams API',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A **Stream** is a pipeline of operations over a sequence of elements — declarative data processing. It does NOT store data and does NOT mutate the source.' },
        { type: 'code', caption: 'A typical pipeline', code: `import java.util.*;
import java.util.stream.*;

List<String> names = List.of("Ann", "Bob", "Cara", "Dan");
List<String> result = names.stream()
    .filter(n -> n.length() == 3)     // intermediate (lazy)
    .map(String::toUpperCase)         // intermediate (lazy)
    .sorted()                         // intermediate (lazy)
    .collect(Collectors.toList());    // terminal (triggers it)
// [ANN, BOB, DAN]` },
        { type: 'keyterms', terms: [
          { term: 'Intermediate ops (lazy)', def: 'filter, map, sorted, distinct, limit — return a new Stream; nothing runs until a terminal op.' },
          { term: 'Terminal ops (eager)', def: 'collect, forEach, reduce, count, anyMatch, findFirst — trigger execution and produce a result/side-effect.' },
          { term: 'reduce / collect', def: 'reduce combines elements into one value (sum, max); collect gathers into a List/Set/Map or summary via Collectors (groupingBy, joining, counting).' },
          { term: 'Optional<T>', def: 'A container that may or may not hold a value — avoids null. Use map/filter/orElse/ifPresent; don’t just call get() blindly.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Streams are about *what*, not *how*. They’re also easy to parallelise (parallelStream()), but only help for large, CPU-bound, stateless work — measure before reaching for it.' },
        { type: 'p', text: 'Run the "Lambdas & Streams" example below and tweak the pipeline:' },
        { type: 'widget', widget: 'java-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m8-q1', type: 'single', prompt: 'A functional interface has…', options: ['No methods', 'Exactly one abstract method', 'At least two abstract methods', 'Only static methods'], correct: [1], explanation: 'Exactly one abstract method (SAM) — that’s what a lambda implements.' },
    { id: 'java-m8-q2', type: 'single', prompt: 'Which functional interface represents T → boolean?', options: ['Function', 'Predicate', 'Consumer', 'Supplier'], correct: [1], explanation: 'Predicate<T>.test returns boolean — used for filtering.' },
    { id: 'java-m8-q3', type: 'single', prompt: 'Stream intermediate operations are…', options: ['Eager', 'Lazy — they don’t run until a terminal op', 'Terminal', 'Always parallel'], correct: [1], explanation: 'Intermediate ops are lazy; a terminal op triggers the pipeline.' },
    { id: 'java-m8-q4', type: 'single', prompt: 'Which is a terminal operation?', options: ['filter', 'map', 'collect', 'sorted'], correct: [2], explanation: 'collect is terminal; filter/map/sorted are intermediate.' },
    { id: 'java-m8-q5', type: 'single', prompt: '`System.out::println` is an example of a…', options: ['Lambda with body', 'Method reference', 'Constructor', 'Generic method'], correct: [1], explanation: 'It’s a method reference — shorthand for x -> System.out.println(x).' },
    { id: 'java-m8-q6', type: 'single', prompt: 'Optional is used to…', options: ['Make fields optional in a DB', 'Represent a possibly-absent value and avoid null', 'Speed up streams', 'Replace generics'], correct: [1], explanation: 'Optional<T> models presence/absence to reduce NullPointerExceptions.' },
  ],
  resources: [
    { label: 'Oracle — Aggregate Operations (Streams)', url: 'https://docs.oracle.com/javase/tutorial/collections/streams/', kind: 'docs', free: true },
    { label: 'Baeldung — Java 8 Streams', url: 'https://www.baeldung.com/java-8-streams', kind: 'article', free: true },
  ],
};
