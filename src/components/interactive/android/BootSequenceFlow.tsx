import { NotesFlow, type NotesStep } from './NotesFlow';

// The complete Android boot sequence, drawn exactly like a notebook page:
// vertical flow, side-notes beside each box, labelled arrows, tap for depth.

const steps: NotesStep[] = [
  {
    kind: 'node',
    node: {
      id: 'bootrom',
      title: 'Power ON & Boot ROM',
      mono: 'PBL · burned into the SoC',
      notes: ['Hardcoded in the chip silicon by the vendor', 'Initialises basic HW & verifies the SBL (secure boot)'],
      detail:
        'On the power button press the CPU knows nothing about Android or even RAM — it simply executes code at a fixed address inside the **Boot ROM** (the Primary Bootloader, burned read-only into the SoC by the chipmaker, e.g. Qualcomm). It does basic hardware checks, cryptographically **verifies the signature of the next bootloader stage**, and loads it into internal SRAM.',
    },
  },
  {
    kind: 'node',
    edge: '(verified hand-off)',
    node: {
      id: 'bootloader',
      title: 'Bootloader',
      mono: 'SBL / XBL / ABL / U-Boot',
      notes: ['Initialises main memory (RAM) & storage', 'Vol-down → fastboot · Vol-up → recovery', 'AVB verifies boot images → chain of trust', 'Loads boot.img (kernel + ramdisk)'],
      detail:
        'Handles the transition from hardware init to software. **XBL** brings up RAM and clocks, then **ABL** takes over. It checks whether a key combo asks for **fastboot** (Vol-down) or **recovery** (Vol-up), runs **AVB — Android Verified Boot** (`dm-verity`) to cryptographically verify the integrity of `boot.img`, `vendor_boot.img` and the system partitions (the *chain of trust*), then loads the **Linux kernel + ramdisk** into memory and jumps to the kernel entry point.',
    },
  },
  {
    kind: 'node',
    node: {
      id: 'kernel',
      title: 'Linux Kernel',
      notes: ['Initialises CPU, memory & essential drivers', 'Sets up the Binder driver (`/dev/binder`) for IPC', 'Mounts rootfs → spawns the first user process'],
      detail:
        'The kernel takes control: sets up **virtual memory, CPU scheduling and interrupt handlers**, initialises built-in drivers (display, USB, I²C — and crucially the **Binder driver**, `/dev/binder`, so IPC exists before any framework code runs). It mounts the initial root filesystem, establishes the basic security ground rules, then spawns **`/system/bin/init`** — the very first user-space process.',
    },
  },
  {
    kind: 'node',
    node: {
      id: 'init',
      title: 'Init Process',
      mono: 'PID = 1 · /system/bin/init',
      notes: ['First user-space process created by the kernel', 'i) Mounts partitions (`/sys`, `/dev`, `/proc`)', 'ii) Loads SELinux policies (system + vendor) → **Enforcing**', 'iii) Starts property service & parses `init.rc`'],
      detail:
        'The grandparent of every Android process, and it runs in **three internal stages**: **first-stage init** mounts the virtual filesystems (`/dev`, `/proc`, `/sys`) and early partitions (`/system`, `/vendor`, `/product`); the **SELinux setup stage** loads the compiled policy from system + vendor and flips SELinux to **Enforcing** *before anything else starts*, so nothing ever runs unconfined; **second-stage init** starts the **property service** (`ro.*`, `persist.*`, `sys.*`), parses `init.rc` (plus hardware `.rc` files), and launches the essential native services.',
    },
  },
  {
    kind: 'branch',
    edge: '(spawned via init.rc)',
    nodes: [
      {
        id: 'daemons',
        title: 'Native Daemons',
        mono: 'vold · lmkd · surfaceflinger',
        notes: ['essential native services'],
        detail:
          'Native C++ services from `init.rc`: **vold** (storage mounting + file-based encryption), **lmkd** (low-memory killer), **surfaceflinger** (the display compositor — it also triggers `bootanimation`, which is why the logo appears now), **netd**, **logd** and friends.',
      },
      {
        id: 'servicemanager',
        title: 'ServiceManager',
        mono: 'Binder handle 0',
        notes: ['the phonebook of Binder IPC'],
        detail:
          'The **DNS/phonebook of Binder**: every system service must register itself here by name, and every client looks services up here. It holds the special Binder **context-manager handle 0**, so everyone can find it without looking it up.',
      },
      {
        id: 'zygote',
        title: 'Zygote',
        mono: 'app_process64',
        notes: ['template process for every app'],
        detail:
          'Started from `init.zygote64.rc` (binary `app_process64`). Like a biological cell that divides to create identical cells, Zygote is the **template process that forks to create every Java process in Android**. Inside `ZygoteInit.main()`: ① creates the **ART VM** in C++ and switches into Java, ② **preloads ~15,000 framework classes** + shared resources (`framework-res.apk`), ③ opens the socket **`/dev/socket/zygote`** for launch commands, ④ forks its very first child — **SystemServer**.',
      },
    ],
  },
  {
    kind: 'node',
    edge: '(fork — Zygote’s first child)',
    node: {
      id: 'systemserver',
      title: 'System Server',
      mono: 'system_server',
      notes: ['The brain of the framework', 'Starts a Looper + loads `libandroid_servers.so`', 'Starts 90+ Java services in **3 ordered groups**', 'All of them register with ServiceManager'],
      detail:
        'One process hosting nearly **all Java framework services**. Inside `SystemServer.run()`: starts the main-thread **Looper**, loads native libs, creates **SystemServiceManager** (service lifecycles + boot phases), then starts services in 3 ordered groups to avoid circular dependencies — **`startBootstrapServices()`** (Installer, **AMS**, PowerMS, DisplayMS, **PMS** — which scans every APK, UserMS), **`startCoreServices()`** (BatteryService, UsageStats, WebViewUpdate), **`startOtherServices()`** (the other 70+: **WMS**, InputMS, Audio, Storage, Network, **Watchdog** — and it launches **SystemUI**, `com.android.systemui`). Finally **`AMS.systemReady()`** runs once everything is registered.',
    },
  },
  {
    kind: 'node',
    edge: '(AMS.systemReady())',
    node: {
      id: 'launcher',
      title: 'Home Launcher & Boot Complete',
      notes: ['`startHomeOnAllDisplays()` → launches `CATEGORY_HOME`', 'PIN-locked? **FallbackHome** first, real launcher after unlock', 'First frame → `service.bootanim.exit = 1`', 'Fires `ACTION_BOOT_COMPLETED`'],
      detail:
        '`AMS.systemReady()` calls **`startHomeOnAllDisplays()`**, asking **PMS** which app handles `Intent.CATEGORY_HOME`. On a PIN-locked device, credential-encrypted storage is still locked — so a dummy `directBootAware` screen (**FallbackHome**) starts first, and the real launcher comes after unlock. When the launcher draws its first frame, WMS/SurfaceFlinger set **`service.bootanim.exit = 1`** to kill the boot animation, AMS fires **`PHASE_BOOT_COMPLETED` (1000)** and sends the system-wide broadcast **`ACTION_BOOT_COMPLETED`**. The device is fully up.',
    },
  },
];

export function BootSequenceFlow() {
  return (
    <NotesFlow
      title="Android Boot Sequence"
      intro="Power button → home screen, in seven hand-offs. Follow the side-notes like margin scribbles."
      steps={steps}
    />
  );
}
