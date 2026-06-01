import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'java-m0',
  slug: 'how-java-runs',
  order: 0,
  title: 'How Java Runs',
  subtitle: 'JDK, JRE, JVM & bytecode',
  icon: 'coffee',
  lessons: [
    {
      id: 'java-m0-l1',
      title: 'Why Java? & "write once, run anywhere"',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Java is a **statically-typed, object-oriented, compiled-and-interpreted** language. You compile source to **bytecode**, and a **JVM** runs that bytecode on any platform. That indirection is Java’s superpower: the same compiled file runs on Windows, macOS, and Linux unchanged — **"write once, run anywhere"** (WORA).' },
        { type: 'analogy', text: 'Bytecode is like a universal travel adapter: you build one plug (the .class file) and the JVM on each country’s wall (OS) makes it fit. You don’t rebuild your charger per country.' },
        { type: 'callout', variant: 'key', text: 'Java is *compiled* (javac → bytecode) AND *interpreted/JIT-compiled* (the JVM executes bytecode). Saying "Java is purely interpreted" is a common interview mistake.' },
      ],
    },
    {
      id: 'java-m0-l2',
      title: 'The pipeline: source → bytecode → JVM',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Walk the full journey of a Java program. Click each stage:' },
        { type: 'widget', widget: 'jvm-pipeline' },
        { type: 'keyterms', title: 'The three acronyms everyone confuses', terms: [
          { term: 'JVM (Java Virtual Machine)', def: 'The engine that loads, verifies, and executes bytecode. Platform-specific — there’s a different JVM build per OS. This is what makes WORA possible.' },
          { term: 'JRE (Java Runtime Environment)', def: 'JVM + the standard class libraries. Everything needed to *run* a Java app (but not compile one).' },
          { term: 'JDK (Java Development Kit)', def: 'JRE + development tools like the `javac` compiler, `jar`, and the debugger. Everything needed to *build* Java apps.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Containment, smallest to largest: JVM ⊂ JRE ⊂ JDK. To develop you need the JDK; to merely run, the JRE is enough.' },
      ],
    },
    {
      id: 'java-m0-l3',
      title: 'Your first program',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Every runnable Java program needs a `main` method with this exact signature — the JVM looks for it as the entry point:' },
        { type: 'code', caption: 'The anatomy of main', code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}` },
        { type: 'keyterms', terms: [
          { term: 'public', def: 'Accessible from anywhere — the JVM must be able to call it.' },
          { term: 'static', def: 'Belongs to the class, not an object — so the JVM can call it without first creating an instance.' },
          { term: 'void', def: 'Returns nothing.' },
          { term: 'String[] args', def: 'Command-line arguments passed to the program.' },
        ] },
        { type: 'p', text: 'Now run real Java yourself. Edit the code, hit **Run**, and try the other examples (classes, polymorphism, collections, streams):' },
        { type: 'widget', widget: 'java-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m0-q1', type: 'single', prompt: 'What does the Java compiler (javac) produce?', options: ['Native machine code', 'Bytecode (.class files)', 'An .exe', 'Assembly'], correct: [1], explanation: 'javac compiles source to platform-independent bytecode, which the JVM then executes.' },
    { id: 'java-m0-q2', type: 'single', prompt: 'Which is the correct containment relationship?', options: ['JDK ⊂ JRE ⊂ JVM', 'JVM ⊂ JRE ⊂ JDK', 'JRE ⊂ JVM ⊂ JDK', 'They are unrelated'], correct: [1], explanation: 'JVM is inside the JRE, and the JRE is inside the JDK (which adds dev tools like javac).' },
    { id: 'java-m0-q3', type: 'single', prompt: 'What makes "write once, run anywhere" possible?', options: ['Java is interpreted only', 'Bytecode runs on a platform-specific JVM', 'Java has no compiler', 'Source is shipped to users'], correct: [1], explanation: 'The same bytecode runs on any platform because each platform has its own JVM.' },
    { id: 'java-m0-q4', type: 'single', prompt: 'To merely RUN (not compile) a Java program, you need at least…', options: ['The JDK', 'The JRE', 'Only javac', 'An IDE'], correct: [1], explanation: 'The JRE (JVM + libraries) can run programs; the JDK is only needed to compile.' },
    { id: 'java-m0-q5', type: 'single', prompt: 'Why must main be static?', options: ['So it runs faster', 'So the JVM can call it without creating an object first', 'So it can return a value', 'It’s optional'], correct: [1], explanation: 'static means it belongs to the class, so the JVM invokes it without instantiating anything.' },
  ],
  resources: [
    { label: 'Oracle — The Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/', kind: 'docs', free: true },
    { label: 'Baeldung — JDK vs JRE vs JVM', url: 'https://www.baeldung.com/jvm-vs-jre-vs-jdk', kind: 'article', free: true },
  ],
};
