import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'android-m8',
  slug: 'input-pipeline-systemui',
  order: 8,
  title: 'Input Pipeline & SystemUI',
  subtitle: 'From a finger on glass to onTouchEvent — and the bars around it',
  icon: 'list-tree',
  lessons: [
    {
      id: 'android-m8-l1',
      title: 'The journey of one tap',
      minutes: 8,
      blocks: [
        {
          type: 'p',
          text: 'You know *when* input causes trouble (the 5-second ANR). Now the full story of **where a touch travels** — because “explain the input pipeline” is a standard framework-round question, and it beautifully reuses three things you already know: epoll, WMS focus, and the main thread’s Looper.',
        },
        { type: 'widget', widget: 'input-pipeline' },
        {
          type: 'keyterms',
          title: 'Side-notes to remember',
          terms: [
            { term: 'Two processes', def: 'EventHub, InputReader and InputDispatcher all run inside **system_server**; only the last hop crosses into your app.' },
            { term: 'InputChannel', def: 'The private pipe (a socketpair) between InputDispatcher and one window — created when WMS adds the window.' },
            { term: 'The ANR clock', def: 'Started by InputDispatcher when it sends, stopped by your `finishInputEvent` — the 5 seconds live exactly between those two points.' },
            { term: 'Keys vs touches', def: 'Key events go to the **focused** window (WMS decides); touch events go to the window **under the finger**.' },
          ],
        },
      ],
    },
    {
      id: 'android-m8-l2',
      title: 'Inside the app — the U-shape',
      minutes: 10,
      blocks: [
        {
          type: 'p',
          text: 'Once ViewRootImpl has the event, a second journey starts *inside* your view tree — and this one is the single most-asked custom-view interview question. The rule is a **U-shape**: the event goes **down** the tree (each parent may intercept it), and if nobody consumes it, it **bubbles back up**.',
        },
        { type: 'widget', widget: 'touch-dispatch' },
        { type: 'h3', text: 'The three methods, one line each' },
        {
          type: 'keyterms',
          terms: [
            { term: 'dispatchTouchEvent()', def: 'The traffic router — every event enters a view through this. You rarely override it.' },
            { term: 'onInterceptTouchEvent()', def: '**ViewGroups only.** “Before passing this to my children… do I want it for myself?” Return true to steal the gesture.' },
            { term: 'onTouchEvent()', def: 'The consumer. Return **true** = “mine — keep sending me this gesture.” Return false = “not interested,” and the event bubbles up.' },
          ],
        },
        {
          type: 'ul',
          items: [
            '**Why DOWN matters most**: if nobody consumes `ACTION_DOWN`, the system doesn’t bother delivering the rest of the gesture to your app’s views at all.',
            '**Interception mid-gesture**: a scroll container lets the button receive DOWN; the moment your finger *moves* far enough, `onInterceptTouchEvent` returns true, the child receives **`ACTION_CANCEL`**, and the rest of the gesture belongs to the scroller. That’s why a pressed button un-presses when you start scrolling.',
            '**The child’s veto**: a child can call `requestDisallowInterceptTouchEvent(true)` to forbid parents from intercepting — how horizontal carousels survive inside vertical scrollers.',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“A touch is read from /dev/input by system_server’s EventHub, decoded by InputReader into MotionEvents, and InputDispatcher — consulting WMS for the target window — sends it through that window’s InputChannel, starting the 5-second ANR timer. The app’s main Looper wakes, ViewRootImpl dispatches it down the view tree via dispatchTouchEvent; any ViewGroup may intercept (the child then gets ACTION_CANCEL), otherwise the deepest view’s onTouchEvent decides — true consumes the gesture, false lets it bubble back up to the Activity.”',
        },
      ],
    },
    {
      id: 'android-m8-l3',
      title: 'SystemUI — the app that is the OS’s face',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'Here’s the fact that surprises people: the status bar, the notification shade, the lock screen, the navigation gestures, recents — **none of that is “the OS drawing on top.”** It’s all one privileged, persistent **app**: `com.android.systemui`, launched by SystemServer during `startOtherServices()` (you saw this line in the boot topic).',
        },
        { type: 'h3', text: 'a) What lives inside SystemUI' },
        {
          type: 'ul',
          items: [
            '**Status bar** (clock, icons) and the **notification shade** with quick settings — windows at high z-order that WMS keeps above app windows.',
            '**Keyguard** — the lock screen, including the PIN pad you saw in the boot story while CE storage was still sealed.',
            '**Navigation** — back/home gestures or buttons, and the recents (overview) screen.',
            'Plus volume dialogs, screenshots UI, media output picker… each a module inside the same process.',
          ],
        },
        { type: 'h3', text: 'b) How it talks to the system' },
        {
          type: 'p',
          text: 'SystemUI holds no special magic of its own — it’s a Binder **client** like any app, just signed with the platform key so signature-level permissions open every door. Example: an app posts a notification → **NotificationManagerService** (in system_server) ranks and stores it → pushes it over Binder to SystemUI → SystemUI inflates the row you see in the shade. The service owns the *data*; SystemUI owns the *pixels*.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'And when it dies?',
          text: 'From the boot topic’s death chain: AMS notices a *persistent* process died and restarts it instantly — status bar blinks, nothing else lost. You can watch it: `adb shell pkill -f com.android.systemui` (on a debug build) and count the blink.',
        },
        {
          type: 'keyterms',
          title: '✱ Rapid fire',
          terms: [
            { term: 'Is the status bar an Activity?', def: 'No — it’s a plain window SystemUI adds via WindowManager with a privileged window type.' },
            { term: 'Who ranks notifications?', def: 'NotificationManagerService (system_server). SystemUI only renders what it’s told.' },
            { term: 'Why a separate process?', def: 'Isolation: UI chrome can crash and restart in a second without touching system_server — you’d rather blink the status bar than soft-reboot.' },
            { term: 'OEM skins?', def: 'Samsung’s OneUI bars = a modified SystemUI. It’s an app, so vendors fork it.' },
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m8-q1',
      type: 'single',
      prompt: 'Order the input pipeline correctly:',
      options: [
        'InputReader → EventHub → kernel → InputDispatcher → app',
        'Kernel driver (/dev/input) → EventHub → InputReader → InputDispatcher → InputChannel → ViewRootImpl',
        'EventHub → InputDispatcher → InputReader → WMS → app',
        'Kernel → WMS → InputReader → app',
      ],
      correct: [1],
      explanation: 'Driver publishes evdev events; EventHub watches the nodes; InputReader cooks MotionEvents; InputDispatcher targets a window and sends through its channel to ViewRootImpl.',
    },
    {
      id: 'android-m8-q2',
      type: 'single',
      prompt: 'The input-ANR 5-second clock runs between…',
      options: [
        'Finger down and finger up',
        'InputDispatcher sending the event and the app’s finishInputEvent acknowledging it',
        'onPause and onResume',
        'VSYNC pulses',
      ],
      correct: [1],
      explanation: 'The dispatcher starts the timer on send; the app’s acknowledgement stops it. A blocked main thread can’t acknowledge — ANR.',
    },
    {
      id: 'android-m8-q3',
      type: 'single',
      prompt: 'A key press (not a touch) is delivered to…',
      options: [
        'Every visible window',
        'The window WMS says currently has input focus',
        'The window under the finger',
        'SystemUI first',
      ],
      correct: [1],
      explanation: 'Keys follow focus (WMS’s decision); touches follow the finger’s position.',
    },
    {
      id: 'android-m8-q4',
      type: 'single',
      prompt: 'A scroll container steals a gesture mid-swipe. The child that had it receives…',
      options: ['ACTION_UP', 'Nothing', 'ACTION_CANCEL', 'onStop()'],
      correct: [2],
      explanation: 'Interception sends the child ACTION_CANCEL so it can un-press cleanly — the rest of the gesture goes to the parent.',
    },
    {
      id: 'android-m8-q5',
      type: 'single',
      prompt: 'No view consumed ACTION_DOWN. What happens to the rest of that gesture?',
      options: [
        'Delivered anyway',
        'Not delivered to those views at all — DOWN decides interest',
        'Sent to SystemUI',
        'Triggers an ANR',
      ],
      correct: [1],
      explanation: 'Consuming DOWN is the subscription to the gesture; refusing it means you’ve opted out of MOVE/UP.',
    },
    {
      id: 'android-m8-q6',
      type: 'single',
      prompt: 'onInterceptTouchEvent() exists on…',
      options: ['Every View', 'ViewGroups only — only containers can steal from children', 'Activities only', 'ViewRootImpl'],
      correct: [1],
      explanation: 'Interception is a parent’s privilege: it sits between the incoming event and the children.',
    },
    {
      id: 'android-m8-q7',
      type: 'single',
      prompt: 'The status bar and notification shade are rendered by…',
      options: [
        'system_server directly',
        'The kernel',
        'com.android.systemui — a persistent, platform-signed app process',
        'Each app for itself',
      ],
      correct: [2],
      explanation: 'SystemUI is an app launched by SystemServer; services own the data, SystemUI draws it.',
    },
    {
      id: 'android-m8-q8',
      type: 'single',
      prompt: 'SystemUI crashes. The result is…',
      options: [
        'A soft reboot',
        'AMS restarts the persistent process immediately — a one-second status-bar blink',
        'A kernel panic',
        'The launcher takes over',
      ],
      correct: [1],
      explanation: 'Persistent processes are auto-restarted by AMS — unlike system_server, whose death means a soft reboot.',
    },
  ],
  resources: [
    { label: 'AOSP — Input overview', url: 'https://source.android.com/docs/core/interaction/input/overview', kind: 'docs', free: true },
    { label: 'Android docs — Manage touch events in a ViewGroup', url: 'https://developer.android.com/develop/ui/views/touch-and-input/gestures/viewgroup', kind: 'docs', free: true },
  ],
};
