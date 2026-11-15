import type { Module } from '@/content/types';

export const m23: Module = {
  id: 'android-m23',
  slug: 'issues-ui-input',
  order: 23,
  title: 'Issues 6 · UI, Graphics & Input',
  subtitle: 'Jank, black windows & dead touch',
  icon: 'touchpad',
  lessons: [
    {
      id: 'android-m23-l1',
      title: 'Under the hood — alive, but wrong on screen',
      minutes: 7,
      blocks: [
        {
          type: 'p',
          text: 'This family’s defining trait: **adb works, nothing crashed** — but what the user sees or touches is wrong. The failures live in the two pipelines you’ve already mapped (graphics in Phase 3, input in Phase 2), so triage means asking: *which station of which pipeline stalled?*',
        },
        {
          type: 'keyterms',
          title: 'Symptom → pipeline station',
          terms: [
            { term: 'Stutter / jank', def: 'Frames missing VSYNC — the app’s UI/RenderThread over budget. Detectors: Choreographer’s “Skipped frames”, HWUI’s “Davey!”, gfxinfo percentiles.' },
            { term: 'Black or frozen window', def: 'The window exists but no (new) buffer arrives: app never drew (`mDrawState` stuck), the BufferQueue contract broke (abandoned), or WMS froze for a transition and timed out waiting.' },
            { term: 'Touches ignored', def: 'Events exist but can’t be delivered: no focused window, focus on the *wrong* window, or a dead InputChannel. First split: does `getevent` show raw events at all?' },
            { term: 'Ghost touches', def: 'Phantom pointers. If they’re already present in `getevent`’s raw stream, it’s digitizer hardware/firmware — not software. The split test settles it in one minute.' },
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The three interrogation tools',
          text: 'This category is debugged from **live state dumps** more than logs: `dumpsys window` (WMS: every window, draw states, focus, ongoing transitions), `dumpsys SurfaceFlinger` (every layer, its buffers, composition mode), `dumpsys input` (dispatcher state, focused window, stuck channels) — plus **Perfetto** when the question is “what took so long?”.',
        },
      ],
    },
    {
      id: 'android-m23-l2',
      title: 'The logs, annotated',
      minutes: 10,
      blocks: [
        { type: 'widget', widget: 'log-ui-issues' },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The method',
          text: 'Jank: gfxinfo for the numbers → Perfetto for the cause (UI thread vs RenderThread vs a stalled Binder call, against the VSYNC track). Black screen: dumpsys window for the window’s mDrawState → SurfaceFlinger for the layer and its buffer → the app’s main thread if it never drew. Touch: getevent first (hardware vs software) → dumpsys input for FocusedWindow and broken channels → WMS logs for the focus handoff. Always name the pipeline station in your conclusion — that’s what makes the analysis senior.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Interview-ready answer',
          text: '“I map the symptom onto the pipeline. Stutter is the app missing its frame budget — Choreographer’s skipped-frames line and Davey markers find the moments, Perfetto shows whether the UI thread, RenderThread or a binder stall ate the budget. A black-but-alive window I chase through dumpsys: WMS’s draw-state machine says whether the app ever drew, SurfaceFlinger says whether a buffer was ever queued, and an abandoned BufferQueue means the surface lifecycle raced. Dead touch I split with getevent: no raw events is hardware; events-but-no-response is delivery — dumpsys input then shows a missing or wrong focused window, or an unrecoverably broken InputChannel. And ghost touches already visible in getevent are a digitizer problem, not a framework one.”',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'android-m23-q1',
      type: 'single',
      prompt: '“Davey! duration=1240ms” is…',
      options: ['A kernel warning', 'HWUI flagging a single frame that took over ~700 ms', 'An ANR', 'A SurfaceFlinger crash'],
      correct: [1],
      explanation: 'One Davey = one catastrophic frame — grep-countable hitches.',
    },
    {
      id: 'android-m23-q2',
      type: 'single',
      prompt: 'A window stuck at mDrawState=DRAW_PENDING means…',
      options: ['WMS refuses to show it', 'The app never completed its first draw — suspect its main/render thread', 'SurfaceFlinger is dead', 'The buffer was composited twice'],
      correct: [1],
      explanation: 'The draw-state machine advances only when the app reports its frame; stuck = the app’s side stalled.',
    },
    {
      id: 'android-m23-q3',
      type: 'single',
      prompt: '“BufferQueue has been abandoned” on dequeue means…',
      options: ['Out of RAM', 'The consumer/surface was destroyed while the producer still renders — a lifecycle race', 'The GPU crashed', 'VSYNC stopped'],
      correct: [1],
      explanation: 'The consumer end is gone; every dequeue fails and the window shows nothing new.',
    },
    {
      id: 'android-m23-q4',
      type: 'single',
      prompt: 'Touches ignored. getevent shows NO events at all. The problem is…',
      options: ['InputDispatcher', 'WMS focus', 'Below the framework: touch firmware/driver/hardware', 'The app’s onTouchEvent'],
      correct: [2],
      explanation: 'getevent reads the raw kernel stream — silence there exonerates everything above it.',
    },
    {
      id: 'android-m23-q5',
      type: 'single',
      prompt: '“Dropping event because there is no focused window” persisting means…',
      options: ['Normal app switching', 'A focus bug: the dispatcher has no valid target — check dumpsys input’s FocusedWindow vs what’s on screen', 'A dead battery', 'Jank'],
      correct: [1],
      explanation: 'Transient during handoffs; persistent = WMS/dispatcher disagree about who should receive input.',
    },
    {
      id: 'android-m23-q6',
      type: 'single',
      prompt: 'The right tool to learn WHY a specific slow frame was slow is…',
      options: ['logcat -b crash', 'A Perfetto trace — thread timelines against VSYNC', 'dumpsys battery', 'getprop'],
      correct: [1],
      explanation: 'Only the trace shows what occupied the UI/RenderThread during the missed budget.',
    },
  ],
  resources: [
    { label: 'AOSP — Testing & debugging graphics', url: 'https://source.android.com/docs/core/graphics', kind: 'docs', free: true },
    { label: 'Perfetto — UI jank detection', url: 'https://perfetto.dev/docs/data-sources/frametimeline', kind: 'docs', free: true },
  ],
};
