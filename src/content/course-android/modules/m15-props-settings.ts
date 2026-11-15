import type { Module } from '@/content/types';

export const m15: Module = {
  id: 'android-m15',
  slug: 'properties-settings',
  order: 15,
  title: 'System Properties & Settings',
  subtitle: 'getprop/setprop vs Settings.System / Secure / Global',
  icon: 'sliders',
  lessons: [
    {
      id: 'android-m15-l1',
      title: 'Two configuration stores',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Almost every device customisation, feature flag and debug switch lives in one of **two key-value stores**. They look similar (both are key = value) but they’re built for different jobs. Explore both:',
        },
        { type: 'widget', widget: 'props-settings' },
        { type: 'h3', text: 'a) System properties: how they work' },
        {
          type: 'ol',
          items: [
            '**Storage**: all properties live in a **shared memory area** (`/dev/__properties__`), mapped read-only into every process. That makes **reading very fast**: no IPC, just a memory lookup. Even native code and early boot code can read them.',
            '**Writing**: you can’t write that memory directly. `setprop` sends a request over a socket to **init’s property service** (started in second-stage init, from the boot topic), which checks permission and updates the value.',
            '**Permission**: every property has an SELinux label from `property_contexts`. Who may *set* (and for some, read) a property is policy, exactly like files.',
            '**Triggers**: `.rc` files can react to properties, e.g. `on property:sys.boot_completed=1` runs commands the moment boot completes.',
          ],
        },
        {
          type: 'keyterms',
          title: 'The prefixes',
          terms: [
            { term: 'ro.*', def: 'Read-only: set once (from build.prop files at boot), never changed until reboot.' },
            { term: 'persist.*', def: 'Saved to /data/property/ and restored every boot.' },
            { term: 'ctl.*', def: 'Not data, a command: ctl.start / ctl.stop / ctl.restart ask init to control an .rc service.' },
            { term: 'sys.* / vendor.*', def: 'Runtime state. Since Treble, vendor code must use the vendor.* namespace.' },
          ],
        },
      ],
    },
    {
      id: 'android-m15-l2',
      title: 'SettingsProvider & when to use which',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: '**SettingsProvider** (`frameworks/base/packages/SettingsProvider`) is a ContentProvider running inside the system process, backed by XML files per user in `/data/system/users/<id>/`. Apps reach it through the `Settings.System / Secure / Global` APIs, which are queries to that provider.',
        },
        {
          type: 'keyterms',
          title: 'The three tables',
          terms: [
            { term: 'Settings.System', def: 'Per-user preferences (brightness, ringtone). Apps can write with the special “Modify system settings” access.' },
            { term: 'Settings.Secure', def: 'Per-user, security or privacy relevant (accessibility services, default keyboard). Only system/signature apps can write (`WRITE_SECURE_SETTINGS`).' },
            { term: 'Settings.Global', def: 'Once per **device**, shared by all users (airplane mode, adb_enabled, mobile data). Same write restriction as Secure.' },
          ],
        },
        {
          type: 'keyterms',
          title: 'Properties or Settings? Decide by these',
          terms: [
            { term: 'Needed by native code or early boot?', def: 'Property. Settings only exist once system_server is running.' },
            { term: 'Different per user?', def: 'Settings (System or Secure). Properties are device-wide.' },
            { term: 'Others must react to changes?', def: 'Settings: apps register a `ContentObserver` and get notified. (Properties can only trigger init `.rc` actions.)' },
            { term: 'Should it be backed up and restored?', def: 'Settings: many are included in backup. Properties never are.' },
            { term: 'Large value?', def: 'Settings. Normal property values are capped at 92 bytes (only ro.* may be longer).' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“System properties are a device-wide key-value store in shared memory, managed by init’s property service: everyone reads them directly with no IPC, writes go through init and are guarded by SELinux property_contexts. ro.* is set once at boot, persist.* survives reboots under /data/property, and ctl.start/stop is a command to init. SettingsProvider is a ContentProvider in the system process with per-user XML files: Settings.System for ordinary user preferences, Secure for privacy and security settings only system apps can write, Global for device-wide settings shared by all users. I use a property when native or early-boot code needs it, and a setting when it’s per-user, observable through ContentObserver, or should be backed up.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m15-q1',
      type: 'single',
      prompt: 'Why is reading a system property so cheap?',
      options: ['It’s cached by the app', 'Properties live in a shared memory area mapped into every process, so a read is a memory lookup with no IPC', 'They’re compiled into the APK', 'Binder is fast'],
      correct: [1],
      explanation: 'Reads go straight to the mapped property area; only writes go through init.',
    },
    {
      id: 'android-m15-q2',
      type: 'single',
      prompt: 'Who actually performs a setprop?',
      options: ['The kernel', 'init’s property service, after checking SELinux permissions', 'system_server', 'SettingsProvider'],
      correct: [1],
      explanation: 'Writers send a request to init over a socket; init validates and updates the shared area.',
    },
    {
      id: 'android-m15-q3',
      type: 'single',
      prompt: 'Which property survives a reboot?',
      options: ['sys.boot_completed', 'persist.sys.timezone', 'ctl.start', 'Any property'],
      correct: [1],
      explanation: 'persist.* values are saved under /data/property and restored at boot.',
    },
    {
      id: 'android-m15-q4',
      type: 'single',
      prompt: '`setprop ctl.restart surfaceflinger` does what?',
      options: ['Stores the string “surfaceflinger”', 'Asks init to restart the surfaceflinger service from its .rc definition', 'Nothing', 'Reboots the device'],
      correct: [1],
      explanation: 'ctl.* properties are commands to init, not data.',
    },
    {
      id: 'android-m15-q5',
      type: 'single',
      prompt: 'Airplane mode lives in Settings.Global because…',
      options: ['It’s secret', 'It exists once per device, the same for every user', 'Apps write it', 'It’s needed at early boot'],
      correct: [1],
      explanation: 'Global = device-wide. System and Secure are per-user copies.',
    },
    {
      id: 'android-m15-q6',
      type: 'single',
      prompt: 'A normal third-party app tries to write Settings.Secure. Result:',
      options: ['Works', 'Denied: it needs WRITE_SECURE_SETTINGS, which only system/signature apps get', 'Works after a dialog', 'Device reboots'],
      correct: [1],
      explanation: 'Secure and Global are writable only by privileged callers.',
    },
    {
      id: 'android-m15-q7',
      type: 'single',
      prompt: 'Your feature flag must be readable by a native daemon before system_server starts. Use…',
      options: ['Settings.Global', 'A system property', 'SharedPreferences', 'Settings.System'],
      correct: [1],
      explanation: 'Settings don’t exist until system_server runs; properties are available from early boot to any process.',
    },
  ],
  resources: [
    { label: 'AOSP — Adding system properties', url: 'https://source.android.com/docs/core/architecture/configuration/add-system-properties', kind: 'docs', free: true },
    { label: 'Android docs — Settings', url: 'https://developer.android.com/reference/android/provider/Settings', kind: 'docs', free: true },
  ],
};
