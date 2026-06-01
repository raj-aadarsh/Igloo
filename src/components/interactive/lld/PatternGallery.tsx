import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

type Cat = 'Creational' | 'Structural' | 'Behavioral';

interface Pattern {
  name: string;
  cat: Cat;
  intent: string;
  useWhen: string;
  example: string;
}

const PATTERNS: Pattern[] = [
  // Creational — how objects are created
  { name: 'Singleton', cat: 'Creational', intent: 'Guarantee a single shared instance with a global access point.', useWhen: 'Exactly one object must coordinate (config, logger, connection pool).', example: 'Logger.getInstance(), runtime config' },
  { name: 'Factory Method', cat: 'Creational', intent: 'Let a method decide which concrete class to instantiate.', useWhen: 'Creation logic varies and you want to hide `new` behind an interface.', example: 'ShapeFactory.create("circle")' },
  { name: 'Abstract Factory', cat: 'Creational', intent: 'Create families of related objects without naming concretes.', useWhen: 'You need consistent sets (e.g. matching UI widgets per OS).', example: 'WinFactory vs MacFactory' },
  { name: 'Builder', cat: 'Creational', intent: 'Construct a complex object step-by-step; avoid telescoping constructors.', useWhen: 'Many optional params; immutable objects.', example: 'new Burger.Builder().cheese().build()' },
  { name: 'Prototype', cat: 'Creational', intent: 'Create new objects by cloning an existing one.', useWhen: 'Object creation is expensive; copy a template.', example: 'shape.clone()' },

  // Structural — how objects are composed
  { name: 'Adapter', cat: 'Structural', intent: 'Make an incompatible interface usable by wrapping it.', useWhen: 'Integrating a third-party/legacy class with a different API.', example: 'XmlToJsonAdapter' },
  { name: 'Decorator', cat: 'Structural', intent: 'Add responsibilities to an object dynamically by wrapping it.', useWhen: 'Mix optional features at runtime without subclass explosion.', example: 'new MilkDecorator(new Coffee())' },
  { name: 'Facade', cat: 'Structural', intent: 'Provide a simple unified interface over a complex subsystem.', useWhen: 'Hide messy internals behind one friendly entry point.', example: 'VideoConverter.convert(file)' },
  { name: 'Composite', cat: 'Structural', intent: 'Treat individual objects and groups uniformly via a tree.', useWhen: 'Part-whole hierarchies (files/folders, UI trees).', example: 'Folder containing Files & Folders' },
  { name: 'Proxy', cat: 'Structural', intent: 'A stand-in that controls access to another object.', useWhen: 'Lazy loading, access control, caching, logging.', example: 'Virtual/Protection/Remote proxy' },
  { name: 'Bridge', cat: 'Structural', intent: 'Split an abstraction from its implementation so both vary independently.', useWhen: 'Two dimensions of variation would otherwise multiply.', example: 'Shape × Renderer' },
  { name: 'Flyweight', cat: 'Structural', intent: 'Share fine-grained objects to save memory.', useWhen: 'Huge numbers of similar objects (glyphs, game tiles).', example: 'Shared Character glyphs' },

  // Behavioral — how objects interact
  { name: 'Strategy', cat: 'Behavioral', intent: 'Encapsulate interchangeable algorithms; swap at runtime.', useWhen: 'Multiple ways to do one thing (sort, pay, compress).', example: 'PaymentStrategy: UPI / Card' },
  { name: 'Observer', cat: 'Behavioral', intent: 'Notify many dependents automatically when state changes.', useWhen: 'Pub/sub, event systems, UI binding.', example: 'Channel → Subscribers' },
  { name: 'State', cat: 'Behavioral', intent: 'Change an object’s behaviour when its internal state changes.', useWhen: 'Object behaves differently per state (a state machine).', example: 'Media player: Playing/Paused' },
  { name: 'Command', cat: 'Behavioral', intent: 'Encapsulate a request as an object (queue, log, undo).', useWhen: 'Undo/redo, task queues, macro recording.', example: 'UndoableEditCommand' },
  { name: 'Template Method', cat: 'Behavioral', intent: 'Define an algorithm’s skeleton; subclasses fill in steps.', useWhen: 'Fixed sequence with varying steps.', example: 'DataParser.parse() hooks' },
  { name: 'Chain of Responsibility', cat: 'Behavioral', intent: 'Pass a request along a chain until one handler takes it.', useWhen: 'Middleware, approval flows, logging levels.', example: 'Servlet filters / middleware' },
  { name: 'Iterator', cat: 'Behavioral', intent: 'Traverse a collection without exposing its internals.', useWhen: 'Uniform iteration over different structures.', example: 'Java Iterator/for-each' },
  { name: 'Mediator', cat: 'Behavioral', intent: 'Centralise complex many-to-many comms in one object.', useWhen: 'Reduce tangled object-to-object dependencies.', example: 'Chat room hub' },
  { name: 'Memento', cat: 'Behavioral', intent: 'Capture & restore an object’s state without breaking encapsulation.', useWhen: 'Snapshots, undo, checkpoints.', example: 'Editor save points' },
  { name: 'Visitor', cat: 'Behavioral', intent: 'Add operations to a class hierarchy without changing it.', useWhen: 'Many unrelated ops over a stable structure.', example: 'AST node visitors' },
];

const CATS: Cat[] = ['Creational', 'Structural', 'Behavioral'];
const CAT_DESC: Record<Cat, string> = {
  Creational: 'How objects are created.',
  Structural: 'How objects are composed into bigger structures.',
  Behavioral: 'How objects communicate & share responsibility.',
};

export function PatternGallery() {
  const [cat, setCat] = useState<Cat>('Creational');
  const [open, setOpen] = useState<string | null>(null);
  const list = PATTERNS.filter((p) => p.cat === cat);

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-1 text-sm font-semibold text-muted">The 23 GoF design patterns — browse by category, tap a card</div>
      <div className="mb-3 flex gap-1.5">
        {CATS.map((c) => (
          <button key={c} onClick={() => { setCat(c); setOpen(null); }}
            className={cn('rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors', c === cat ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>
            {c}
          </button>
        ))}
      </div>
      <p className="mb-3 text-xs text-muted">{CAT_DESC[cat]}</p>

      <div className="grid gap-1.5 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.name} className="rounded-xl border border-border">
            <button onClick={() => setOpen(open === p.name ? null : p.name)} className={cn('flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold', open === p.name && 'text-brand-700 dark:text-brand-300')}>
              {p.name}
              <span className="text-xs text-muted">{open === p.name ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {open === p.name && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="space-y-1 px-3 pb-3 text-xs">
                    <p><span className="font-semibold text-text">Intent:</span> <span className="text-muted">{p.intent}</span></p>
                    <p><span className="font-semibold text-text">Use when:</span> <span className="text-muted">{p.useWhen}</span></p>
                    <p><span className="font-semibold text-text">Example:</span> <span className="font-mono text-muted">{p.example}</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
