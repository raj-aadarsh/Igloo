import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'java-m3',
  slug: 'oop-inheritance-polymorphism',
  order: 3,
  title: 'OOP II — Inheritance & Polymorphism',
  subtitle: 'extends, overriding, abstraction & interfaces',
  icon: 'shapes',
  lessons: [
    {
      id: 'java-m3-l1',
      title: 'Inheritance & super',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Inheritance** lets a subclass reuse and extend a superclass via `extends`. Use it only for genuine **is-a** relationships (a Car is-a Vehicle). For "has-a", prefer **composition**.' },
        { type: 'code', code: `class Vehicle {
    int speed;
    void start() { System.out.println("Starting"); }
}
class Car extends Vehicle {     // Car IS-A Vehicle
    void start() {
        super.start();          // call the parent version
        System.out.println("Car ready");
    }
}` },
        { type: 'keyterms', terms: [
          { term: 'super', def: 'Refers to the parent: super() calls the parent constructor (must be the first statement); super.method() calls the parent’s version.' },
          { term: 'Single inheritance (classes)', def: 'A Java class can extend only ONE class (no multiple inheritance of classes — avoids the "diamond problem"). It can implement many interfaces, though.' },
          { term: 'Composition over inheritance', def: 'Often it’s better to hold a reference to another object (has-a) than to subclass it. More flexible, less tight coupling.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Java has no multiple inheritance of classes. You get multiple-inheritance-of-type via interfaces (a class can implement many).' },
      ],
    },
    {
      id: 'java-m3-l2',
      title: 'Polymorphism: overriding vs overloading',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Polymorphism** — "many forms" — is the pillar interviewers probe most. Two flavours, often confused:' },
        { type: 'keyterms', terms: [
          { term: 'Overriding (runtime / dynamic)', def: 'A subclass redefines a parent method with the SAME signature. The version called depends on the actual object at runtime (dynamic dispatch). Use @Override.' },
          { term: 'Overloading (compile-time / static)', def: 'Multiple methods with the SAME name but DIFFERENT parameter lists. The compiler picks which one based on arguments.' },
        ] },
        { type: 'code', caption: 'Dynamic dispatch in action', code: `class Animal { String sound() { return "..."; } }
class Cat extends Animal { @Override String sound() { return "Meow"; } }

Animal a = new Cat();   // parent reference, child object
a.sound();              // "Meow" — decided at RUNTIME` },
        { type: 'widget', widget: 'oop-pillars' },
        { type: 'callout', variant: 'key', text: 'Rules of overriding: same name + parameters + compatible return type; access can’t be more restrictive; can’t override static, final, or private methods. Overloading only needs a different parameter list (return type alone is NOT enough).' },
      ],
    },
    {
      id: 'java-m3-l3',
      title: 'Abstraction: abstract classes vs interfaces',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Abstraction** exposes *what* an object does and hides *how*. Java gives you two tools — knowing when to use which is a classic question.' },
        { type: 'keyterms', terms: [
          { term: 'abstract class', def: 'May have both abstract (unimplemented) and concrete methods, plus fields/state and constructors. A class extends ONE. Use when types share state/behaviour ("is-a" with common code).' },
          { term: 'interface', def: 'A pure contract (since Java 8, may have default & static methods). No instance state. A class implements MANY. Use to declare a capability ("can-do", e.g. Comparable, Runnable).' },
          { term: 'default methods', def: 'Java 8+ interfaces can provide method bodies via `default`, letting interfaces evolve without breaking implementers.' },
        ] },
        { type: 'code', code: `interface Payment {              // capability / contract
    void pay(double amount);
    default void receipt() { System.out.println("Thanks!"); }
}
abstract class Account {         // shared state + partial impl
    protected double balance;
    abstract void withdraw(double a);   // each subclass defines
    double getBalance() { return balance; }
}` },
        { type: 'callout', variant: 'tip', text: 'Pick interface for "can-do" capabilities and multiple inheritance of type; pick abstract class when subclasses share state and common code. Modern Java often favours interfaces + composition.' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m3-q1', type: 'single', prompt: 'How many classes can a Java class directly extend?', options: ['Unlimited', 'Exactly one', 'Up to two', 'Zero'], correct: [1], explanation: 'Java supports single inheritance of classes (but a class may implement many interfaces).' },
    { id: 'java-m3-q2', type: 'single', prompt: 'Overriding is resolved…', options: ['At compile time', 'At runtime (dynamic dispatch)', 'By the linker', 'Never'], correct: [1], explanation: 'The overridden method is chosen at runtime based on the actual object type.' },
    { id: 'java-m3-q3', type: 'single', prompt: 'Two methods with the same name but different parameter lists is…', options: ['Overriding', 'Overloading', 'Shadowing', 'Hiding'], correct: [1], explanation: 'Overloading = same name, different parameters, resolved at compile time.' },
    { id: 'java-m3-q4', type: 'single', prompt: 'Can return type alone distinguish two overloaded methods?', options: ['Yes', 'No — the parameter list must differ', 'Only for static methods', 'Only with generics'], correct: [1], explanation: 'Overloads must differ in parameters; differing return type alone is a compile error.' },
    { id: 'java-m3-q5', type: 'single', prompt: 'A key difference between an interface and an abstract class is…', options: ['Interfaces can have constructors', 'A class can implement many interfaces but extend only one (abstract) class', 'Abstract classes can’t have methods', 'Interfaces hold instance state'], correct: [1], explanation: 'Multiple interfaces vs single class inheritance; abstract classes can hold state, interfaces can’t (no instance fields).' },
    { id: 'java-m3-q6', type: 'single', prompt: 'Which CANNOT be overridden?', options: ['public instance methods', 'protected methods', 'final and static methods', 'abstract methods'], correct: [2], explanation: 'final methods can’t be overridden; static methods are hidden, not overridden.' },
  ],
  resources: [
    { label: 'Oracle — Inheritance', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html', kind: 'docs', free: true },
    { label: 'Baeldung — Abstract Class vs Interface', url: 'https://www.baeldung.com/java-interface-vs-abstract-class', kind: 'article', free: true },
  ],
};
