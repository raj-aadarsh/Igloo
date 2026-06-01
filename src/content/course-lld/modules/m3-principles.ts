import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'lld-m3',
  slug: 'principles-and-smells',
  order: 3,
  title: 'Core Principles & Code Smells',
  subtitle: 'DRY, KISS, YAGNI & composition',
  icon: 'shapes',
  lessons: [
    {
      id: 'lld-m3-l1',
      title: 'DRY, KISS & YAGNI',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'DRY — Don’t Repeat Yourself', def: 'Every piece of knowledge has a single source of truth. Duplicated logic = bugs that must be fixed in N places. Extract a method/class instead.' },
          { term: 'KISS — Keep It Simple', def: 'The simplest design that works wins. Clever, “impressive” code is a liability — favour the obvious solution.' },
          { term: 'YAGNI — You Aren’t Gonna Need It', def: 'Don’t build for imagined future requirements. Add flexibility when a real need appears, not before.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'DRY can be over-applied: forcing two things that merely *look* similar into one abstraction couples them. Prefer a little duplication over the wrong abstraction — "duplication is cheaper than the wrong abstraction" (Sandi Metz).' },
        { type: 'callout', variant: 'tip', text: 'KISS + YAGNI are the antidote to over-engineering — the exact failure mode that sinks LLD interviews. Solve the problem in front of you, cleanly.' },
      ],
    },
    {
      id: 'lld-m3-l2',
      title: 'Composition over inheritance',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The single most important design instinct in LLD: **favour composition (has-a) over inheritance (is-a)**. Inheritance is rigid — it locks behaviour at compile time and leads to fragile, deep hierarchies and the "class explosion" problem.' },
        { type: 'code', caption: 'Inheritance explodes; composition flexes', code: `// ❌ Inheritance: a class per combination → explosion
class Coffee {}
class CoffeeWithMilk extends Coffee {}
class CoffeeWithMilkAndSugar extends CoffeeWithMilk {}
class CoffeeWithSugar extends Coffee {}   // ...and on, and on

// ✅ Composition: mix behaviours at runtime
class Coffee {
    private List<AddOn> addOns = new ArrayList<>();
    void add(AddOn a) { addOns.add(a); }   // milk, sugar, ... any combo
    double cost() { /* base + sum of add-ons */ }
}` },
        { type: 'callout', variant: 'key', text: 'Why composition wins: behaviour can change at runtime, you avoid deep brittle hierarchies, and you sidestep the diamond problem. This idea powers the Strategy and Decorator patterns you’ll meet next.' },
        { type: 'keyterms', terms: [
          { term: 'Use inheritance when', def: 'There is a true, stable "is-a" and the subclass fully honours the base contract (Liskov).' },
          { term: 'Use composition when', def: 'You want to reuse behaviour, mix capabilities, or expect them to vary — i.e. most of the time.' },
        ] },
      ],
    },
    {
      id: 'lld-m3-l3',
      title: 'Smelling bad design',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**Code smells** are surface symptoms of deeper design problems. Spotting them — and naming the fix — is exactly what an LLD interviewer wants to hear.' },
        { type: 'keyterms', title: 'The smells you’ll cite most', terms: [
          { term: 'God Class / Blob', def: 'One class that does everything. Fix: split by responsibility (SRP).' },
          { term: 'Long method', def: 'A method doing too much. Fix: extract smaller, well-named methods.' },
          { term: 'Feature envy', def: 'A method more interested in another class’s data than its own. Fix: move the method to that class.' },
          { term: 'Shotgun surgery', def: 'One change forces edits in many classes (high coupling). Fix: consolidate the responsibility.' },
          { term: 'Switch on type / instanceof chains', def: 'Begging for polymorphism. Fix: interface + implementations (OCP).' },
          { term: 'Primitive obsession', def: 'Passing around bare strings/ints instead of meaningful types. Fix: introduce value objects (e.g. Money, Email).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Refactoring is behaviour-preserving restructuring. In interviews, narrate it: "This is a God class — I’d apply SRP and split it into X, Y, Z." Naming the smell *and* the principle that fixes it is a power move.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m3-q1', type: 'single', prompt: 'DRY stands for…', options: ['Do Repeat Yourself', 'Don’t Repeat Yourself', 'Don’t Refactor Yet', 'Deploy, Run, Yield'], correct: [1], explanation: 'Don’t Repeat Yourself — one source of truth for each piece of knowledge.' },
    { id: 'lld-m3-q2', type: 'single', prompt: 'YAGNI advises you to…', options: ['Add flexibility early for the future', 'Not build features until they’re actually needed', 'Always use inheritance', 'Repeat code for safety'], correct: [1], explanation: 'You Aren’t Gonna Need It — avoid speculative complexity.' },
    { id: 'lld-m3-q3', type: 'single', prompt: 'A "class explosion" from one subclass per feature-combination is best solved with…', options: ['Deeper inheritance', 'Composition', 'More switch statements', 'Static methods'], correct: [1], explanation: 'Composition mixes behaviours at runtime, avoiding the combinatorial subclass explosion.' },
    { id: 'lld-m3-q4', type: 'single', prompt: 'Favour composition over inheritance mainly because…', options: ['It runs faster', 'It’s more flexible and avoids brittle deep hierarchies', 'Inheritance is deprecated', 'It uses less memory'], correct: [1], explanation: 'Composition allows runtime flexibility and avoids fragile hierarchies and the diamond problem.' },
    { id: 'lld-m3-q5', type: 'single', prompt: 'A "God class" smell is fixed by applying…', options: ['Open/Closed', 'Single Responsibility (split it)', 'Liskov', 'DRY'], correct: [1], explanation: 'A class doing everything should be split along responsibilities (SRP).' },
    { id: 'lld-m3-q6', type: 'single', prompt: 'A long chain of instanceof / switch-on-type is a smell that calls for…', options: ['More comments', 'Polymorphism (interface + implementations)', 'A bigger method', 'Caching'], correct: [1], explanation: 'Replace type-based conditionals with polymorphism (OCP).' },
  ],
  resources: [
    { label: 'Refactoring.Guru — Code Smells', url: 'https://refactoring.guru/refactoring/smells', kind: 'article', free: true },
    { label: 'Martin Fowler — Refactoring', url: 'https://refactoring.com/', kind: 'docs', free: true },
  ],
};
