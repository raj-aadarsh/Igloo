import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'java-m1',
  slug: 'language-basics',
  order: 1,
  title: 'Language Basics & Strings',
  subtitle: 'Types, variables, control flow & String',
  icon: 'book',
  lessons: [
    {
      id: 'java-m1-l1',
      title: 'Primitives vs reference types',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Java has two categories of types — and the difference drives almost every "gotcha" interview question.' },
        { type: 'keyterms', title: 'The 8 primitives', terms: [
          { term: 'Integers', def: 'byte (8-bit), short (16), int (32), long (64).' },
          { term: 'Floating point', def: 'float (32-bit), double (64-bit).' },
          { term: 'Other', def: 'char (16-bit Unicode), boolean (true/false).' },
        ] },
        { type: 'keyterms', terms: [
          { term: 'Primitive types', def: 'Hold the actual value directly (e.g. int x = 5). Stored on the stack (for locals). Compared with ==.' },
          { term: 'Reference types', def: 'Everything else — objects, arrays, Strings. The variable holds a *reference* (address) to an object on the heap. == compares references, not contents.' },
          { term: 'Autoboxing', def: 'Automatic conversion between a primitive (int) and its wrapper object (Integer). Convenient, but creates objects — watch performance in loops.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Wrapper caching trap: Integer caches values -128..127, so `Integer a = 100; Integer b = 100; a == b` is true, but at 1000 it’s false. Always compare objects with .equals(), never ==.' },
      ],
    },
    {
      id: 'java-m1-l2',
      title: 'Operators & control flow',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Control flow in Java looks like C/C++/JavaScript. The essentials:' },
        { type: 'code', code: `int n = 7;

if (n % 2 == 0) System.out.println("even");
else            System.out.println("odd");

// enhanced for-each
int[] nums = {1, 2, 3};
for (int x : nums) System.out.print(x + " ");

// switch (classic)
switch (n) {
    case 1:  System.out.println("one"); break;
    default: System.out.println("many");
}

// ternary
String parity = (n % 2 == 0) ? "even" : "odd";` },
        { type: 'keyterms', terms: [
          { term: '== vs = ', def: '== compares; = assigns. A frequent typo.' },
          { term: '&&  ||  (short-circuit)', def: 'Stop evaluating as soon as the result is known — the right side may never run.' },
          { term: 'break / continue', def: 'Exit a loop entirely / skip to the next iteration.' },
        ] },
      ],
    },
    {
      id: 'java-m1-l3',
      title: 'Strings: immutability & the pool',
      minutes: 6,
      blocks: [
        { type: 'p', text: '`String` is the single most-asked Java basics topic. The key fact: **Strings are immutable** — every "modification" creates a new String object.' },
        { type: 'callout', variant: 'key', text: 'Why immutable? Security (safe to share, e.g. as map keys & in class loading), thread-safety (no locking needed), and the String pool (reuse identical literals). hashCode can be cached too.' },
        { type: 'keyterms', terms: [
          { term: 'String pool', def: 'A special heap area where String *literals* are interned & reused. `"hi" == "hi"` is true (same pooled object); `new String("hi")` forces a new object, so == is false.' },
          { term: 'String vs StringBuilder', def: 'Concatenating Strings in a loop creates many throwaway objects (O(n²)). Use StringBuilder for repeated modification — it’s mutable and O(n).' },
          { term: 'StringBuilder vs StringBuffer', def: 'Same API; StringBuffer is synchronized (thread-safe, slower), StringBuilder is not (faster, single-threaded). Prefer StringBuilder unless you truly share across threads.' },
        ] },
        { type: 'code', caption: 'The classic comparison gotcha', code: `String a = "java";
String b = "java";
String c = new String("java");

System.out.println(a == b);        // true  (same pooled literal)
System.out.println(a == c);        // false (c is a new object)
System.out.println(a.equals(c));   // true  (same contents)` },
        { type: 'p', text: 'Run it and prove it to yourself — load the "Hello, Java" example and paste these lines, or just experiment:' },
        { type: 'widget', widget: 'java-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m1-q1', type: 'single', prompt: 'How many primitive types does Java have?', options: ['6', '8', '10', '4'], correct: [1], explanation: 'byte, short, int, long, float, double, char, boolean — 8 primitives.' },
    { id: 'java-m1-q2', type: 'single', prompt: 'For two String objects with equal contents, `==` returns…', options: ['Always true', 'True only if they’re the same object/reference', 'Always false', 'A compile error'], correct: [1], explanation: '== compares references. Use .equals() to compare contents.' },
    { id: 'java-m1-q3', type: 'single', prompt: 'Why are Java Strings immutable?', options: ['To save memory only', 'For security, thread-safety, and pooling/caching', 'Because of a language bug', 'They are not immutable'], correct: [1], explanation: 'Immutability enables safe sharing, thread-safety, the String pool, and cached hashCodes.' },
    { id: 'java-m1-q4', type: 'single', prompt: 'To build a long string in a loop efficiently, use…', options: ['String += in the loop', 'StringBuilder', 'char[] only', 'StringBuffer always'], correct: [1], explanation: 'StringBuilder is mutable and avoids the O(n²) garbage of repeated String concatenation.' },
    { id: 'java-m1-q5', type: 'single', prompt: 'The difference between StringBuilder and StringBuffer is…', options: ['StringBuffer is faster', 'StringBuffer is synchronized (thread-safe); StringBuilder is not', 'They have different APIs', 'StringBuilder is immutable'], correct: [1], explanation: 'StringBuffer is synchronized (thread-safe, slower); StringBuilder is the faster single-threaded choice.' },
    { id: 'java-m1-q6', type: 'single', prompt: 'Autoboxing refers to…', options: ['Wrapping code in try/catch', 'Automatic conversion between a primitive and its wrapper object', 'Boxing UI components', 'Casting between number types'], correct: [1], explanation: 'Autoboxing auto-converts e.g. int ↔ Integer.' },
  ],
  resources: [
    { label: 'Baeldung — Java String Pool', url: 'https://www.baeldung.com/java-string-pool', kind: 'article', free: true },
  ],
};
