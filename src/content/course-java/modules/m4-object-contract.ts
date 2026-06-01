import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'java-m4',
  slug: 'object-contract',
  order: 4,
  title: 'The Object Contract & Friends',
  subtitle: 'equals/hashCode, ==, enums, immutability',
  icon: 'boxes',
  lessons: [
    {
      id: 'java-m4-l1',
      title: 'Every class extends Object',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Every Java class implicitly extends `java.lang.Object`, inheriting a handful of methods you’ll override constantly: `equals()`, `hashCode()`, `toString()`, `getClass()`.' },
        { type: 'keyterms', terms: [
          { term: '== vs equals()', def: '== compares references (are these the same object?). equals() compares logical value — but the default Object.equals() also just checks ==, so you must override it for value equality.' },
          { term: 'toString()', def: 'Human-readable form; override it so logging/printing is useful. Default is ClassName@hexHash.' },
        ] },
        { type: 'code', caption: 'Reference vs value equality', code: `String a = new String("hi");
String b = new String("hi");
System.out.println(a == b);       // false (different objects)
System.out.println(a.equals(b));  // true  (same value)` },
      ],
    },
    {
      id: 'java-m4-l2',
      title: 'The equals & hashCode contract',
      minutes: 6,
      blocks: [
        { type: 'callout', variant: 'key', text: 'THE contract: if a.equals(b) is true, then a.hashCode() == b.hashCode() MUST be true. Override one → override the other. Break this and HashMap/HashSet silently misbehave.' },
        { type: 'p', text: 'Why it matters: hash-based collections first find the bucket by `hashCode()`, then confirm with `equals()`. If equal objects have different hash codes, they land in different buckets and the map can’t find them.' },
        { type: 'code', caption: 'A correct pair', code: `class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }
    @Override public int hashCode() {
        return java.util.Objects.hash(x, y);
    }
}` },
        { type: 'keyterms', title: 'equals() must be', terms: [
          { term: 'Reflexive / Symmetric / Transitive', def: 'a=a; a=b ⇒ b=a; a=b & b=c ⇒ a=c.' },
          { term: 'Consistent', def: 'Repeated calls give the same result if objects don’t change.' },
          { term: 'Non-null', def: 'a.equals(null) is always false.' },
        ] },
      ],
    },
    {
      id: 'java-m4-l3',
      title: 'Immutability, enums & records',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Immutable class', def: 'State can’t change after construction. Recipe: make the class final, all fields private final, no setters, and defensively copy mutable inputs/outputs. (String is the canonical example.) Immutable objects are automatically thread-safe.' },
          { term: 'enum', def: 'A fixed set of named constants that are real objects — they can have fields, constructors and methods. Type-safe alternative to int/string constants.' },
          { term: 'record (Java 16+)', def: 'A concise immutable data carrier: `record Point(int x, int y) {}` auto-generates the constructor, getters, equals, hashCode and toString.' },
          { term: 'Comparable vs Comparator', def: 'Comparable<T>.compareTo defines a type’s natural order (one, internal). Comparator<T>.compare defines an external, swappable order (many) — great for sorting by different keys.' },
        ] },
        { type: 'code', caption: 'enum with behaviour', code: `enum Day {
    MON, TUE, WED, THU, FRI, SAT, SUN;
    boolean isWeekend() { return this == SAT || this == SUN; }
}
System.out.println(Day.SAT.isWeekend());  // true` },
        { type: 'p', text: 'Experiment with equals/hashCode, enums or records in the playground:' },
        { type: 'widget', widget: 'java-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m4-q1', type: 'single', prompt: 'If you override equals(), you must also override…', options: ['toString()', 'hashCode()', 'getClass()', 'clone()'], correct: [1], explanation: 'The equals/hashCode contract: equal objects must have equal hash codes.' },
    { id: 'java-m4-q2', type: 'single', prompt: 'What does == compare for objects?', options: ['Their contents', 'Their references (identity)', 'Their hashCodes', 'Their toString()'], correct: [1], explanation: '== compares references; equals() compares value (once overridden).' },
    { id: 'java-m4-q3', type: 'single', prompt: 'Breaking the equals/hashCode contract most directly breaks…', options: ['Compilation', 'HashMap / HashSet lookups', 'Inheritance', 'The garbage collector'], correct: [1], explanation: 'Hash-based collections locate entries by hashCode then equals; inconsistency loses entries.' },
    { id: 'java-m4-q4', type: 'single', prompt: 'Which is part of the recipe for an immutable class?', options: ['Add setters', 'private final fields, no setters, defensive copies', 'Make all fields public', 'Override finalize()'], correct: [1], explanation: 'Final class, private final fields, no mutators, and defensive copying of mutable inputs/outputs.' },
    { id: 'java-m4-q5', type: 'single', prompt: 'Comparable vs Comparator: Comparable defines…', options: ['Multiple external orderings', 'A type’s single natural ordering (compareTo)', 'Equality', 'Hashing'], correct: [1], explanation: 'Comparable = natural order via compareTo; Comparator = external, multiple orderings via compare.' },
    { id: 'java-m4-q6', type: 'single', prompt: 'A Java `record` primarily gives you…', options: ['A mutable bean', 'A concise immutable data carrier with auto equals/hashCode/toString', 'A thread pool', 'A database row'], correct: [1], explanation: 'records auto-generate constructor, accessors, equals, hashCode and toString for immutable data.' },
  ],
  resources: [
    { label: 'Baeldung — equals() and hashCode()', url: 'https://www.baeldung.com/java-equals-hashcode-contracts', kind: 'article', free: true },
    { label: 'Oracle — Enum types', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html', kind: 'docs', free: true },
  ],
};
