import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, RotateCcw, StepForward } from 'lucide-react';
import { cn } from '@/lib/cn';

// One Binder call, frame by frame: Proxy → Parcel → one copy into the
// mmap-ed buffer → Stub → reply. The "1 copy" trick made visible.

interface Step {
  narration: string;
  parcelAt: 'none' | 'client' | 'kernel' | 'server' | 'client-reply';
  highlight: ('client' | 'kernel' | 'server' | 'sm')[];
}

const STEPS: Step[] = [
  {
    narration: 'Our app wants Wi-Fi info. But WifiService lives in system_server — a different process, and the kernel walls every process’s memory off from the others. A plain method call can’t cross that wall. Press Next.',
    parcelAt: 'none',
    highlight: ['client'],
  },
  {
    narration: 'Step 1 — Lookup. The app asks ServiceManager (reachable by everyone at the fixed Binder handle 0) for “wifi”. It gets back a *handle* — think of it as a numbered ticket for the service, not a memory address. Handles are given out by the kernel, so they can’t be faked.',
    parcelAt: 'none',
    highlight: ['sm', 'client'],
  },
  {
    narration: 'Step 2 — Flatten. The app actually talks to a Proxy (a stand-in object that *looks* like the real service). The Proxy writes the method ID + arguments into a Parcel — Android’s way of flattening objects into a row of bytes that can travel.',
    parcelAt: 'client',
    highlight: ['client'],
  },
  {
    narration: 'Step 3 — THE one copy. The Proxy hands the Parcel to the Binder driver (a system call into the kernel). The driver copies the bytes ONCE — directly into a buffer that is mmap-ed into system_server. mmap = a kernel trick where the same physical memory shows up inside two places at once. So the copy *into the kernel* is already the copy *into the receiver*.',
    parcelAt: 'kernel',
    highlight: ['kernel'],
  },
  {
    narration: 'Step 4 — Dispatch. A thread from system_server’s Binder thread pool wakes up, the Stub (the server-side twin of the Proxy) unflattens the Parcel and calls the real method. First thing the service does: check who’s calling via Binder.getCallingUid() — identity comes from the kernel, so permission checks here can’t be spoofed.',
    parcelAt: 'server',
    highlight: ['server'],
  },
  {
    narration: 'Step 5 — Reply. The result rides back in a reply Parcel over the same one-copy road, and the Proxy hands the app a plain Java object. To the app the whole journey looked like one ordinary method call — that’s the magic of Binder.',
    parcelAt: 'client-reply',
    highlight: ['client'],
  },
];

function Parcel({ reply }: { reply?: boolean }) {
  return (
    <motion.div
      layoutId="parcel"
      className="mx-auto flex w-fit items-center gap-1 rounded-md border px-2 py-1 font-mono text-[10px] font-bold"
      style={{ borderColor: reply ? '#6fae6a' : '#d7b155', background: reply ? '#1d2a1d' : '#2a2310', color: reply ? '#b9e0b5' : '#f3dc9b' }}
    >
      <Package size={11} /> {reply ? 'reply Parcel' : 'Parcel'}
    </motion.div>
  );
}

