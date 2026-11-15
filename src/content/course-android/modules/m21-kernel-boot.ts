import type { Module } from '@/content/types';

export const m21: Module = {
  id: 'android-m21',
  slug: 'issues-kernel-boot',
  order: 21,
  title: 'Issues 4 · Kernel & Boot Failures',
  subtitle: 'Panics, hardware watchdogs & bootloops',
  icon: 'circuit-board',
  lessons: [
    {
      id: 'android-m21-l1',
      title: 'Under the hood — failures below Android',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: 'Everything in categories 1–3 assumed a living kernel writing logs. This category breaks that assumption: when the **kernel itself** dies, logcat simply stops mid-sentence. The detection and the evidence both move down a layer.',
        },
        {
          type: 'ol',
          items: [
            'A kernel bug (usually a **driver**) faults → the kernel prints an **Oops** with its own backtrace. In a context it can’t survive (interrupt context, scheduler) it escalates to a **panic** → the device resets. Hard reboot, vendor logo.',
            'If CPUs lock up so hard that even the panic path can’t run (interrupts disabled in a loop), the **hardware watchdog timer** stops being “pet” and the SoC resets itself — leaving **no panic message at all**, just a truncated log.',
            'Either way the evidence survives in **pstore**: a region of RAM the bootloader preserves across a reset. The next boot exposes the previous console as `/sys/fs/pstore/console-ramoops-0` — the modern `last_kmsg`.',
            'The bootloader also records the reset cause, surfaced as **`ro.boot.bootreason`** (`kernel_panic`, `watchdog`, `cold`, `reboot`…) — your ten-second classifier.',
          ],
        },
        {
          type: 'keyterms',
          title: 'Bootloop side-notes',
          terms: [
            { term: 'Where does it loop?', def: 'Match the symptom to the boot story: stuck at **vendor logo** = bootloader/kernel/early init. Stuck or looping at the **boot animation** = init services, Zygote or system_server. The last `boot_progress_*` milestone reached names the stage.' },
            { term: 'Classic early-loop causes', def: 'A **critical init service** dying repeatedly (init gives up / escalates), or **fstab/encryption-metadata** failures leaving /data unmountable — vold’s exit lines in the log.' },
            { term: 'Classic late-loop cause', def: 'system_server crashing during startOtherServices (bad OEM patch, priv-app allowlist violation…) → crash → Zygote exit → retry, forever. The crash buffer has the same FATAL EXCEPTION every cycle.' },
            { term: 'Rescue Party', def: 'The platform noticing a persistent crash loop and escalating: reset feature flags/settings → warm reboot → offer factory reset. Its logcat lines confirm “the system itself judged this unbootable”.' },
          ],
        },
      ],
    },
    {
      id: 'android-m21-l2',
      title: 'The logs, annotated',
      minutes: 9,
      blocks: [
        { type: 'widget', widget: 'log-kernel-boot' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method',
          text: '1) `getprop ro.boot.bootreason` → panic, watchdog or normal. 2) `ls /sys/fs/pstore/` → read the previous boot’s console; panic text present = driver bug (the `[module]` bracket names it), abrupt ending = hardware watchdog (find what disabled interrupts). 3) For bootloops: adb usually works during the loop — `logcat -b events` for the last boot_progress milestone, crash buffer for a repeating FATAL EXCEPTION, init’s “exited with status” lines for dying daemons. 4) No adb at all? UART serial console is the platform team’s last resort.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“A hard reboot means the kernel or hardware reset: I check ro.boot.bootreason first, then read pstore — console-ramoops is the previous boot’s kernel console preserved in RAM. A panic leaves its Oops text and call trace there, with the faulting function’s module bracket assigning blame to a driver; a hardware-watchdog reset leaves a log that just stops, meaning something held interrupts off too long. Bootloops I localise against the boot sequence: the last boot_progress event names the stage, init’s exit lines expose dying critical services like vold on encryption failures, and a repeating FATAL EXCEPTION IN SYSTEM PROCESS in the crash buffer is a framework-level loop — which Rescue Party may already be escalating.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m21-q1',
      type: 'single',
      prompt: 'Where is the kernel log from BEFORE an unexpected hard reset?',
      options: ['logcat -b system', '/sys/fs/pstore/console-ramoops-0 — RAM preserved across the reset', '/data/anr/', 'dumpsys dropbox'],
      correct: [1],
      explanation: 'pstore survives the reboot; every normal log channel died with the kernel.',
    },
    {
      id: 'android-m21-q2',
      type: 'single',
      prompt: 'pstore ends abruptly mid-line with no panic message. Most likely…',
      options: [
        'A clean shutdown',
        'A hardware watchdog reset — CPUs/interrupts were locked up so even the panic path never ran',
        'An app crash',
        'logd crashed',
      ],
      correct: [1],
      explanation: 'A panic writes its story; a hardware watchdog bite leaves only silence — that absence IS the signature.',
    },
    {
      id: 'android-m21-q3',
      type: 'single',
      prompt: 'In a panic trace, `pc: wlan_rx_complete+0x48 [wlan_drv]` tells you…',
      options: [
        'Nothing useful',
        'The faulting function AND that it lives in a loadable vendor driver module — ownership assigned',
        'The app that caused it',
        'The fault address',
      ],
      correct: [1],
      explanation: 'The [bracket] marks a module, not core kernel — usually the vendor’s driver team’s bug.',
    },
    {
      id: 'android-m21-q4',
      type: 'single',
      prompt: 'A device loops at the boot animation; events show boot_progress_ams_ready but never enable_screen. The failure is in…',
      options: ['The bootloader', 'The kernel', 'The late framework / home-launch stage (after AMS was ready)', 'AVB'],
      correct: [2],
      explanation: 'The milestone timeline brackets the failure: everything up to AMS readiness succeeded.',
    },
    {
      id: 'android-m21-q5',
      type: 'single',
      prompt: "“Service 'vold' exited with status 1 … restarting” repeating at early boot points to…",
      options: ['A SurfaceFlinger bug', 'Storage/encryption trouble — /data can’t be mounted, so boot can’t proceed', 'A Java OOM', 'An input bug'],
      correct: [1],
      explanation: 'vold owns mounting and FBE; its repeated death is the classic fstab/encryption bootloop.',
    },
    {
      id: 'android-m21-q6',
      type: 'single',
      prompt: '“RescueParty: Attempting rescue level WARM_REBOOT” means…',
      options: [
        'The battery is low',
        'The platform detected a persistent crash loop and is escalating its automatic recovery ladder',
        'An OTA is installing',
        'The user pressed recovery keys',
      ],
      correct: [1],
      explanation: 'Rescue Party reacts to repeated core crashes: flags/settings reset → reboot → factory-reset prompt.',
    },
  ],
  resources: [
    { label: 'AOSP — Rescue Party', url: 'https://source.android.com/docs/core/tests/debug/rescue-party', kind: 'docs', free: true },
    { label: 'Kernel docs — pstore/ramoops', url: 'https://docs.kernel.org/admin-guide/ramoops.html', kind: 'docs', free: true },
  ],
};
