import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Code2, Package, FlaskConical, Tag, UploadCloud, Settings, Activity, Infinity as Inf, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Stage { id: string; label: string; icon: typeof Code2; side: 'dev' | 'ops'; detail: string; }

const STAGES: Stage[] = [
  { id: 'plan', label: 'Plan', icon: ClipboardList, side: 'dev', detail: 'Define what to build — requirements, tickets, design. Tools: Jira, Confluence.' },
  { id: 'code', label: 'Code', icon: Code2, side: 'dev', detail: 'Developers write code and commit to version control. Tools: Git, GitHub/GitLab.' },
  { id: 'build', label: 'Build', icon: Package, side: 'dev', detail: 'Compile/package the app into a build artifact (often a container image). Tools: Maven, Docker.' },
  { id: 'test', label: 'Test', icon: FlaskConical, side: 'dev', detail: 'Automated tests run on every change — unit, integration, security scans. Tools: JUnit, Selenium.' },
  { id: 'release', label: 'Release', icon: Tag, side: 'ops', detail: 'A tested build is approved and versioned, ready to ship. Often automated as part of CD.' },
  { id: 'deploy', label: 'Deploy', icon: UploadCloud, side: 'ops', detail: 'Push the release to production (rolling, blue-green, or canary). Tools: Kubernetes, Argo CD.' },
  { id: 'operate', label: 'Operate', icon: Settings, side: 'ops', detail: 'Run the live system — scaling, configuration, infrastructure. Tools: Kubernetes, Terraform, Ansible.' },
  { id: 'monitor', label: 'Monitor', icon: Activity, side: 'ops', detail: 'Watch metrics, logs & traces; feed insights back into Plan. Tools: Prometheus, Grafana.' },
];

const dev = STAGES.filter((s) => s.side === 'dev');
const ops = STAGES.filter((s) => s.side === 'ops');

function Chip({ s, active, onClick }: { s: Stage; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn('flex min-w-[72px] flex-col items-center gap-1 rounded-xl border p-2 transition-colors',
        active ? 'border-brand-400 bg-brand-500/10' : 'border-border hover:bg-surface-2')}>
      <motion.span animate={active ? { scale: [1, 1.2, 1] } : {}}><s.icon size={18} className={active ? 'text-brand-600 dark:text-brand-300' : 'text-muted'} /></motion.span>
      <span className="text-[11px] font-bold">{s.label}</span>
    </button>
  );
}

export function DevopsLifecycle() {
  const [active, setActive] = useState('plan');
  const s = STAGES.find((x) => x.id === active)!;

  return (
    <div className="not-prose my-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 text-sm font-semibold text-muted">The DevOps lifecycle — one continuous loop. Tap a stage</div>

      {/* DEV row (left → right) */}
      <div className="flex items-center gap-1">
        <span className="w-9 shrink-0 text-center text-[10px] font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">Dev</span>
        {dev.map((st, i) => (
          <div key={st.id} className="flex items-center gap-1">
            <Chip s={st} active={active === st.id} onClick={() => setActive(st.id)} />
            {i < dev.length - 1 && <ArrowRight size={14} className="text-muted/40" />}
          </div>
        ))}
        <ArrowRight size={14} className="text-accent-500" />
      </div>

      {/* center infinity motif */}
      <div className="my-1 flex items-center justify-center gap-2 text-muted">
        <Inf size={26} className="text-accent-500" />
        <span className="text-[11px] font-semibold">continuous · automated · feedback-driven</span>
      </div>

      {/* OPS row (right → left, reversed so it loops) */}
      <div className="flex items-center gap-1">
        <span className="w-9 shrink-0 text-center text-[10px] font-bold uppercase tracking-wide text-accent-600 dark:text-accent-300">Ops</span>
        <ArrowLeft size={14} className="text-accent-500 sm:hidden" />
        <div className="flex flex-1 flex-row-reverse items-center justify-end gap-1">
          {ops.map((st, i) => (
            <div key={st.id} className="flex flex-row-reverse items-center gap-1">
              <Chip s={st} active={active === st.id} onClick={() => setActive(st.id)} />
              {i < ops.length - 1 && <ArrowLeft size={14} className="text-muted/40" />}
            </div>
          ))}
        </div>
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
        <div className="mb-1 flex items-center gap-2 font-semibold"><s.icon size={16} className="text-brand-500" /> {s.label} <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', s.side === 'dev' ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'bg-accent-500/10 text-accent-700 dark:text-accent-300')}>{s.side === 'dev' ? 'Dev' : 'Ops'}</span></div>
        <p className="text-sm text-muted">{s.detail}</p>
      </motion.div>

      <p className="mt-2 text-xs text-muted">DevOps unites <strong>Dev</strong> (build it) and <strong>Ops</strong> (run it) into one automated loop — Monitor feeds back into Plan, so improvements ship continuously instead of in rare, risky big-bang releases.</p>
    </div>
  );
}
