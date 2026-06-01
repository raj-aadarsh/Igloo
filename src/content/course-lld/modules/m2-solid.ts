import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'lld-m2',
  slug: 'solid-principles',
  order: 2,
  title: 'SOLID Principles',
  subtitle: 'The five rules of extensible design',
  icon: 'shield',
  lessons: [
    {
      id: 'lld-m2-l1',
      title: 'The five principles, hands-on',
      minutes: 8,
      blocks: [
        { type: 'p', text: '**SOLID** is five principles (coined by Robert C. Martin) that keep object-oriented designs flexible and rot-resistant. They’re the most-asked LLD theory topic — you must be able to name each, explain it, and show a violation + fix. Explore all five below; flip between the *violation* and the *fix*:' },
        { type: 'widget', widget: 'solid-explorer' },
        { type: 'keyterms', title: 'The five, in one line each', terms: [
          { term: 'S — Single Responsibility', def: 'One class, one reason to change.' },
          { term: 'O — Open/Closed', def: 'Open to extension, closed to modification.' },
          { term: 'L — Liskov Substitution', def: 'Subtypes must be drop-in replacements for their base type.' },
          { term: 'I — Interface Segregation', def: 'Many small interfaces beat one fat one.' },
          { term: 'D — Dependency Inversion', def: 'Depend on abstractions, not concrete classes.' },
        ] },
      ],
    },
    {
      id: 'lld-m2-l2',
      title: 'Why each one matters',
      minutes: 7,
      blocks: [
        { type: 'callout', variant: 'key', text: 'SRP & OCP are about *change isolation* — keep reasons-to-change apart, and add features without editing tested code. LSP is about *correct inheritance*. ISP & DIP are about *depending on the right thing* — small contracts and abstractions.' },
        { type: 'p', text: '**Open/Closed in practice** — the if/else-on-type smell is the classic OCP violation. The fix (polymorphism) is also the single most common LLD move: replace a conditional with an interface + implementations.' },
        { type: 'code', caption: 'OCP: replace the switch with polymorphism', code: `// ❌ every new shape edits this method
double area(Shape s) {
    switch (s.type) { case CIRCLE: ...; case SQUARE: ...; }
}

// ✅ each shape owns its behaviour; new shapes just add a class
interface Shape { double area(); }
class Circle implements Shape { public double area() { return 3.14*r*r; } }
class Square implements Shape { public double area() { return side*side; } }` },
        { type: 'p', text: '**Dependency Inversion** is what makes code testable. By depending on an interface and injecting the implementation (Dependency Injection), you can swap a real database for a mock in tests, or MySQL for Postgres in production — with zero changes to the high-level class.' },
        { type: 'callout', variant: 'tip', text: 'DIP ≠ DI. Dependency Inversion is the principle (depend on abstractions). Dependency Injection is one technique to achieve it (pass dependencies in, rather than newing them up inside).' },
      ],
    },
    {
      id: 'lld-m2-l3',
      title: 'Applying SOLID without overdoing it',
      minutes: 4,
      blocks: [
        { type: 'p', text: 'SOLID is a guide, not a religion. Each principle adds indirection; apply it where change is likely, not everywhere. A tiny script doesn’t need five interfaces.' },
        { type: 'keyterms', terms: [
          { term: 'Smell → principle map', def: 'God class → SRP. if/else on type → OCP. Subclass throwing "not supported" → LSP. Fat interface with empty methods → ISP. `new Concrete()` inside a high-level class → DIP.' },
          { term: 'The payoff', def: 'When the inevitable new requirement lands, a SOLID design absorbs it by *adding* a class — not by surgery on code you were afraid to touch.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Interview gold: when asked "how would you extend this?", a SOLID-shaped answer ("I’d add a new implementation of this interface — nothing else changes") instantly signals senior-level design thinking.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m2-q1', type: 'single', prompt: 'A class that parses, validates, saves, and emails — all itself — violates…', options: ['OCP', 'SRP (Single Responsibility)', 'LSP', 'DIP'], correct: [1], explanation: 'Too many reasons to change → Single Responsibility Principle violation.' },
    { id: 'lld-m2-q2', type: 'single', prompt: 'Adding a feature by writing a new class instead of editing existing code satisfies…', options: ['Open/Closed (OCP)', 'Liskov', 'Interface Segregation', 'Single Responsibility'], correct: [0], explanation: 'OCP: open for extension (new classes), closed for modification (don’t edit tested code).' },
    { id: 'lld-m2-q3', type: 'single', prompt: 'A subclass that overrides a method to throw UnsupportedOperationException most directly breaks…', options: ['SRP', 'OCP', 'Liskov Substitution', 'DIP'], correct: [2], explanation: 'It can’t substitute for its base type → LSP violation.' },
    { id: 'lld-m2-q4', type: 'single', prompt: 'Splitting one fat interface into several focused ones is…', options: ['Interface Segregation (ISP)', 'Dependency Inversion', 'Liskov', 'Open/Closed'], correct: [0], explanation: 'ISP: clients shouldn’t depend on methods they don’t use.' },
    { id: 'lld-m2-q5', type: 'single', prompt: 'A high-level service should depend on…', options: ['A concrete MySQLDatabase class', 'An abstraction (interface) injected from outside', 'Global static state', 'Nothing'], correct: [1], explanation: 'Dependency Inversion: depend on abstractions, inject the concrete implementation.' },
    { id: 'lld-m2-q6', type: 'single', prompt: 'Dependency Injection is…', options: ['The same as Dependency Inversion', 'A technique (passing dependencies in) to achieve Dependency Inversion', 'A design pattern that creates objects', 'Unrelated to SOLID'], correct: [1], explanation: 'DI is a technique; DIP is the principle it helps satisfy.' },
    { id: 'lld-m2-q7', type: 'single', prompt: 'The biggest risk of applying SOLID is…', options: ['Code gets too fast', 'Over-engineering with needless abstraction', 'Classes get too small', 'It breaks inheritance'], correct: [1], explanation: 'Applied blindly, SOLID adds indirection you don’t need — apply where change is likely.' },
  ],
  resources: [
    { label: 'Baeldung — SOLID Principles', url: 'https://www.baeldung.com/solid-principles', kind: 'article', free: true },
    { label: 'Uncle Bob — The Principles of OOD', url: 'http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod', kind: 'article', free: true },
  ],
};
