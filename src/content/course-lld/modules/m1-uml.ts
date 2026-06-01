import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'lld-m1',
  slug: 'uml-and-relationships',
  order: 1,
  title: 'UML & Class Relationships',
  subtitle: 'Draw what you mean',
  icon: 'workflow',
  lessons: [
    {
      id: 'lld-m1-l1',
      title: 'Reading a class diagram',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A **UML class diagram** is the lingua franca of LLD interviews. You’ll sketch one on the whiteboard before writing code. A class is a box with three compartments:' },
        { type: 'code', caption: 'The anatomy of a UML class box', code: `┌────────────────────────┐
│        Account         │   ← class name
├────────────────────────┤
│ - balance: double      │   ← fields (attributes)
│ - owner: String        │
├────────────────────────┤
│ + deposit(amt): void   │   ← methods (operations)
│ + getBalance(): double │
└────────────────────────┘` },
        { type: 'keyterms', title: 'Visibility markers', terms: [
          { term: '+ public', def: 'Visible everywhere.' },
          { term: '- private', def: 'Visible only inside the class.' },
          { term: '# protected', def: 'Visible to subclasses & package.' },
          { term: '~ package', def: 'Visible within the package (default).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'You don’t need pixel-perfect UML in an interview — you need the relationships right. Get the arrows and diamonds correct and you’ll communicate your design instantly.' },
      ],
    },
    {
      id: 'lld-m1-l2',
      title: 'The six relationships (with notation)',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'This is the heart of UML — and the detail interviewers love to probe. Tap each relationship to see its exact notation (the arrowheads and diamonds matter):' },
        { type: 'widget', widget: 'uml-relationships' },
        { type: 'callout', variant: 'key', text: 'Aggregation vs Composition is the classic trick question. Both are "has-a", but composition (filled ◆ diamond) means the part dies with the whole (a House owns its Rooms), while aggregation (hollow ◇ diamond) means the part outlives the whole (a Team has Players who exist independently).' },
        { type: 'keyterms', terms: [
          { term: 'Inheritance vs Realization', def: 'Inheritance = extends a class (solid line, hollow triangle). Realization = implements an interface (dashed line, hollow triangle).' },
          { term: 'Association vs Dependency', def: 'Association = a lasting link (a field reference). Dependency = a transient "uses" (a method parameter or local variable).' },
        ] },
      ],
    },
    {
      id: 'lld-m1-l3',
      title: 'From relationships to code',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Each UML relationship maps to a concrete Java shape. Recognising the mapping both ways — code ⇄ diagram — is the skill:' },
        { type: 'code', code: `// Inheritance / Realization
class Car extends Vehicle { }
class UpiPayment implements Payment { }

// Composition (House OWNS Rooms — created & destroyed together)
class House {
    private final List<Room> rooms = new ArrayList<>();
    House() { rooms.add(new Room()); }   // House creates its parts
}

// Aggregation (Team HAS Players — passed in, live independently)
class Team {
    private List<Player> players;
    Team(List<Player> players) { this.players = players; }
}

// Dependency (uses transiently, as a parameter)
class OrderService {
    void checkout(PaymentGateway gw) { gw.pay(); }
}` },
        { type: 'callout', variant: 'tip', text: 'Heuristic: if a class `new`s its part internally and nobody else references it → composition. If the part is handed in from outside and shared → aggregation. If it only appears as a parameter → dependency.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m1-q1', type: 'single', prompt: 'In UML, inheritance is drawn as…', options: ['A dashed line with an open arrow', 'A solid line with a hollow triangle pointing to the parent', 'A filled diamond', 'A hollow diamond'], correct: [1], explanation: 'Inheritance = solid line + hollow triangle at the superclass.' },
    { id: 'lld-m1-q2', type: 'single', prompt: 'A FILLED diamond denotes…', options: ['Aggregation', 'Composition', 'Dependency', 'Realization'], correct: [1], explanation: 'Composition (strong ownership; part dies with the whole) uses a filled diamond.' },
    { id: 'lld-m1-q3', type: 'single', prompt: 'A Team has Players who exist even if the team disbands. That is…', options: ['Composition', 'Aggregation', 'Inheritance', 'Dependency'], correct: [1], explanation: 'Independent lifetimes → aggregation (hollow diamond).' },
    { id: 'lld-m1-q4', type: 'single', prompt: 'Implementing an interface is shown as…', options: ['Solid line + hollow triangle', 'Dashed line + hollow triangle (realization)', 'Filled diamond', 'Open arrow'], correct: [1], explanation: 'Realization = dashed line with a hollow triangle to the interface.' },
    { id: 'lld-m1-q5', type: 'single', prompt: 'A class that only uses another as a method parameter has a…', options: ['Composition', 'Aggregation', 'Dependency', 'Inheritance'], correct: [2], explanation: 'A transient "uses" via a parameter is a dependency (the weakest link).' },
    { id: 'lld-m1-q6', type: 'single', prompt: 'Ordering of ownership strength, weakest → strongest, is…', options: ['Composition → Aggregation → Association → Dependency', 'Dependency → Association → Aggregation → Composition', 'Association → Dependency → Composition → Aggregation', 'They are all equal'], correct: [1], explanation: 'Dependency (weakest) → Association → Aggregation → Composition (strongest).' },
  ],
  resources: [
    { label: 'Refactoring.Guru — UML relations', url: 'https://refactoring.guru/design-patterns/catalog', kind: 'article', free: true },
    { label: 'Visual Paradigm — UML class diagram guide', url: 'https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-class-diagram-tutorial/', kind: 'docs', free: true },
  ],
};
