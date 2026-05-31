import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Home, BookOpen, Map, Library, GraduationCap, ChevronDown, CheckCircle2, Circle, X,
  Cpu, Heart, Code2, Swords,
} from 'lucide-react';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { useDsaProgress } from '@/features/progress/useDsaProgress';
import { course as aiCourse } from '@/content/course-ai';
import { osCourse } from '@/content/course-os';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';

// A nested link inside a course group ([13px], shows its own icon).
function SubLink({ to, end, children, icon: I, tone = 'brand' }: { to: string; end?: boolean; children: React.ReactNode; icon?: typeof Map; tone?: 'brand' | 'accent' }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors',
          isActive
            ? tone === 'accent' ? 'bg-accent-500/10 text-accent-700 dark:text-accent-300' : 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
            : 'text-muted hover:bg-surface-2 hover:text-text',
        )
      }
    >
      {I ? <I size={14} className={tone === 'accent' ? 'text-accent-500' : ''} /> : <Map size={14} className="opacity-0" />}
      {children}
    </NavLink>
  );
}

function GroupButton({ icon: I, label, open, onClick }: { icon: typeof Home; label: string; open: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-text">
      <I size={18} />
      <span className="flex-1 truncate text-left">{label}</span>
      <ChevronDown size={16} className={cn('shrink-0 transition-transform', open && 'rotate-180')} />
    </button>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { perModule, overallPct } = useCourseProgress();
  const { perModule: osModules } = useCourseProgress(osCourse);
  const { perSub } = useDsaProgress();
  const loc = useLocation();
  const [aiOpen, setAiOpen] = useState(loc.pathname.startsWith('/learn') || loc.pathname.startsWith('/atlas') || loc.pathname === '/glossary' || loc.pathname === '/exam');
  const [dsaOpen, setDsaOpen] = useState(loc.pathname.startsWith('/dsa'));
  const [osOpen, setOsOpen] = useState(loc.pathname.startsWith('/os'));

  const modLink = (basePath: string) => ({ module, complete }: { module: { id: string; slug: string; icon: string; title: string }; complete: boolean }) => (
    <NavLink
      key={module.id}
      to={`${basePath}/${module.slug}`}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors',
          isActive ? 'bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2 hover:text-text',
        )
      }
    >
      {complete ? <CheckCircle2 size={14} className="shrink-0 text-emerald-500" /> : <Circle size={14} className="shrink-0 opacity-40" />}
      <Icon name={module.icon} size={14} />
      <span className="truncate">{module.title}</span>
    </NavLink>
  );

  return (
    <div className="flex h-full flex-col" onClick={() => onNavigate?.()}>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Logo className="h-9 w-9 rounded-xl shadow-soft" />
        <div>
          <div className="text-lg font-black leading-none tracking-tight">Igloo</div>
          <div className="text-[11px] text-muted">Warm up to hard ideas</div>
        </div>
      </div>

      {/* AI course progress */}
      <div className="mx-5 mb-3 rounded-xl border border-border bg-surface-2/60 p-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-muted">AI course progress</span>
          <span className="font-bold text-brand-600 dark:text-brand-300">{overallPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6" onClick={(e) => e.stopPropagation()}>
        <div onClick={() => onNavigate?.()}>
          <NavLink to="/" end className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2 hover:text-text')}>
            <Home size={18} /> Home
          </NavLink>
        </div>

        {/* AI course (with its own Atlas, Glossary & Exam nested inside) */}
        <GroupButton icon={BookOpen} label={aiCourse.title} open={aiOpen} onClick={() => setAiOpen((o) => !o)} />
        {aiOpen && (
          <div className="ml-2 space-y-0.5 border-l border-border pl-2" onClick={() => onNavigate?.()}>
            <SubLink to="/learn" end>Overview</SubLink>
            {perModule.map(modLink('/learn'))}
            <div className="my-1 ml-2 h-px bg-border/60" />
            <SubLink to="/atlas" icon={Map}>AI Atlas</SubLink>
            <SubLink to="/glossary" icon={Library}>Glossary</SubLink>
            <SubLink to="/exam" icon={GraduationCap}>Final Exam</SubLink>
          </div>
        )}

        {/* DSA course */}
        <GroupButton icon={Code2} label="DSA Dojo" open={dsaOpen} onClick={() => setDsaOpen((o) => !o)} />
        {dsaOpen && (
          <div className="ml-2 space-y-0.5 border-l border-border pl-2" onClick={() => onNavigate?.()}>
            <SubLink to="/dsa" end>Overview</SubLink>
            {perSub.map(({ sub, earned }) => (
              <NavLink
                key={sub.id}
                to={`/dsa/${sub.slug}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors',
                    isActive ? 'bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2 hover:text-text',
                  )
                }
              >
                {earned ? <CheckCircle2 size={14} className="shrink-0 text-emerald-500" /> : <Circle size={14} className="shrink-0 opacity-40" />}
                <Icon name={sub.icon} size={14} />
                <span className="truncate">{sub.title}</span>
              </NavLink>
            ))}
            <SubLink to="/dsa/arena" icon={Swords} tone="accent">Interview Arena</SubLink>
          </div>
        )}

        {/* OS course */}
        <GroupButton icon={Cpu} label="Operating Systems" open={osOpen} onClick={() => setOsOpen((o) => !o)} />
        {osOpen && (
          <div className="ml-2 space-y-0.5 border-l border-border pl-2" onClick={() => onNavigate?.()}>
            <SubLink to="/os" end>Overview</SubLink>
            {osModules.map(modLink('/os'))}
            <div className="my-1 ml-2 h-px bg-border/60" />
            <SubLink to="/os/exam" icon={GraduationCap}>Final Exam</SubLink>
          </div>
        )}

        <div className="my-2 h-px bg-border" />
        <div onClick={() => onNavigate?.()}>
          <NavLink to="/about" className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2 hover:text-text')}>
            <Heart size={18} /> About
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export function SidebarCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="absolute right-3 top-4 rounded-lg p-1.5 text-muted hover:bg-surface-2 lg:hidden">
      <X size={20} />
    </button>
  );
}
