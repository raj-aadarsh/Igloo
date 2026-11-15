import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'android-m4',
  slug: 'context-intents-permissions',
  order: 4,
  title: 'Context, Intents & Permissions',
  subtitle: 'Who am I, what do I want, and am I allowed',
  icon: 'compass',
  lessons: [
    {
      id: 'android-m4-l1',
      title: 'Context in depth — and the leak',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: '`Context` is the most-passed-around object in Android, yet most developers can’t define it. Simply put: **Context is your app’s ID card plus its phonebook** — it answers *“who am I?”* (package name, theme, permissions granted to me) and *“how do I reach the system?”* (resources, files, `getSystemService()`, `startActivity()`). Nothing meaningful happens in Android without one, because every interaction with the framework needs to know *which app, with which rights, in which theme* is asking.',
        },
        { type: 'h3', text: 'a) The two Contexts that matter' },
        {
          type: 'keyterms',
          terms: [
            { term: 'Activity context', def: 'Lives and dies with **one screen**. Carries the activity’s theme and window — so anything UI (inflating layouts, showing a `Dialog`) needs this one.' },
            { term: 'Application context', def: 'One per process, lives as long as the app does (`getApplicationContext()`). No theme, no window — but perfectly safe to keep long-term.' },
            { term: 'The rule', def: '**Match the lifetime.** UI things → Activity context. Anything stored beyond one screen (singletons, repositories, libraries) → Application context.' },
          ],
        },
        { type: 'h3', text: 'b) The classic Context memory leak' },
        {
          type: 'p',
          text: 'Here’s the interview favourite. A **singleton** (an object created once and kept for the whole app’s life) stores a reference to an Activity context:',
        },
        {
          type: 'code',
          caption: 'The leak — the singleton outlives the screen it captured',
          code: `class Analytics {
    static Analytics sInstance;          // lives forever
    private final Context mContext;      // ...holding an Activity!

    static Analytics get(Context c) {
        if (sInstance == null) sInstance = new Analytics(c); // BAD: c might be an Activity
        return sInstance;
    }
    private Analytics(Context c) { mContext = c; }
}

// FIX: never store the raw parameter — store c.getApplicationContext()`,
        },
        {
          type: 'p',
          text: 'Why is this so bad? The user rotates the screen → the Activity is destroyed → but the garbage collector **can’t free it**, because the static singleton still points at it. And an Activity doesn’t leak alone: it drags its **entire view tree, bitmaps and resources** with it. Rotate ten times, leak ten activities. The fix is one line: store `getApplicationContext()` instead — its lifetime already matches the singleton’s.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Context is the handle to the app environment — identity, resources, and access to system services. Activity context is themed and window-backed but dies with the screen; Application context is process-long. The rule is to match lifetimes: anything that outlives a screen must hold the Application context, otherwise a static or singleton reference pins the destroyed Activity — and its whole view hierarchy — in memory.”',
        },
      ],
    },
    {
      id: 'android-m4-l2',
      title: 'Intents in depth',
      minutes: 10,
      blocks: [
        {
          type: 'p',
          text: 'An **Intent** is a message envelope saying *“I want this done.”* It’s how every component gets started — you’ve already used them in `startActivity`, `startService` and broadcasts. The big fork in the road: do you name the receiver, or describe the job?',
        },
        { type: 'h3', text: 'a) Explicit intent — you name the class' },
        {
          type: 'code',
          caption: 'Explicit: exact target, no questions asked',
          code: `Intent i = new Intent(this, DetailActivity.class);
i.putExtra("item_id", 42);     // extras = a Bundle of data riding along
startActivity(i);`,
        },
        {
          type: 'p',
          text: 'Used for navigation **inside your own app**. The system doesn’t need to search anything — the component name is right there.',
        },
        { type: 'h3', text: 'b) Implicit intent — you describe the job' },
        {
          type: 'p',
          text: 'You say **what** (an `action`), optionally **on what** (`data` URI and/or MIME type — MIME type is just a label describing the kind of content, like `image/*` or `text/plain`), and the system finds **who**. Every app advertises what it can handle with `<intent-filter>` blocks in its manifest — PMS collected them all at install time. Try the matcher:',
        },
        { type: 'widget', widget: 'intent-matching' },
        {
          type: 'ul',
          items: [
            '**Matching rules**: the filter must contain the intent’s **action**; the **data/MIME** must match what the filter declares; and the filter must include **`CATEGORY_DEFAULT`** — because `startActivity()` silently adds that category to every implicit intent. A filter without it can never receive implicit launches (classic bug).',
            '**0 matches** → `ActivityNotFoundException` — the caller crashes if it didn’t check first.',
            '**1 match** → starts directly. **Many** → the chooser sheet (“Open with…”).',
          ],
        },
        { type: 'h3', text: 'c) PendingIntent — an intent with your identity inside' },
        {
          type: 'p',
          text: 'One more kind you must be able to define: a **PendingIntent** wraps an intent and hands it to *another* app (usually the system) to fire **later, as you, with your permissions**. That’s how a notification tap opens your activity and how AlarmManager starts your code at 7 am — the system is executing *your* intent on your behalf. Since Android 12 you must declare `FLAG_IMMUTABLE` (or explicitly mutable), so the holder can’t rewrite what the intent does.',
        },
      ],
    },
    {
      id: 'android-m4-l3',
      title: 'Permissions in depth',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Permissions answer the third question: *am I allowed?* Android sorts them by how dangerous they are — and that decides **when** the user is asked.',
        },
        { type: 'h3', text: 'a) The three levels you must know' },
        {
          type: 'keyterms',
          terms: [
            { term: 'Install-time (normal)', def: 'Low-risk things like `INTERNET` or `VIBRATE`. Declared in the manifest, granted automatically at install — the user is never prompted.' },
            { term: 'Runtime (dangerous)', def: 'Privacy-touching things — camera, location, contacts, microphone. Declared in the manifest **and** asked via a dialog while the app runs (since Android 6). Can be denied, or granted “only this time”, and auto-reset if the app sits unused.' },
            { term: 'Signature / privileged', def: 'The powerful ones (`INSTALL_PACKAGES`, …). **Signature**: only granted to apps signed with the **same certificate** as the app that defined the permission — this is how an OEM’s own apps unlock OEM powers. **Privileged**: additionally requires sitting in `/system/priv-app` *and* being explicitly allow-listed in an XML on the system partition.' },
          ],
        },
        { type: 'h3', text: 'b) Where enforcement actually happens' },
        {
          type: 'p',
          text: 'This is the part that connects everything: a permission is **not** checked inside your app (that could be tampered with). When your call crosses Binder into a system service, the service asks the kernel-backed question *“which UID is calling me?”* (`Binder.getCallingUid()`) and checks that UID’s grants — e.g. `context.checkCallingPermission(CAMERA)`. The kernel supplied the identity, the service holds the rulebook: **unforgeable caller + check on the trusted side**. Deny means a `SecurityException` comes back over Binder.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Runtime permission flow in one line each',
          text: '`checkSelfPermission()` → maybe `shouldShowRequestPermissionRationale()` (user denied once — explain yourself) → `requestPermissions()` → result callback. Deny twice and the dialog stops appearing (“don’t ask again”) — the only path left is Settings.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“Three tiers: normal permissions are granted silently at install; dangerous ones prompt the user at runtime since Android 6 and can be revoked anytime; signature permissions are granted only to apps signed with the same certificate as the definer, and privileged ones additionally require the priv-app partition plus an allow-list. Crucially, enforcement happens on the far side of Binder — the service checks Binder.getCallingUid() against the grant database, so an app can never lie about who it is.”',
        },
      ],
    },
    {
      id: 'android-m4-l4',
      title: 'Additional information — tying it together',
      minutes: 5,
      blocks: [
        {
          type: 'keyterms',
          title: '✱ Rapid-fire follow-ups',
          terms: [
            { term: 'Toast from App context?', def: 'Works — a toast needs no window of yours. A **Dialog** crashes: it must attach to an activity’s window and theme.' },
            { term: 'startActivity from App context?', def: 'Historically needs `FLAG_ACTIVITY_NEW_TASK` — there’s no existing task to join when no activity is behind the call.' },
            { term: 'Intent extras size', def: 'Extras travel through Binder → the ~1 MB transaction budget applies. Never put a bitmap in an intent; pass a URI to it instead.' },
            { term: 'Why explicit for your own services?', def: 'Implicit service intents are banned since Android 5 — you can’t know *whose* service would have answered. Security first.' },
            { term: 'Custom permissions', def: 'Any app can `<permission>`-define its own and guard its exported components with it — that’s literally how signature-level app suites talk privately.' },
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'See it on a real device',
          text: '`adb shell dumpsys package com.your.app | grep permission` shows exactly which permissions are granted right now — and `adb shell pm revoke com.your.app android.permission.CAMERA` yanks one away while the app runs. Watching your own app survive that is the best way to understand runtime permissions.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m4-q1',
      type: 'single',
      prompt: 'A singleton stores the Context it was first created with — an Activity. The consequence:',
      options: [
        'Nothing, contexts are free',
        'The destroyed Activity and its whole view tree stay reachable from the static reference — a memory leak on every recreation',
        'The singleton is garbage collected',
        'A SecurityException',
      ],
      correct: [1],
      explanation: 'The static field outlives the screen and pins the Activity (plus views and bitmaps) in memory. Store getApplicationContext() instead.',
    },
    {
      id: 'android-m4-q2',
      type: 'single',
      prompt: 'Which task strictly requires an Activity context (not Application)?',
      options: ['Reading a string resource', 'Showing a Dialog', 'getSystemService()', 'Reading a file'],
      correct: [1],
      explanation: 'A Dialog must attach to an activity’s window and theme. Resources, services and files are fine from either.',
    },
    {
      id: 'android-m4-q3',
      type: 'single',
      prompt: 'An implicit intent matches a filter when…',
      options: [
        'The package names are equal',
        'Action matches, data/MIME matches, and the filter declares CATEGORY_DEFAULT',
        'Only the action matches',
        'The apps share a signature',
      ],
      correct: [1],
      explanation: 'All three tests must pass — and DEFAULT is required because startActivity() adds that category to every implicit intent.',
    },
    {
      id: 'android-m4-q4',
      type: 'single',
      prompt: 'startActivity() finds zero matching activities. What happens?',
      options: ['Silently nothing', 'ActivityNotFoundException', 'The Play Store opens', 'A chooser with zero rows'],
      correct: [1],
      explanation: 'No handler = an exception in the caller. Check resolveActivity() or catch it.',
    },
    {
      id: 'android-m4-q5',
      type: 'single',
      prompt: 'A PendingIntent is best described as…',
      options: [
        'A delayed Handler message',
        'An intent another app can fire later with YOUR identity and permissions',
        'An intent without extras',
        'A broadcast',
      ],
      correct: [1],
      explanation: 'It wraps an intent plus your identity — notifications and alarms execute it “as you” long after your code stopped running.',
    },
    {
      id: 'android-m4-q6',
      type: 'single',
      prompt: 'CAMERA is a runtime permission because…',
      options: [
        'It’s expensive to grant',
        'It touches user privacy, so the user must consent in-context and can revoke it anytime',
        'The camera HAL requires it',
        'It’s needed at install time',
      ],
      correct: [1],
      explanation: 'Dangerous = privacy-sensitive: prompted at runtime (Android 6+), revocable, and auto-reset for unused apps.',
    },
    {
      id: 'android-m4-q7',
      type: 'single',
      prompt: 'A signature-level permission is granted when…',
      options: [
        'The user approves a dialog',
        'The requesting app is signed with the same certificate as the app that defined the permission',
        'The app is popular enough',
        'The app targets the latest SDK',
      ],
      correct: [1],
      explanation: 'Same signing key = same author = trusted. It’s how platform/OEM apps get powers ordinary apps can’t request.',
    },
    {
      id: 'android-m4-q8',
      type: 'single',
      prompt: 'Permission checks for system services actually happen…',
      options: [
        'In the app, before the call',
        'On the service side of Binder, using the kernel-provided Binder.getCallingUid()',
        'In the Play Store',
        'In the bootloader',
      ],
      correct: [1],
      explanation: 'The caller’s UID comes from the kernel and can’t be faked; the trusted side holds the rulebook.',
    },
  ],
  resources: [
    { label: 'Android docs — Intents & filters', url: 'https://developer.android.com/guide/components/intents-filters', kind: 'docs', free: true },
    { label: 'Android docs — Permissions overview', url: 'https://developer.android.com/guide/topics/permissions/overview', kind: 'docs', free: true },
  ],
};
