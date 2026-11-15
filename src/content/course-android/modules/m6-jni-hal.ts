import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'android-m6',
  slug: 'jni-hal-bridge',
  order: 6,
  title: 'JNI & the HAL Bridge',
  subtitle: 'How Java reaches C++ — and C++ reaches the hardware',
  icon: 'atom',
  lessons: [
    {
      id: 'android-m6-l1',
      title: 'The bridge on one page',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'You now know two walls: the **process wall** (crossed by Binder) and the **Treble wall** between framework and vendor (crossed by stable HAL interfaces). One wall remains: the **language wall** — Java can’t poke hardware registers; that’s C/C++ territory. The doorway through it is **JNI**. Watch all three walls get crossed by a single buzz of your phone:',
        },
        { type: 'widget', widget: 'jni-hal' },
        {
          type: 'keyterms',
          title: 'Side-notes to remember',
          terms: [
            { term: 'JNI', def: '**Java Native Interface** — Java ↔ C/C++ inside ONE process. Same memory, no Parcels, no copies. Just two languages sharing a room.' },
            { term: 'Binder vs JNI', def: 'Binder crosses **processes**; JNI crosses **languages**. A framework call usually needs both, in that order.' },
            { term: 'HAL', def: 'The vendor’s C++ implementation of Android’s standard hardware interface, in its **own vendor process**.' },
            { term: 'The full ladder', def: 'Java API → Binder → system service → JNI → native code → stable AIDL/HIDL → vendor HAL → kernel driver → silicon.' },
          ],
        },
      ],
    },
    {
      id: 'android-m6-l2',
      title: 'JNI in depth',
      minutes: 11,
      blocks: [
        { type: 'h3', text: 'a) The three pieces of every JNI setup' },
        {
          type: 'code',
          caption: 'Java side — declare & load',
          code: `public class Vibes {
    static {
        // Finds and loads libvibes.so into THIS process
        System.loadLibrary("vibes");
    }
    // "a native method exists — body lives in C++"
    public static native void buzz(int millis);
}`,
        },
        {
          type: 'code',
          caption: 'C++ side — implement',
          code: `#include <jni.h>

// Name encodes the full Java path: Java_<package>_<Class>_<method>
extern "C" JNIEXPORT void JNICALL
Java_com_example_Vibes_buzz(JNIEnv* env, jclass clazz, jint millis) {
    // real C++ here — talk to drivers, run native libs, anything
}`,
        },
        {
          type: 'ul',
          items: [
            '**`native` keyword** — a promise to the VM: “the body of this method lives in a loaded `.so` library.” Call it before the library loads → `UnsatisfiedLinkError`.',
            '**`System.loadLibrary("vibes")`** → loads `libvibes.so` from the APK’s bundled native libs (built for the device’s CPU — arm64 today).',
            '**Name matching**: ART finds `Java_com_example_Vibes_buzz` by naming convention — or you register functions explicitly with **`RegisterNatives`** (what the framework does: faster lookup, obfuscation-friendly, catches mistakes at load time instead of first call).',
          ],
        },
        { type: 'h3', text: 'b) JNIEnv — C++’s remote control for Java' },
        {
          type: 'p',
          text: 'Every native function receives a **`JNIEnv*`** — a table of ~230 functions that let C++ operate on the Java world: find a class (`FindClass`), call a method (`CallVoidMethod`), read a field, convert a `jstring` to a C string, throw a Java exception. Two rules keep you out of famous crashes: a `JNIEnv` is **valid only on its own thread** (a native thread must call `AttachCurrentThread` to get its own), and object references C++ receives are **local** — they die when the function returns, so anything kept longer needs a `NewGlobalRef` (and a matching delete, or you leak).',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'When JNI goes wrong',
          text: 'Java mistakes throw exceptions; native mistakes **kill the whole process** — a bad pointer dereference becomes a native crash and the system writes a **tombstone** file (a native-world crash report with the stack of every thread). We’ll read tombstones properly in the debugging phase.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Where JNI hides in daily Android',
          text: 'You use JNI constantly without writing any: `Bitmap` pixels live in native memory, SQLite calls cross it, `MediaPlayer` is a thin Java shell over native code — and the framework itself crosses it in thousands of places (that `libandroid_servers.so` from the boot topic is system_server’s native half).',
        },
      ],
    },
    {
      id: 'android-m6-l3',
      title: 'The HAL side in depth',
      minutes: 9,
      blocks: [
        { type: 'h3', text: 'a) Binderized HALs — hardware behind an interface' },
        {
          type: 'p',
          text: 'Native framework code still doesn’t touch the hardware itself — it calls the **vendor’s HAL service**, which runs in its **own process** on the vendor side of the Treble wall. Since Android 8 almost all HALs are **“binderized”**: they’re reached over Binder like any service, just in a separated domain. The sequence mirrors everything you learned: look up the HAL in the (hardware) service manager → get a handle → Proxy/Stub → one-copy transactions. Same physics, different wall.',
        },
        { type: 'h3', text: 'b) HIDL vs stable AIDL' },
        {
          type: 'ul',
          items: [
            '**HIDL** (HAL Interface Definition Language) — Treble’s original HAL language (Android 8–10), speaking over **`/dev/hwbinder`** with its own `hwservicemanager`.',
            '**Stable AIDL** — from Android 11 the platform converged back on AIDL for new HALs: one language for framework *and* vendor interfaces, with **frozen, versioned** contracts (`IVibrator/1`, `/2`…) so an old vendor half keeps working under a new framework.',
            '**Passthrough mode** — the legacy escape hatch: the HAL is just a `.so` loaded *into the caller’s own process* (no IPC at all). Kept for old devices; binderized is the modern norm.',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'See the wall on a real device',
          text: '`adb shell lshal` lists every HIDL HAL with its transport (binderized vs passthrough), and `adb shell service list | grep -i vibrator` shows an AIDL HAL (e.g. `android.hardware.vibrator.IVibrator/default`) registered like any other service. One command, and Treble stops being a diagram and becomes something you’ve touched.',
        },
      ],
    },
    {
      id: 'android-m6-l4',
      title: 'Additional information — closing the loop',
      minutes: 6,
      blocks: [
        {
          type: 'keyterms',
          title: '✱ Rapid fire',
          terms: [
            { term: 'JNI = IPC?', def: 'No — opposite. JNI is same-process, zero-copy, two languages. Binder is cross-process. The vibrate trace used both.' },
            { term: 'Is JNI slow?', def: 'A JNI *call* costs nanoseconds more than a Java call — the real costs are data conversion (strings, arrays) and sloppy reference handling. “Avoid chatty borders, pass big data rarely.”' },
            { term: 'Why not all-Java HALs?', def: 'Drivers, DMA, registers and real-time constraints are C territory; vendors reuse decades of C/C++ driver code. Java ends at the framework.' },
            { term: 'NDK vs framework JNI', def: 'Same JNI mechanism, two users: app developers via the NDK (games, codecs), and the platform itself (every system service with native halves).' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer (45 seconds)',
          text: '“JNI is the bridge between Java and C++ inside one process: Java declares native methods, System.loadLibrary brings in the .so, and ART links the implementations — by Java_ naming or RegisterNatives. Native code gets a JNIEnv to call back into Java, valid only on its own thread, with local references that must be promoted to global refs to outlive the call. Below that, native framework code reaches vendor hardware code across the Treble boundary through binderized HALs — HIDL over hwbinder historically, stable versioned AIDL today — and only the vendor’s kernel driver finally touches the hardware. So a single vibrate() crosses the process wall by Binder, the language wall by JNI, and the vendor wall by a stable HAL interface.”',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Phase 1 complete 🎉',
          text: 'You can now tell the full story: how Android is layered, how it boots, how an app is born and lives on one message loop, what the four components are, how intents and permissions govern them, how Binder carries every call, and how JNI + HAL reach the metal. Phase 2 goes deeper: inside AMS/WMS/PMS, the input pipeline, and real-world debugging — ANRs, tombstones and logs.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m6-q1',
      type: 'single',
      prompt: 'JNI differs from Binder in that JNI…',
      options: [
        'Crosses process boundaries with one copy',
        'Connects Java and C/C++ within the SAME process — same memory, no marshalling',
        'Is used only by games',
        'Requires a Parcel',
      ],
      correct: [1],
      explanation: 'JNI is the language bridge, Binder the process bridge. A framework call typically uses both.',
    },
    {
      id: 'android-m6-q2',
      type: 'single',
      prompt: 'Calling a native method before its library is loaded throws…',
      options: ['ClassNotFoundException', 'UnsatisfiedLinkError', 'RemoteException', 'A kernel panic'],
      correct: [1],
      explanation: 'The VM has no implementation to link the native method to — hence the static { System.loadLibrary(...) } idiom.',
    },
    {
      id: 'android-m6-q3',
      type: 'single',
      prompt: 'The framework prefers RegisterNatives over Java_-style name matching because it…',
      options: [
        'Is required by SELinux',
        'Binds explicitly at load time — faster lookup and immediate failure on mismatch',
        'Allows Java to call kernel functions',
        'Skips JNIEnv',
      ],
      correct: [1],
      explanation: 'Explicit registration catches signature mistakes when the library loads, not on the first unlucky call — and survives symbol stripping.',
    },
    {
      id: 'android-m6-q4',
      type: 'single',
      prompt: 'A JNIEnv pointer may be used…',
      options: [
        'From any thread, anytime',
        'Only on the thread it belongs to — other native threads must AttachCurrentThread for their own',
        'Only during onCreate',
        'Only while holding a global ref',
      ],
      correct: [1],
      explanation: 'JNIEnv is thread-local. Sharing it across threads is a classic native crash.',
    },
    {
      id: 'android-m6-q5',
      type: 'single',
      prompt: 'C++ wants to keep a Java object after the JNI call returns. It must…',
      options: [
        'Just store the jobject pointer',
        'Create a NewGlobalRef (and delete it later)',
        'Copy the object’s bytes',
        'Lock the GC',
      ],
      correct: [1],
      explanation: 'Received references are LOCAL — dead when the call returns. Global refs pin the object (and leak if never deleted).',
    },
    {
      id: 'android-m6-q6',
      type: 'single',
      prompt: 'A bad pointer in JNI code results in…',
      options: [
        'A catchable Java exception',
        'A native crash of the whole process, recorded as a tombstone',
        'An ANR',
        'A SecurityException',
      ],
      correct: [1],
      explanation: 'Native faults don’t become exceptions — the process dies and debuggerd writes the tombstone with all thread stacks.',
    },
    {
      id: 'android-m6-q7',
      type: 'single',
      prompt: '“Binderized HAL” means…',
      options: [
        'The HAL is compiled into system_server',
        'The HAL runs as its own vendor process, reached over a binder domain through a stable interface',
        'The HAL lives in the kernel',
        'The HAL is written in Java',
      ],
      correct: [1],
      explanation: 'Vendor code is isolated in its own process behind HIDL/stable-AIDL — that separation IS the Treble wall. (Passthrough is the legacy same-process mode.)',
    },
    {
      id: 'android-m6-q8',
      type: 'multi',
      prompt: 'In the full vibrate() journey, which bridges are crossed? (pick all)',
      options: [
        'Binder IPC (app → system_server)',
        'JNI (Java → C++ inside system_server)',
        'A stable HAL interface (framework → vendor process)',
        'A kernel driver (vendor HAL → hardware)',
      ],
      correct: [0, 1, 2, 3],
      explanation: 'All four — process wall, language wall, vendor wall, and finally the kernel touching silicon. That one trace summarises the whole phase.',
    },
  ],
  resources: [
    { label: 'Android docs — JNI tips', url: 'https://developer.android.com/training/articles/perf-jni', kind: 'docs', free: true },
    { label: 'AOSP — AIDL for HALs', url: 'https://source.android.com/docs/core/architecture/aidl/aidl-hals', kind: 'docs', free: true },
  ],
};
