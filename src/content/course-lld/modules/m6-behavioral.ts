import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'lld-m6',
  slug: 'behavioral-patterns',
  order: 6,
  title: 'Behavioral Patterns',
  subtitle: 'Strategy, Observer, State & more',
  icon: 'workflow',
  lessons: [
    {
      id: 'lld-m6-l1',
      title: 'Strategy — swappable algorithms',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Behavioral patterns** govern how objects communicate and divide responsibility. **Strategy** is the workhorse: encapsulate a family of interchangeable algorithms behind one interface and swap them at runtime.' },
        { type: 'widget', widget: 'strategy-demo' },
        { type: 'callout', variant: 'key', text: 'Strategy is the OCP poster child: add a new behaviour (sort order, payment method, compression) by writing a new strategy class — the context never changes. Whenever you see a switch choosing *how* to do something, think Strategy.' },
        { type: 'widget', widget: 'lld-playground' },
      ],
    },
    {
      id: 'lld-m6-l2',
      title: 'Observer — publish & subscribe',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Observer** defines a one-to-many dependency: when the *subject* changes, all registered *observers* are notified automatically. It powers event systems, UI data-binding, and pub/sub.' },
        { type: 'widget', widget: 'observer-demo' },
        { type: 'keyterms', terms: [
          { term: 'Subject', def: 'Holds state and a list of observers; exposes subscribe/unsubscribe/notify.' },
          { term: 'Observer', def: 'Implements update(); reacts to changes. It never has to be known concretely by the subject — total decoupling.' },
          { term: 'Push vs pull', def: 'Push: subject sends the data in update(data). Pull: subject just says "I changed" and observers query what they need.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Real examples to name: Java’s listener interfaces, RxJava/Reactive streams, Kafka consumers, React state → re-render. All Observer at heart.' },
      ],
    },
    {
      id: 'lld-m6-l3',
      title: 'State — behaviour that changes with state',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**State** lets an object alter its behaviour when its internal state changes — it "appears to change its class." Each state becomes its own class handling the events its way, replacing a tangle of `if/else` on a status flag.' },
        { type: 'widget', widget: 'state-demo' },
        { type: 'callout', variant: 'key', text: 'State vs Strategy — they look identical (both delegate to a swappable object) but differ in intent: Strategy is chosen by the *client* to pick an algorithm; State is changed by the *object itself* as it transitions, and states often decide the next state.' },
        { type: 'callout', variant: 'tip', text: 'Reach for State when you’d otherwise write a giant switch on a "status" field (order lifecycle, vending machine, media player, TCP connection).' },
      ],
    },
    {
      id: 'lld-m6-l4',
      title: 'Command, Template Method, Chain & the rest',
      minutes: 7,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Command', def: 'Wrap a request as an object (with execute()/undo()). Enables queues, logging, macros, and undo/redo. Think: every button is a Command.' },
          { term: 'Template Method', def: 'A base class defines an algorithm’s skeleton and calls overridable steps (hooks). Subclasses fill in the variable parts without changing the order.' },
          { term: 'Chain of Responsibility', def: 'Pass a request along a chain of handlers until one handles it. Powers middleware, servlet filters, and approval/escalation flows.' },
          { term: 'Iterator', def: 'Traverse a collection without exposing its internals — Java’s Iterator/for-each.' },
        ] },
        { type: 'keyterms', title: 'Good to recognise', terms: [
          { term: 'Mediator', def: 'A hub that centralises many-to-many communication (a chat room, air-traffic control) so objects don’t reference each other directly.' },
          { term: 'Memento', def: 'Capture and restore an object’s state without violating encapsulation — undo/checkpoints.' },
          { term: 'Visitor', def: 'Add new operations to a stable class hierarchy without modifying it (e.g. operations over AST nodes).' },
        ] },
        { type: 'callout', variant: 'key', text: 'Pattern → problem cheat: undo/redo → Command (+ Memento for snapshots); fixed steps, varying details → Template Method; "try handlers in order" → Chain of Responsibility; tangled object-to-object chatter → Mediator.' },
      ],
    },
  ],
  quiz: [
    { id: 'lld-m6-q1', type: 'single', prompt: 'When you see a switch choosing *how* to perform a task (sort, pay), reach for…', options: ['Singleton', 'Strategy', 'Composite', 'Proxy'], correct: [1], explanation: 'Strategy encapsulates interchangeable algorithms behind one interface.' },
    { id: 'lld-m6-q2', type: 'single', prompt: 'Observer defines a relationship that is…', options: ['One-to-one', 'One-to-many (subject → observers)', 'Many-to-many only', 'None'], correct: [1], explanation: 'One subject notifies many observers automatically when it changes.' },
    { id: 'lld-m6-q3', type: 'single', prompt: 'The key difference between State and Strategy is…', options: ['They are identical', 'Intent: Strategy is client-chosen algorithm; State is the object transitioning itself', 'State is creational', 'Strategy uses inheritance only'], correct: [1], explanation: 'Same structure, different intent — Strategy = pick an algorithm; State = behaviour tied to (self-)transitions.' },
    { id: 'lld-m6-q4', type: 'single', prompt: 'Which pattern best supports undo/redo?', options: ['Command', 'Facade', 'Adapter', 'Flyweight'], correct: [0], explanation: 'Command objects encapsulate actions with execute/undo — ideal for undo stacks & queues.' },
    { id: 'lld-m6-q5', type: 'single', prompt: 'A base class defining an algorithm skeleton with overridable steps is…', options: ['Chain of Responsibility', 'Template Method', 'Mediator', 'Iterator'], correct: [1], explanation: 'Template Method fixes the sequence and lets subclasses fill in steps.' },
    { id: 'lld-m6-q6', type: 'single', prompt: 'Middleware / servlet filters that pass a request along handlers is…', options: ['Chain of Responsibility', 'Observer', 'State', 'Builder'], correct: [0], explanation: 'Chain of Responsibility passes a request along until a handler processes it.' },
    { id: 'lld-m6-q7', type: 'single', prompt: 'A chat room hub coordinating users so they don’t reference each other is…', options: ['Mediator', 'Memento', 'Visitor', 'Proxy'], correct: [0], explanation: 'Mediator centralises many-to-many communication.' },
  ],
  resources: [
    { label: 'Refactoring.Guru — Behavioral patterns', url: 'https://refactoring.guru/design-patterns/behavioral-patterns', kind: 'article', free: true },
  ],
};
