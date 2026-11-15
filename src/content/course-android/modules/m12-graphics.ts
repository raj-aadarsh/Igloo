import type { Module } from '@/content/types';

export const m12: Module = {
  id: 'android-m12',
  slug: 'graphics-pipeline',
  order: 12,
  title: 'Graphics & Rendering Pipeline',
  subtitle: 'VSYNC, Choreographer, BufferQueue, SurfaceFlinger, HWC',
  icon: 'monitor',
  lessons: [
    {
      id: 'android-m12-l1',
      title: 'One frame, end to end',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'You’ve met the pieces separately: Choreographer in the app-process topic, SurfaceFlinger in boot and WMS. Here is how they connect. This flow is the map you need for debugging **frame drops, frozen UI and black screens**.',
        },
        { type: 'widget', widget: 'graphics-pipeline' },
        {
          type: 'keyterms',
          title: 'Side-notes to remember',
          terms: [
            { term: 'Producer / consumer', def: 'The app **produces** buffers (dequeue → render → queue); SurfaceFlinger **consumes** them. BufferQueue sits in between.' },
            { term: 'Two threads in your app', def: 'The **UI thread** records *what* to draw (display list); the **RenderThread** turns it into GPU work. A slow frame can be either one.' },
            { term: 'HWC', def: 'The vendor’s **Hardware Composer HAL**. Display hardware blends layers itself using overlay planes; the GPU only helps when it can’t.' },
            { term: 'Frame budget', def: '16.7 ms at 60 Hz, 11.1 ms at 90 Hz, 8.3 ms at 120 Hz. Higher refresh rates make the budget *tighter*.' },
          ],
        },
      ],
    },
    {
      id: 'android-m12-l2',
      title: 'Jank & black screens',
      minutes: 9,
      blocks: [
        {
          type: 'p',
          text: 'A dropped frame is simply **work that didn’t finish before the next VSYNC**, so the display shows the old frame again. Cause one yourself:',
        },
        { type: 'widget', widget: 'frame-timeline' },
        { type: 'h3', text: 'Reading the symptoms' },
        {
          type: 'keyterms',
          terms: [
            { term: 'Stutter while scrolling', def: 'Frames occasionally over budget. Look at the **UI thread** in Perfetto (slow `onBindViewHolder`, layout passes) and the **RenderThread** (huge bitmaps, overdraw).' },
            { term: '“Skipped N frames!”', def: 'Choreographer’s log line: the main thread was busy across N VSYNCs. Same root cause family as an ANR, just shorter.' },
            { term: 'Frozen picture, app alive', def: 'The app stopped *queuing* buffers, so SurfaceFlinger keeps showing the last one. Check whether the main or render thread is stuck.' },
            { term: 'Black screen', def: 'The layer has **no buffer at all** (never drew), or it’s hidden/zero-size, or composition failed. `dumpsys SurfaceFlinger` lists every layer with its buffer and visibility.' },
          ],
        },
        {
          type: 'code',
          caption: 'The graphics debugging toolkit',
          code: `adb shell dumpsys gfxinfo com.example.app       # frame-time stats, janky frame %
adb shell dumpsys gfxinfo com.example.app framestats   # per-frame timestamps
adb shell dumpsys SurfaceFlinger                # every layer, buffers, HWC vs GPU composition
# Perfetto trace: UI thread, RenderThread, SurfaceFlinger & VSYNC on one timeline`,
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“On each VSYNC, Choreographer runs the app’s frame on the main thread: input, animation, then traversal, where ViewRootImpl measures, lays out and records a display list. The RenderThread turns that into GPU commands via Skia, dequeues a buffer from the window’s BufferQueue, renders into it and queues it back. On the next VSYNC-sf, SurfaceFlinger latches the newest buffer of every visible layer and asks the Hardware Composer HAL to blend them, using overlay planes where possible or GPU composition otherwise, and the frame reaches the display. If the app’s work misses the VSYNC deadline, the old buffer is shown again: that’s jank, and I find it in Perfetto by comparing UI and RenderThread work against VSYNC.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m12-q1',
      type: 'single',
      prompt: 'In BufferQueue terms, the app and SurfaceFlinger are…',
      options: ['Both producers', 'App = producer, SurfaceFlinger = consumer', 'App = consumer, SurfaceFlinger = producer', 'Both consumers'],
      correct: [1],
      explanation: 'The app dequeues, renders and queues buffers; SurfaceFlinger latches and composites them.',
    },
    {
      id: 'android-m12-q2',
      type: 'single',
      prompt: 'With hardware acceleration, what does the UI thread’s “draw” step actually do?',
      options: ['Paints pixels on the CPU', 'Records drawing commands into a display list; the RenderThread turns them into GPU work', 'Sends pixels to HWC', 'Nothing'],
      correct: [1],
      explanation: 'Recording is cheap; the GPU work happens on the RenderThread, off the main thread.',
    },
    {
      id: 'android-m12-q3',
      type: 'single',
      prompt: 'Choreographer’s doFrame runs its callbacks in which order?',
      options: ['Traversal → animation → input', 'Input → animation → traversal', 'Animation → input → traversal', 'Random'],
      correct: [1],
      explanation: 'Input first (so the frame reflects the latest touch), then animations, then layout/draw.',
    },
    {
      id: 'android-m12-q4',
      type: 'single',
      prompt: 'The Hardware Composer (HWC) is…',
      options: ['A Java service in system_server', 'A vendor HAL that blends layers using display overlay planes, with GPU composition as the fallback', 'Part of the app', 'The GPU driver'],
      correct: [1],
      explanation: 'HWC is on the vendor side of the Treble wall; overlays avoid GPU work entirely.',
    },
    {
      id: 'android-m12-q5',
      type: 'single',
      prompt: 'At 120 Hz, the per-frame budget is about…',
      options: ['16.7 ms', '33 ms', '8.3 ms', '1 ms'],
      correct: [2],
      explanation: '1000 ms ÷ 120 ≈ 8.3 ms. Higher refresh rates tighten the budget.',
    },
    {
      id: 'android-m12-q6',
      type: 'single',
      prompt: 'An app’s window is black. A first useful command is…',
      options: ['adb shell getprop ro.build.type', 'adb shell dumpsys SurfaceFlinger, to see whether the layer exists, has a buffer and is visible', 'adb reboot', 'pm list users'],
      correct: [1],
      explanation: 'A black window usually means no buffer was ever queued, or the layer is hidden. SurfaceFlinger’s dump shows exactly which.',
    },
    {
      id: 'android-m12-q7',
      type: 'single',
      prompt: 'What does the user actually see when a frame misses its VSYNC?',
      options: ['A black frame', 'The previous frame again (a repeat), perceived as stutter', 'A crash', 'Half a frame'],
      correct: [1],
      explanation: 'SurfaceFlinger reuses the last buffer it has for that layer: a dropped frame is a repeated one.',
    },
  ],
  resources: [
    { label: 'AOSP — Graphics architecture', url: 'https://source.android.com/docs/core/graphics/architecture', kind: 'docs', free: true },
    { label: 'AOSP — BufferQueue', url: 'https://source.android.com/docs/core/graphics/arch-bq-gralloc', kind: 'docs', free: true },
  ],
};
