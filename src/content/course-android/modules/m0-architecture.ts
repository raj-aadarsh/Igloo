import type { Module } from '@/content/types';

export const m0: Module = {
  id: 'android-m0',
  slug: 'architecture',
  order: 0,
  title: 'Android System Architecture',
  subtitle: 'The 5 layers — the map everything else fits into',
  icon: 'layers',
  lessons: [
    {
      id: 'android-m0-l1',
      title: 'The whole stack on one page',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'Android is a **layered system**: your app sits at the top, real silicon sits at the bottom, and every call travels down through well-defined layers. Keep this one picture in your head — every topic in this course (boot, Binder, system services, HALs, JNI) is just zooming into one part of it.',
        },
        { type: 'widget', widget: 'android-stack' },
        {
          type: 'analogy',
          text: 'a hotel. Guests (apps) never enter the kitchen. They call reception (framework APIs), reception coordinates the staff (system services), the staff use the building’s machinery (native libs), the machinery is wired through standard sockets (HAL), and the electricity grid underneath is the Linux kernel.',
        },
        {
          type: 'keyterms',
          title: 'Side-notes to remember',
          terms: [
            { term: 'One rule', def: 'Each layer only talks to its neighbours — an app never calls a driver, a driver never knows about apps.' },
            { term: 'Where APIs run', def: 'Your `android.*` call usually ends up in a **system service inside system_server**, reached over Binder.' },
            { term: 'Where Java ends', def: 'Below the framework layer there is no Java — native C/C++ and the kernel do the heavy lifting.' },
            { term: 'Why HAL exists', def: 'So Android can define *what* hardware must do while vendors decide *how* — swappable per device.' },
          ],
        },
      ],
    },
    {
      id: 'android-m0-l2',
      title: 'About the layers in depth',
      minutes: 12,
      blocks: [
        { type: 'h3', text: 'a) Linux Kernel — the foundation' },
        {
          type: 'p',
          text: 'Android stands on a modified Linux kernel. It owns **process scheduling, memory management, power management and every hardware driver**. Android adds its own pieces to stock Linux, and these additions are exactly what interviewers probe: the **Binder driver** (`/dev/binder`) that powers all IPC, **wakelocks** for power, **ashmem/memfd** shared memory, and the **low-memory kill** path (`lmkd` acts on kernel pressure signals). SELinux enforcement also happens at this level.',
        },
        { type: 'h3', text: 'b) HAL — the Hardware Abstraction Layer (Project Treble)' },
        {
          type: 'p',
          text: 'Android must run on thousands of different devices, so it never talks to hardware directly. Instead it defines **standard interfaces** — “a camera HAL must be able to open a camera and capture a frame” — and each vendor ships a module implementing them for their chip. These live on the **`/vendor`** partition.',
        },
        {
          type: 'p',
          text: '**Project Treble** (Android 8) made this boundary strict: framework and vendor halves may only talk through **versioned, stable interfaces** — originally **HIDL**, now **stable AIDL**. Result: Google can update the Android half **without the vendor rewriting their half**, which is the whole reason modern devices get OS updates faster. A device can even boot a **GSI** (Generic System Image) on top of its vendor half to prove the separation works.',
        },
        { type: 'h3', text: 'c) Native C/C++ libraries & ART — the engine room' },
        {
          type: 'ul',
          items: [
            '**Native libraries**: `bionic` (Android’s own libc), `libbinder`, **Skia** (all 2D drawing), OpenGL ES / Vulkan (GPU), SQLite, media codecs. The framework is a Java shell over these.',
            '**ART (Android Runtime)** executes your app’s **DEX bytecode**. It mixes **AOT** (`dex2oat` compiles to native code at install / idle time), **JIT** for hot paths discovered at runtime, and an interpreter — guided by *profiles* of what your users actually run.',
            'ART also owns the **garbage collector** — modern ART uses a generational, mostly-concurrent GC, which is why old “GC causes jank” answers need updating.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Dalvik vs ART (still asked!)',
          text: 'Dalvik (pre-Android 5) was JIT-only — apps compiled while running, every time. ART replaced it with AOT + JIT + profiles: faster startup, better battery, at the cost of some install time and storage.',
        },
        { type: 'h3', text: 'd) Java API Framework — where your calls land' },
        {
          type: 'p',
          text: 'The `android.*` classes your app compiles against, plus the machinery behind them: the **View system**, resource management, and above all the **system services** — **ActivityManagerService** (processes & activities), **WindowManagerService** (windows & input focus), **PackageManagerService** (APKs & permissions), NotificationManager, LocationManager… ~90 services, nearly all hosted in one process: **`system_server`**.',
        },
        {
          type: 'p',
          text: 'The key mental model: calling `getSystemService(...)` hands you a thin **manager object**; the real logic runs in `system_server`, and your call crosses process boundaries over **Binder IPC** — where permissions are checked on the *service* side, never trusted to the app.',
        },
        { type: 'h3', text: 'e) System & User Apps — the top' },
        {
          type: 'ul',
          items: [
            '**System apps** ship with the device — launcher, dialer, settings, SystemUI — in `/system/priv-app`, `/system/app` and `/product/app`. *Privileged* ones can hold permissions normal apps can’t.',
            '**User apps** install to `/data/app`, each sandboxed under its **own Linux UID** — the sandbox is enforced by the kernel, not by politeness.',
            'Even system apps use the same framework APIs — the launcher starts your app with a plain `startActivity()`, like anyone else.',
          ],
        },
      ],
    },
    {
      id: 'android-m0-l3',
      title: 'Additional information — the interview angle',
      minutes: 6,
      blocks: [
        {
          type: 'keyterms',
          title: '“Which layer does X live in?” — rapid fire',
          terms: [
            { term: 'Binder driver', def: 'Linux kernel (the framework’s `libbinder` talks to it).' },
            { term: 'AMS / WMS / PMS', def: 'Java framework — inside `system_server`.' },
            { term: 'ART & dex2oat', def: 'Native layer (the runtime itself is C/C++).' },
            { term: 'Camera vendor code', def: 'HAL, on the `/vendor` partition.' },
            { term: 'SurfaceFlinger', def: 'Native service (started by init — not a Java service).' },
            { term: 'SELinux policy', def: 'Loaded by init, enforced in the kernel.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Android is a five-layer stack: a Linux kernel with Android-specific additions like Binder and wakelocks; vendor HALs behind stable Treble interfaces; native libraries plus the ART runtime; the Java framework whose system services run in system_server; and apps on top. Each layer talks only to its neighbours, and crossing from an app into the framework is Binder IPC, where permissions are enforced.”',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Follow-up they love',
          text: '“Why Treble?” — Before Android 8, an OS update required vendors to re-port their hardware code against the new framework, so updates took a year or never shipped. Treble froze the interface between the two halves, letting the framework update independently. If you mention GSI as proof, you sound like you’ve actually flashed one.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m0-q1',
      type: 'single',
      prompt: 'An app needs the camera. What is the correct path of the call?',
      options: [
        'App → camera driver directly',
        'App → framework API → CameraService (Binder) → camera HAL → kernel driver',
        'App → HAL → framework → kernel',
        'App → kernel → HAL → framework',
      ],
      correct: [1],
      explanation: 'Calls always descend layer by layer: framework API, system service over Binder, vendor HAL, kernel driver. Apps never touch drivers directly.',
    },
    {
      id: 'android-m0-q2',
      type: 'single',
      prompt: 'Project Treble’s core change was…',
      options: [
        'Replacing Dalvik with ART',
        'A stable, versioned interface between the framework and vendor HALs, so the OS updates independently of vendor code',
        'Moving all HALs into the kernel',
        'Introducing the Binder driver',
      ],
      correct: [1],
      explanation: 'Treble (Android 8) drew a hard line at the HAL boundary — framework and vendor halves talk only via stable HIDL/AIDL interfaces, decoupling OS updates from vendor work.',
    },
    {
      id: 'android-m0-q3',
      type: 'single',
      prompt: 'Where do AMS, WMS and PMS actually run?',
      options: ['Each in its own process', 'Inside the kernel', 'Inside the system_server process', 'Inside every app’s process'],
      correct: [2],
      explanation: 'Nearly all Java system services are hosted together in the single system_server process.',
    },
    {
      id: 'android-m0-q4',
      type: 'single',
      prompt: 'ART differs from the old Dalvik runtime because ART…',
      options: [
        'Is interpreter-only',
        'Uses AOT compilation (plus JIT and profiles) instead of JIT-only execution',
        'Runs Java source directly',
        'Removed garbage collection',
      ],
      correct: [1],
      explanation: 'ART compiles DEX ahead of time with dex2oat, adds JIT for hot code and profile guidance — Dalvik was JIT-only.',
    },
    {
      id: 'android-m0-q5',
      type: 'single',
      prompt: 'Which of these is an Android-specific addition to the Linux kernel?',
      options: ['Skia', 'The Binder driver', 'SQLite', 'ART'],
      correct: [1],
      explanation: 'Binder (/dev/binder) is Android’s kernel-level IPC driver. Skia, SQLite and ART are native-layer components.',
    },
    {
      id: 'android-m0-q6',
      type: 'single',
      prompt: 'The app sandbox is fundamentally enforced by…',
      options: ['The Play Store', 'Each app running under its own Linux UID, enforced by the kernel', 'ProGuard', 'The launcher'],
      correct: [1],
      explanation: 'Every app gets its own Linux UID; standard kernel user isolation (plus SELinux) is what the sandbox really is.',
    },
    {
      id: 'android-m0-q7',
      type: 'multi',
      prompt: 'Which statements about the HAL are true? (pick all)',
      options: [
        'Vendor HAL modules live on the /vendor partition',
        'HALs are written by Google only',
        'Since Treble, framework ↔ HAL communication uses stable HIDL/AIDL interfaces',
        'A GSI can boot on a device because of this separation',
      ],
      correct: [0, 2, 3],
      explanation: 'HALs are vendor-written implementations of Android’s standard interfaces; Treble’s stable boundary is what makes a Generic System Image bootable.',
    },
    {
      id: 'android-m0-q8',
      type: 'single',
      prompt: 'When your app calls getSystemService() and uses the returned manager, the real work happens…',
      options: [
        'Inside your app process',
        'In system_server, reached via Binder IPC — with permissions checked on the service side',
        'In the HAL',
        'In the kernel scheduler',
      ],
      correct: [1],
      explanation: 'Managers are thin client stubs; the logic and the permission checks live in the system service across the Binder boundary.',
    },
  ],
  resources: [
    { label: 'AOSP — Architecture overview', url: 'https://source.android.com/docs/core/architecture', kind: 'docs', free: true },
    { label: 'AOSP — HAL & Project Treble', url: 'https://source.android.com/docs/core/architecture/hal', kind: 'docs', free: true },
  ],
};
