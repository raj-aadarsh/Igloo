import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, RotateCcw, Terminal, AlertTriangle, WifiOff, DraftingCompass } from 'lucide-react';
import { CodeEditor } from '@/components/code/CodeEditor';
import { Button } from '@/components/ui/primitives';
import { useJavaRunner } from '@/features/dsa/runner/useJavaRunner';
import { readJSON, writeJSON } from '@/lib/storage';
import { cn } from '@/lib/cn';

interface Example { id: string; label: string; code: string; }

// Each is a complete, runnable `public class Main` implementing a pattern.
// All Java-8 compatible (verified with `javac --release 8`).
const EXAMPLES: Example[] = [
  {
    id: 'singleton', label: 'Singleton',
    code: `public class Main {
    // Thread-safe, lazy singleton via the "holder" idiom.
    static class Logger {
        private Logger() {}
        private static class Holder { static final Logger I = new Logger(); }
        static Logger getInstance() { return Holder.I; }
        void log(String m) { System.out.println("[LOG] " + m); }
    }

    public static void main(String[] args) {
        Logger a = Logger.getInstance();
        Logger b = Logger.getInstance();
        a.log("hello");
        System.out.println("same instance? " + (a == b));  // true
    }
}`,
  },
  {
    id: 'factory', label: 'Factory Method',
    code: `public class Main {
    interface Shape { void draw(); }
    static class Circle implements Shape { public void draw() { System.out.println("○ circle"); } }
    static class Square implements Shape { public void draw() { System.out.println("□ square"); } }

    // The factory hides 'new' behind a single creation point.
    static class ShapeFactory {
        static Shape create(String type) {
            switch (type) {
                case "circle": return new Circle();
                case "square": return new Square();
                default: throw new IllegalArgumentException("unknown: " + type);
            }
        }
    }

    public static void main(String[] args) {
        ShapeFactory.create("circle").draw();
        ShapeFactory.create("square").draw();
    }
}`,
  },
  {
    id: 'builder', label: 'Builder',
    code: `public class Main {
    static class Burger {
        private final String bun; private final boolean cheese; private final int patties;
        private Burger(Builder b) { this.bun = b.bun; this.cheese = b.cheese; this.patties = b.patties; }
        public String toString() { return patties + "-patty burger on " + bun + (cheese ? " +cheese" : ""); }

        static class Builder {
            private String bun = "sesame"; private boolean cheese; private int patties = 1;
            Builder bun(String b) { this.bun = b; return this; }      // fluent
            Builder cheese() { this.cheese = true; return this; }
            Builder patties(int n) { this.patties = n; return this; }
            Burger build() { return new Burger(this); }
        }
    }

    public static void main(String[] args) {
        Burger b = new Burger.Builder().patties(2).cheese().bun("brioche").build();
        System.out.println(b);
    }
}`,
  },
  {
    id: 'strategy', label: 'Strategy',
    code: `public class Main {
    interface PayStrategy { void pay(int amount); }
    static class CardPay implements PayStrategy { public void pay(int a) { System.out.println("Paid " + a + " by card"); } }
    static class UpiPay  implements PayStrategy { public void pay(int a) { System.out.println("Paid " + a + " by UPI"); } }

    static class Cart {
        private PayStrategy strategy;
        void setStrategy(PayStrategy s) { this.strategy = s; }   // swap at runtime
        void checkout(int amount) { strategy.pay(amount); }
    }

    public static void main(String[] args) {
        Cart cart = new Cart();
        cart.setStrategy(new UpiPay());
        cart.checkout(500);
        cart.setStrategy(new CardPay());   // same cart, different algorithm
        cart.checkout(900);
    }
}`,
  },
  {
    id: 'observer', label: 'Observer',
    code: `import java.util.*;

public class Main {
    interface Subscriber { void update(String video); }

    static class Channel {
        private final List<Subscriber> subs = new ArrayList<>();
        void subscribe(Subscriber s) { subs.add(s); }
        void upload(String video) {
            System.out.println("Channel posted: " + video);
            for (Subscriber s : subs) s.update(video);   // notify all
        }
    }

    public static void main(String[] args) {
        Channel ch = new Channel();
        ch.subscribe(v -> System.out.println("  Aarav watches " + v));
        ch.subscribe(v -> System.out.println("  Diya watches " + v));
        ch.upload("LLD Patterns 101");
    }
}`,
  },
  {
    id: 'decorator', label: 'Decorator',
    code: `public class Main {
    interface Coffee { String desc(); double cost(); }
    static class Plain implements Coffee {
        public String desc() { return "coffee"; }
        public double cost() { return 100; }
    }
    // A decorator wraps a Coffee and IS-A Coffee.
    static abstract class AddOn implements Coffee {
        protected final Coffee inner;
        AddOn(Coffee c) { this.inner = c; }
    }
    static class Milk extends AddOn {
        Milk(Coffee c) { super(c); }
        public String desc() { return inner.desc() + " + milk"; }
        public double cost() { return inner.cost() + 20; }
    }
    static class Sugar extends AddOn {
        Sugar(Coffee c) { super(c); }
        public String desc() { return inner.desc() + " + sugar"; }
        public double cost() { return inner.cost() + 10; }
    }

    public static void main(String[] args) {
        Coffee order = new Sugar(new Milk(new Plain()));   // stack at runtime
        System.out.println(order.desc() + " = ₹" + order.cost());
    }
}`,
  },
];

