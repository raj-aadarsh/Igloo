import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, FileCode2, Folder, FolderOpen } from 'lucide-react';
import { RichText } from '@/components/ui/RichText';

// The AOSP source tree as a map of this course: every folder points back to
// a topic you've already learned. Click to expand, click again for the note.

interface Node {
  name: string;
  note?: string;
  topic?: string;
  children?: Node[];
}

const TREE: Node[] = [
  {
    name: 'frameworks/',
    note: 'The Android framework: the Java API and system services (base) plus the native framework (native).',
    children: [
      {
        name: 'base/',
        note: 'The biggest and most-edited project in AOSP.',
        children: [
          { name: 'core/java/android/', note: 'The public `android.*` API that apps compile against: `Activity`, `View`, `Intent`, `Handler`, `Looper`, `Binder`…', topic: 'Components · Handler/Looper' },
          { name: 'core/java/com/android/internal/os/', note: '`ZygoteInit.java`, `RuntimeInit`: Zygote’s Java half lives here.', topic: 'Boot Sequence' },
          {
            name: 'services/core/java/com/android/server/',
            note: 'The system services that run inside `system_server`. `SystemServer.java` (the 3 start groups) is one level up in `services/java/`.',
            topic: 'Core System Services',
            children: [
              { name: 'am/', note: '`ActivityManagerService`, `ProcessList` (the oom_adj constants), `OomAdjuster`, ANR handling.', topic: 'AMS · Memory' },
              { name: 'wm/', note: '`WindowManagerService`, and since Android 10 also `ActivityTaskManagerService`, `Task`, `ActivityRecord`: the back stacks.', topic: 'WMS · Launch modes' },
              { name: 'pm/', note: '`PackageManagerService`: the manifest scan, `packages.xml`, permission state.', topic: 'PMS' },
              { name: 'input/', note: '`InputManagerService`: the Java side of the input pipeline.', topic: 'Input Pipeline' },
              { name: 'Watchdog.java', note: 'The thread that kills system_server when a core lock or thread is stuck for ~60 s.', topic: 'Stability' },
            ],
          },
          { name: 'packages/SystemUI/', note: 'The status bar, shade, keyguard and recents: the whole SystemUI app.', topic: 'SystemUI' },
          { name: 'packages/SettingsProvider/', note: 'The provider behind `Settings.System / Secure / Global`.', topic: 'Properties & Settings' },
          { name: 'cmds/', note: 'Shell tools: `am`, `pm`, `wm`, `settings`… their Java front-ends.' },
        ],
      },
      {
        name: 'native/',
        note: 'The C++ half of the framework.',
        children: [
          { name: 'libs/binder/', note: '`libbinder`: `IPCThreadState`, `Parcel.cpp`, the native side of every Binder call.', topic: 'Binder IPC' },
          { name: 'services/surfaceflinger/', note: 'SurfaceFlinger, the compositor.', topic: 'Graphics Pipeline' },
          { name: 'services/inputflinger/', note: '`EventHub`, `InputReader`, `InputDispatcher`, the native input pipeline.', topic: 'Input Pipeline' },
          { name: 'libs/gui/', note: '`BufferQueue`, `Surface`, `BLASTBufferQueue`.', topic: 'Graphics Pipeline' },
        ],
      },
    ],
  },
  {
    name: 'system/',
    note: 'Low-level system pieces below the framework.',
    children: [
      { name: 'core/init/', note: 'The init process (PID 1): first-stage init, SELinux setup, property service, `.rc` parsing.', topic: 'Boot Sequence · Properties' },
      { name: 'sepolicy/', note: 'Platform SELinux policy: `.te` files, `file_contexts`, `property_contexts`, and the neverallow rules.', topic: 'Security' },
      { name: 'memory/lmkd/', note: 'The low-memory killer daemon: PSI monitoring and kill decisions.', topic: 'Memory' },
      { name: 'logging/', note: '`logd` and `logcat`.', topic: 'Stability' },
    ],
  },
  { name: 'hardware/interfaces/', note: 'The stable HAL interface definitions (AIDL and older HIDL): `vibrator/`, `camera/`, `graphics/composer/`… The Treble contract, in files.', topic: 'JNI & HAL' },
  { name: 'art/', note: 'The Android Runtime: the interpreter, JIT, `dex2oat` AOT compiler, garbage collector.', topic: 'Architecture' },
  { name: 'bionic/', note: 'Android’s own C library (libc), dynamic linker and math library.', topic: 'Architecture' },
  { name: 'packages/', note: 'Apps (`apps/Settings`, `apps/Launcher3`…) and `modules/`: the **Mainline** modules updated through Google Play, outside full OTAs.' },
  { name: 'build/', note: 'The build system itself: `envsetup.sh`, `soong/`, `make/` (product configuration).', topic: 'Builds' },
  { name: 'device/<vendor>/<device>/', note: 'Per-device configuration: `BoardConfig.mk`, `device.mk`, fstab, device `.rc` files, overlays.' },
  { name: 'vendor/', note: 'Vendor-provided code and prebuilts (often closed source): HAL implementations, firmware blobs.' },
  { name: 'out/', note: 'Build output. `out/target/product/<device>/` holds `system.img`, `vendor.img`, `boot.img`… Delete it and you rebuild everything.', topic: 'Builds' },
];

