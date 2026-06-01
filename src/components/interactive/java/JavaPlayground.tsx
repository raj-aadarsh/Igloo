import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, RotateCcw, Terminal, AlertTriangle, WifiOff, Coffee } from 'lucide-react';
import { CodeEditor } from '@/components/code/CodeEditor';
import { Button } from '@/components/ui/primitives';
import { useJavaRunner } from '@/features/dsa/runner/useJavaRunner';
import { readJSON, writeJSON } from '@/lib/storage';
import { cn } from '@/lib/cn';

interface Example {
  id: string;
  label: string;
  code: string;
}

// Curated, self-contained `public class Main` snippets that each print something.
// Learners load one, read it, then tweak & re-run real Java in the browser.
const EXAMPLES: Example[] = [
  {
    id: 'hello',
    label: 'Hello, Java',
    code: `public class Main {
    public static void main(String[] args) {
        String name = "Igloo";
        System.out.println("Hello, " + name + "!");
        // Java is statically typed: every variable has a known type.
        int year = 1995;
        System.out.println("Java was born in " + year);
    }
}`,
  },
  {
    id: 'oop',
    label: 'Classes & objects',
    code: `public class Main {
    // A class is a blueprint; objects are instances of it.
    static class Dog {
        String name;          // field (state)
        Dog(String name) {    // constructor
            this.name = name;
        }
        void bark() {         // method (behaviour)
            System.out.println(name + " says: Woof!");
        }
    }

    public static void main(String[] args) {
        Dog d = new Dog("Rex");
        d.bark();
    }
}`,
  },
  {
    id: 'poly',
    label: 'Polymorphism',
    code: `public class Main {
    static class Animal {
        String sound() { return "..."; }
    }
    static class Cat extends Animal {
        @Override String sound() { return "Meow"; }
    }
    static class Cow extends Animal {
        @Override String sound() { return "Moo"; }
    }

    public static void main(String[] args) {
        // One reference type, many runtime forms — dynamic dispatch.
        Animal[] zoo = { new Cat(), new Cow(), new Animal() };
        for (Animal a : zoo) {
            System.out.println(a.getClass().getSimpleName() + " -> " + a.sound());
        }
    }
}`,
  },
  {
    id: 'collections',
    label: 'Collections & Map',
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> fruits = new ArrayList<>(Arrays.asList("apple", "banana", "apple"));
        System.out.println("List: " + fruits);

        Set<String> unique = new HashSet<>(fruits);
        System.out.println("Set (no dupes): " + unique);

        Map<String, Integer> counts = new HashMap<>();
        for (String f : fruits) {
            counts.merge(f, 1, Integer::sum);
        }
        System.out.println("Counts: " + counts);
    }
}`,
  },
  {
    id: 'streams',
    label: 'Lambdas & Streams',
    code: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6);
        int sumOfEvenSquares = nums.stream()
            .filter(n -> n % 2 == 0)   // keep evens
            .map(n -> n * n)           // square them
            .reduce(0, Integer::sum);  // add them up
        System.out.println("Sum of even squares = " + sumOfEvenSquares);
    }
}`,
  },
  {
    id: 'exceptions',
    label: 'Exceptions',
    code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};
        try {
            System.out.println(arr[5]);  // out of bounds!
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Caught: " + e.getMessage());
        } finally {
            System.out.println("finally always runs.");
        }
    }
}`,
  },
];

export function JavaPlayground() {
  const { status, run } = useJavaRunner();
  const storeKey = 'java-playground-code';
  const [activeId, setActiveId] = useState(EXAMPLES[0].id);
  const [code, setCode] = useState<string>(() => readJSON(storeKey, EXAMPLES[0].code));
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadExample = (ex: Example) => {
    setActiveId(ex.id);
    setCode(ex.code);
    writeJSON(storeKey, ex.code);
    setOutput(null); setCompileError(null); setLoadError(null);
  };

  const setAndStore = (v: string) => { setCode(v); writeJSON(storeKey, v); };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null); setCompileError(null); setLoadError(null);
    try {
      const report = await run(code, [{ stdin: '', expected: '' }]);
      if (report.loadError) { setLoadError(report.loadError); return; }
      if (report.compileError) { setCompileError(report.compileError); return; }
      const r = report.results[0];
      if (r?.error) { setOutput((r.got ? r.got + '\n' : '') + r.error); }
      else if (r?.timedOut) { setOutput('Timed out — is there an infinite loop?'); }
      else { setOutput(r?.got ?? '(no output)'); }
    } finally {
      setRunning(false);
    }
  };

  const busy = running || status === 'loading';
  const reset = () => { const ex = EXAMPLES.find((e) => e.id === activeId)!; setAndStore(ex.code); setOutput(null); setCompileError(null); };

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
        <Coffee size={16} className="text-accent-500" /> Java playground — edit & run real Java
      </div>

      {/* Example chips */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => loadExample(ex)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
              ex.id === activeId ? 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-border text-muted hover:bg-surface-2',
            )}
          >
            {ex.label}
          </button>
        ))}
        <button onClick={reset} className="ml-auto inline-flex items-center gap-1 text-xs text-muted hover:text-text">
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <CodeEditor value={code} onChange={setAndStore} minHeight={220} />

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
