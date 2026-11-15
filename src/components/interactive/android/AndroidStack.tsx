import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronDown, RotateCcw, StepForward } from 'lucide-react';
import { RichText } from '@/components/ui/RichText';
import { cn } from '@/lib/cn';

// The 5 layers of Android, drawn as a stack on a dark notebook page.
// Tap a layer to unfold it — or trace a real camera call from app to silicon.

interface Layer {
  id: string;
  name: string;
  mono: string;
  tint: string;
  border: string;
  examples: string;
  detail: string;
  trace: string;
}

const LAYERS: Layer[] = [
  {
    id: 'apps',
    name: 'System & User Apps',
    mono: 'launcher · dialer · camera · your APKs',
    tint: '#1d2a1d',
    border: '#6fae6a',
    examples: 'System apps live in `/system/priv-app` & `/product/app` · user apps in `/data/app`',
    detail:
      'The top of the stack — every APK, whether shipped with the device or installed by the user. **System apps** (`/system/priv-app`, `/product/app`) can hold privileged permissions; **user apps** (`/data/app`) live in the standard sandbox. Both talk to the system *only* through the framework APIs below — no app ever touches a driver directly.',
    trace: 'Our camera app calls `cameraManager.openCamera(...)` — a normal Java API call.',
  },
  {
    id: 'framework',
    name: 'Java API Framework',
    mono: 'android.* APIs · system services in system_server',
    tint: '#2a2310',
    border: '#d7b155',
    examples: 'AMS · WMS · PMS · PackageInstaller · View system · Resources',
    detail:
      'The `android.*` classes apps compile against, plus the **system services** that do the real work — **AMS** (activities & processes), **WMS** (windows), **PMS** (packages), NotificationManager and ~90 more, almost all hosted inside **system_server**. Your API call usually turns into a **Binder IPC** into one of these services, which enforces permissions before acting.',
    trace: 'The call crosses **Binder** into `CameraService`, which checks the `CAMERA` permission.',
  },
  {
    id: 'native',
    name: 'Native C/C++ Libraries & ART',
    mono: 'bionic · libbinder · Skia · OpenGL ES · SQLite — and the ART VM',
    tint: '#101d2a',
    border: '#5a9bd4',
    examples: 'ART runs your dex bytecode (AOT + JIT + interpreter, GC)',
    detail:
      'Two things share this layer. **Native libraries**: `bionic` (Android’s libc), `libbinder`, Skia (2D drawing), OpenGL ES/Vulkan, SQLite, media codecs — the C/C++ muscle the framework stands on. And **ART**, the Android Runtime, which executes your app’s DEX bytecode with a mix of **AOT compilation** (`dex2oat` at install/idle), **JIT** for hot paths, an interpreter, and a modern generational **garbage collector**.',
    trace: '`CameraService` (native, in C++) prepares the request using native libs — no Java below this line.',
  },
  {
    id: 'hal',
    name: 'Hardware Abstraction Layer',
    mono: 'vendor HALs · Project Treble · /vendor partition',
    tint: '#241424',
    border: '#b06ab0',
    examples: 'camera HAL · audio HAL · sensors HAL — stable AIDL/HIDL interfaces',
    detail:
      'The translation layer between Android’s *standard expectations* and each vendor’s *actual hardware*. Every device ships vendor-written HAL modules (camera, audio, sensors…) on the **`/vendor`** partition. **Project Treble** (Android 8) drew a hard line here: the framework and vendor code talk only through **versioned, stable interfaces** (HIDL, now **stable AIDL**), so the Android side can be updated **without waiting for vendors to rewrite their half** — the single biggest fix for slow OS updates.',
    trace: 'The request reaches the vendor’s **camera HAL** through its stable AIDL interface.',
  },
  {
    id: 'kernel',
    name: 'Linux Kernel',
    mono: 'drivers · Binder driver · memory & process mgmt · SELinux',
    tint: '#201612',
    border: '#c07a50',
    examples: 'The only layer that touches real hardware',
    detail:
      'A modified Linux kernel: process scheduling, memory management, power management (wakelocks), security enforcement (**SELinux** lives here), and every hardware **driver**. Android’s additions matter in interviews: the **Binder driver** (`/dev/binder`) that powers all IPC, **ashmem/memfd** shared memory, and the **low-memory killer** path. Only kernel code talks to silicon.',
    trace: 'The HAL calls the **camera driver**, the sensor captures a frame — and the data rides all the way back up. 📸',
  },
];