export function BinderIpc() {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];
  const done = idx >= STEPS.length - 1;

  const Box = ({
    id,
    title,
    mono,
    children,
  }: {
    id: 'client' | 'kernel' | 'server';
    title: string;
    mono: string;
    children?: React.ReactNode;
  }) => {
    const hot = step.highlight.includes(id);
    return (
      <div
        className={cn('flex min-h-[150px] flex-col rounded-xl border-2 p-2.5 transition-all')}
        style={{
          borderColor: hot ? '#e8c56a' : '#4a3d1c',
          background: id === 'kernel' ? '#1a1309' : '#161208',
          boxShadow: hot ? '0 0 18px rgba(215,177,85,0.25)' : undefined,
        }}
      >
        <div className="text-center text-[12px] font-bold" style={{ color: hot ? '#f3dc9b' : '#d7b155' }}>{title}</div>
        <div className="mb-2 text-center font-mono text-[9.5px]" style={{ color: '#9a874f' }}>{mono}</div>
        <div className="flex flex-1 flex-col justify-center gap-1.5">{children}</div>
      </div>
    );
  };

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
          One Binder Call <span className="not-italic">:-</span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => (done ? setIdx(0) : setIdx(idx + 1))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#d7b155] px-2.5 py-1 text-xs font-bold text-[#1c1810] hover:bg-[#e8c56a]"
          >
            <StepForward size={12} /> {done ? 'Replay' : idx === 0 ? 'Start' : 'Next'}
          </button>
          <button onClick={() => setIdx(0)} className="inline-flex items-center gap-1 rounded-lg border border-[#6a5624] px-2 py-1 text-xs font-semibold text-[#a8893f] hover:bg-[#241e0e]">
            <RotateCcw size={11} />
          </button>
        </div>
      </div>
      <p className="mb-3 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        How a method call crosses the wall between two processes — with exactly one copy of the data.
      </p>

      {/* ServiceManager strip */}
      <div
        className="mx-auto mb-2 w-fit rounded-lg border px-3 py-1 text-center transition-all"
        style={{
          borderColor: step.highlight.includes('sm') ? '#e8c56a' : '#4a3d1c',
          background: step.highlight.includes('sm') ? '#2a2310' : '#161208',
          boxShadow: step.highlight.includes('sm') ? '0 0 14px rgba(215,177,85,0.3)' : undefined,
        }}
      >
        <span className="text-[11px] font-bold" style={{ color: '#d7b155' }}>servicemanager</span>
        <span className="ml-2 font-mono text-[9.5px]" style={{ color: '#9a874f' }}>“wifi” → handle · itself = handle 0</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Box id="client" title="Our app" mono="its own walled memory">
          <div className="rounded-md border border-[#4a3d1c] px-2 py-1 text-center font-mono text-[9.5px]" style={{ color: idx >= 2 ? '#f3dc9b' : '#6f6549' }}>
            Proxy (IWifiManager)
          </div>
          {step.parcelAt === 'client' && <Parcel />}
          {step.parcelAt === 'client-reply' && <Parcel reply />}
        </Box>

        <Box id="kernel" title="Binder driver" mono="kernel · /dev/binder">
          <div
            className="rounded-md border border-dashed px-2 py-1.5 text-center font-mono text-[9px] leading-snug"
            style={{ borderColor: idx === 3 ? '#e8c56a' : '#4a3d1c', color: idx >= 3 ? '#bda367' : '#6f6549' }}
          >
            mmap-ed buffer
            <br />
            (same memory, visible in system_server too)
          </div>
          {step.parcelAt === 'kernel' && (
            <>
              <Parcel />
              <div className="text-center font-mono text-[9px] font-bold" style={{ color: '#8fd48a' }}>copy #1 — the only one</div>
            </>
          )}
        </Box>

        <Box id="server" title="system_server" mono="WifiService lives here">
          <div className="rounded-md border border-[#4a3d1c] px-2 py-1 text-center font-mono text-[9.5px]" style={{ color: idx >= 4 ? '#f3dc9b' : '#6f6549' }}>
            Stub → real method
          </div>
          <div className="rounded-md border border-[#4a3d1c] px-2 py-1 text-center font-mono text-[9px]" style={{ color: idx >= 4 ? '#bda367' : '#6f6549' }}>
            Binder thread pool {idx >= 4 ? '· one thread awake' : '· waiting'}
          </div>
          {step.parcelAt === 'server' && <Parcel />}
        </Box>
      </div>

      {/* Narration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 rounded-xl border border-[#4a3d1c] bg-[#161208] px-3.5 py-2.5 text-[12.5px] leading-relaxed"
          style={{ color: '#ded4ba' }}
        >
          {step.narration}
        </motion.div>
      </AnimatePresence>

      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 rounded-xl border border-[#2e4a2e] bg-[#12210f] px-3.5 py-2.5 text-[12px] leading-relaxed" style={{ color: '#b9e0b5' }}>
          <strong>Why not just use sockets/pipes?</strong> A socket needs <strong>two</strong> copies: sender → kernel buffer (copy 1), kernel → receiver (copy 2). Binder’s mmap trick removes the second one — and on a phone where <em>every</em> framework interaction is IPC, halving the copying is a big deal.
        </motion.div>
      )}
    </div>
  );
}