function TreeNode({ node, depth, path, openPath, setOpenPath, expanded, toggle }: {
  node: Node;
  depth: number;
  path: string;
  openPath: string | null;
  setOpenPath: (p: string | null) => void;
  expanded: Set<string>;
  toggle: (p: string) => void;
}) {
  const isDir = !!node.children;
  const isOpen = expanded.has(path);
  const showNote = openPath === path;

  const onClick = () => {
    if (isDir) toggle(path);
    setOpenPath(showNote ? null : path);
  };

  return (
    <div>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left transition-colors hover:bg-[#241e0e]"
        style={{ paddingLeft: depth * 16 + 4 }}
      >
        {isDir ? (
          <ChevronRight size={12} className="shrink-0 transition-transform" style={{ color: '#9a874f', transform: isOpen ? 'rotate(90deg)' : undefined }} />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        {isDir ? (
          isOpen ? <FolderOpen size={13} className="shrink-0" style={{ color: '#d7b155' }} /> : <Folder size={13} className="shrink-0" style={{ color: '#d7b155' }} />
        ) : (
          <FileCode2 size={13} className="shrink-0" style={{ color: '#9a874f' }} />
        )}
        <span className="font-mono text-[12px] font-bold" style={{ color: showNote ? '#f3dc9b' : '#ded4ba' }}>{node.name}</span>
        {node.topic && (
          <span className="ml-auto hidden shrink-0 rounded px-1.5 py-px text-[9.5px] font-semibold sm:inline" style={{ background: '#1d2a1d', color: '#b9e0b5' }}>
            {node.topic}
          </span>
        )}
      </button>
      <AnimatePresence>
        {showNote && node.note && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div
              className="my-1 rounded-lg border border-[#4a3d1c] bg-[#161208] px-3 py-1.5 text-[12px] leading-relaxed"
              style={{ marginLeft: depth * 16 + 24, color: '#ded4ba' }}
            >
              <RichText>{node.note}</RichText>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isDir && isOpen &&
        node.children!.map((c) => (
          <TreeNode key={c.name} node={c} depth={depth + 1} path={`${path}${c.name}`} openPath={openPath} setOpenPath={setOpenPath} expanded={expanded} toggle={toggle} />
        ))}
    </div>
  );
}

export function AospTree() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['frameworks/']));
  const [openPath, setOpenPath] = useState<string | null>(null);

  const toggle = (p: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(p)) n.delete(p); else n.add(p);
      return n;
    });

  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-[#2e2817] bg-[#131007] p-4 shadow-soft sm:p-6">
      <h3 className="text-[17px] font-bold italic tracking-wide" style={{ color: '#8fd48a' }}>
        The AOSP Source Map <span className="not-italic">:-</span>
      </h3>
      <p className="mb-3 mt-1 text-[12.5px] italic" style={{ color: '#8d8268' }}>
        Every topic in this course lives somewhere in this tree. The green tags show which one. Click folders to open them.
      </p>
      <div className="rounded-xl border border-[#4a3d1c] bg-[#0e0b05] p-2">
        {TREE.map((n) => (
          <TreeNode key={n.name} node={n} depth={0} path={n.name} openPath={openPath} setOpenPath={setOpenPath} expanded={expanded} toggle={toggle} />
        ))}
      </div>
      <div className="mt-3 text-center text-[11px] italic" style={{ color: '#6f6549' }}>
        Search the real tree online at cs.android.com, the fastest way to read framework code.
      </div>
    </div>
  );
}
