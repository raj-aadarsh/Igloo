import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Principle {
  letter: string;
  name: string;
  oneLiner: string;
  idea: string;
  bad: string;
  good: string;
  smell: string;
}

const PRINCIPLES: Principle[] = [
  {
    letter: 'S', name: 'Single Responsibility',
    oneLiner: 'A class should have one, and only one, reason to change.',
    idea: 'Each class does one job. Mixing concerns (e.g. business logic + persistence + formatting) means many reasons to change and fragile code.',
    smell: 'A class named ...Manager/...Util that does everything; methods touching unrelated concerns.',
    bad: `class Invoice {
    void calculateTotal() { /* business logic */ }
    void saveToDb() { /* persistence */ }     // 2nd reason to change
    void printPdf() { /* formatting */ }       // 3rd reason to change
}`,
    good: `class Invoice        { void calculateTotal() {} }   // business
class InvoiceRepo    { void save(Invoice i) {} }    // persistence
class InvoicePrinter { void printPdf(Invoice i) {} } // formatting`,
  },
  {
    letter: 'O', name: 'Open/Closed',
    oneLiner: 'Open for extension, closed for modification.',
    idea: 'Add new behaviour by adding new code (new classes), not by editing existing, tested code. Usually achieved with polymorphism/abstractions.',
    smell: 'Growing if/else or switch on a "type" — every new type forces editing the same method.',
    bad: `class AreaCalc {
    double area(Object shape) {
        if (shape instanceof Circle) { ... }
        else if (shape instanceof Square) { ... }
        // adding Triangle => EDIT this method again
    }
}`,
    good: `interface Shape { double area(); }
class Circle implements Shape { public double area() { ... } }
class Square implements Shape { public double area() { ... } }
// new shape => NEW class, no edits to existing code`,
  },
  {
    letter: 'L', name: 'Liskov Substitution',
    oneLiner: 'Subtypes must be usable anywhere their base type is expected.',
    idea: 'A subclass must honour the base class’s contract — no surprising exceptions, no weakened behaviour. If it can’t, it isn’t really an "is-a".',
    smell: 'A subclass overriding a method to throw UnsupportedOperationException, or a Square extends Rectangle that breaks setWidth/setHeight.',
    bad: `class Bird { void fly() { ... } }
class Ostrich extends Bird {
    void fly() { throw new UnsupportedOperationException(); }
} // breaks code that calls bird.fly()`,
    good: `interface Bird {}
interface FlyingBird extends Bird { void fly(); }
class Sparrow implements FlyingBird { public void fly() { ... } }
class Ostrich implements Bird {}   // simply doesn't promise flight`,
  },
  {
    letter: 'I', name: 'Interface Segregation',
    oneLiner: 'Don’t force clients to depend on methods they don’t use.',
    idea: 'Prefer several small, focused interfaces over one fat interface. Clients implement only what they need.',
    smell: 'A class implementing a big interface and leaving half its methods empty or throwing.',
    bad: `interface Worker { void work(); void eat(); }
class Robot implements Worker {
    public void work() { ... }
    public void eat() { /* robots don't eat! */ }  // forced
}`,
    good: `interface Workable { void work(); }
interface Eatable   { void eat(); }
class Robot implements Workable { public void work() { ... } }
class Human implements Workable, Eatable { ... }`,
  },
  {
    letter: 'D', name: 'Dependency Inversion',
    oneLiner: 'Depend on abstractions, not on concretions.',
    idea: 'High-level modules shouldn’t depend on low-level details; both should depend on interfaces. Enables swapping implementations & testing (mocks).',
    smell: 'A high-level class doing `new ConcreteThing()` internally — hard-wired, untestable.',
    bad: `class OrderService {
    private MySqlDatabase db = new MySqlDatabase(); // hard-wired
    void save(Order o) { db.insert(o); }
}`,
    good: `interface Database { void insert(Order o); }
class OrderService {
    private final Database db;            // abstraction
    OrderService(Database db) { this.db = db; }  // injected
}`,
  },
];

export function SolidExplorer() {
  const [idx, setIdx] = useState(0);
  const [showGood, setShowGood] = useState(false);
  const p = PRINCIPLES[idx];

  const select = (i: number) => { setIdx(i); setShowGood(false); };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">SOLID — tap a letter, then flip between the violation and the fix</div>

      {/* Letter tabs */}
      <div className="flex gap-1.5">
        {PRINCIPLES.map((pr, i) => (
          <button
            key={pr.letter}
            onClick={() => select(i)}
            className={cn(
              'flex h-12 flex-1 flex-col items-center justify-center rounded-xl border transition-colors',
              i === idx ? 'border-brand-400 bg-brand-500/10' : 'border-border hover:bg-surface-2',
            )}
          >
            <span className={cn('text-lg font-black', i === idx ? 'text-brand-600 dark:text-brand-300' : 'text-muted')}>{pr.letter}</span>
          </button>
        ))}
      </div>

      <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
        <div className="rounded-xl border border-border bg-surface-2/50 p-3">
          <div className="font-bold">{p.letter} — {p.name}</div>
          <div className="text-sm font-medium text-brand-700 dark:text-brand-300">{p.oneLiner}</div>
          <p className="mt-1 text-sm text-muted">{p.idea}</p>
          <p className="mt-1.5 text-xs text-muted"><span className="font-semibold text-rose-600 dark:text-rose-400">Smell:</span> {p.smell}</p>
        </div>

        {/* Toggle */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setShowGood(false)}
            className={cn('inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold', !showGood ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'text-muted hover:bg-surface-2')}
          >
            <X size={14} /> Violation
          </button>
          <button
            onClick={() => setShowGood(true)}
            className={cn('inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold', showGood ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'text-muted hover:bg-surface-2')}
          >
            <Check size={14} /> Fix
          </button>
        </div>

        <motion.pre
          key={showGood ? 'good' : 'bad'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'mt-2 overflow-x-auto rounded-xl border p-3 font-mono text-xs leading-relaxed',
            showGood ? 'border-emerald-500/40 bg-emerald-950/90 text-emerald-50' : 'border-rose-500/40 bg-rose-950/90 text-rose-50',
          )}
        >{showGood ? p.good : p.bad}</motion.pre>
      </motion.div>
    </div>
  );
}
