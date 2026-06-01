import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'java-m7',
  slug: 'generics',
  order: 7,
  title: 'Generics',
  subtitle: 'Type safety, wildcards & erasure',
  icon: 'shapes',
  lessons: [
    {
      id: 'java-m7-l1',
      title: 'Why generics exist',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**Generics** add compile-time type safety to classes and methods. Before generics, collections held `Object` and you cast everywhere (risking ClassCastException at runtime). Generics move that error to compile time.' },
        { type: 'code', code: `// Without generics — unsafe
List raw = new ArrayList();
raw.add("hi");
Integer n = (Integer) raw.get(0);   // compiles, CRASHES at runtime

// With generics — safe
List<String> list = new ArrayList<>();
list.add("hi");
String s = list.get(0);             // no cast, checked at compile time` },
        { type: 'keyterms', terms: [
          { term: 'Generic class', def: 'class Box<T> { T value; } — T is a type parameter filled in at use: Box<String>.' },
          { term: 'Generic method', def: '<T> T first(List<T> xs) — the method introduces its own type parameter.' },
          { term: 'Bounded type', def: '<T extends Number> restricts T to Number and its subtypes, so you can call Number methods on it.' },
        ] },
      ],
    },
    {
      id: 'java-m7-l2',
      title: 'Wildcards & PECS',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: '? (unbounded wildcard)', def: 'List<?> — "a list of some unknown type". You can read as Object and add nothing (except null).' },
          { term: '? extends T (upper bound)', def: 'Producer — you can READ Ts out of it. List<? extends Number> accepts List<Integer>, List<Double>.' },
          { term: '? super T (lower bound)', def: 'Consumer — you can WRITE Ts into it. List<? super Integer> accepts List<Integer>, List<Number>, List<Object>.' },
        ] },
        { type: 'callout', variant: 'key', text: 'PECS — "Producer Extends, Consumer Super." If a parameter produces values you read, use `? extends T`; if it consumes values you write, use `? super T`. Straight from Effective Java.' },
        { type: 'code', code: `// copies from a producer (src) into a consumer (dst)
static <T> void copy(List<? extends T> src, List<? super T> dst) {
    for (T item : src) dst.add(item);
}` },
      ],
    },
    {
      id: 'java-m7-l3',
      title: 'Type erasure',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'Generics are a **compile-time** feature. The compiler checks types, then **erases** them — at runtime `List<String>` and `List<Integer>` are both just `List`. This keeps backward compatibility with pre-generics code.' },
        { type: 'keyterms', title: 'Consequences of erasure', terms: [
          { term: 'No runtime type info', def: 'You can’t do `if (x instanceof List<String>)` or `new T[]` — the type isn’t there at runtime.' },
          { term: 'Same class', def: 'List<String>.class == List<Integer>.class (both List.class).' },
          { term: 'No primitives', def: 'Type parameters must be reference types — List<int> is illegal; use List<Integer> (autoboxing).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Interview line: "Generics give compile-time type safety; the JVM erases type parameters at runtime, so there’s no per-type bytecode and no runtime generic type info."' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m7-q1', type: 'single', prompt: 'Generics primarily provide…', options: ['Faster runtime', 'Compile-time type safety (fewer casts/ClassCastExceptions)', 'Smaller bytecode', 'Multithreading'], correct: [1], explanation: 'They catch type errors at compile time and remove explicit casts.' },
    { id: 'java-m7-q2', type: 'single', prompt: 'Per PECS, a parameter you only READ from should be…', options: ['? super T', '? extends T', 'raw type', 'T[]'], correct: [1], explanation: 'Producer Extends — read from `? extends T`.' },
    { id: 'java-m7-q3', type: 'single', prompt: '`List<? super Integer>` lets you…', options: ['Read Integers safely', 'Add Integers into the list', 'Only add Strings', 'Nothing'], correct: [1], explanation: 'A lower-bounded wildcard is a consumer — you can write Integers (and subtypes) into it.' },
    { id: 'java-m7-q4', type: 'single', prompt: 'Type erasure means that at runtime…', options: ['Each generic type has its own class', 'Type parameters are removed (List<String> ≈ List)', 'Generics are faster', 'Primitives are allowed'], correct: [1], explanation: 'The compiler erases type parameters; List<String> and List<Integer> share List.class.' },
    { id: 'java-m7-q5', type: 'single', prompt: 'Which is illegal due to erasure?', options: ['List<Integer>', 'new T[10] inside a generic class', 'Box<String>', '<T extends Number>'], correct: [1], explanation: 'You can’t create a generic array (new T[...]) because T isn’t known at runtime.' },
    { id: 'java-m7-q6', type: 'single', prompt: 'Why must `List<int>` be written `List<Integer>`?', options: ['int is reserved', 'Type parameters must be reference types', 'int is too small', 'It’s just a style rule'], correct: [1], explanation: 'Generic type arguments must be reference types; primitives use their wrapper (autoboxing).' },
  ],
  resources: [
    { label: 'Oracle — Generics tutorial', url: 'https://docs.oracle.com/javase/tutorial/java/generics/', kind: 'docs', free: true },
  ],
};
