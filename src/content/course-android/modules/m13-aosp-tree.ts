import type { Module } from '@/content/types';

export const m13: Module = {
  id: 'android-m13',
  slug: 'aosp-source-partitions',
  order: 13,
  title: 'AOSP Source, Dev Loop & Partitions',
  subtitle: 'Where everything lives, and how to change it fast',
  icon: 'folder-tree',
  lessons: [
    {
      id: 'android-m13-l1',
      title: 'The source map',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: 'Interviewers check whether you have *actually* worked in AOSP with one simple question: **“where is AMS?”** Every topic you’ve learned has a home in the tree. Here’s the map, tagged with the topic each folder belongs to:',
        },
        { type: 'widget', widget: 'aosp-tree' },
        {
          type: 'keyterms',
          title: 'The five paths to know by heart',
          terms: [
            { term: 'frameworks/base/services/core/java/com/android/server/', def: 'AMS (`am/`), WMS + ATMS (`wm/`), PMS (`pm/`): the system services.' },
            { term: 'frameworks/base/packages/SystemUI/', def: 'The SystemUI app.' },
            { term: 'frameworks/native/libs/binder/', def: 'libbinder: the native half of every Binder call.' },
            { term: 'system/sepolicy/', def: 'Platform SELinux policy and the neverallow rules.' },
            { term: 'hardware/interfaces/', def: 'The stable HAL interface definitions: the Treble contract.' },
          ],
        },
      ],
    },
    {
      id: 'android-m13-l2',
      title: 'The fast dev loop',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: 'A full build and flash takes a long time. Day to day, platform engineers build just the module they changed and push it straight onto a running **userdebug** device:',
        },
        {
          type: 'code',
          caption: 'Edit → build one module → push → restart',
          code: `source build/envsetup.sh        # adds lunch, m, mm, mma… to your shell
lunch <product>-<release>-userdebug   # pick device + build variant
m                               # full build (first time, or for flashing)

cd frameworks/base/services     # …after editing AMS
mm                              # build the modules in THIS directory
mma                             # same, plus everything they depend on

adb root                        # adbd restarts with root (userdebug only)
adb remount                     # make /system etc. writable (may need a reboot the first time)
adb sync                        # push changed files from out/ to the device
adb shell stop && adb shell start   # restart the framework (zygote + system_server), no full reboot`,
        },
        {
          type: 'keyterms',
          terms: [
            { term: 'mm vs mma vs m', def: '`mm` = modules in the current directory · `mma` = those plus their dependencies · `m` = the whole tree (or `m <module>` for one by name).' },
            { term: 'Why stop/start?', def: 'Framework code (services.jar) is loaded by system_server at boot. `stop`/`start` restarts the Java world, like a soft reboot, so your new code loads in seconds.' },
            { term: 'Why userdebug?', def: '`adb root` and `remount` are refused on a **user** build. That’s exactly why it’s the daily driver.' },
          ],
        },
      ],
    },
    {
      id: 'android-m13-l3',
      title: 'Partitions & the Treble layout',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: 'The build’s output becomes **partition images**. Each partition has an owner and a reason to exist, and together they enforce the Treble wall on disk:',
        },
        { type: 'widget', widget: 'partition-map' },
        {
          type: 'keyterms',
          title: 'Who owns what',
          terms: [
            { term: '/system', def: 'Google’s generic framework. Replaceable by a GSI.' },
            { term: '/system_ext', def: 'OEM extensions tied to /system.' },
            { term: '/product', def: 'Per-product apps, overlays, carrier config.' },
            { term: '/vendor', def: 'SoC vendor HALs and daemons: the other side of the Treble wall.' },
            { term: '/odm', def: 'Device-maker tweaks on top of vendor.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“System services live in frameworks/base/services/core/java/com/android/server — am, wm and pm — SystemUI in frameworks/base/packages, libbinder in frameworks/native, policy in system/sepolicy and HAL interfaces in hardware/interfaces. My loop is envsetup and lunch a userdebug target, mm or mma in the module I changed, then adb root, remount, sync, and stop/start to reload the framework without reflashing. On the device, system, system_ext and product are the platform and OEM side, vendor and odm the SoC and device side, and since Android 10 they’re logical partitions inside super, so OTAs can resize them.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m13-q1',
      type: 'single',
      prompt: 'Where is ActivityManagerService’s source?',
      options: ['system/core/am/', 'frameworks/base/services/core/java/com/android/server/am/', 'frameworks/native/am/', 'packages/apps/ActivityManager/'],
      correct: [1],
      explanation: 'All the big system services live under services/core/java/com/android/server/.',
    },
    {
      id: 'android-m13-q2',
      type: 'single',
      prompt: '`mma` differs from `mm` because it…',
      options: ['Builds the whole tree', 'Also builds the dependencies of the modules in the current directory', 'Flashes the device', 'Cleans the out/ directory'],
      correct: [1],
      explanation: 'mm = this directory’s modules; mma = those plus everything they depend on.',
    },
    {
      id: 'android-m13-q3',
      type: 'single',
      prompt: 'After `adb sync` of a changed services.jar, the fastest way to load it is…',
      options: ['Factory reset', 'adb shell stop && adb shell start, which restarts zygote and system_server', 'Reflash vendor', 'Nothing, it loads automatically'],
      correct: [1],
      explanation: 'Restarting the Java world reloads framework code without a full reboot.',
    },
    {
      id: 'android-m13-q4',
      type: 'single',
      prompt: '`adb remount` fails on the device. Most likely…',
      options: ['It’s a user build: root and remount are disabled', 'The cable is wrong', 'SurfaceFlinger is down', 'The device has too many users'],
      correct: [0],
      explanation: 'Root-level development commands need a userdebug (or eng) build.',
    },
    {
      id: 'android-m13-q5',
      type: 'single',
      prompt: 'Dynamic partitions (Android 10+) mean that…',
      options: ['Partitions are created at runtime by apps', 'system, vendor, product etc. are logical partitions inside one super partition, resizable by OTA', 'There is no /vendor anymore', 'userdata is inside system'],
      correct: [1],
      explanation: 'Sizes live in metadata, so an update can grow one partition and shrink another without repartitioning.',
    },
    {
      id: 'android-m13-q6',
      type: 'single',
      prompt: 'Vendor HAL implementations normally ship in…',
      options: ['/system', '/product', '/vendor (with device tweaks in /odm)', '/data'],
      correct: [2],
      explanation: 'The vendor side of the Treble wall lives on /vendor and /odm.',
    },
    {
      id: 'android-m13-q7',
      type: 'single',
      prompt: 'Which partition does a factory reset wipe?',
      options: ['/system', '/vendor', '/data (userdata)', 'boot'],
      correct: [2],
      explanation: 'Everything that changes at runtime lives in userdata. The read-only images stay untouched.',
    },
  ],
  resources: [
    { label: 'Android Code Search', url: 'https://cs.android.com/', kind: 'tool', free: true },
    { label: 'AOSP — Dynamic partitions', url: 'https://source.android.com/docs/core/ota/dynamic_partitions', kind: 'docs', free: true },
    { label: 'AOSP — Partitions overview', url: 'https://source.android.com/docs/core/architecture/partitions', kind: 'docs', free: true },
  ],
};
