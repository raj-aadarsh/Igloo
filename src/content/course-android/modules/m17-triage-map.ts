import type { Module } from '@/content/types';

export const m17: Module = {
  id: 'android-m17',
  slug: 'triage-map',
  order: 17,
  title: 'The Triage Map',
  subtitle: 'Two golden rules + the 8 families of Android issues',
  icon: 'map',
  lessons: [
    {
      id: 'android-m17-l1',
      title: 'Golden rule 1 — how far down did it break?',
      minutes: 5,
      blocks: [
        {
          type: 'p',
          text: 'Classify severity **before** reading any log. The lower the layer that failed, the bigger the damage, and the classification tells you which evidence to open.',
        },
        {
          type: 'keyterms',
          title: 'Severity, worst first',
          terms: [
            { term: '🔴 Hard reboot', def: 'Restarts from the **vendor logo**. Kernel or hardware died → pstore, dmesg, `ro.boot.bootreason`.' },
            { term: '🟠 Soft reboot', def: 'Only the **boot animation** replays. system_server or Zygote died → crash buffer, dropbox, watchdog lines.' },
            { term: '🟡 App-level', def: 'One app crashed or froze → crash buffer, tombstones, /data/anr.' },
            { term: '🟢 Degraded', def: 'Nothing died, but it’s slow, wrong or failing silently → dumpsys state, Perfetto.' },
          ],
        },
        {
          type: 'keyterms',
          title: 'The 8 families (one topic each, next)',
          terms: [
            { term: '1 · Java crashes', def: 'App · system_server · Binder exceptions' },
            { term: '2 · Freezes', def: 'ANR · Watchdog · deadlock · Binder pool' },
            { term: '3 · Native crashes', def: 'SIGSEGV · SIGABRT · SIGBUS/ILL/FPE' },
            { term: '4 · Kernel & boot', def: 'Panic · HW watchdog · bootloop' },
            { term: '5 · Memory', def: 'OOM · leaks · lmkd thrashing · FD leak' },
            { term: '6 · UI & input', def: 'Jank · black window · dead touch' },
            { term: '7 · Security', def: 'SecurityException · priv-app · SELinux' },
            { term: '8 · XTS & upgrades', def: 'CTS/VTS/STS reds · post-upgrade breakage' },
          ],
        },
      ],
    },
    {
      id: 'android-m17-l2',
      title: 'Golden rule 2 — search the right buffer',
      minutes: 5,
      blocks: [
        {
          type: 'p',
          text: 'Logs are split into separate buffers so a noisy app can’t wipe out a crash. The most common beginner mistake is searching the wrong one.',
        },
        { type: 'widget', widget: 'log-buffers' },
        {
          type: 'code',
          caption: 'The first five commands on any bug',
          code: `adb shell getprop ro.boot.bootreason          # why did the device last reset?
adb logcat -b all -v threadtime -d > all.txt  # every buffer, with timestamps
adb logcat -b events -d | grep -E "am_anr|am_crash|am_kill|boot_progress"
adb shell dumpsys dropbox --print             # crashes/ANRs that outlived the logs
adb bugreport bug.zip                         # all of the above + every dumpsys`,
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“First severity: vendor logo means kernel or hardware, boot animation only means a soft reboot, otherwise it’s one app or a degradation. Then the right buffer: crash for deaths, events for am_anr and boot_progress records that outlive everything else, system for framework logs, and dmesg or pstore for anything involving the kernel or a reboot.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m17-q1',
      type: 'single',
      prompt: 'The device restarted showing only the boot animation (no vendor logo). This was…',
      options: ['A kernel panic', 'A soft reboot — the Java world was rebuilt; the kernel never went down', 'A hard reboot', 'A factory reset'],
      correct: [1],
      explanation: 'Vendor logo = the whole device reset. Boot animation only = zygote/system_server were rebuilt on a running kernel.',
    },
    {
      id: 'android-m17-q2',
      type: 'single',
      prompt: 'The fastest way to classify a mystery reboot is…',
      options: ['Reading all of logcat', 'getprop ro.boot.bootreason + asking “vendor logo or boot animation?”', 'Reinstalling the app', 'dumpsys meminfo'],
      correct: [1],
      explanation: 'The bootloader records why the device reset; the visual question splits hard from soft reboots in seconds.',
    },
    {
      id: 'android-m17-q3',
      type: 'single',
      prompt: 'Why does Android use separate log buffers?',
      options: ['For encryption', 'So chatty app logs can’t overwrite crash and system records', 'To save battery', 'Because logd is single-threaded'],
      correct: [1],
      explanation: 'Each buffer rolls over on its own — a noisy main buffer leaves crash and events untouched.',
    },
    {
      id: 'android-m17-q4',
      type: 'single',
      prompt: 'Which buffer holds am_anr and boot_progress_* records?',
      options: ['main', 'crash', 'events', 'radio'],
      correct: [2],
      explanation: 'The compact events buffer records lifecycle milestones and survives the longest.',
    },
    {
      id: 'android-m17-q5',
      type: 'single',
      prompt: 'The kernel log from BEFORE an unexpected hard reboot is in…',
      options: ['logcat -b crash', '/sys/fs/pstore/console-ramoops', '/data/anr/', 'dumpsys window'],
      correct: [1],
      explanation: 'pstore keeps the previous boot’s kernel log in RAM across the reset.',
    },
    {
      id: 'android-m17-q6',
      type: 'single',
      prompt: 'Logs rolled over before you captured them. Crash and ANR records may still be in…',
      options: ['The Play Store', 'dumpsys dropbox', 'The kernel', 'getprop'],
      correct: [1],
      explanation: 'AMS files crash, ANR and watchdog reports into dropbox, which lasts far longer than the buffers.',
    },
  ],
  resources: [
    { label: 'Android docs — logcat & buffers', url: 'https://developer.android.com/tools/logcat', kind: 'docs', free: true },
    { label: 'AOSP — Reading bug reports', url: 'https://source.android.com/docs/core/tests/debug/read-bug-reports', kind: 'docs', free: true },
  ],
};
