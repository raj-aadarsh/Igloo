import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'java-m5',
  slug: 'exceptions',
  order: 5,
  title: 'Exceptions',
  subtitle: 'Checked vs unchecked, try/catch/finally',
  icon: 'shield',
  lessons: [
    {
      id: 'java-m5-l1',
      title: 'The exception hierarchy',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'When something goes wrong, Java *throws* an exception object that propagates up the call stack until caught. Everything throwable descends from `Throwable`.' },
        { type: 'keyterms', terms: [
          { term: 'Throwable', def: 'The root. Two branches: Error and Exception.' },
          { term: 'Error', def: 'Serious problems you shouldn’t catch — e.g. OutOfMemoryError, StackOverflowError. The JVM/environment failing.' },
          { term: 'Exception (checked)', def: 'Recoverable conditions the compiler FORCES you to handle or declare — e.g. IOException, SQLException.' },
          { term: 'RuntimeException (unchecked)', def: 'Programming bugs — NullPointerException, ArrayIndexOutOfBounds, IllegalArgument. Not checked by the compiler.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Checked vs unchecked — the #1 exceptions question: checked extend Exception (compiler-enforced, must catch or declare with `throws`); unchecked extend RuntimeException (not enforced). Errors are unchecked too but signal unrecoverable JVM issues.' },
      ],
    },
    {
      id: 'java-m5-l2',
      title: 'try / catch / finally & try-with-resources',
      minutes: 6,
      blocks: [
        { type: 'code', code: `try {
    int x = 10 / 0;                 // throws ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Oops: " + e.getMessage());
} finally {
    System.out.println("Always runs — cleanup goes here");
}` },
        { type: 'keyterms', terms: [
          { term: 'finally', def: 'Runs whether or not an exception was thrown (even on return) — classic place for cleanup. Skipped only on System.exit() / JVM crash.' },
          { term: 'multi-catch', def: 'catch (IOException | SQLException e) — handle several types in one block.' },
          { term: 'try-with-resources', def: 'try (var f = new FileReader(...)) { } auto-closes any AutoCloseable resource — no manual finally needed. Preferred for files, streams, connections.' },
        ] },
        { type: 'code', caption: 'try-with-resources auto-closes', code: `try (var reader = new java.io.BufferedReader(
        new java.io.FileReader("data.txt"))) {
    System.out.println(reader.readLine());
}  // reader.close() called automatically, even on exception` },
        { type: 'callout', variant: 'warning', text: 'Anti-patterns: don’t swallow exceptions with an empty catch {}, don’t catch Exception/Throwable broadly, and never use exceptions for normal control flow.' },
      ],
    },
    {
      id: 'java-m5-l3',
      title: 'throw, throws & custom exceptions',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'throw', def: 'Actually raises an exception: `throw new IllegalArgumentException("bad");`' },
          { term: 'throws', def: 'Declares that a method may propagate a checked exception: `void read() throws IOException`.' },
          { term: 'Custom exception', def: 'Extend Exception (checked) or RuntimeException (unchecked) to model your domain’s failures meaningfully.' },
        ] },
        { type: 'code', code: `class InsufficientFundsException extends RuntimeException {
    InsufficientFundsException(String msg) { super(msg); }
}
void withdraw(double amt, double balance) {
    if (amt > balance)
        throw new InsufficientFundsException("Balance too low");
}` },
        { type: 'p', text: 'Try the "Exceptions" example in the playground and trigger different exception types:' },
        { type: 'widget', widget: 'java-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m5-q1', type: 'single', prompt: 'A checked exception is one that…', options: ['Extends RuntimeException', 'The compiler forces you to catch or declare', 'Can never be caught', 'Only the JVM throws'], correct: [1], explanation: 'Checked exceptions (extends Exception, not RuntimeException) must be caught or declared with throws.' },
    { id: 'java-m5-q2', type: 'single', prompt: 'NullPointerException is…', options: ['A checked exception', 'An unchecked (runtime) exception', 'An Error', 'Not a Throwable'], correct: [1], explanation: 'NPE extends RuntimeException → unchecked.' },
    { id: 'java-m5-q3', type: 'single', prompt: 'The finally block runs…', options: ['Only if an exception is thrown', 'Only if no exception is thrown', 'Whether or not an exception is thrown (barring System.exit)', 'Never with a return'], correct: [2], explanation: 'finally runs in essentially all cases — even after a return — for cleanup.' },
    { id: 'java-m5-q4', type: 'single', prompt: 'try-with-resources is used to…', options: ['Retry failed code', 'Automatically close AutoCloseable resources', 'Catch every exception', 'Run code in parallel'], correct: [1], explanation: 'It auto-closes resources (files, streams, connections) without a manual finally.' },
    { id: 'java-m5-q5', type: 'single', prompt: 'What’s the difference between throw and throws?', options: ['Nothing', 'throw raises an exception; throws declares one a method may propagate', 'throws raises; throw declares', 'Both declare'], correct: [1], explanation: 'throw actually raises an instance; throws is a method-signature declaration.' },
    { id: 'java-m5-q6', type: 'single', prompt: 'OutOfMemoryError is an…', options: ['Checked exception', 'Error (should generally not be caught)', 'RuntimeException to catch routinely', 'Compile error'], correct: [1], explanation: 'It’s an Error — a serious JVM-level problem you normally shouldn’t try to recover from.' },
  ],
  resources: [
    { label: 'Oracle — Exceptions tutorial', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/', kind: 'docs', free: true },
  ],
};