export function LldPlayground() {
  const { status, run } = useJavaRunner();
  const storeKey = 'lld-playground-code';
  const [activeId, setActiveId] = useState(EXAMPLES[0].id);
  const [code, setCode] = useState<string>(() => readJSON(storeKey, EXAMPLES[0].code));
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadExample = (ex: Example) => {
    setActiveId(ex.id); setCode(ex.code); writeJSON(storeKey, ex.code);
    setOutput(null); setCompileError(null); setLoadError(null);
  };
  const setAndStore = (v: string) => { setCode(v); writeJSON(storeKey, v); };

  const handleRun = async () => {
    setRunning(true); setOutput(null); setCompileError(null); setLoadError(null);
    try {
      const report = await run(code, [{ stdin: '', expected: '' }]);
      if (report.loadError) { setLoadError(report.loadError); return; }
      if (report.compileError) { setCompileError(report.compileError); return; }
      const r = report.results[0];
      if (r?.error) setOutput((r.got ? r.got + '\n' : '') + r.error);
      else if (r?.timedOut) setOutput('Timed out — is there an infinite loop?');
      else setOutput(r?.got ?? '(no output)');
    } finally { setRunning(false); }
  };

  const busy = running || status === 'loading';
  const reset = () => { const ex = EXAMPLES.find((e) => e.id === activeId)!; setAndStore(ex.code); setOutput(null); setCompileError(null); };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
        <DraftingCompass size={16} className="text-accent-500" /> Pattern playground — run real design-pattern code
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button key={ex.id} onClick={() => loadExample(ex)}
            className={cn('rounded-full border px-2.5 py-1 text-xs font-medium transition-colors', ex.id === activeId ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2')}>
            {ex.label}
          </button>
        ))}
        <button onClick={reset} className="ml-auto inline-flex items-center gap-1 text-xs text-muted hover:text-text"><RotateCcw size={13} /> Reset</button>
      </div>

      <CodeEditor value={code} onChange={setAndStore} minHeight={260} />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button onClick={handleRun} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          {status === 'loading' && running ? 'Starting the Java engine…' : running ? 'Compiling & running…' : 'Run'}
        </Button>
      </div>
      {status === 'loading' && running && (
        <p className="mt-2 text-xs text-muted">First run downloads the Java engine (needs internet, just once per session). After that it’s quick.</p>
      )}

      {loadError && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
          <WifiOff className="text-amber-500" size={18} />
          <div className="text-sm text-amber-800 dark:text-amber-200"><strong>Couldn’t start the Java engine.</strong> {loadError}</div>
        </div>
      )}
      {compileError && (
        <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 p-3 dark:border-rose-800 dark:bg-rose-900/20">
          <div className="mb-1 flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300"><AlertTriangle size={15} /> Compilation error</div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-rose-800 dark:text-rose-200">{compileError}</pre>
        </div>
      )}
      <AnimatePresence>
        {output !== null && !compileError && !loadError && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 overflow-hidden rounded-xl border border-border bg-[#0d1117]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300"><Terminal size={13} /> Output</div>
            <pre className="overflow-x-auto whitespace-pre-wrap p-3 font-mono text-xs text-slate-100">{output}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
