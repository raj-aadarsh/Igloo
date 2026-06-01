import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'lld-m4',
  slug: 'creational-patterns',
  order: 4,
  title: 'Creational Patterns',
  subtitle: 'Singleton, Factory, Builder & friends',
  icon: 'boxes',
  lessons: [
    {
      id: 'lld-m4-l1',
      title: 'What design patterns are',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**Design patterns** are battle-tested, reusable solutions to recurring design problems — a shared vocabulary cataloged by the "Gang of Four" (GoF). Knowing them lets you say "use a Strategy here" and instantly communicate a whole design.' },
        { type: 'keyterms', title: 'The three GoF families', terms: [
          { term: 'Creational', def: 'How objects are created (Singleton, Factory, Builder, Prototype, Abstract Factory).' },
          { term: 'Structural', def: 'How objects are composed (Adapter, Decorator, Facade, Composite, Proxy, Bridge, Flyweight).' },
          { term: 'Behavioral', def: 'How objects interact & share responsibility (Strategy, Observer, State, Command, …).' },
        ] },
        { type: 'p', text: 'Browse the full catalog — tap any card for its intent, when to use it, and a real example. You’ll meet the key ones in depth across the next three modules:' },
        { type: 'widget', widget: 'pattern-gallery' },
        { type: 'callout', variant: 'warning', text: 'Patterns are tools, not trophies. Reaching for one when a plain class would do is over-engineering. Use a pattern when it removes real pain (duplication, rigidity, tangled creation logic).' },
      ],
    },
    {
      id: 'lld-m4-l2',
      title: 'Singleton & Factory',
      minutes: 7,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Singleton', def: 'One instance, globally accessible. Private constructor + static accessor. Use the static-holder idiom (or an enum) for lazy, thread-safe init.' },
          { term: 'Factory Method', def: 'Encapsulate object creation behind a method, so callers depend on an interface — not concrete classes (supports OCP & DIP).' },
          { term: 'Abstract Factory', def: 'A factory of factories — creates whole *families* of related products that must match (e.g. all-Windows or all-Mac widgets).' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Singleton is the most over-used (and interview-debated) pattern: it’s essentially global state, which hurts testability and hides dependencies. Prefer dependency injection of a single instance where you can. Also beware thread-safety — double-checked locking needs `volatile`; the holder idiom avoids the issue.' },
        { type: 'p', text: 'Run real implementations — pick "Singleton" and "Factory Method" and tweak them:' },
        { type: 'widget', widget: 'lld-playground' },
      ],
    },
    {
      id: 'lld-m4-l3',
      title: 'Builder & Prototype',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Builder', def: 'Construct a complex object step-by-step with a fluent API. Kills the "telescoping constructor" anti-pattern (constructors with 8 params) and pairs perfectly with immutability.' },
          { term: 'Prototype', def: 'Create new objects by cloning an existing prototype — handy when construction is expensive or you want a configured template.' },
        ] },
        { type: 'code', caption: 'Telescoping constructors vs Builder', code: `// ❌ which boolean is which?
new Pizza(12, true, false, true, false, true);

// ✅ self-documenting, optional params, immutable result
Pizza p = new Pizza.Builder(12)
        .cheese().mushrooms()
        .build();` },
        { type: 'callout', variant: 'key', text: 'Builder is a machine-coding favourite — designing a Pizza/Burger/HttpRequest builder shows you understand immutability + fluent APIs. Try the "Builder" example in the playground above.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m4-q1', type: 'single', prompt: 'Design patterns are…', options: ['Language features', 'Reusable solutions to recurring design problems', 'Algorithms', 'Libraries you import'], correct: [1], explanation: 'They’re proven, named solutions to common design problems — a shared vocabulary.' },
    { id: 'lld-m4-q2', type: 'single', prompt: 'Which family does Builder belong to?', options: ['Creational', 'Structural', 'Behavioral', 'Concurrency'], correct: [0], explanation: 'Builder is a creational pattern (it’s about constructing objects).' },
    { id: 'lld-m4-q3', type: 'single', prompt: 'The main job of a Factory Method is to…', options: ['Ensure one instance', 'Hide which concrete class is instantiated behind an interface', 'Clone objects', 'Add behaviour dynamically'], correct: [1], explanation: 'It encapsulates creation so callers depend on abstractions, not concretes.' },
    { id: 'lld-m4-q4', type: 'single', prompt: 'A common criticism of the Singleton is that it…', options: ['Is too fast', 'Introduces global state that hurts testability', 'Can’t be thread-safe', 'Needs an interface'], correct: [1], explanation: 'It’s effectively global state — hard to test and it hides dependencies.' },
    { id: 'lld-m4-q5', type: 'single', prompt: 'Builder mainly solves the problem of…', options: ['Single instance', 'Telescoping constructors / many optional parameters', 'Incompatible interfaces', 'Notifying observers'], correct: [1], explanation: 'Builder gives a readable, fluent way to construct objects with many optional fields.' },
    { id: 'lld-m4-q6', type: 'single', prompt: 'Abstract Factory is best when you must…', options: ['Clone a prototype', 'Create families of related objects that must be consistent', 'Add one instance', 'Wrap a legacy API'], correct: [1], explanation: 'It produces matching families of products (e.g. a whole themed UI kit).' },
  ],
  resources: [
    { label: 'Refactoring.Guru — Creational patterns', url: 'https://refactoring.guru/design-patterns/creational-patterns', kind: 'article', free: true },
  ],
};
