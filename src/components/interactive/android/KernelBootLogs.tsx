import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 4: failures below Android. The giveaway: logcat just STOPS —
// the evidence survives in pstore (RAM that outlives a reboot) and dmesg.

const tabs: LogTab[] = [
  {
    id: 'panic',
    label: 'Kernel panic / Oops',
    blurb: 'A bug inside the kernel itself — usually a driver. Userspace never gets to log a goodbye.',
    source: '/sys/fs/pstore/console-ramoops-0 (the previous boot’s console) · dmesg',
    lines: [
      { text: 'Unable to handle kernel NULL pointer dereference at virtual address 0000000000000030', note: 'The kernel’s own SIGSEGV. Same decoding skill as a tombstone: a tiny address = null struct pointer + field offset, inside kernel code.' },
      { text: 'pc : wlan_rx_complete+0x48/0x120 [wlan_drv]', note: '`pc` names the function (+offset/size) where it died, and the `[wlan_drv]` suffix means it’s a **loadable module** — vendor driver, not core kernel. That one bracket often settles whose bug it is.' },
      { text: 'Call trace:', note: 'The kernel backtrace follows — read it top-down exactly like a tombstone’s #00, #01 frames.' },
      { text: 'Kernel panic - not syncing: Fatal exception in interrupt', note: 'An **Oops** in a context the kernel can’t survive (here: interrupt context) escalates to a full **panic** → the device resets. An Oops in a normal process context may only kill that task and limp on — grep for "Oops:" too.' },
      { text: 'SMP: stopping secondary CPUs', note: 'Shutdown choreography of the panic path. After this line: black screen, vibration, vendor logo — the **hard reboot** signature. If the user says the boot animation replayed instead, it was NOT this; that’s a soft reboot (category 1/2).' },
    ],
    greps: [
      { pattern: 'Kernel panic', where: '/sys/fs/pstore/console-ramoops-0 — pstore is RAM preserved across the reset; this file IS the previous boot' },
      { pattern: 'Oops:', where: 'dmesg / pstore — kernel faults that may not have panicked' },
      { pattern: 'sysrq', where: 'pstore — tells you whether the reset was triggered manually/by tooling rather than a bug' },
    ],
  },
  {
    id: 'hwwd',
    label: 'HW watchdog',
    blurb: 'No panic message at all — the CPU just stopped answering, and a hardware timer pulled the plug.',
    source: 'pstore + the SoC’s boot/reset reason',
    lines: [
      { text: '[  412.330122] wdog: pet watchdog', note: 'Normal life: the kernel “pets” the hardware watchdog timer every few seconds, proving CPUs still run and interrupts still fire.' },
      { text: '[  458.012000] <last line in console-ramoops, mid-sentence>', note: 'The signature of a hardware-watchdog reset is an **absence**: pstore ends abruptly with no panic text. Something held interrupts disabled / spun with preemption off so long that nobody could pet the dog.' },
      { text: 'Boot reason: watchdog', note: 'The bootloader records WHY the SoC reset. Surfaced as the property `ro.boot.bootreason` (also in the kernel cmdline). Values like `watchdog`, `kernel_panic`, `cold`, `reboot` split hard-reboot bugs into families before you read anything else.' },
      { text: '[    0.000000] Booting Linux on physical CPU 0x0', note: 'Then a fresh boot starts. Triage method: correlate the *time* pstore died with what the device was doing (events buffer from before, test logs) — a driver’s busy-loop under a spinlock is the classic culprit.' },
    ],
    greps: [
      { pattern: 'ro.boot.bootreason', where: 'adb shell getprop — the single most useful hard-reboot clue' },
      { pattern: 'console-ramoops', where: 'ls /sys/fs/pstore/ — if it’s empty, the platform may not support pstore (then it’s UART serial logs)' },
    ],
  },
  {
    id: 'bootloop',
    label: 'Bootloop / stuck boot',
    blurb: 'The device starts but never finishes. Find WHERE in the boot story from Phase 1 it stops looping.',
    source: 'logcat -b events (boot_progress_*) · logcat system',
    lines: [
      { text: 'I boot_progress_start: 9641', note: 'The events buffer logs **milestones with ms timestamps**: start → preload_start/end → system_run → pms_start/ready → ams_ready → enable_screen. The LAST milestone reached tells you which boot stage to blame.' },
      { text: 'I boot_progress_ams_ready: 24180', note: 'Example: reaching ams_ready but never `boot_progress_enable_screen` = SystemServer is up but the home/launcher step is failing (CE storage? FallbackHome crash? WMS?).' },
      { text: "E init    : Service 'vold' exited with status 1 ... restarting", note: 'Early loops: init shows a **critical service dying repeatedly**. vold failing often means an **fstab / encryption-metadata problem** — the device can’t mount /data, and boot can’t proceed past it.' },
      { text: 'I am_proc_start: [0,2214,1000,system,...]  ·  (repeats every ~45 s)', note: 'The loop signature: the same early-boot sequence repeating. system_server starts, crashes (check crash buffer / dropbox for the FATAL EXCEPTION), Zygote dies, init restarts it — forever. Stuck-on-bootanimation = this loop with the animation never told to exit (`service.bootanim.exit` stays 0).' },
      { text: 'W RescueParty: Attempting rescue level WARM_REBOOT for persistent app crash', note: '**Rescue Party**: when core components crash 5+ times in a row, the platform escalates through rescue levels (reset feature flags/settings → warm reboot → offer factory reset) instead of looping silently. Its lines tell you the system itself judged this a persistent boot failure.' },
    ],
    greps: [
      { pattern: 'boot_progress', where: 'logcat -b events — the boot milestone timeline (works on a looping device via adb during the loop)' },
      { pattern: 'exited with status', where: 'logcat (init’s lines) — which native service keeps dying' },
      { pattern: 'RescueParty', where: 'logcat system — confirms a persistent-crash loop and what the system tried' },
    ],
  },
];

export function KernelBootLogs() {
  return (
    <LogAnatomy
      heading="Kernel & Boot Failures, Annotated"
      intro="Below Android, the rules change: the log you need is the one from BEFORE the reboot — that’s what pstore is for."
      tabs={tabs}
    />
  );
}
