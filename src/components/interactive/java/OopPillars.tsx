import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, GitBranch, Shapes, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Pillar {
  id: string;
  name: string;
  icon: typeof Lock;
  oneLiner: string;
  detail: string;
  code: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'enc',
    name: 'Encapsulation',
    icon: Lock,
    oneLiner: 'Bundle data + methods; hide internals behind accessors.',
    detail: 'Keep fields private and expose controlled getters/setters. The object guards its own state — callers can’t put it in an invalid state.',
    code: `class Account {
    private double balance;          // hidden state
    public void deposit(double amt) {
        if (amt > 0) balance += amt;  // guarded
    }
    public double getBalance() {
        return balance;               // controlled access
    }
}`,
  },
  {
    id: 'inh',
    name: 'Inheritance',
    icon: GitBranch,
    oneLiner: 'A subclass reuses & extends a superclass (is-a).',
    detail: 'extends lets a class inherit fields/methods from a parent and add or override behaviour. Use it for genuine "is-a" relationships; prefer composition otherwise.',
    code: `class Vehicle {
    void start() { System.out.println("Starting..."); }
}
class Car extends Vehicle {        // Car IS-A Vehicle
    void honk() { System.out.println("Beep!"); }
}
// new Car() can call both start() and honk()`,
  },
  {
    id: 'poly',
    name: 'Polymorphism',
    icon: Shapes,
    oneLiner: 'One interface, many implementations (run-time dispatch).',
    detail: 'A parent reference can point to any subclass object; the actual method called is decided at runtime (overriding). Overloading = same name, different parameters, decided at compile time.',
    code: `Shape s = new Circle();   // parent ref, child object
s.area();                  // calls Circle.area() at runtime

// Overriding (runtime) vs Overloading (compile-time)
int add(int a, int b)        { return a + b; }
double add(double a, double b){ return a + b; }`,
  },
  {
    id: 'abs',
    name: 'Abstraction',
    icon: EyeOff,
    oneLiner: 'Expose what an object does, hide how.',
    detail: 'Abstract classes & interfaces define a contract without (full) implementation. Callers depend on the abstraction, not the concrete details. Interface = pure contract; abstract class = partial implementation + state.',
    code: `interface Payment {        // pure contract
    void pay(double amount);
}
class UpiPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " via UPI");
    }
}`,
  },
];

export function OopPillars() {
  const [active, setActive] = useState('enc');
  const p = PILLARS.find((x) => x.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">The 4 pillars of OOP — tap one</div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {PILLARS.map((pl) => (
          <button
            key={pl.id}
            onClick={() => setActive(pl.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-colors',
              pl.id === active ? 'border-brand-400 bg-brand-500/10' : 'border-border hover:bg-surface-2',
            )}
          >
            <pl.icon size={20} className={pl.id === active ? 'text-brand-600 dark:text-brand-300' : 'text-muted'} />
            <span className="text-xs font-bold leading-tight">{pl.name}</span>
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
        <div className="rounded-xl border border-border bg-surface-2/50 p-3">
          <div className="mb-1 flex items-center gap-2 font-semibold"><p.icon size={16} className="text-brand-500" /> {p.name}</div>
          <p className="text-sm font-medium">{p.oneLiner}</p>
          <p className="mt-1 text-sm text-muted">{p.detail}</p>
        </div>
        <pre className="mt-2 overflow-x-auto rounded-xl border border-border bg-[#0d1117] p-3 font-mono text-xs leading-relaxed text-slate-100">{p.code}</pre>
      </motion.div>
    </div>
  );
}
