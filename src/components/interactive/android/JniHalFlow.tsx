import { NotesFlow, type NotesStep } from './NotesFlow';

// One buzz, traced end to end: Java → Binder → JNI → HAL → kernel driver.
// The perfect recap — it crosses every bridge this course has built so far.

const steps: NotesStep[] = [
  {
    kind: 'node',
    node: {
      id: 'app',
      title: 'App: vibrator.vibrate(…)',
      mono: 'Java · app process',
      notes: ['A normal framework API call', 'The app has no idea what comes next'],
      detail:
        'Your app calls `getSystemService(Vibrator.class)` and then `vibrate(...)`. That returned object is just a thin **manager** — the real decision-making (is the phone in Do-Not-Disturb? which app may vibrate?) belongs to the system, so the call must leave your process.',
    },
  },
  {
    kind: 'node',
    edge: '(Binder IPC — crosses processes)',
    node: {
      id: 'service',
      title: 'VibratorManagerService',
      mono: 'Java · inside system_server',
      notes: ['Checks policy & permissions', 'Decides the final vibration effect', 'Now needs to touch *hardware* — Java can’t'],
      detail:
        'The service applies the rules: user settings, DND, which effects the device supports. Now it must program an actual motor. Java has no way to poke hardware — that is **native territory**, so the call has to step down from Java into C++ *inside the same process*.',
    },
  },
  {
    kind: 'node',
    edge: '(JNI — Java ↔ C++, same process)',
    node: {
      id: 'jni',
      title: 'JNI glue code',
      mono: 'C++ · libandroid_servers.so',
      notes: ['`native` methods declared in Java', 'Loaded via `System.loadLibrary(…)`', 'No Binder here — same memory, just two languages'],
      detail:
        '**JNI (Java Native Interface)** is the doorway between Java and C/C++ *within one process* — no Parcels, no copies, they share the same memory. The Java side declares methods with the `native` keyword; the C++ side implements them and gets a **JNIEnv** pointer — a “service desk” for talking back to Java (find a class, call a method, convert a string). Framework JNI registers its functions explicitly with `RegisterNatives` at startup.',
    },
  },
  {
    kind: 'node',
    edge: '(stable AIDL — framework ↔ vendor)',
    node: {
      id: 'hal',
      title: 'Vibrator HAL service',
      mono: 'vendor process · /vendor partition',
      notes: ['Written by the device maker (Qualcomm, Samsung…)', 'Implements the standard `IVibrator` interface', 'The Treble wall is crossed right here'],
      detail:
        'The native code calls the vendor’s **HAL service** through its versioned, stable interface — modern HALs use **stable AIDL** (over Binder), older ones **HIDL** (over `/dev/hwbinder`, Binder’s sibling driver for HALs). This is exactly the **Project Treble** boundary from the architecture topic: Android defines *what* `IVibrator` must do, the vendor decides *how* their chip does it.',
    },
  },
  {
    kind: 'node',
    edge: '(system call into the kernel)',
    node: {
      id: 'kernel',
      title: 'Kernel driver → motor spins',
      mono: 'Linux kernel · e.g. /sys/class/leds/vibrator',
      notes: ['Only the kernel touches real hardware', 'The driver programs the haptics chip', '…and your phone buzzes 📳'],
      detail:
        'The HAL writes to the device node its driver exposes (a `/dev/...` or `/sys/...` file). The **kernel driver** translates that into bus commands (I²C/SPI) for the haptics chip, current flows, and the motor spins. Total journey: Java → Binder → Java → JNI → C++ → AIDL/HIDL → vendor C++ → kernel — in a few milliseconds.',
    },
  },
];

export function JniHalFlow() {
  return (
    <NotesFlow
      title="JNI & the HAL Bridge"
      intro="Follow one vibration from a Java call all the way down to the motor — every bridge in the system, in one trace."
      steps={steps}
    />
  );
}
