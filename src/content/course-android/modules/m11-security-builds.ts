import type { Module } from '@/content/types';

export const m11: Module = {
  id: 'android-m11',
  slug: 'security-builds-compliance',
  order: 11,
  title: 'Security, Builds & Compliance',
  subtitle: 'SELinux, Soong & the XTS gauntlet',
  icon: 'shield',
  lessons: [
    {
      id: 'android-m11-l1',
      title: 'SELinux in depth',
      minutes: 11,
      blocks: [
        {
          type: 'p',
          text: 'Phase 1 gave you the first wall: every app is its own Linux UID (**DAC** — *discretionary* access control, where the file’s **owner** decides who may touch it). SELinux adds a second, stricter wall: **MAC** — *mandatory* access control, where a **central policy** decides, and nobody — not even root — can opt out. A root process in a confined domain still can’t touch what policy doesn’t allow; that’s the whole point.',
        },
        {
          type: 'keyterms',
          title: 'The vocabulary — side-notes',
          terms: [
            { term: 'Label', def: 'Every process and every object (file, socket, property…) carries a label like `u:r:untrusted_app:s0`. Policy is written about **labels**, never paths.' },
            { term: 'Domain', def: 'A process’s label — `untrusted_app`, `system_server`, `vold`, `hal_camera_default`… init assigns them (remember: policy loads *before* anything starts).' },
            { term: 'Type', def: 'An object’s label — `app_data_file`, `proc_serial`, `binder_device`. File labels come from file_contexts and are applied at build/boot.' },
            { term: 'Rule', def: '`allow <domain> <type>:<class> { permissions };` — everything NOT allowed is denied. Default-deny is the safety.' },
            { term: 'Enforcing / Permissive', def: 'Enforcing = denials are blocked. Permissive = allowed but **logged** — a development mode for writing policy, never for shipping.' },
          ],
        },
        {
          type: 'p',
          text: 'When something is denied, the kernel logs one precisely-formatted line. Being able to **read it cold** is a genuine platform-engineer skill — decode this one:',
        },
        { type: 'widget', widget: 'avc-decoder' },
        {
          type: 'callout',
          variant: 'warning',
          title: 'neverallow — the uncrossable lines',
          text: 'Platform policy also ships **neverallow** rules: compile-time bans (e.g. “app domains may never write to system files”). If a proposed allow rule collides with one, **the build itself fails** — and CTS re-verifies the neverallows on the shipping device. This is why “just add an allow rule” is often not a legal fix: the system forces you to solve the problem properly (different label, different API, different design).',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Where denials show up',
          text: '`adb shell dmesg | grep avc` (kernel log) or `adb logcat | grep avc`. During bring-up, teams run a domain in permissive mode, collect the denials, and translate the legitimate ones into policy — `audit2allow` drafts candidate rules from the log, engineers judge them.',
        },
      ],
    },
    {
      id: 'android-m11-l2',
      title: 'The AOSP build system',
      minutes: 10,
      blocks: [
        {
          type: 'p',
          text: 'AOSP is tens of millions of lines building into a flashable OS — the build system is how. The modern one is **Soong**, and its build files are **`Android.bp`** (“blueprint”) files:',
        },
        {
          type: 'code',
          caption: 'Android.bp — declarative, JSON-like, deliberately logic-free',
          code: `cc_library_shared {
    name: "libvibrator-impl",
    srcs: ["Vibrator.cpp"],
    shared_libs: ["libbinder_ndk", "liblog"],
    vendor: true,            // → lands on the /vendor partition
}

android_app {
    name: "Settings",
    srcs: ["src/**/*.java"],
    platform_apis: true,
    certificate: "platform", // → signed with the platform key
}`,
        },
        {
          type: 'ul',
          items: [
            '**Why `.bp` replaced the old `Android.mk` makefiles**: Make allowed arbitrary logic, so no tool could reason about the build. Blueprint files are pure *descriptions* — Soong reads them all and generates one giant, fast, parallel build (via ninja). Conditionals live in Soong itself, not in the files.',
            '**Module types tell you what a thing is at a glance**: `cc_library_*` (native), `java_library`, `android_app`, `aidl_interface` (stable AIDL HALs from the JNI topic!), `sh_binary`, `prebuilt_etc`…',
            '**The daily loop**: `source build/envsetup.sh` → `lunch <product>-<variant>` (pick the device and build type) → `m` (build everything) or `m <module>` (just your module) → flash or `adb sync` the result.',
            '**Build variants**: **user** = what ships (no root, adb limited) · **userdebug** = ship-like but debuggable with root — the daily driver of platform teams · **eng** = everything unlocked, extra logging.',
            '**The output is partition images**: `system.img` (the framework), `vendor.img` (the HAL side of the Treble wall), `boot.img` (kernel + ramdisk — remember the bootloader loading exactly this), `product.img`, and friends in `out/target/product/<device>/`.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why engineers care where a module lands',
          text: 'The `vendor: true` flag isn’t cosmetic — it decides which side of the **Treble wall** your code lives on, which binder domain it may use, which libraries it may link (vendor code can’t link private platform libs), and which SELinux policy file labels it. Build system, Treble and SELinux are one braided system.',
        },
      ],
    },
    {
      id: 'android-m11-l3',
      title: 'The XTS gauntlet & the interview angle',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'A device maker can’t ship “Android with Google apps” just by compiling AOSP — the build must pass the **XTS** test suites. For a platform engineer, *“fix the CTS failures”* is a recurring work item, so know what each suite is:',
        },
        {
          type: 'keyterms',
          title: 'The suites — side-notes',
          terms: [
            { term: 'CTS', def: '**Compatibility** Test Suite — millions of API-behaviour tests proving the device is *real Android*: every documented API behaves exactly as documented (and the SELinux neverallows hold).' },
            { term: 'VTS', def: '**Vendor** Test Suite — tests the vendor half through the Treble interfaces: HALs implement their HIDL/AIDL contracts, the kernel exposes what it must. Runs against the vendor image with a Generic System Image on top.' },
            { term: 'GTS', def: '**GMS** Test Suite — requirements for shipping Google apps & Play services (licensing-related, not part of open AOSP).' },
            { term: 'STS', def: '**Security** Test Suite — regression tests for known vulnerabilities: proves the monthly security patches are really in.' },
          ],
        },
        { type: 'h3', text: 'How a failure is actually debugged' },
        {
          type: 'ol',
          items: [
            'The harness (**tradefed**) names the failing module and test — e.g. `CtsOsTestCases android.os.cts.BuildVersionTest#testSdkInt`.',
            'Run **just that test** locally (`run cts -m <module> -t <test>`) to get a tight repro loop.',
            'Read the assertion + device logcat from the failure window — the test tells you the expected behaviour; the logs tell you what the device did instead (often an avc denial or a wrong property).',
            'Fix on the right side of the wall — a framework patch, a vendor HAL fix, a sepolicy label, or a device config — and re-run the module. “Fixing the test” is not an option: the suite is the specification.',
          ],
        },
        {
          type: 'keyterms',
          title: '✱ Rapid fire',
          terms: [
            { term: 'DAC vs MAC in one line', def: 'DAC: the owner decides (UIDs/permissions bits). MAC: the policy decides, for everyone, root included.' },
            { term: 'Who assigns app SELinux domains?', def: 'Apps get `untrusted_app` (etc.) at process start — decided by policy + the app’s attributes, set up during the Zygote fork.' },
            { term: 'Permissive device vs domain', def: 'Whole-device permissive is a lab/debug state; a single *domain* can also be permissive during bring-up while the rest stays enforcing.' },
            { term: 'Why is my new service invisible to apps?', def: 'Three separate gates: the Binder registration, the SELinux rules (`add_service`, `find_service`), and the API surface. Platform work means clearing all three.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Android security is layered: DAC sandboxes every app by UID, and SELinux adds mandatory access control on top — every process runs in a labelled domain, policy is default-deny, init loads it to Enforcing before anything starts, and even root is confined. Denials appear as avc lines naming source context, target context, class and permission; legitimate ones become allow rules in sepolicy, but compile-time neverallow rules — re-verified by CTS — make the dangerous ones impossible. The platform builds with Soong from declarative Android.bp files into partition images on either side of the Treble wall, in user, userdebug or eng variants. And before shipping, the device must pass the XTS suites: CTS for API compatibility, VTS for the vendor/HAL contracts, GTS for Google requirements, STS for security patches.”',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Phase 2 complete 🎉',
          text: 'That’s the full framework map — from the power button to the policy engine. Next (when you’re ready): the issue-resolving phase — taking real-world symptoms end to end through everything you’ve built here.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m11-q1',
      type: 'single',
      prompt: 'The key difference between DAC and MAC:',
      options: [
        'MAC is faster',
        'DAC lets the resource owner decide; MAC enforces a central policy that even root cannot override',
        'DAC is newer',
        'MAC only applies to apps',
      ],
      correct: [1],
      explanation: 'Discretionary = owner’s choice (UID permission bits); Mandatory = system-wide policy, binding for everyone.',
    },
    {
      id: 'android-m11-q2',
      type: 'single',
      prompt: 'In scontext=u:r:untrusted_app:s0, the part “untrusted_app” is…',
      options: ['A username', 'The process’s SELinux domain', 'The APK name', 'A file path'],
      correct: [1],
      explanation: 'The domain is the process’s security label — ordinary third-party apps run as untrusted_app.',
    },
    {
      id: 'android-m11-q3',
      type: 'single',
      prompt: 'permissive=1 on an avc line means…',
      options: [
        'The action was blocked',
        'The action was allowed but logged — that domain (or device) is in permissive mode',
        'The device is rooted',
        'The rule was added by audit2allow',
      ],
      correct: [1],
      explanation: 'Permissive mode is the policy-development state: log what WOULD be denied without blocking it.',
    },
    {
      id: 'android-m11-q4',
      type: 'single',
      prompt: 'Your candidate allow rule makes the build fail with a neverallow violation. The correct response:',
      options: [
        'Delete the neverallow',
        'Switch the device to permissive',
        'Redesign the access — different label, proper API, or different architecture; the ban is intentional and CTS-verified',
        'Ship an eng build',
      ],
      correct: [2],
      explanation: 'neverallows are the platform’s hard security lines; CTS checks them on the final device, so there is no quiet way around.',
    },
    {
      id: 'android-m11-q5',
      type: 'single',
      prompt: 'Android.bp files contain no conditionals or loops because…',
      options: [
        'The parser is simple',
        'They’re purely declarative descriptions, so Soong can analyse and parallelise the whole build; logic lives in Soong itself',
        'Google forgot to add them',
        'They’re JSON',
      ],
      correct: [1],
      explanation: 'That restriction is the design: a build the tooling can fully reason about — the problem with free-form Android.mk makefiles.',
    },
    {
      id: 'android-m11-q6',
      type: 'single',
      prompt: 'Platform teams usually daily-drive which build variant?',
      options: ['user', 'userdebug — ship-like behaviour plus root and debugging', 'eng', 'recovery'],
      correct: [1],
      explanation: 'user is what ships; eng diverges too much; userdebug is the working compromise.',
    },
    {
      id: 'android-m11-q7',
      type: 'single',
      prompt: 'VTS specifically verifies…',
      options: [
        'Google app requirements',
        'The vendor half: HAL implementations honour their Treble interface contracts (tested under a GSI)',
        'Java API behaviour',
        'The Play Store',
      ],
      correct: [1],
      explanation: 'VTS is the test side of the Treble wall — vendor image + generic system image must work together.',
    },
    {
      id: 'android-m11-q8',
      type: 'multi',
      prompt: 'True statements: (pick all)',
      options: [
        'SELinux policy loads before any service starts, courtesy of init',
        'A root process can be blocked by SELinux',
        'CTS re-verifies neverallow rules on the device',
        'vendor: true in Android.bp is purely cosmetic',
      ],
      correct: [0, 1, 2],
      explanation: 'Policy-first boot, confined root, and CTS-checked neverallows are all real. vendor: true decides partition, linkage and policy — anything but cosmetic.',
    },
  ],
  resources: [
    { label: 'AOSP — SELinux concepts', url: 'https://source.android.com/docs/security/features/selinux/concepts', kind: 'docs', free: true },
    { label: 'AOSP — Soong build system', url: 'https://source.android.com/docs/setup/build', kind: 'docs', free: true },
    { label: 'AOSP — Compatibility Test Suite', url: 'https://source.android.com/docs/compatibility/cts', kind: 'docs', free: true },
  ],
};
