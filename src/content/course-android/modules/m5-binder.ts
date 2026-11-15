import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'android-m5',
  slug: 'binder-aidl',
  order: 5,
  title: 'Binder IPC & AIDL',
  subtitle: 'How every framework call crosses the process wall',
  icon: 'workflow',
  lessons: [
    {
      id: 'android-m5-l1',
      title: 'Why Binder exists — one call, one copy',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Every process in Android lives behind a **memory wall**: the kernel gives each one its own private address space, so a crashing or malicious app can’t read or scribble over another’s memory. Great for safety — but now a problem: your app and `system_server` are different processes, and **every single framework call must cross that wall**. The mechanism that crosses it millions of times a day is **Binder**. Step through one call:',
        },
        { type: 'widget', widget: 'binder-ipc' },
        {
          type: 'keyterms',
          title: 'Side-notes to remember',
          terms: [
            { term: 'Parcel', def: 'Objects flattened into a row of bytes so they can travel. The flattening is called *marshalling* — just a fancy word for packing.' },
            { term: 'Proxy / Stub', def: 'Twin objects: the **Proxy** sits in the client pretending to be the service; the **Stub** sits in the server unpacking and calling the real code.' },
            { term: 'Handle', def: 'Your ticket to a remote service — a number the *kernel* maps to the real object. Unforgeable, because userspace never holds a raw pointer.' },
            { term: 'ServiceManager', def: 'The phonebook: name → handle. Reachable by everyone at the fixed handle 0.' },
            { term: 'mmap one-copy', def: 'The receiver’s buffer is mapped into both kernel and receiver — so the single copy *into the kernel* is already *in the receiver*.' },
          ],
        },
        {
          type: 'analogy',
          text: 'a bank counter with a pneumatic tube. You (client) can’t walk into the vault (server memory). You fill a form (Parcel), the tube (Binder driver) shoots it across in one go (one copy), a free teller (Binder thread pool) processes it, and the tube returns your receipt. The teller always sees your verified account number on the form (getCallingUid) — you can’t scribble someone else’s.',
        },
      ],
    },
    {
      id: 'android-m5-l2',
      title: 'Under the hood in depth',
      minutes: 10,
      blocks: [
        { type: 'h3', text: 'a) Why not sockets or pipes?' },
        {
          type: 'p',
          text: 'Classic Linux IPC (pipes, sockets, System V queues) copies data **twice**: sender → kernel buffer, then kernel buffer → receiver. Binder’s trick: when a process opens Binder, it **mmap**s a receive buffer — *mmap* being the kernel feature that makes one piece of physical memory visible at two addresses (once in the kernel, once in the process). The driver copies the sender’s Parcel **directly into that mapped buffer** — one copy, done. On a phone where *everything* is IPC, halving the copying matters enormously.',
        },
        { type: 'h3', text: 'b) Identity — the security superpower' },
        {
          type: 'p',
          text: 'With a socket, the receiver only knows “some bytes arrived”. With Binder, **the kernel stamps every transaction with the sender’s UID and PID**. The receiving service reads them with `Binder.getCallingUid()` — and because the stamp comes from the kernel, it **cannot be faked**. This is the foundation the whole permission system stands on (as you saw in the permissions topic).',
        },
        { type: 'h3', text: 'c) Threads — who runs my request?' },
        {
          type: 'p',
          text: 'Incoming calls don’t run on the server’s main thread. Each Binder process owns a **thread pool** (default cap ~16); the driver wakes a free thread to run the Stub. Two consequences worth saying out loud in interviews: **services must be thread-safe** (two apps can call simultaneously on two pool threads), and **a full pool means callers queue up** — a classic source of system jank when a service blocks its Binder threads.',
        },
        { type: 'h3', text: 'd) The 1 MB budget' },
        {
          type: 'p',
          text: 'The mmap-ed transaction buffer is about **1 MB per process — shared by all its concurrent transactions**. Blow it and you get the infamous **`TransactionTooLargeException`**. That’s the real reason you never stuff a bitmap into an intent extra, and why `onSaveInstanceState` Bundles must stay small (they cross Binder into `system_server`).',
        },
        { type: 'h3', text: 'e) Death notifications' },
        {
          type: 'p',
          text: 'Binder also solves “how do I know the other side died?” — register a **`DeathRecipient`** with `linkToDeath()`, and the kernel (who always knows when a process dies) calls your `binderDied()`. This is exactly how AMS instantly cleans up after crashed apps, and how Zygote’s world rebuilds when `system_server` goes down (remember the boot topic’s death chain).',
        },
      ],
    },
    {
      id: 'android-m5-l3',
      title: 'AIDL in practice',
      minutes: 11,
      blocks: [
        {
          type: 'p',
          text: 'Writing Proxies, Stubs and Parcel packing by hand would be miserable — so Android generates them for you from an **AIDL** file (*Android Interface Definition Language*: you describe the interface, the compiler writes the plumbing).',
        },
        {
          type: 'code',
          caption: 'IRateService.aidl — the contract',
          code: `// The interface both processes agree on
interface IRateService {
    // in    = data travels INTO the service (default for primitives)
    // out   = service fills it, travels back to you
    // inout = both directions
    int getRate(in String metal);

    // oneway = fire-and-forget: returns immediately, no reply,
    // calls are queued & run one by one on the server
    oneway void logQuery(in String metal);
}`,
        },
        {
          type: 'p',
          text: 'From this one file the build generates `IRateService.Stub` (server side — extend it and implement the methods) and an inner **Proxy** (client side — created for you by `Stub.asInterface(binder)`). The flow end to end:',
        },
        {
          type: 'code',
          caption: 'Server (inside a Service) and client',
          code: `// SERVER — implement the Stub, hand it out from onBind()
private final IRateService.Stub binder = new IRateService.Stub() {
    @Override public int getRate(String metal) {
        // runs on a BINDER POOL THREAD — must be thread-safe!
        return rates.get(metal);
    }
    @Override public void logQuery(String metal) { /* async, no reply */ }
};
@Override public IBinder onBind(Intent i) { return binder; }

// CLIENT — in onServiceConnected after bindService()
IRateService svc = IRateService.Stub.asInterface(service);
int rate = svc.getRate("gold");   // looks local — is actually IPC

// And know when the server dies:
service.linkToDeath(() -> reconnect(), 0);`,
        },
        {
          type: 'ul',
          items: [
            '**Directional tags** (`in`/`out`/`inout`) exist because copying costs: marking a big object `in` when the server only *reads* it avoids shipping it back pointlessly. Primitives are always `in`.',
            '**`oneway`** calls return immediately (no reply Parcel). On the server they’re **serialized** — executed one at a time in arrival order. Perfect for notifications/logging; useless when you need an answer.',
            'Custom objects crossing the wall must implement **`Parcelable`** — your class teaching Android how to flatten and un-flatten itself.',
            'Same-process binding skips all of this: `onBind()` hands the client the **actual object** — no Proxy, no Parcel, no copies. AIDL only earns its keep across processes.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Where you’ve already met AIDL without noticing',
          text: 'Every framework API: `ActivityManager` talks to AMS over `IActivityManager.aidl`, and since Treble the HALs speak **stable AIDL** too. Your Messenger-based services? `Messenger` is just a convenience wrapper around a oneway AIDL interface (`IMessenger`) carrying Handler Messages.',
        },
      ],
    },
    {
      id: 'android-m5-l4',
      title: 'Additional information — the interview angle',
      minutes: 6,
      blocks: [
        {
          type: 'keyterms',
          title: '✱ Rapid fire',
          terms: [
            { term: 'Three binder drivers', def: '`/dev/binder` (framework ↔ apps), `/dev/hwbinder` (HIDL HALs), `/dev/vndbinder` (vendor ↔ vendor). Same mechanism, separated worlds.' },
            { term: 'Blocking by default', def: 'A normal Binder call **blocks the calling thread** until the reply. Call a slow service from the main thread → jank/ANR. `oneway` is the async escape hatch.' },
            { term: 'clearCallingIdentity()', def: 'A service that must call *onward* as itself (not as its caller) temporarily swaps the UID stamp — and restores it after. Nuanced, senior-sounding.' },
            { term: 'Binder vs Messenger vs AIDL', def: 'Same-process? Extend `Binder` directly. Cross-process, simple, serialized? `Messenger`. Cross-process, multithreaded, typed methods? Full AIDL.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer (60 seconds)',
          text: '“Processes are isolated by the kernel, so Android routes all cross-process calls through the Binder driver. A client gets a handle from servicemanager, its generated Proxy marshals arguments into a Parcel, and the driver copies it once — directly into a buffer mmap-ed by the receiver, which is why Binder is one-copy where sockets need two. A Binder-pool thread runs the generated Stub, which calls the real method; the kernel stamps every transaction with the caller’s UID, so permission checks on the service side are unforgeable. AIDL generates the Proxy/Stub pair; in/out/inout control copy direction, oneway makes calls async and serialized, Parcelable flattens custom types, the shared transaction buffer is about 1 MB — hence TransactionTooLargeException — and linkToDeath gives me death notifications.”',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'See it live',
          text: '`adb shell service list` prints every registered service with its interface — that’s literally servicemanager’s phonebook. And `dumpsys binder_calls_stats` (or `/sys/kernel/debug/binder/stats`) shows real transaction counts. Quoting either proves you’ve explored, not just read.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m5-q1',
      type: 'single',
      prompt: 'Binder needs only ONE data copy per transaction because…',
      options: [
        'Parcels are compressed',
        'The receiver mmap-s a buffer, so the copy into the kernel lands directly in the receiver’s address space',
        'It uses shared global memory for everything',
        'The kernel skips copying for small data',
      ],
      correct: [1],
      explanation: 'mmap makes one physical buffer visible in both kernel and receiver — sockets/pipes need a second kernel→receiver copy.',
    },
    {
      id: 'android-m5-q2',
      type: 'single',
      prompt: 'A service trusts Binder.getCallingUid() because…',
      options: [
        'The client promises honestly',
        'The kernel stamps every transaction with the sender’s UID — userspace cannot forge it',
        'ServiceManager verifies a password',
        'It’s encrypted',
      ],
      correct: [1],
      explanation: 'Caller identity is attached by the Binder driver in the kernel — the foundation of Android permission enforcement.',
    },
    {
      id: 'android-m5-q3',
      type: 'single',
      prompt: 'ServiceManager’s special property is that it…',
      options: [
        'Runs inside the kernel',
        'Is reachable at the fixed Binder handle 0, so everyone can find it without looking it up',
        'Hosts all system services',
        'Only exists during boot',
      ],
      correct: [1],
      explanation: 'The phonebook needs no phonebook entry: handle 0 is the hardwired context manager.',
    },
    {
      id: 'android-m5-q4',
      type: 'single',
      prompt: 'Your AIDL method is called from two apps at once. The server must…',
      options: [
        'Nothing — Binder serializes everything',
        'Be thread-safe: each call may run on a different Binder pool thread simultaneously',
        'Reject one caller',
        'Run them on the main thread',
      ],
      correct: [1],
      explanation: 'Only oneway calls are serialized. Normal calls run concurrently on the pool — synchronize your state.',
    },
    {
      id: 'android-m5-q5',
      type: 'single',
      prompt: 'A oneway AIDL method…',
      options: [
        'Blocks until the server finishes',
        'Returns immediately with no reply; server executes such calls one at a time, in order',
        'Can return an int',
        'Skips the Binder driver',
      ],
      correct: [1],
      explanation: 'Fire-and-forget: no reply Parcel, async for the caller, serialized on the receiving side.',
    },
    {
      id: 'android-m5-q6',
      type: 'single',
      prompt: 'TransactionTooLargeException most commonly means…',
      options: [
        'The network payload was huge',
        'A Parcel (intent extras, saved-state Bundle…) blew the ~1 MB shared Binder buffer',
        'Too many threads in the pool',
        'The service died',
      ],
      correct: [1],
      explanation: 'The per-process transaction buffer is ~1 MB shared — big bitmaps in extras or giant Bundles are the usual culprits.',
    },
    {
      id: 'android-m5-q7',
      type: 'single',
      prompt: 'To find out that a remote service’s process died, a client should…',
      options: [
        'Poll it every second',
        'Register a DeathRecipient via linkToDeath() — the kernel reports the death',
        'Catch IOException',
        'Listen for ACTION_SHUTDOWN',
      ],
      correct: [1],
      explanation: 'The kernel always knows when a process dies and fires binderDied() on registered recipients — AMS cleans up apps exactly this way.',
    },
    {
      id: 'android-m5-q8',
      type: 'multi',
      prompt: 'True statements: (pick all)',
      options: [
        'A normal Binder call blocks the calling thread until the reply arrives',
        'Binding to a service in the SAME process hands you the real object — no IPC at all',
        'HIDL HALs historically used /dev/hwbinder, a separate binder domain',
        'Parcelable objects cannot cross process boundaries',
      ],
      correct: [0, 1, 2],
      explanation: 'Binder is synchronous by default; same-process onBind() returns the actual object; hwbinder is the HAL domain. Parcelable exists precisely TO cross boundaries.',
    },
  ],
  resources: [
    { label: 'Android docs — AIDL', url: 'https://developer.android.com/develop/background-work/services/aidl', kind: 'docs', free: true },
    { label: 'AOSP — Binder IPC', url: 'https://source.android.com/docs/core/architecture/hidl/binder-ipc', kind: 'docs', free: true },
  ],
};
