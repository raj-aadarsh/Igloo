import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// Anatomy of one SELinux denial. Platform engineers read these daily —
// click each piece of the line to decode it.

interface Part {
  id: string;
  text: string;
  title: string;
  note: string;
}

const PARTS: Part[] = [
  {
    id: 'avc',
    text: 'avc: denied',
    title: 'The verdict',
    note: 'SELinux blocked something. “avc” = Access Vector Cache, the kernel component answering allow/deny questions. Every denial is logged — this line IS the error message.',
  },
  {
    id: 'perm',
    text: '{ read }',
    title: 'What was attempted',
    note: 'The permission that was requested — here, reading. Could be open, write, bind, connect, ioctl… Together with the class at the end, it forms the full question: “may it READ this FILE?”',
  },
  {
    id: 'comm',
    text: 'comm="com.example.app"',
    title: 'Which process',
    note: 'The process name (truncated to 16 chars by the kernel). Handy for matching the denial to the thing that was running.',
  },
  {
    id: 'name',
    text: 'name="serial"',
    title: 'Which object',
    note: 'The target’s name — here a file called “serial” (the device serial number in /proc). The dev= and ino= fields pin down exactly which filesystem object it was.',
  },
  {
    id: 'scontext',
    text: 'scontext=u:r:untrusted_app:s0',
    title: 'Source context — WHO',
    note: 'The security label of the asker. The part that matters is the domain: `untrusted_app` = an ordinary third-party app. Every process runs in a domain (init assigned them — remember the boot topic loading policy before anything started).',
  },
  {
    id: 'tcontext',
    text: 'tcontext=u:object_r:proc_serial:s0',
    title: 'Target context — ON WHAT',
    note: 'The label of the thing being touched. Files don’t have names in policy — they have types: this file was labeled `proc_serial`. Policy is written entirely in terms of these labels, never paths.',
  },
  {
    id: 'tclass',
    text: 'tclass=file',
    title: 'What kind of thing',
    note: 'The object class: file, dir, socket, binder, property_service… The same type can appear as different classes, and the allowed permissions differ per class.',
  },
  {
    id: 'permissive',
    text: 'permissive=0',
    title: 'Was it actually blocked?',
    note: 'permissive=0 → ENFORCING: the action really was denied. permissive=1 → the action was *allowed but logged* — the domain (or whole device, on debug builds) is in permissive mode, used only while developing policy.',
  },
];

export function AvcDecoder() {
  const [open, setOpen] = useState<string | null>(null);
  const [showFix, setShowFix] = useState(false);
  const part = PARTS.find((p) => p.id === open);

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Anatomy of a Denial <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        One line, five questions answered: who, did what, to what, of which kind — and was it enforced. Tap each piece.
      </p>

      {/* The denial line */}
      <div className="rounded-xl border border-[#4a3d1c] bg-[#0e0b05] p-3 font-mono text-[11.5px] leading-loose">
        {PARTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpen(open === p.id ? null : p.id)}
            className={cn(
              'mr-1.5 rounded px-1 py-0.5 transition-colors',
              open === p.id ? 'bg-[#2a2310] text-[#f3dc9b] ring-1 ring-[#d7b155]' : 'text-[#d7b155] hover:bg-[#241e0e]',
            )}
          >
            {p.text}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {part && (
          <motion.div
            key={part.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2.5 rounded-xl border border-[#4a3d1c] bg-[#161208] px-3.5 py-2.5"
          >
            <div className="mb-0.5 text-[12px] font-bold" style={{ color: '#d7b155' }}>{part.title}</div>
            <div className="text-[12.5px] leading-relaxed" style={{ color: '#ded4ba' }}>{part.note}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The read-back + fix thinking */}
      <div className="mt-3 rounded-xl border border-[#2e4a2e] bg-[#12210f] px-3.5 py-2.5 text-[12.5px] leading-relaxed" style={{ color: '#b9e0b5' }}>
        <strong>Read it back in one sentence:</strong> “an untrusted app tried to <em>read</em> the <em>file</em> labeled <em>proc_serial</em> — and enforcing SELinux said no.”
      </div>

      <div className="mt-2.5">
        {!showFix ? (
          <button onClick={() => setShowFix(true)} className="rounded-lg border border-[#6a5624] px-3 py-1.5 text-xs font-bold text-[#d7b155] hover:bg-[#241e0e]">
            So how would a platform engineer respond?
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <div className="rounded-xl border border-[#4a3d1c] bg-[#161208] px-3.5 py-2.5 text-[12.5px] leading-relaxed" style={{ color: '#ded4ba' }}>
              <p className="mb-2"><strong style={{ color: '#d7b155' }}>First ask: SHOULD this be allowed?</strong> Most denials are the policy working correctly — an app has no business reading the device serial. The right fix is usually changing the code to use a proper API, not loosening policy.</p>
              <p className="mb-2">If it’s a legitimate platform feature, the denial maps mechanically to a rule — <code className="rounded bg-[#241e0e] px-1 font-mono text-[11px] text-[#f3dc9b]">allow &lt;scontext&gt; &lt;tcontext&gt;:&lt;tclass&gt; &#123; perms &#125;;</code> — added to the right `.te` file in system or vendor sepolicy (`audit2allow` drafts it from the log).</p>
              <p>But platform policy also contains <strong>neverallow rules</strong> — hard bans compiled into the build (and verified by CTS), e.g. “untrusted apps may never read /proc serials”. A candidate rule that collides with one fails the build on the spot: the system refuses to let you open that hole, no matter how convenient.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
