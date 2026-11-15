import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 2: nothing crashed — something stopped answering. The four
// freeze signatures every framework engineer must read fluently.

const tabs: LogTab[] = [
  {
    id: 'anr',
    label: 'ANR',
    blurb: 'A deadline fired: input 5 s · broadcast 10 s (60 s background) · service 20 s (200 s background).',
    source: 'logcat -b events (am_anr) · /data/anr/',
    lines: [
      { text: 'I am_anr : [0,12873,com.example.notes,952745541,Input dispatching timed out (...)]', note: 'The **events-buffer** record AMS writes at the verdict: user id, pid, package, flags, reason. Grep this first — it timestamps the exact moment and names the deadline.' },
      { text: '----- pid 12873 at 2026-11-15 20:14:07 -----  (/data/anr/anr_2026-11-15-20-14-07-123)', note: 'AMS then dumps **every thread of the guilty process** (plus key system processes) here. The dialog is cosmetic; this file is the evidence.' },
      { text: '"main" prio=5 tid=1 Blocked', note: 'Always read `"main"` first. **Blocked** = stuck on a Java lock. Other classics: `Native` (stuck in a syscall or Binder call — read the native frames), `Waiting` (Object.wait), `Sleeping`.' },
      { text: '  at com.example.notes.Db.query(Db.java:88)' },
      { text: '  - waiting to lock <0x0d47d2> (a java.lang.Object) held by thread 14', note: 'The dump names the lock AND the holder. Jump to tid=14: whatever it does while holding this lock *is* your ANR. (If main is instead deep in `BinderProxy.transactNative` — the stall is in the remote service; go dump system_server.)' },
    ],
    greps: [
      { pattern: 'am_anr', where: 'logcat -b events — every ANR, one line each' },
      { pattern: 'ANR in', where: 'logcat main/system — the human-readable summary with CPU load' },
      { pattern: 'Input dispatching timed out', where: 'the reason line — tells you which deadline class fired' },
    ],
  },
  {
    id: 'watchdog',
    label: 'Watchdog',
    blurb: 'system_server ANR-ing itself: core handler threads and service locks checked every 30 s, killed at ~60 s.',
    source: 'logcat -b events + system · dropbox system_server_watchdog',
    lines: [
      { text: 'W Watchdog: WAITED_HALF: monitor com.android.server.am.ActivityManagerService', note: 'The **30-second half-check**: a probe couldn’t take the AMS lock for 30 s. Watchdog logs a warning + stack dump but waits — many stalls recover. Seeing WAITED_HALF without a kill = a near-miss worth investigating anyway.' },
      { text: 'W Watchdog: *** WATCHDOG KILLING SYSTEM PROCESS: Blocked in monitor com.android.server.am.ActivityManagerService on foreground thread (android.fg)', note: 'The 60-second verdict. It names the stuck **monitor** (which service’s lock) and the **checker thread**. The accompanying stack dump shows who holds that lock — read it exactly like an ANR trace.' },
      { text: 'I am_watchdog_5 : [com.android.server.am.ActivityManagerService]', note: 'The events-buffer breadcrumb — survives in bugreports when the main buffer has already rolled over.' },
      { text: 'I Zygote  : Exit zygote because system server (1337) has terminated', note: 'The consequence: soft reboot. A device that “randomly restarts to the boot animation every few hours” has one of these lines before every restart — that pattern IS the diagnosis.' },
    ],
    greps: [
      { pattern: 'WATCHDOG KILLING SYSTEM PROCESS', where: 'logcat system / bugreport' },
      { pattern: 'WAITED_HALF', where: 'logcat — the early warnings before the kill' },
      { pattern: 'system_server_watchdog', where: 'dumpsys dropbox — full stacks preserved across the reboot' },
    ],
  },
  {
    id: 'deadlock',
    label: 'Deadlock',
    blurb: 'Lock inversion: two threads, two locks, opposite order. The dump shows a closed circle.',
    source: 'the thread dump inside /data/anr/ or the watchdog stacks',
    lines: [
      { text: '"android.anim" prio=5 tid=12 Blocked', note: 'Thread A: one of system_server’s named handler threads (ui / fg / anim / display — know these names).' },
      { text: '  at com.android.server.wm.WindowManagerService.relayoutWindow', note: 'It’s inside WMS code…' },
      { text: '  - waiting to lock <0x0a11> (WindowManagerGlobalLock) held by thread 9', note: '…waiting for the **WMS lock**, held by thread 9.' },
      { text: '"android.fg" prio=5 tid=9 Blocked' },
      { text: '  at com.android.server.am.ActivityManagerService.updateOomAdj', note: 'Thread B is inside AMS…' },
      { text: '  - waiting to lock <0x0b22> (ActivityManagerGlobalLock) held by thread 12', note: '…waiting for the **AMS lock** — which thread 12 holds. 12 waits for 9, 9 waits for 12: the circle is closed, nobody ever proceeds. This AMS↔WMS inversion is the historical classic (one reason ATMS split out and lock order rules got strict).' },
    ],
    greps: [
      { pattern: 'waiting to lock', where: 'the trace — collect every line, then draw the holder graph; a cycle = deadlock' },
      { pattern: 'held by thread', where: 'same — the edge list of your graph' },
    ],
  },
  {
    id: 'pool',
    label: 'Binder pool exhausted',
    blurb: 'All ~16 Binder threads busy → the process still “runs”, but nobody can call into it. A stealth freeze.',
    source: 'the thread dump — count the Binder threads',
    lines: [
      { text: '"Binder:1337_1" prio=5 tid=18 Native', note: 'Binder pool threads are named `Binder:<pid>_<n>`. In a healthy dump most sit idle in `IPCThreadState::getAndExecuteCommand` waiting for work.' },
      { text: '  at com.android.server.SomeService.slowQuery(SomeService.java:51)', note: 'Here every single one is *inside a service method*. Count them: if all ~16 are busy (often all stuck on the same lock), the pool is exhausted.' },
      { text: '"Binder:1337_F" prio=5 tid=41 Blocked' },
      { text: '  - waiting to lock <0x0c33> held by thread 18', note: 'The usual shape: one slow/blocked call holds a lock, fifteen more pile up behind it. Meanwhile every *client* of this process blocks in `transactNative` — and THEIR ANRs fire. The real culprit is here, not in the apps that got the blame.' },
      { text: 'W BinderProxy: An incoming oneway call exceeded the binder buffer…', note: 'Related starvation signal: even `oneway` calls queue up when the receiver can’t drain them — remember, oneway is serialized on the server side.' },
    ],
    greps: [
      { pattern: 'Binder:', where: 'the thread dump — count busy vs idle pool threads' },
      { pattern: 'transactNative', where: 'CLIENT dumps — many apps stuck here all pointing at one pid = that pid’s pool is the problem' },
    ],
  },
];

export function AnrFreezeLogs() {
  return (
    <LogAnatomy
      heading="Freezes & Hangs, Annotated"
      intro="Four ways a thread stops answering — and how each one confesses in the dump."
      tabs={tabs}
    />
  );
}
