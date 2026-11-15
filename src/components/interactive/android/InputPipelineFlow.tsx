import { NotesFlow, type NotesStep } from './NotesFlow';

// One finger tap, traced from the touchscreen hardware to onTouchEvent —
// the input pipeline every framework engineer gets asked about.

const steps: NotesStep[] = [
  {
    kind: 'node',
    node: {
      id: 'kernel',
      title: 'Touchscreen → kernel driver',
      mono: '/dev/input/event2',
      notes: ['The touch controller raises an interrupt', 'Driver publishes raw events at a device node'],
      detail:
        'Your finger changes the screen’s capacitance; the touch controller chip tells the CPU via an **interrupt** (“something happened, look now”). The kernel driver turns that into standard **evdev** events — small records like “X=540, Y=1200, finger down” — and publishes them at a device file such as `/dev/input/event2`. From here on, it’s software all the way.',
    },
  },
  {
    kind: 'node',
    edge: '(epoll wakes the input thread)',
    node: {
      id: 'eventhub',
      title: 'EventHub',
      mono: 'native · inside system_server',
      notes: ['Watches ALL `/dev/input/*` nodes at once', 'Also notices devices appearing/disappearing'],
      detail:
        '**EventHub** is the system’s single listening post for input hardware: it keeps every `/dev/input/*` node open and sleeps on **epoll** (the same kernel wait-for-events trick the main thread’s Looper uses) until any of them has data. Plug in a USB keyboard and EventHub is also the one that notices the new device.',
    },
  },
  {
    kind: 'node',
    node: {
      id: 'reader',
      title: 'InputReader',
      mono: 'decodes raw → cooked events',
      notes: ['Raw coordinates → a proper `MotionEvent`', 'Applies calibration, multi-touch tracking, velocity'],
      detail:
        '**InputReader** turns raw evdev records into meaningful, “cooked” events: it assembles multi-finger state (pointer IDs), maps hardware coordinates to screen pixels (rotation!), and classifies the gesture stream into `MotionEvent`s — ACTION_DOWN, ACTION_MOVE, ACTION_UP. It immediately hands each cooked event to the dispatcher so the pipeline never stalls.',
    },
  },
  {
    kind: 'node',
    node: {
      id: 'dispatcher',
      title: 'InputDispatcher',
      mono: 'finds the target window',
      notes: ['Asks WMS: which window is touched/focused?', '**Starts the 5-second ANR timer** here', 'Sends the event through that window’s InputChannel'],
      detail:
        '**InputDispatcher** decides *who* gets the event. For a touch it picks the window under the finger; for a key press, the **focused** window — information it gets from **WMS**. Then it writes the event into that window’s **InputChannel** — a private pipe (built on a socketpair) created when the window was added. Crucially, the dispatcher starts a timer: if the app doesn’t report the event handled within **5 seconds**, this is exactly where the ANR verdict comes from.',
    },
  },
  {
    kind: 'node',
    edge: '(the app’s Looper wakes up)',
    node: {
      id: 'viewroot',
      title: 'ViewRootImpl',
      mono: 'app process · main thread',
      notes: ['The InputChannel plugs into the main Looper’s epoll', 'Remember `nativePollOnce()`? This is one thing it waits for'],
      detail:
        'On the app side, the InputChannel is registered with the main thread’s **Looper** — so the same `nativePollOnce()` sleep from the Handler/Looper topic wakes up for input too. **ViewRootImpl** (the bridge object between your view tree and WMS) receives the `MotionEvent` and starts delivering it into your views. When your code finishes with it, `finishInputEvent()` reports back to the dispatcher — that report is what stops the 5-second ANR clock.',
    },
  },
  {
    kind: 'node',
    node: {
      id: 'views',
      title: 'The view tree',
      mono: 'dispatchTouchEvent → onTouchEvent',
      notes: ['Down the tree: parents may intercept', 'Up the tree: unhandled events bubble back', 'Try it in the widget below ↓'],
      detail:
        'Inside the app the event travels a **U-shape**: down from the Activity through each ViewGroup (any parent can **intercept** and steal the gesture — that’s how a scroll list takes over from a button mid-swipe), reaching the touched child’s `onTouchEvent()`. If nobody consumes it (returns `true`), it **bubbles back up** the same path and finally lands in `Activity.onTouchEvent()`. The next widget lets you play this exact game.',
    },
  },
];

export function InputPipelineFlow() {
  return (
    <NotesFlow
      title="The Input Pipeline"
      intro="From a change in screen capacitance to your onTouchEvent — six stations, two processes, one 5-second timer."
      steps={steps}
    />
  );
}
