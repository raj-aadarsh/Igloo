import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Step { id: string; instr: string; layer: boolean; note: string; }

const STEPS: Step[] = [
  { id: 'from', instr: 'FROM node:18-alpine', layer: true, note: 'Base image layer — the starting filesystem (a minimal Node.js + Alpine Linux). Shared & reused across all your images.' },
  { id: 'workdir', instr: 'WORKDIR /app', layer: false, note: 'Sets the working directory. Metadata only — no real filesystem layer.' },
  { id: 'copypkg', instr: 'COPY package.json .', layer: true, note: 'Copies just the dependency manifest first — on purpose, so the next (expensive) layer can be cached.' },
  { id: 'install', instr: 'RUN npm install', layer: true, note: 'Installs dependencies → a big layer. It’s CACHED and reused on every build, UNLESS package.json changed above it. This ordering is the #1 Dockerfile optimisation.' },
  { id: 'copysrc', instr: 'COPY . .', layer: true, note: 'Copies your source code. This changes often, so it’s placed LAST — its rebuild doesn’t invalidate the cached npm-install layer.' },
  { id: 'cmd', instr: 'CMD ["node","app.js"]', layer: false, note: 'Declares the default start command. Metadata only — no filesystem layer.' },
];

const layers = STEPS.filter((s) => s.layer);

export function ImageLayers() {
  const [active, setActive] = useState('install');
  const s = STEPS.find((x) => x.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">A Dockerfile builds a layered image — tap an instruction</div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Dockerfile */}
        <div className="overflow-hidden rounded-xl border border-border bg-[#0d1117]">
          <div className="border-b border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">Dockerfile</div>
          <div className="p-2 font-mono text-[12px]">
            {STEPS.map((st) => (
              <button key={st.id} onClick={() => setActive(st.id)}
                className={cn('block w-full rounded px-2 py-1 text-left transition-colors', active === st.id ? 'bg-brand-500/25 text-white' : 'text-slate-300 hover:bg-white/5')}>
                {st.instr}
              </button>
            ))}
          </div>
        </div>

        {/* Layer stack */}
        <div>
          <div className="mb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted">Image = stack of layers ↑</div>
          <div className="flex flex-col-reverse gap-1">
            {layers.map((st) => (
              <button key={st.id} onClick={() => setActive(st.id)}
                className={cn('rounded-lg border px-2 py-2 text-center text-[11px] font-mono font-semibold transition-colors',
                  active === st.id ? 'border-brand-400 bg-brand-500/15 text-brand-700 dark:text-brand-300' : 'border-border bg-surface-2/50 text-muted hover:bg-surface-2')}>
                {st.instr.split(' ').slice(0, 2).join(' ')}…
              </button>
            ))}
            <div className="rounded-lg border border-dashed border-border px-2 py-1 text-center text-[10px] text-muted">read-only layers · stacked, content-addressed</div>
          </div>
        </div>
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3 text-sm">
        <span className={cn('mr-2 rounded-full px-2 py-0.5 text-[10px] font-semibold', s.layer ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'bg-surface-2 text-muted')}>{s.layer ? 'creates a layer' : 'metadata only'}</span>
        <span className="text-muted">{s.note}</span>
      </motion.div>

      <p className="mt-2 text-xs text-muted">Each instruction adds a read-only <strong>layer</strong>; layers are cached and shared between images. Order matters: put <strong>rarely-changing</strong> steps first so expensive layers (like <span className="font-mono">npm install</span>) stay cached. A running <strong>container</strong> = these read-only layers + a thin writable layer on top.</p>
    </div>
  );
}
