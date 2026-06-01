import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

function Box({ label, tone = 'plain', wide }: { label: string; tone?: 'plain' | 'app' | 'heavy' | 'engine' | 'base'; wide?: boolean }) {
  const tones = {
    plain: 'border-border bg-surface-2 text-muted',
    app: 'border-brand-400 bg-brand-500/10 text-brand-700 dark:text-brand-300',
    heavy: 'border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    engine: 'border-accent-400 bg-accent-500/10 text-accent-700 dark:text-accent-300',
    base: 'border-border bg-surface-2/60 text-muted',
  };
  return <div className={cn('rounded-md border px-2 py-1 text-center text-[10px] font-semibold', tones[tone], wide && 'w-full')}>{label}</div>;
}

function Unit({ heavy }: { heavy: boolean }) {
  return (
    <div className="flex-1 space-y-0.5 rounded-lg border border-dashed border-border p-1">
      <Box label="App" tone="app" wide />
      <Box label="Bins / Libs" wide />
      {heavy && <Box label="Guest OS" tone="heavy" wide />}
    </div>
  );
}

export function ContainerVsVm() {
  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">Virtual machines vs containers — what each app carries</div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* VM */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border p-2">
          <div className="mb-1.5 text-center text-xs font-bold">Virtual Machines</div>
          <div className="flex gap-1">
            <Unit heavy /><Unit heavy /><Unit heavy />
          </div>
          <div className="mt-0.5 space-y-0.5">
            <Box label="Hypervisor" tone="engine" wide />
            <Box label="Host OS" tone="base" wide />
            <Box label="Infrastructure (hardware)" tone="base" wide />
          </div>
          <p className="mt-1.5 text-[10px] text-muted">Each VM ships a full <span className="text-rose-600 dark:text-rose-400 font-semibold">Guest OS</span> → GBs in size, boots in minutes.</p>
        </motion.div>

        {/* Container */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border p-2">
          <div className="mb-1.5 text-center text-xs font-bold">Containers</div>
          <div className="flex gap-1">
            <Unit heavy={false} /><Unit heavy={false} /><Unit heavy={false} />
          </div>
          <div className="mt-0.5 space-y-0.5">
            <Box label="Container Engine (Docker)" tone="engine" wide />
            <Box label="Host OS — shared kernel" tone="base" wide />
            <Box label="Infrastructure (hardware)" tone="base" wide />
          </div>
          <p className="mt-1.5 text-[10px] text-muted">Containers <span className="text-brand-600 dark:text-brand-300 font-semibold">share the host kernel</span> → MBs in size, start in milliseconds.</p>
        </motion.div>
      </div>

      <p className="mt-3 text-xs text-muted">
        A VM virtualizes <strong>hardware</strong> (each gets its own OS); a container virtualizes the <strong>operating system</strong> (each shares the host kernel, isolated as a process). That’s why containers are far lighter, faster, and denser — you can pack many more per machine. (VMs still win for strong isolation / running a different OS kernel.)
      </p>
    </div>
  );
}
