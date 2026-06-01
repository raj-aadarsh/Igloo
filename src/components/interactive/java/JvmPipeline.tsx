import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode2, Cog, Binary, Boxes, Cpu, MonitorSmartphone, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Stage {
  id: string;
  label: string;
  sub: string;
  icon: typeof Cog;
  detail: string;
}

const STAGES: Stage[] = [
  { id: 'src', label: 'Main.java', sub: 'Source code', icon: FileCode2, detail: 'Human-readable Java you write. It cannot run directly — it must be compiled first.' },
  { id: 'javac', label: 'javac', sub: 'Compiler', icon: Cog, detail: 'The Java compiler checks types & syntax and translates your source into bytecode. This is COMPILE time.' },
  { id: 'class', label: 'Main.class', sub: 'Bytecode', icon: Binary, detail: 'Platform-independent bytecode — the same .class runs on any machine with a JVM. This is the secret to "write once, run anywhere".' },
  { id: 'loader', label: 'ClassLoader', sub: 'JVM', icon: Boxes, detail: 'The JVM\'s class loader loads .class files into memory, links and verifies the bytecode (security & integrity), and initialises static data.' },
  { id: 'engine', label: 'Execution Engine', sub: 'Interpreter + JIT', icon: Cpu, detail: 'The engine executes bytecode. The interpreter runs it line-by-line; the JIT (Just-In-Time) compiler turns hot paths into native machine code for speed. This is RUN time.' },
  { id: 'os', label: 'Any OS', sub: 'Win / Mac / Linux', icon: MonitorSmartphone, detail: 'Because the JVM sits between bytecode and the OS, the exact same program runs on Windows, macOS or Linux — only the JVM differs per platform.' },
];

export function JvmPipeline() {
  const [active, setActive] = useState<string>('src');
  const stage = STAGES.find((s) => s.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">From source to running program — click a stage</div>
      <div className="flex flex-wrap items-stretch gap-1.5">
        {STAGES.map((s, i) => (
          <div key={s.id} className="flex items-stretch gap-1.5">
            <button
              onClick={() => setActive(s.id)}
              className={cn(
                'flex w-24 flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-colors sm:w-28',
                s.id === active ? 'border-brand-400 bg-brand-500/10' : 'border-border hover:bg-surface-2',
              )}
            >
              <s.icon size={20} className={s.id === active ? 'text-brand-600 dark:text-brand-300' : 'text-muted'} />
              <span className="font-mono text-[11px] font-bold leading-tight">{s.label}</span>
              <span className="text-[10px] text-muted">{s.sub}</span>
            </button>
            {i < STAGES.length - 1 && <ArrowRight size={16} className="self-center text-muted/50" />}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2 text-xs">
        <span className="rounded-full bg-accent-500/10 px-2 py-0.5 font-semibold text-accent-700 dark:text-accent-300">JDK = javac + JRE + dev tools</span>
        <span className="rounded-full bg-brand-500/10 px-2 py-0.5 font-semibold text-brand-700 dark:text-brand-300">JRE = JVM + libraries</span>
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
        <div className="mb-1 flex items-center gap-2 font-semibold"><stage.icon size={16} className="text-brand-500" /> {stage.label} <span className="text-xs font-normal text-muted">· {stage.sub}</span></div>
        <p className="text-sm text-muted">{stage.detail}</p>
      </motion.div>
    </div>
  );
}
