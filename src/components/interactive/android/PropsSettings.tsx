import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RichText } from '@/components/ui/RichText';
import { cn } from '@/lib/cn';

// Two key-value stores that run Android's configuration. Click an entry to
// see where it lives, who may write it, and what happens on reboot.

interface Entry {
  key: string;
  value: string;
  store: 'prop' | 'system' | 'secure' | 'global';
  facts: { label: string; value: string }[];
  note: string;
  cmd: string;
}

const STORE: Record<Entry['store'], { title: string; sub: string; border: string; text: string }> = {
  prop: { title: 'System properties', sub: 'init’s property service', border: '#d7b155', text: '#f3dc9b' },
  system: { title: 'Settings.System', sub: 'user preferences', border: '#6fae6a', text: '#b9e0b5' },
  secure: { title: 'Settings.Secure', sub: 'protected, per user', border: '#b06ab0', text: '#e0b5e0' },
  global: { title: 'Settings.Global', sub: 'device-wide, all users', border: '#5a9bd4', text: '#b5d4ee' },
};

const ENTRIES: Entry[] = [
  {
    key: 'ro.build.version.security_patch',
    value: '2026-11-05',
    store: 'prop',
    facts: [{ label: 'prefix', value: 'ro.* = write once' }, { label: 'set by', value: 'build.prop at boot' }, { label: 'survives reboot', value: 'rebuilt from the image every boot' }],
    note: '**ro.** means read-only: once set (usually from `build.prop` files on the partitions at boot), nobody can change it until the next boot. This one is the security patch level, which the patch-porting topic is all about.',
    cmd: 'adb shell getprop ro.build.version.security_patch',
  },
  {
    key: 'persist.sys.timezone',
    value: 'Asia/Kolkata',
    store: 'prop',
    facts: [{ label: 'prefix', value: 'persist.* = saved' }, { label: 'stored in', value: '/data/property/' }, { label: 'survives reboot', value: 'yes' }],
    note: '**persist.** properties are written to disk under `/data/property/` and reloaded at every boot. That makes them perfect for device-level switches a debug engineer wants to keep across reboots. (Wiped by a factory reset, since that clears /data.)',
    cmd: 'adb shell setprop persist.sys.timezone Asia/Kolkata',
  },
  {
    key: 'sys.boot_completed',
    value: '1',
    store: 'prop',
    facts: [{ label: 'prefix', value: 'sys.* = runtime state' }, { label: 'set by', value: 'the framework when boot completes' }, { label: 'survives reboot', value: 'no, gone on reboot' }],
    note: 'Ordinary runtime properties live only in memory. This is the one from the boot topic: it flips to 1 exactly when `ACTION_BOOT_COMPLETED` is sent. Scripts and tests poll it to know the device is ready.',
    cmd: 'adb shell getprop sys.boot_completed',
  },
  {
    key: 'ctl.start',
    value: 'bootanim',
    store: 'prop',
    facts: [{ label: 'prefix', value: 'ctl.* = a command, not data' }, { label: 'handled by', value: 'init' }, { label: 'stored', value: 'never, it’s an action' }],
    note: '**ctl.** isn’t really a property: writing `ctl.start=<service>` (or `ctl.stop` / `ctl.restart`) asks **init** to start or stop a service declared in an `.rc` file. That’s how `adb shell start` / `stop` work. SELinux strictly limits who may send these.',
    cmd: 'adb shell setprop ctl.start bootanim',
  },
  {
    key: 'screen_brightness',
    value: '128',
    store: 'system',
    facts: [{ label: 'scope', value: 'per user' }, { label: 'writable by', value: 'apps granted “Modify system settings”' }, { label: 'stored in', value: '/data/system/users/<id>/settings_system.xml' }],
    note: '**Settings.System** holds ordinary user preferences: brightness, ringtone, font scale. An app can write here only after the user grants the special `WRITE_SETTINGS` access in Settings.',
    cmd: 'adb shell settings get system screen_brightness',
  },
  {
    key: 'enabled_accessibility_services',
    value: 'com.example/.A11yService',
    store: 'secure',
    facts: [{ label: 'scope', value: 'per user' }, { label: 'writable by', value: 'system / signature apps only' }, { label: 'needs', value: 'WRITE_SECURE_SETTINGS' }],
    note: '**Settings.Secure** holds settings that affect security or privacy: enabled accessibility services, default keyboard, location mode. Normal apps may **read** many of them but can never write. Only the system (or a platform-signed app holding `WRITE_SECURE_SETTINGS`) can.',
    cmd: 'adb shell settings get secure enabled_accessibility_services',
  },
  {
    key: 'airplane_mode_on',
    value: '0',
    store: 'global',
    facts: [{ label: 'scope', value: 'device-wide, every user' }, { label: 'writable by', value: 'system / signature apps only' }, { label: 'stored in', value: 'user 0’s settings_global.xml' }],
    note: '**Settings.Global** is for things that exist once per *device*, not per person: airplane mode, `adb_enabled`, mobile data. Switch users and these stay the same. That’s the difference from System/Secure, which each user has a copy of.',
    cmd: 'adb shell settings put global airplane_mode_on 1',
  },
];

