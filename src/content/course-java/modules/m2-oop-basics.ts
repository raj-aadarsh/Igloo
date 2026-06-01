import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'java-m2',
  slug: 'oop-classes-objects',
  order: 2,
  title: 'OOP I — Classes & Objects',
  subtitle: 'Encapsulation, constructors, static & final',
  icon: 'boxes',
  lessons: [
    {
      id: 'java-m2-l1',
      title: 'Classes, objects & constructors',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Java is object-oriented to its core. A **class** is a blueprint describing state (**fields**) and behaviour (**methods**); an **object** is a concrete instance created with `new`.' },
        { type: 'code', code: `class Dog {
    String name;            // field (instance state)

    Dog(String name) {      // constructor — runs at "new"
        this.name = name;   // 'this' = the object being built
    }

    void bark() {           // method (behaviour)
        System.out.println(name + " says Woof!");
    }
}

Dog d = new Dog("Rex");     // object creation
d.bark();                   // -> Rex says Woof!` },
        { type: 'keyterms', terms: [
          { term: 'Constructor', def: 'A special method (same name as the class, no return type) that initialises a new object. If you write none, Java gives a default no-arg one.' },
          { term: 'this', def: 'A reference to the current object; disambiguates fields from parameters and lets one constructor call another (this(...)).' },
          { term: 'Constructor overloading', def: 'Multiple constructors with different parameter lists — pick how an object can be built.' },
        ] },
      ],
    },
    {
      id: 'java-m2-l2',
      title: 'Encapsulation & access modifiers',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**Encapsulation** = keep fields private and expose controlled methods. The object protects its own invariants. This is the first pillar of OOP — explore all four here:' },
        { type: 'widget', widget: 'oop-pillars' },
        { type: 'keyterms', title: 'Access modifiers (least → most restrictive)', terms: [
          { term: 'public', def: 'Accessible from anywhere.' },
          { term: 'protected', def: 'Accessible within the same package AND by subclasses.' },
          { term: 'default (no keyword)', def: 'Package-private — accessible only within the same package.' },
          { term: 'private', def: 'Accessible only within the same class. The default home of fields.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Rule of thumb: make fields private, methods as restrictive as possible, and widen access only when there’s a real need. This is "information hiding".' },
      ],
    },
    {
      id: 'java-m2-l3',
      title: 'static vs instance, and final',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'instance member', def: 'Belongs to each object; every object gets its own copy. Accessed via a reference.' },
          { term: 'static member', def: 'Belongs to the class itself — one shared copy for all objects. Accessed via the class name (e.g. Math.PI). main is static so the JVM can call it without an object.' },
          { term: 'static block', def: 'Runs once when the class is first loaded — used for one-time setup.' },
        ] },
        { type: 'code', caption: 'A shared counter via static', code: `class Counter {
    static int total = 0;   // shared across all objects
    int id;                 // unique per object
    Counter() { id = ++total; }
}
new Counter(); new Counter();
System.out.println(Counter.total);  // 2` },
        { type: 'keyterms', title: 'final — three meanings', terms: [
          { term: 'final variable', def: 'A constant — can be assigned once and never reassigned.' },
          { term: 'final method', def: 'Cannot be overridden by a subclass.' },
          { term: 'final class', def: 'Cannot be extended (e.g. String is final).' },
        ] },
        { type: 'p', text: 'Try the "Classes & objects" example in the playground and add a static field or a second constructor:' },
        { type: 'widget', widget: 'java-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'java-m2-q1', type: 'single', prompt: 'A constructor…', options: ['Returns a value', 'Has the same name as the class and initialises new objects', 'Must be static', 'Is optional and never generated'], correct: [1], explanation: 'Constructors share the class name, have no return type, and initialise objects; Java supplies a default if you write none.' },
    { id: 'java-m2-q2', type: 'single', prompt: 'A static member belongs to…', options: ['Each object separately', 'The class itself (one shared copy)', 'The JVM', 'The package'], correct: [1], explanation: 'static members are shared at the class level, not per-object.' },
    { id: 'java-m2-q3', type: 'single', prompt: 'Which modifier makes a member accessible only within its own class?', options: ['public', 'protected', 'default', 'private'], correct: [3], explanation: 'private restricts access to the declaring class — the basis of encapsulation.' },
    { id: 'java-m2-q4', type: 'single', prompt: 'A `final` method…', options: ['Cannot be overridden', 'Cannot be called', 'Must be static', 'Runs last'], correct: [0], explanation: 'final on a method prevents subclasses from overriding it.' },
    { id: 'java-m2-q5', type: 'single', prompt: 'Encapsulation is best described as…', options: ['Inheriting from a parent', 'Hiding internal state behind controlled access', 'Many forms of one method', 'Running on any OS'], correct: [1], explanation: 'Encapsulation bundles data with methods and hides internals (private fields + accessors).' },
    { id: 'java-m2-q6', type: 'single', prompt: 'What does `this` refer to?', options: ['The class', 'The current object instance', 'The superclass', 'A static field'], correct: [1], explanation: 'this is a reference to the current object.' },
  ],
  resources: [
    { label: 'Oracle — Classes and Objects', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/', kind: 'docs', free: true },
  ],
};
