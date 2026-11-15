import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

// PMS's memory of one app, shown the way engineers actually see it:
// a dumpsys package record. Click the glowing lines to decode them.

interface Line { text: string; note?: string }

const LINES: Line[] = [
  { text: 'Package [com.example.notes] (b3f2a1):' },
  {
    text: '  appId=10057',
    note: 'The app’s identity number, assigned by PMS at install (apps start at 10000). Combine it with a userId and you get the kernel uid — 10057 for the owner, 1010057 for user 10. The sandbox starts right here.',
  },
  {
    text: '  codePath=/data/app/~~Xq3BvA…/com.example.notes-…/',
    note: 'Where the APK actually lives. One copy, no matter how many users have the app — the random-looking directory name is a per-install token. Data lives elsewhere (/data/user/<id>/…), which is why uninstall-for-one-user doesn’t touch the code.',
  },
  { text: '  versionCode=42  minSdk=26  targetSdk=35' },
  {
    text: '  signatures=PackageSignatures{… version:3}',
    note: 'The APK’s signing certificate, recorded forever. Every update must be signed with a matching key or PMS refuses it — and “same certificate” is exactly the test behind signature-level permissions. v3 is the modern signing scheme (supports key rotation).',
  },
  { text: '  requested permissions:' },
  {
    text: '    android.permission.INTERNET: granted=true',
    note: 'A normal (install-time) permission — granted automatically, recorded in PMS’s persisted state (packages.xml). When a service checks a caller over Binder, THIS is the database being consulted.',
  },
  {
    text: '    android.permission.CAMERA: granted=false',
    note: 'A dangerous (runtime) permission the user hasn’t granted yet — declared in the manifest, but granted=false until the runtime dialog says yes. Revoking from Settings flips this same bit back.',
  },
  {
    text: '  User 0: installed=true stopped=false   ·   User 10: installed=true',
    note: 'Per-user install state — the multi-user topic, live. The same package record carries one row per user: each can have the app installed, hidden or “stopped” independently, over their own encrypted data.',
  },
  { text: '  Activity Resolver Table:' },
  {
    text: '    android.intent.action.MAIN → com.example.notes/.MainActivity',
    note: 'The intent filters harvested from the manifest during PMS’s boot scan. Every resolveActivity() / implicit-intent match you played with in the intents topic is a lookup in THIS table — built before the app ever ran.',
  },
  {
    text: '  dexopt state: [arm64]: status=speed-profile',
    note: 'ART’s compilation state for this app, managed by PMS: “speed-profile” means dex2oat AOT-compiled the hot paths recorded in the app’s usage profile — the ART story from the architecture topic, as an actual field on the record.',
  },
];

export function PackageRecord() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        PMS’s Memory of One App <span className="not-italic">:-</span>
      </h3>
      <p className="mb-3 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Everything below is one record in PMS’s database — what <span className="font-mono not-italic">dumpsys package com.example.notes</span> prints. Click the glowing lines.
      </p>

      <div className="rounded-xl border border-[#4a3d1c] bg-[#0e0b05] p-3 font-mono text-[11px] leading-relaxed">
        {LINES.map((l, i) => (
          <div key={i}>
            <button
              onClick={() => l.note && setOpen(open === i ? null : i)}
              className={cn('block w-full whitespace-pre-wrap text-left', l.note && 'rounded px-1 transition-colors hover:bg-[#241e0e]')}
              style={{
                color: l.note ? '#f3dc9b' : '#8d8268',
                textShadow: l.note && open !== i ? '0 0 10px rgba(215,177,85,0.4)' : undefined,
                cursor: l.note ? 'pointer' : 'default',
              }}
            >
              {l.text}
            </button>
            <AnimatePresence>
              {open === i && l.note && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="my-1.5 rounded-lg border border-[#4a3d1c] bg-[#161208] px-3 py-2 font-sans text-[12px] leading-relaxed" style={{ color: '#ded4ba' }}>
                    {l.note}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        This record is built from the manifest scan at boot, persisted in /data/system/packages.xml — and consulted on every resolve, launch and permission check.
      </div>
    </div>
  );
}
