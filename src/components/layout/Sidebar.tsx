import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Home, BookOpen, Map, Library, GraduationCap, ChevronDown, CheckCircle2, Circle, X,
  Building2, Boxes, AppWindow, Layers, Cpu, Laptop, Heart,
} from 'lucide-react';
import { useCourseProgress } from '@/features/progress/useCourseProgress';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';

const atlasLinks = [
  { to: '/atlas/companies', label: 'Companies & Labs', icon: Building2 },
  { to: '/atlas/models', label: 'Models', icon: Boxes },
  { to: '/atlas/products', label: 'Products & Apps', icon: AppWindow },
  { to: '/atlas/categories', label: 'Categories', icon: Layers },
  { to: '/atlas/hardware', label: 'Hardware & Chips', icon: Cpu },
  { to: '/atlas/on-device', label: 'On-device / Offline', icon: Laptop },
];

function SectionLink({ to, icon: I, children, end }: { to: string; icon: typeof Home; children: React.ReactNode; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2 hover:text-text',
        )
      }
    >
      <I size={18} />
      {children}
    </NavLink>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { perModule, overallPct } = useCourseProgress();
  const loc = useLocation();
  const [courseOpen, setCourseOpen] = useState(loc.pathname.startsWith('/learn'));
  const [atlasOpen, setAtlasOpen] = useState(loc.pathname.startsWith('/atlas'));

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

      {/* Overall progress */}
      <div className="mx-5 mb-3 rounded-xl border border-border bg-surface-2/60 p-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-muted">Course progress</span>
          <span className="font-bold text-brand-600 dark:text-brand-300">{overallPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6" onClick={(e) => e.stopPropagation()}>
        <div onClick={() => onNavigate?.()}>
          <SectionLink to="/" icon={Home} end>Home</SectionLink>
        </div>

        {/* Course group */}
        <button
          onClick={() => setCourseOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-text"
        >
          <BookOpen size={18} />
          <span className="flex-1 text-left">AI Course</span>
          <ChevronDown size={16} className={cn('transition-transform', courseOpen && 'rotate-180')} />
        </button>
        {courseOpen && (
          <div className="ml-2 space-y-0.5 border-l border-border pl-2" onClick={() => onNavigate?.()}>
            <NavLink
              to="/learn"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-muted hover:bg-surface-2 hover:text-text',
                )
              }
            >
              <Map size={14} className="opacity-0" /> Course overview
            </NavLink>
            {perModule.map(({ module, complete }) => (
              <NavLink
                key={module.id}
                to={`/learn/${module.slug}`}
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
            ))}
          </div>
        )}

        {/* Atlas group */}
        <button
          onClick={() => setAtlasOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-text"
        >
          <Map size={18} />
          <span className="flex-1 text-left">The AI Atlas</span>
          <ChevronDown size={16} className={cn('transition-transform', atlasOpen && 'rotate-180')} />
        </button>
        {atlasOpen && (
          <div className="ml-2 space-y-0.5 border-l border-border pl-2" onClick={() => onNavigate?.()}>
            {atlasLinks.map((l) => (
              <SectionLink key={l.to} to={l.to} icon={l.icon}>{l.label}</SectionLink>
            ))}
          </div>
        )}

        <div className="my-2 h-px bg-border" />
        <div onClick={() => onNavigate?.()}>
          <SectionLink to="/glossary" icon={Library}>Glossary</SectionLink>
          <SectionLink to="/exam" icon={GraduationCap}>Final Exam</SectionLink>
          <SectionLink to="/about" icon={Heart}>About</SectionLink>
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