export function AndroidStack() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [traceIdx, setTraceIdx] = useState<number | null>(null);

  const startTrace = () => { setTraceIdx(0); setOpenId(null); };
  const nextHop = () => {
    if (traceIdx === null) return;
    if (traceIdx >= LAYERS.length - 1) setTraceIdx(null);
    else setTraceIdx(traceIdx + 1);
  };

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
          Android System Architecture <span className="not-italic">:-</span>
        </h3>
        <div className="flex items-center gap-2">
          {traceIdx === null ? (
            <button onClick={startTrace} className="inline-flex items-center gap-1.5 rounded-lg border border-[#6a5624] px-2.5 py-1 text-xs font-semibold text-[#d7b155] hover:bg-[#241e0e]">
              <Camera size={12} /> Trace a camera call
            </button>
          ) : (
            <>
              <button onClick={nextHop} className="inline-flex items-center gap-1.5 rounded-lg bg-[#d7b155] px-2.5 py-1 text-xs font-bold text-[#1c1810] hover:bg-[#e8c56a]">
                <StepForward size={12} /> {traceIdx >= LAYERS.length - 1 ? 'Finish' : 'Next hop'}
              </button>
              <button onClick={() => setTraceIdx(null)} className="inline-flex items-center gap-1 rounded-lg border border-[#6a5624] px-2 py-1 text-xs font-semibold text-[#a8893f] hover:bg-[#241e0e]">
                <RotateCcw size={11} />
              </button>
            </>
          )}
        </div>
      </div>
      <p className="mb-4 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Five layers, one rule: each layer only ever talks to its neighbours.
      </p>

      <div className="mx-auto max-w-2xl space-y-1.5">
        {LAYERS.map((l, i) => {
          const open = openId === l.id;
          const active = traceIdx === i;
          return (
            <div key={l.id}>
              <button
                onClick={() => { setOpenId(open ? null : l.id); }}
                className={cn('w-full rounded-xl border-2 px-4 py-2.5 text-left transition-all')}
                style={{
                  borderColor: active ? '#f3dc9b' : l.border,
                  background: l.tint,
                  boxShadow: active ? '0 0 22px rgba(215,177,85,0.35)' : undefined,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold" style={{ color: l.border }}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="truncate text-[14px] font-bold sm:text-[15px]" style={{ color: '#ece4cf' }}>{l.name}</span>
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[10.5px]" style={{ color: '#9a874f' }}>{l.mono}</div>
                  </div>
                  <ChevronDown size={14} className={cn('shrink-0 transition-transform', open && 'rotate-180')} style={{ color: l.border }} />
                </div>
                <AnimatePresence>
                  {active && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="mt-2 rounded-lg border border-[#4a3d1c] bg-[#161208] px-3 py-2 text-[12.5px]" style={{ color: '#ded4ba' }}>
                        <span className="mr-1.5 font-bold" style={{ color: '#d7b155' }}>hop {i + 1}:</span>
                        <RichText>{l.trace}</RichText>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mx-2 my-1.5 rounded-xl border border-[#4a3d1c] bg-[#161208] p-3.5 text-[13px] leading-relaxed" style={{ color: '#ded4ba' }}>
                      <RichText>{l.detail}</RichText>
                      <div className="mt-2 text-[11.5px] italic" style={{ color: '#9a874f' }}>
                        <RichText>{l.examples}</RichText>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Tap a layer to unfold it — or trace the camera call hop by hop.
      </div>
    </div>
  );
}
