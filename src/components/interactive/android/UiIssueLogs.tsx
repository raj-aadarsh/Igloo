import { LogAnatomy, type LogTab } from './LogAnatomy';

// Category 6: the device is alive on adb, but what the USER sees is wrong —
// stutter, black windows, dead touch. Three dumpsys tools, three stories.

const tabs: LogTab[] = [
  {
    id: 'jank',
    label: 'Jank',
    blurb: 'Frames missing their VSYNC. You met the mechanism in the graphics topic — these are its log fingerprints.',
    source: 'logcat · dumpsys gfxinfo · Perfetto',
    lines: [
      { text: 'I Choreographer: Skipped 47 frames!  The application may be doing too much work on its main thread.', note: 'Choreographer noticed VSYNCs went by while the main thread was busy — 47 × 16.7 ms ≈ 0.8 s of frozen UI. Short cousin of an ANR; same triage (what was main doing?), smaller deadline.' },
      { text: 'W OpenGLRenderer: Davey! duration=1240ms; Flags=0, FrameTimelineVsyncId=38112, ...', note: 'HWUI’s marker for a single frame that took **>700 ms**. The name is an in-joke (Daydream-era “Jank” monster). One Davey = one visible hitch; grep counts them per session.' },
      { text: '  Janky frames: 212 (18.40%)   95th percentile: 34ms   99th percentile: 78ms', note: 'From `dumpsys gfxinfo <pkg>`: the statistical view. 18% janky with a 99th percentile of 78 ms = regular multi-frame stalls — now open **Perfetto** and find what occupies the UI/RenderThread at those timestamps (lock waits, binder calls, inflation, GC).' },
    ],
    greps: [
      { pattern: 'Skipped', where: 'logcat (Choreographer) — main-thread stalls in frame units' },
      { pattern: 'Davey!', where: 'logcat (OpenGLRenderer) — individual catastrophic frames' },
      { pattern: 'Janky frames', where: 'dumpsys gfxinfo <package>' },
    ],
  },
  {
    id: 'black',
    label: 'Black / frozen window',
    blurb: 'The app runs, adb responds — but the window shows nothing, or never appears. Interrogate WMS and SurfaceFlinger.',
    source: 'dumpsys window · dumpsys SurfaceFlinger',
    lines: [
      { text: 'W WindowManager: Window freeze timeout expired.', note: 'WMS froze the screen for a transition (e.g. rotation) and a window **failed to redraw in time** (~2 s). The next log line lists the window it was waiting for — that app’s rendering is the suspect.' },
      { text: 'I WindowManager: Relayout Window{a1b2c3 u0 com.example.notes/.MainActivity}: viewVisibility=0 mDrawState=NO_SURFACE', note: 'From `dumpsys window windows`: the state machine every window walks — NO_SURFACE → DRAW_PENDING → COMMIT_DRAW_PENDING → HAS_DRAWN. A window stuck in **DRAW_PENDING** = the app never finished its first draw (blocked main thread?). NO_SURFACE after start = it never got/kept a surface.' },
      { text: 'E BufferQueueProducer: [SurfaceView - com.example.game] dequeueBuffer: BufferQueue has been abandoned', note: 'The producer/consumer contract from the graphics topic breaking: the consumer side is gone (surface destroyed — often a lifecycle race) while the app still tries to dequeue. Result: nothing new on screen; often a permanently black SurfaceView.' },
      { text: 'W WindowManager: App freeze timeout expired. ... Force clearing freeze: AppWindowToken{...com.example.notes}', note: 'WMS giving up and unfreezing without the laggard — the user sees the screen “snap” after a long black moment. The named token tells you which app to profile.' },
    ],
    greps: [
      { pattern: 'freeze timeout expired', where: 'logcat (WindowManager) — who stalled a transition' },
      { pattern: 'mDrawState', where: 'dumpsys window windows — find windows stuck before HAS_DRAWN' },
      { pattern: 'abandoned', where: 'logcat (BufferQueue) — producer/consumer lifecycle races' },
    ],
  },
  {
    id: 'touch',
    label: 'Dead / ghost touch',
    blurb: 'Touches ignored (or phantom ones). Decide first: hardware events missing, or delivery failing?',
    source: 'dumpsys input · getevent',
    lines: [
      { text: '$ adb shell getevent -l   →   /dev/input/event2: EV_ABS ABS_MT_POSITION_X 000021f3 …', note: 'Step 1, the split test: `getevent` prints **raw kernel events**. Events present while the UI ignores them → the pipeline above the kernel is broken. **No events** → touch firmware/driver/hardware — stop debugging the framework.' },
      { text: 'W InputDispatcher: Dropping event because there is no focused window or focused application in display 0.', note: 'The most famous input line. InputDispatcher has events but **no target**: a key event needs the focused window (WMS’s decision — remember), and focus is missing or mid-handoff. Transient during app switches; persistent = a focus bug.' },
      { text: "FocusedWindow: name='Window{d4e5f6 u0 StatusBar}'", note: 'From `dumpsys input`: the dispatcher’s live state. If the focused window is NOT the app the user sees (here: StatusBar while an app fills the screen), every key/back press goes to the wrong window — the “phone looks fine but ignores me” bug.' },
      { text: "E InputDispatcher: channel 'a1b2c3 com.example.notes' ~ Channel is unrecoverably broken and will be disposed!", note: 'The window’s **InputChannel** (that socketpair from the input topic) died — its app end was closed/killed. Events to that window go nowhere until it’s recreated. Usually a symptom of the app’s own death — pair with crash logs.' },
      { text: "I InputReader: Touch event's action is 0x0 (DOWN) ... pointerCount=2  (user swears one finger!)", note: '“Ghost touches” = extra/false pointers. If `getevent` already shows them, the ghost is **hardware/firmware** (grounding, damaged digitizer), not software — a conclusion that saves weeks.' },
    ],
    greps: [
      { pattern: 'Dropping event', where: 'logcat (InputDispatcher) — delivery failing for lack of a target' },
      { pattern: 'unrecoverably broken', where: 'logcat — dead InputChannels' },
      { pattern: 'FocusedWindow', where: 'dumpsys input — who the dispatcher THINKS should get keys' },
    ],
  },
];

export function UiIssueLogs() {
  return (
    <LogAnatomy
      heading="UI, Graphics & Input Issues, Annotated"
      intro="The device is fine over adb — the pixels and touches are not. Three families, three interrogation tools."
      tabs={tabs}
    />
  );
}
