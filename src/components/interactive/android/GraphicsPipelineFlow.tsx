import { NotesFlow, type NotesStep } from './NotesFlow';

// One frame, from the display's heartbeat to photons: VSYNC → Choreographer →
// UI thread → RenderThread → BufferQueue → SurfaceFlinger → HWC → display.

const steps: NotesStep[] = [
  {
    kind: 'node',
    node: {
      id: 'vsync',
      title: 'Hardware VSYNC',
      mono: '~every 16.7 ms at 60 Hz · 8.3 ms at 120 Hz',
      notes: ['The display’s heartbeat', 'Split into VSYNC-app and VSYNC-sf'],
      detail:
        'The screen refreshes at a fixed rhythm, and each refresh fires a **VSYNC** signal. Everything in the graphics pipeline marches to this beat. SurfaceFlinger turns the hardware signal into two software ticks: **VSYNC-app** (wakes apps to draw) and **VSYNC-sf** (wakes SurfaceFlinger to composite), slightly offset so a frame drawn on one tick can be shown on the next.',
    },
  },
  {
    kind: 'node',
    edge: '(VSYNC-app)',
    node: {
      id: 'choreographer',
      title: 'Choreographer',
      mono: 'app · main thread · doFrame()',
      notes: ['Runs callbacks in order: input → animation → traversal', 'Logs “Skipped N frames!” when late'],
      detail:
        'Each app’s **Choreographer** receives VSYNC-app and runs `doFrame()` on the **main thread**, in a fixed order: **input** events first, then **animations**, then **traversal** (layout and drawing). If the main thread was busy when the tick arrived, frames are missed, and Choreographer logs the famous `Skipped 42 frames! The application may be doing too much work on its main thread.`',
    },
  },
  {
    kind: 'node',
    node: {
      id: 'uithread',
      title: 'UI thread: Measure → Layout → Draw',
      mono: 'ViewRootImpl.performTraversals()',
      notes: ['Measure: how big is each view?', 'Layout: where does each view go?', 'Draw: **records** drawing commands (a display list)'],
      detail:
        'ViewRootImpl walks the view tree three times: **measure** (sizes), **layout** (positions), **draw**. With hardware acceleration (the default), “draw” doesn’t paint pixels. It **records** commands like “draw this text here, this rectangle there” into a **display list** (RenderNode). Recording is cheap; the expensive part is handed to the next thread.',
    },
  },
  {
    kind: 'node',
    edge: '(sync the display list)',
    node: {
      id: 'renderthread',
      title: 'RenderThread',
      mono: 'app · separate thread · HWUI',
      notes: ['Turns display lists into GPU commands', 'via **Skia** on OpenGL ES / Vulkan', 'Frees the main thread for the next frame'],
      detail:
        'A dedicated **RenderThread** inside your app takes the display list and turns it into real GPU work, using **Skia** (Android’s 2D graphics library) on top of **OpenGL ES or Vulkan**. Because this happens off the main thread, the UI thread can already start processing the next input event. (Pure-software rendering, where Skia draws on the CPU, still exists for things like `Canvas` on a plain Bitmap.)',
    },
  },
  {
    kind: 'node',
    edge: '(dequeue → render → queue)',
    node: {
      id: 'bufferqueue',
      title: 'BufferQueue',
      mono: 'producer = app · consumer = SurfaceFlinger',
      notes: ['A small pool of buffers (usually 3)', '`dequeueBuffer()` → draw into it → `queueBuffer()`', 'Buffers are shared memory, never copied'],
      detail:
        'A window’s Surface is backed by a **BufferQueue**, a small rotating pool of graphic buffers (usually three, called **triple buffering**). The app is the **producer**: it calls `dequeueBuffer()` to grab an empty one, the GPU renders into it, then `queueBuffer()` hands it over. **SurfaceFlinger** is the **consumer**. The buffers are shared memory (dmabuf, see the memory topic), so a full screen of pixels moves between processes without being copied. (Since Android 12 the queue lives on the app side as **BLASTBufferQueue**, and buffers reach SurfaceFlinger in transactions, but the producer/consumer idea is unchanged.)',
    },
  },
  {
    kind: 'node',
    edge: '(VSYNC-sf)',
    node: {
      id: 'surfaceflinger',
      title: 'SurfaceFlinger',
      mono: 'native · started by init',
      notes: ['Latches the newest buffer of every visible layer', 'Status bar + app window + nav bar → one frame'],
      detail:
        'On VSYNC-sf, **SurfaceFlinger** wakes up and **latches** the latest queued buffer of every visible layer: the status bar (SystemUI), your app window, the navigation bar, maybe a dialog. It then decides how to combine them. If a layer has no new buffer, its previous one is reused; that reuse is exactly what a dropped frame looks like.',
    },
  },
  {
    kind: 'node',
    edge: '(composition)',
    node: {
      id: 'hwc',
      title: 'Hardware Composer (HWC HAL)',
      mono: 'vendor HAL · display hardware',
      notes: ['Overlays: the display hardware blends layers itself', 'Fallback: GPU composition (“client composition”)'],
      detail:
        'SurfaceFlinger asks the **Hardware Composer HAL** (a vendor HAL, on the far side of the Treble wall) which layers the display hardware can blend directly using **overlay planes**. That is the cheapest path, with no GPU work. Layers it can’t handle (too many, unusual effects) are first combined by the GPU (**client composition**) and passed down as one layer. HWC then sends the final frame to the panel.',
    },
  },
  {
    kind: 'node',
    node: {
      id: 'display',
      title: 'Display shows the frame',
      mono: 'on the next VSYNC',
      notes: ['Total budget for all of the above: one VSYNC period', 'Miss it → the old frame stays up (jank)'],
      detail:
        'The panel scans out the new frame at the next refresh. Everything from Choreographer to queueBuffer had to fit in the frame budget (16.7 ms at 60 Hz). Miss it and the display shows the **previous frame again**: a dropped frame, which the user sees as **jank**. The next widget lets you cause exactly that.',
    },
  },
];

export function GraphicsPipelineFlow() {
  return (
    <NotesFlow
      title="The Graphics Pipeline"
      intro="One frame’s journey: the app produces pixels, SurfaceFlinger combines them, the display shows them. All inside one VSYNC."
      steps={steps}
    />
  );
}
