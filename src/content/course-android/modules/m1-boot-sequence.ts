import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'android-m1',
  slug: 'boot-sequence',
  order: 1,
  title: 'Android Boot Sequence',
  subtitle: 'Power button → home screen, hand-off by hand-off',
  icon: 'power',
  lessons: [
    {
      id: 'android-m1-l1',
      title: 'The whole boot on one page',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'This is **the** framework interview topic: it touches hardware, the kernel, init, Zygote and SystemServer in one story — so whoever asks it learns instantly whether you know the system or just apps. Learn it as **one vertical flow with seven hand-offs**, each stage doing just enough to safely start the next.',
        },
        { type: 'widget', widget: 'android-boot' },
        {
          type: 'keyterms',
          title: 'Side-notes to remember',
          terms: [
            { term: 'Chain of trust', def: 'Each stage cryptographically verifies the next before jumping to it — from Boot ROM all the way to the system partitions (AVB).' },
            { term: 'PID 1', def: '`init` is the first user-space process and the ancestor of everything — if it dies, the kernel panics.' },
            { term: 'Zygote', def: 'The warmed-up template process; every Java process in Android is a `fork()` of it.' },
            { term: '3 service groups', def: 'SystemServer starts services as Bootstrap → Core → Other to avoid circular dependencies.' },
            { term: 'Boot is “done” when', def: '`PHASE_BOOT_COMPLETED` fires and `ACTION_BOOT_COMPLETED` is broadcast.' },
          ],
        },
      ],
    },
    {
      id: 'android-m1-l2',
      title: 'Stages in depth — power to PID 1',
      minutes: 11,
      blocks: [
        { type: 'h3', text: 'a) Power ON & Boot ROM (PBL)' },
        {
          type: 'p',
          text: 'On the power press, the CPU has no idea Android or even RAM exists. It executes instructions at a **fixed hardware address** in the **Boot ROM** — read-only code burned into the SoC by the chipmaker. It does basic hardware checks, **verifies the cryptographic signature of the next bootloader** (secure boot — the first link in the chain of trust) and loads it into internal SRAM, because main RAM isn’t initialised yet.',
        },
        { type: 'h3', text: 'b) Bootloader (SBL / XBL / ABL / U-Boot)' },
        {
          type: 'ul',
          items: [
            'Handles the transition from hardware initialisation to software execution. On Qualcomm devices, **XBL** (eXtensible Bootloader) brings up **main memory (RAM)**, clocks and storage, then hands over to **ABL** (Android Bootloader). U-Boot plays this role on many embedded boards.',
            '**Key-combo check**: power + Vol-down → **fastboot** mode; power + Vol-up → **recovery**. This is literally the bootloader reading button states.',
            '**AVB (Android Verified Boot / dm-verity)**: cryptographically verifies the integrity and authenticity of `boot.img`, `vendor_boot.img` and the system partitions **before executing them** — if the OS was tampered with or rooted, verification fails or the warning screen appears.',
            'Finally it loads **`boot.img`** — containing the **Linux kernel + ramdisk (initramfs)** — into memory and jumps to the kernel entry point.',
          ],
        },
        { type: 'h3', text: 'c) Linux Kernel' },
        {
          type: 'p',
          text: 'The kernel uncompresses itself and takes control: it initialises **core system hardware — CPU, memory, interrupt handlers** — sets up virtual memory and the scheduler, and brings up built-in drivers (display, I²C, SPI, USB… and crucially the **Binder driver**, `/dev/binder`, so IPC exists before any framework code). It establishes the basic security ground for user space, mounts the initial root filesystem from the ramdisk, finds `/init` — and spawns it as the **very first user-space process**.',
        },
        { type: 'h3', text: 'd) The init process (PID = 1)' },
        {
          type: 'p',
          text: '`init` is the grandparent of every single Android process — PID 1 because it’s the first process the kernel creates. In modern Android it runs in **three internal stages**:',
        },
        {
          type: 'ol',
          items: [
            '**First-stage init** — mounts the basic virtual filesystems (`/dev`, `/proc`, `/sys`) and the early partitions (`/system`, `/vendor`, `/product`) as listed in the `fstab`.',
            '**SELinux setup stage** — loads the compiled SELinux policy from `/system/etc/selinux` + `/vendor/etc/selinux` into the kernel and switches to **Enforcing** — *before starting any other service*, so nothing ever runs unconfined.',
            '**Second-stage init** — starts the **property service** (managing `ro.*`, `persist.*`, `sys.*` properties), parses **`init.rc`** (plus hardware files like `init.qcom.rc`), and spawns the essential native services.',
          ],
        },
        {
          type: 'p',
          text: 'Those essential services from `init.rc` are worth naming: **servicemanager** (the phonebook of Binder — every system service registers here, it holds context-manager handle 0), **vold** (storage + file-based encryption), **surfaceflinger** (display compositor — it triggers `bootanimation`, which is why the logo appears at this point), and **zygote** — started via `init.zygote64.rc`, with the actual binary being `/system/bin/app_process64`.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Check it yourself',
          text: 'On any device: `adb shell ps -A | head` — you’ll see `init` as PID 1, and `zygote64` + `surfaceflinger` with init (1) as their parent PID. Saying “I’ve looked at this in `ps`” lands better than any diagram.',
        },
      ],
    },
    {
      id: 'android-m1-l3',
      title: 'Stages in depth — Zygote to home screen',
      minutes: 11,
      blocks: [
        { type: 'h3', text: 'e) Zygote — the app spawner' },
        {
          type: 'analogy',
          text: 'a biological cell: a zygote divides to create every other cell in the body. Android’s Zygote is the template process that **forks** to create every Java process — each app is a near-identical copy that then specialises.',
        },
        {
          type: 'p',
          text: 'Inside `ZygoteInit.main()`, four things happen in order:',
        },
        {
          type: 'ol',
          items: [
            '**Creates the ART VM** — the process starts in C++ (`AndroidRuntime::start`), builds the VM, then switches into Java (`ZygoteInit.java`).',
            '**Preloads classes & resources** — ~15,000+ common framework classes (listed in `/system/etc/preloaded-classes`) plus shared themes/drawables from `framework-res.apk` are loaded into its heap.',
            '**Opens the socket** — a UNIX domain socket at `/dev/socket/zygote`, where ActivityManagerService will later send “launch this app” commands when you tap an icon.',
            '**Forks SystemServer** — before waiting for app requests, Zygote’s very first child is **SystemServer** (`forkSystemServer()`).',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Why preload? Copy-on-Write.',
          text: 'When Zygote forks a new app, the child doesn’t reload those 15,000 classes — Linux **Copy-on-Write** lets it simply point at Zygote’s existing memory pages. That one trick makes app startup fast and saves RAM across every running app. It’s also the single best answer to “why does Android fork apps from Zygote instead of starting a fresh VM?”',
        },
        { type: 'h3', text: 'f) SystemServer — the brain of the framework' },
        {
          type: 'p',
          text: 'One process — `system_server` — hosts nearly all Java framework services. Inside `SystemServer.run()`: it starts a **Looper** on its main thread, loads `libandroid_servers.so`, initialises **SystemServiceManager** (service lifecycles + boot phases), then starts services in **3 ordered groups** to prevent circular-dependency crashes:',
        },
        {
          type: 'ul',
          items: [
            '**`startBootstrapServices()`** — the most critical, tightly inter-dependent ones: Installer, **ActivityManagerService**, PowerManagerService, LightsService, DisplayManagerService, **PackageManagerService** (which scans every APK on the device — a big chunk of boot time), UserManagerService.',
            '**`startCoreServices()`** — core trackers: BatteryService, UsageStatsService, WebViewUpdateService.',
            '**`startOtherServices()`** — the remaining 70+: **WindowManagerService**, InputManagerService, AudioService, StorageManagerService, NetworkManagement, **Watchdog** — and it launches **SystemUI** (`com.android.systemui`, status bar + nav bar + notifications).',
          ],
        },
        {
          type: 'p',
          text: 'Once everything is registered with servicemanager, **`AMS.systemReady()`** runs the final callbacks and walks the **boot phases** upward (e.g. `PHASE_SYSTEM_SERVICES_READY` = 500 → `PHASE_ACTIVITY_MANAGER_READY` = 550).',
        },
        { type: 'h3', text: 'g) Launcher startup & boot completed' },
        {
          type: 'ul',
          items: [
            'Inside `systemReady()`, AMS calls **`startHomeOnAllDisplays()`** — it asks PMS which app handles **`Intent.CATEGORY_HOME`** and launches it on every display.',
            '**Encryption detail (modern Android)**: with a PIN set, **credential-encrypted (CE) storage is still locked** at this point. So AMS first launches **FallbackHome** — a dummy, `directBootAware` screen inside Settings — while SystemUI shows the lock screen. After unlock (or immediately, with no PIN), the **real launcher** starts.',
            'When the launcher draws its **first frame**, WMS tells SurfaceFlinger to end the boot animation by setting the property **`service.bootanim.exit = 1`**.',
            'Finally AMS fires **`PHASE_BOOT_COMPLETED` (1000)** and sends the system-wide broadcast **`Intent.ACTION_BOOT_COMPLETED`** — the one apps (with the right permission) can receive to run after-boot work.',
          ],
        },
      ],
    },
    {
      id: 'android-m1-l4',
      title: 'Additional information — what if a process dies?',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'Interviewers love this follow-up, because it proves you understand how the boot chain stays *alive* after boot. Walk it from smallest to biggest:',
        },
        {
          type: 'keyterms',
          title: 'The death chain',
          terms: [
            { term: 'An app dies', def: 'AMS cleans up its records via Binder **DeathRecipient**. Nothing else notices — the phone stays fine.' },
            { term: 'SystemUI dies', def: 'AMS detects the death of a *persistent* process and restarts it immediately. The status bar blinks for a second; no reboot.' },
            { term: 'system_server dies', def: 'Zygote catches the `SIGCHLD` from its child — and **kills itself** (`kill(getpid(), SIGKILL)`). init sees Zygote die, and its `onrestart` rules restart zygote + netd + surfaceflinger… which forks a fresh SystemServer. This is a **soft reboot**: boot animation plays again, but the bootloader/kernel never re-run.' },
            { term: 'init (PID 1) dies', def: 'The kernel triggers a **kernel panic** — the whole device hard-reboots from the Boot ROM.' },
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Why does Zygote kill itself?',
          text: 'Every running app shares memory pages and a socket relationship with Zygote, and all of them depended on the dead system_server’s services. A fresh system_server with stale apps/Zygote state would be inconsistent — so the clean move is: tear down the whole Java world and rebuild it. That’s exactly what the soft reboot is.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer (60 seconds)',
          text: '“Boot ROM verifies and loads the bootloader; the bootloader initialises RAM, runs Android Verified Boot and loads the kernel from boot.img; the kernel brings up drivers including Binder and spawns init as PID 1; init mounts partitions, loads SELinux policy to Enforcing, starts the property service and parses init.rc, spawning servicemanager, vold, surfaceflinger and Zygote; Zygote builds the ART VM, preloads ~15k classes for copy-on-write sharing, opens its socket and forks SystemServer; SystemServer starts ~90 services in bootstrap/core/other order, then AMS.systemReady() launches the home app — FallbackHome first if storage is still locked — the first frame kills the boot animation via service.bootanim.exit=1, and ACTION_BOOT_COMPLETED is broadcast.”',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Debug hooks you can mention',
          text: 'Boot timing: `adb shell dmesg` for the kernel part, `adb logcat -b events | grep boot_progress` for framework milestones, and `adb shell getprop sys.boot_completed` (it flips to `1` exactly when the broadcast goes out).',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m1-q1',
      type: 'single',
      prompt: 'Arrange the actors in boot order:',
      options: [
        'Bootloader → Boot ROM → kernel → Zygote → init → SystemServer',
        'Boot ROM → Bootloader → kernel → init → Zygote → SystemServer → launcher',
        'Boot ROM → kernel → Bootloader → init → SystemServer → Zygote',
        'Kernel → Boot ROM → Bootloader → Zygote → init → launcher',
      ],
      correct: [1],
      explanation: 'PBL in silicon → bootloader stages → Linux kernel → init (PID 1) → Zygote → SystemServer → home launcher.',
    },
    {
      id: 'android-m1-q2',
      type: 'single',
      prompt: 'What does AVB (Android Verified Boot) actually verify?',
      options: [
        'The user’s PIN',
        'Cryptographic integrity of boot images & system partitions before they execute',
        'That the battery is charged',
        'APK signatures at install time',
      ],
      correct: [1],
      explanation: 'AVB/dm-verity extends the chain of trust from the bootloader into boot.img and the system partitions, catching tampering/rooting.',
    },
    {
      id: 'android-m1-q3',
      type: 'single',
      prompt: 'Why is init always PID 1?',
      options: [
        'It’s hardcoded in init.rc',
        'It is the very first user-space process the kernel spawns',
        'Because SELinux requires it',
        'Zygote assigns it',
      ],
      correct: [1],
      explanation: 'The kernel creates init as the first user-space process; every other process descends from it.',
    },
    {
      id: 'android-m1-q4',
      type: 'single',
      prompt: 'init loads SELinux policy and flips to Enforcing before starting services because…',
      options: [
        'It makes boot faster',
        'Otherwise early services would run unconfined, outside any security policy',
        'Zygote needs it to fork',
        'The bootloader requires it',
      ],
      correct: [1],
      explanation: 'Security first: no process should ever exist outside the loaded policy, so SELinux comes up before anything else starts.',
    },
    {
      id: 'android-m1-q5',
      type: 'single',
      prompt: 'Zygote preloads ~15,000 framework classes so that…',
      options: [
        'The system partition stays small',
        'Forked apps share those memory pages via Copy-on-Write instead of reloading them',
        'ART can skip garbage collection',
        'SystemServer boots without a Looper',
      ],
      correct: [1],
      explanation: 'fork() + CoW means every app points at Zygote’s already-loaded pages — fast startup, huge RAM savings.',
    },
    {
      id: 'android-m1-q6',
      type: 'single',
      prompt: 'SystemServer starts services as Bootstrap → Core → Other because…',
      options: [
        'Alphabetical order crashed',
        'The groups break circular dependencies — the most inter-dependent critical services must exist first',
        'Watchdog demands it',
        'It’s required by SELinux',
      ],
      correct: [1],
      explanation: 'AMS, PMS, Power, Display and friends depend on each other tightly; ordered groups keep startup deterministic and crash-free.',
    },
    {
      id: 'android-m1-q7',
      type: 'single',
      prompt: 'On a PIN-locked device, what launches before the real home screen?',
      options: ['SystemUI', 'FallbackHome — a directBootAware placeholder, because CE storage is still locked', 'Recovery', 'The setup wizard'],
      correct: [1],
      explanation: 'Credential-encrypted storage can’t be read until unlock, so a dummy directBootAware home stands in until then.',
    },
    {
      id: 'android-m1-q8',
      type: 'single',
      prompt: 'system_server crashes. What happens next?',
      options: [
        'Only SystemUI restarts',
        'The kernel panics and the device hard-reboots',
        'Zygote kills itself; init restarts Zygote, which forks a fresh SystemServer — a soft reboot',
        'Nothing — apps keep running',
      ],
      correct: [2],
      explanation: 'Zygote catches SIGCHLD and dies by design; init’s onrestart rules rebuild the Java world. Boot animation replays, but bootloader/kernel don’t re-run.',
    },
    {
      id: 'android-m1-q9',
      type: 'multi',
      prompt: 'Which are started directly by init via .rc files? (pick all)',
      options: ['servicemanager', 'SystemUI', 'surfaceflinger', 'Zygote'],
      correct: [0, 2, 3],
      explanation: 'servicemanager, surfaceflinger and zygote come from init.rc files. SystemUI is launched much later by SystemServer.',
    },
  ],
  resources: [
    { label: 'AOSP — Boot flow & verified boot', url: 'https://source.android.com/docs/security/features/verifiedboot', kind: 'docs', free: true },
    { label: 'AOSP — Android init language', url: 'https://android.googlesource.com/platform/system/core/+/master/init/README.md', kind: 'docs', free: true },
  ],
};
