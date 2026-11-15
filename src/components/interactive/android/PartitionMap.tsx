import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RichText } from '@/components/ui/RichText';

// The device's storage, drawn like a disk map: physical partitions,
// the "super" partition holding resizable logical ones, and which side
// of the Treble wall each belongs to.

interface Part {
  id: string;
  name: string;
  owner: 'google' | 'oem' | 'vendor' | 'user' | 'boot';
  grow: number;
  note: string;
}

const OWNER: Record<Part['owner'], { label: string; border: string; bg: string; text: string }> = {
  boot: { label: 'boot chain', border: '#c07a50', bg: '#201612', text: '#e8b896' },
  google: { label: 'platform (AOSP)', border: '#d7b155', bg: '#2a2310', text: '#f3dc9b' },
  oem: { label: 'device maker', border: '#6fae6a', bg: '#1d2a1d', text: '#b9e0b5' },
  vendor: { label: 'SoC vendor', border: '#b06ab0', bg: '#241424', text: '#e0b5e0' },
  user: { label: 'user data', border: '#5a9bd4', bg: '#101d2a', text: '#b5d4ee' },
};

const PHYSICAL_BEFORE: Part[] = [
  { id: 'boot', name: 'boot', owner: 'boot', grow: 1, note: 'The **kernel** (+ generic ramdisk). The exact `boot.img` the bootloader verifies with AVB and loads, from the boot topic.' },
  { id: 'vendor_boot', name: 'vendor_boot', owner: 'boot', grow: 1, note: 'The vendor’s ramdisk and kernel modules, split out of boot so Google’s generic kernel image (GKI) can stay generic.' },
  { id: 'vbmeta', name: 'vbmeta', owner: 'boot', grow: 0.7, note: 'The **AVB** signatures and hashes for the other partitions: the root of the chain of trust after the bootloader.' },
];

const LOGICAL: Part[] = [
  { id: 'system', name: '/system', owner: 'google', grow: 3, note: 'The generic Android framework: `system_server`, framework JARs, core apps. Built from AOSP. On a Treble device this is what a **GSI** replaces.' },
  { id: 'system_ext', name: '/system_ext', owner: 'oem', grow: 1.3, note: 'OEM additions that are **tightly coupled to the system** image, such as framework extensions and privileged OEM apps. Updated together with /system.' },
  { id: 'product', name: '/product', owner: 'oem', grow: 1.5, note: 'Product-specific apps, overlays and config for one **product/SKU**: carrier apps, regional customisations. Lets one system image serve many products.' },
  { id: 'vendor', name: '/vendor', owner: 'vendor', grow: 2, note: 'The **SoC vendor’s** half of the Treble wall: HAL implementations, vendor native daemons, vendor sepolicy. Must keep working when /system is updated.' },
  { id: 'odm', name: '/odm', owner: 'vendor', grow: 1, note: 'The **device maker’s** customisations *on top of* the vendor partition (ODM = original design manufacturer): board-specific HAL tweaks, so one SoC vendor image can serve several devices.' },
];

const PHYSICAL_AFTER: Part[] = [
  { id: 'userdata', name: '/data', owner: 'user', grow: 4, note: '**userdata**: everything that changes at runtime. Installed apps (`/data/app`), each user’s app data (`/data/user/<id>`), `packages.xml`, ANR traces, tombstones, persistent properties. Encrypted with FBE. A factory reset wipes it.' },
];

export function PartitionMap() {
  const [open, setOpen] = useState<string | null>('super');
  const all = [...PHYSICAL_BEFORE, ...LOGICAL, ...PHYSICAL_AFTER];
  const sel = all.find((p) => p.id === open);

  const Block = ({ p }: { p: Part }) => {
    const o = OWNER[p.owner];
    const active = open === p.id;
    return (
      <button
        onClick={() => setOpen(active ? null : p.id)}
        className="flex min-h-[54px] items-center justify-center rounded-lg border-2 px-1.5 text-center font-mono text-[11px] font-bold transition-all"
        style={{
          flexGrow: p.grow,
          flexBasis: 0,
          borderColor: active ? '#f3dc9b' : o.border,
          background: o.bg,
          color: o.text,
          boxShadow: active ? '0 0 14px rgba(215,177,85,0.35)' : undefined,
        }}
      >
        {p.name}
      </button>
    );
  };

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        The Partition Map <span className="not-italic">:-</span>
      </h3>
      <p className="mb-4 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        The device’s storage, left to right. Tap any block. The dashed box is <span className="font-mono not-italic">super</span>, which holds the resizable “dynamic” partitions.
      </p>

      <div className="flex flex-wrap items-stretch gap-1.5 sm:flex-nowrap">
        <div className="flex w-full gap-1.5 sm:w-auto sm:flex-[2.7]">
          {PHYSICAL_BEFORE.map((p) => <Block key={p.id} p={p} />)}
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(open === 'super' ? null : 'super')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(open === 'super' ? null : 'super'); }}
          className="relative w-full cursor-pointer rounded-xl border-2 border-dashed p-1.5 pt-5 text-left sm:w-auto sm:flex-[8.8]"
          style={{ borderColor: open === 'super' ? '#f3dc9b' : '#8a7030' }}
        >
          <span className="absolute left-2 top-1 font-mono text-[10px] font-bold" style={{ color: '#d7b155' }}>super (dynamic partitions)</span>
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {LOGICAL.map((p) => <Block key={p.id} p={p} />)}
          </div>
        </div>
        <div className="flex w-full sm:w-auto sm:flex-[4]">
          {PHYSICAL_AFTER.map((p) => <Block key={p.id} p={p} />)}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
        {Object.values(OWNER).map((o) => (
          <span key={o.label} className="flex items-center gap-1 text-[10.5px]" style={{ color: '#9a874f' }}>
            <span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ borderColor: o.border, background: o.bg }} /> {o.label}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={open ?? 'none'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 min-h-[60px] rounded-xl border border-[#4a3d1c] bg-[#161208] px-3.5 py-2.5 text-[12.5px] leading-relaxed"
          style={{ color: '#ded4ba' }}
        >
          {open === 'super' ? (
            <>
              <strong style={{ color: '#d7b155' }}>super: dynamic partitions (Android 10+).</strong> One big physical partition holding <em>logical</em> partitions whose sizes are decided by metadata, not fixed at the factory. An OTA can grow /system and shrink /product without repartitioning the flash. On A/B devices there are two copies (slot _a / _b) so updates install in the background and switch on reboot.
            </>
          ) : sel ? (
            <RichText>{`**${sel.name}** · ${OWNER[sel.owner].label}. ${sel.note}`}</RichText>
          ) : (
            <span className="italic" style={{ color: '#6f6549' }}>Tap a partition.</span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
