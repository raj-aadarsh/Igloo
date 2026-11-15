import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Image as ImageIcon, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { cn } from '@/lib/cn';

// Compose an implicit intent and watch Android resolve it against every
// installed app's intent filters — one match, many matches, or a crash.

type Action = 'ACTION_VIEW' | 'ACTION_SEND' | 'ACTION_DIAL';
type Data = 'https://…' | 'tel:98XXXXXX' | 'image/* (a photo)' | 'text/plain (some text)';

interface AppDef {
  id: string;
  name: string;
  icon: typeof Globe;
  filters: { action: Action; data: Data[] }[];
  filterLabel: string;
}

const APPS: AppDef[] = [
  { id: 'browser', name: 'Browser', icon: Globe, filterLabel: 'VIEW · http/https', filters: [{ action: 'ACTION_VIEW', data: ['https://…'] }] },
  { id: 'dialer', name: 'Dialer', icon: Phone, filterLabel: 'DIAL · tel:', filters: [{ action: 'ACTION_DIAL', data: ['tel:98XXXXXX'] }] },
  { id: 'gallery', name: 'Gallery', icon: ImageIcon, filterLabel: 'VIEW/SEND · image/*', filters: [{ action: 'ACTION_VIEW', data: ['image/* (a photo)'] }, { action: 'ACTION_SEND', data: ['image/* (a photo)'] }] },
  { id: 'messages', name: 'Messages', icon: MessageSquare, filterLabel: 'SEND · text/plain', filters: [{ action: 'ACTION_SEND', data: ['text/plain (some text)'] }] },
  { id: 'email', name: 'Email', icon: Mail, filterLabel: 'SEND · text + images', filters: [{ action: 'ACTION_SEND', data: ['text/plain (some text)', 'image/* (a photo)'] }] },
];

const ACTIONS: Action[] = ['ACTION_VIEW', 'ACTION_SEND', 'ACTION_DIAL'];
const DATAS: Data[] = ['https://…', 'tel:98XXXXXX', 'image/* (a photo)', 'text/plain (some text)'];

export function IntentMatching() {
  const [action, setAction] = useState<Action>('ACTION_VIEW');
  const [data, setData] = useState<Data>('https://…');
  const [resolved, setResolved] = useState(false);

  const matches = APPS.filter((a) => a.filters.some((f) => f.action === action && f.data.includes(data)));

  const pick = (fn: () => void) => { fn(); setResolved(false); };

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Implicit Intent Resolution <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Describe <strong>what</strong> you want done — PMS checks every app’s intent filters to find <strong>who</strong> can do it.
      </p>

      {/* Compose the intent */}
      <div className="mb-3 rounded-xl border-2 border-[#8a7030] bg-[#1c1810] p-3">
        <div className="mb-2 font-mono text-[11px] font-bold" style={{ color: '#9a874f' }}>Intent intent = new Intent(…);</div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: '#8d8268' }}>action</div>
            <div className="flex flex-wrap gap-1.5">
              {ACTIONS.map((a) => (
                <button key={a} onClick={() => pick(() => setAction(a))} className={cn('rounded-md border px-2 py-1 font-mono text-[11px] font-bold transition-colors', action === a ? 'border-[#d7b155] bg-[#2a2310] text-[#f3dc9b]' : 'border-[#4a3d1c] text-[#9a874f] hover:border-[#8a7030]')}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: '#8d8268' }}>data / MIME type</div>
            <div className="flex flex-wrap gap-1.5">
              {DATAS.map((d) => (
                <button key={d} onClick={() => pick(() => setData(d))} className={cn('rounded-md border px-2 py-1 font-mono text-[11px] font-bold transition-colors', data === d ? 'border-[#d7b155] bg-[#2a2310] text-[#f3dc9b]' : 'border-[#4a3d1c] text-[#9a874f] hover:border-[#8a7030]')}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setResolved(true)} className="ml-auto inline-flex items-center gap-1.5 self-end rounded-lg bg-[#d7b155] px-3 py-1.5 text-xs font-bold text-[#1c1810] hover:bg-[#e8c56a]">
            <Send size={13} /> startActivity( )
          </button>
        </div>
        <div className="mt-2 font-mono text-[10px] italic" style={{ color: '#6f6549' }}>
          + CATEGORY_DEFAULT — added automatically by startActivity(), and every filter must declare it
        </div>
      </div>

      {/* Installed apps */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {APPS.map((app) => {
          const isMatch = resolved && matches.includes(app);
          const isMiss = resolved && !matches.includes(app);
          return (
            <motion.div
              key={app.id}
              animate={{ opacity: isMiss ? 0.3 : 1, scale: isMatch ? 1.04 : 1 }}
              className="rounded-xl border-2 p-2 text-center transition-colors"
              style={{
                borderColor: isMatch ? '#6fae6a' : '#4a3d1c',
                background: isMatch ? '#1d2a1d' : '#161208',
                boxShadow: isMatch ? '0 0 16px rgba(111,174,106,0.3)' : undefined,
              }}
            >
              <app.icon size={18} className="mx-auto" style={{ color: isMatch ? '#b9e0b5' : '#9a874f' }} />
              <div className="mt-1 text-[11px] font-bold" style={{ color: isMatch ? '#b9e0b5' : '#d7b155' }}>{app.name}</div>
              <div className="mt-0.5 font-mono text-[8.5px] leading-tight" style={{ color: '#8d8268' }}>&lt;intent-filter&gt;<br />{app.filterLabel}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Verdict */}
      <AnimatePresence>
        {resolved && (
          <motion.div
            key={`${action}-${data}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border px-3 py-2.5 text-[12.5px] leading-relaxed"
            style={{
              borderColor: matches.length === 0 ? '#c0564a' : matches.length === 1 ? '#6fae6a' : '#d7b155',
              background: matches.length === 0 ? '#2a1410' : matches.length === 1 ? '#1d2a1d' : '#2a2310',
              color: matches.length === 0 ? '#eda89e' : matches.length === 1 ? '#b9e0b5' : '#f3dc9b',
            }}
          >
            {matches.length === 0 && (
              <>💥 <strong>No filter matched</strong> → `ActivityNotFoundException` crashes the caller. Real apps wrap this in a try/catch or check `resolveActivity()` first.</>
            )}
            {matches.length === 1 && (
              <>✅ Exactly one match — <strong>{matches[0].name}</strong> starts directly, no questions asked.</>
            )}
            {matches.length > 1 && (
              <>🤔 {matches.length} apps match → the system shows the <strong>chooser sheet</strong> ({matches.map((m) => m.name).join(' / ')}) and the user picks.</>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Matching rules: the action must match, the data/MIME must match, and CATEGORY_DEFAULT must be in the filter.
      </div>
    </div>
  );
}