export function PropsSettings() {
  const [sel, setSel] = useState<string>('ro.build.version.security_patch');
  const entry = ENTRIES.find((e) => e.key === sel)!;
  const st = STORE[entry.store];

  const group = (stores: Entry['store'][]) => ENTRIES.filter((e) => stores.includes(e.store));

  const Row = ({ e }: { e: Entry }) => {
    const s = STORE[e.store];
    const active = sel === e.key;
    return (
      <button
        onClick={() => setSel(e.key)}
        className={cn('flex w-full items-center justify-between gap-2 rounded-md border px-2 py-1 text-left font-mono text-[10.5px] transition-colors', !active && 'hover:bg-[#241e0e]')}
        style={{ borderColor: active ? s.border : '#2e2817', background: active ? '#221d10' : 'transparent' }}
      >
        <span className="truncate font-bold" style={{ color: active ? s.text : '#ded4ba' }}>{e.key}</span>
        <span className="shrink-0" style={{ color: '#9a874f' }}>{e.value}</span>
      </button>
    );
  };

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        Properties vs Settings <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Two different key-value stores configure the whole device. Click any key.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border-2 border-[#8a7030] bg-[#1c1810] p-2.5">
          <div className="mb-1.5 text-[12.5px] font-bold" style={{ color: '#d7b155' }}>System properties <span className="font-mono text-[10px] font-normal" style={{ color: '#9a874f' }}>getprop / setprop</span></div>
          <div className="space-y-1">{group(['prop']).map((e) => <Row key={e.key} e={e} />)}</div>
        </div>
        <div className="rounded-xl border-2 border-[#4a6a4a] bg-[#151c12] p-2.5">
          <div className="mb-1.5 text-[12.5px] font-bold" style={{ color: '#b9e0b5' }}>SettingsProvider <span className="font-mono text-[10px] font-normal" style={{ color: '#9a874f' }}>adb shell settings</span></div>
          {(['system', 'secure', 'global'] as const).map((s) => (
            <div key={s} className="mb-1.5">
              <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: STORE[s].text }}>{STORE[s].title} · {STORE[s].sub}</div>
              <div className="space-y-1">{group([s]).map((e) => <Row key={e.key} e={e} />)}</div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={entry.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 rounded-xl border-2 p-3"
          style={{ borderColor: st.border, background: '#161208' }}
        >
          <div className="mb-2 font-mono text-[12px] font-bold" style={{ color: st.text }}>{entry.key} = {entry.value}</div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {entry.facts.map((f) => (
              <span key={f.label} className="rounded-md border border-[#4a3d1c] px-2 py-0.5 text-[10.5px]" style={{ color: '#bda367' }}>
                <span style={{ color: '#8d8268' }}>{f.label}:</span> {f.value}
              </span>
            ))}
          </div>
          <div className="text-[12.5px] leading-relaxed" style={{ color: '#ded4ba' }}><RichText>{entry.note}</RichText></div>
          <div className="mt-2 rounded-md bg-[#0e0b05] px-2 py-1 font-mono text-[10.5px]" style={{ color: '#8fd48a' }}>$ {entry.cmd}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
