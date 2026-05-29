import { useState, type ReactNode } from 'react';
import { Menu, Moon, Sun, RotateCcw } from 'lucide-react';
import { Sidebar, SidebarCloseButton } from './Sidebar';
import { useTheme } from '@/theme/ThemeProvider';
import { useProgress } from '@/features/progress/ProgressProvider';
import { cn } from '@/lib/cn';

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const { resetAll } = useProgress();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-surface transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {open && <SidebarCloseButton onClick={() => setOpen(false)} />}
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      {/* Backdrop on mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main column */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-muted hover:bg-surface-2 lg:hidden">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => {
              if (confirm('Reset all progress and quiz scores on this device?')) resetAll();
            }}
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-text sm:flex"
            title="Reset progress"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={toggle} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-text" title="Toggle theme">
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
