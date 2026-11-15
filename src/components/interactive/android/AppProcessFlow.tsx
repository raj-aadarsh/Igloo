import { NotesFlow, type NotesStep } from './NotesFlow';

// What actually happens between tapping an app icon and seeing its first
// frame — the launch path every framework interview walks through.

const steps: NotesStep[] = [
  {
    kind: 'node',
    node: {
      id: 'tap',
      title: 'You tap an app icon',
      mono: 'Launcher process',
      notes: ['The launcher is just another app', 'It calls `startActivity(intent)`'],
      detail:
        'The home screen is an ordinary app in its own process. Tapping an icon makes it call **`startActivity()`** with an explicit intent for the app’s main activity (`ACTION_MAIN` + `CATEGORY_LAUNCHER`). The launcher can’t start another app’s process itself — it can only *ask the system*.',
    },
  },
  {
    kind: 'node',
    edge: '(Binder IPC)',
    node: {
      id: 'ams',
      title: 'ActivityManagerService',
      mono: 'inside system_server',
      notes: ['Resolves the intent & checks permissions', 'Pauses the current activity', 'App process not running? → ask Zygote'],
      detail:
        'The call crosses into **system_server** over Binder. **AMS** (with **ActivityTaskManagerService** handling the activity side on Android 10+) resolves the intent against PMS, checks permissions, pauses the launcher’s activity — and then checks: *does the target app already have a process?* If yes, the activity simply starts in it. If not, AMS requests a brand-new process.',
    },
  },
  {
    kind: 'node',
    edge: '(command over /dev/socket/zygote)',
    node: {
      id: 'zygote',
      title: 'Zygote forks',
      mono: 'fork() — Copy-on-Write',
      notes: ['No APK loading, no VM boot — just a fork', 'Child shares the preloaded classes & ART pages', 'This is why cold starts are fast'],
      detail:
        'AMS writes a start command (`Process.start(...)`) to Zygote’s UNIX socket. Zygote calls **`fork()`** — and thanks to Linux **Copy-on-Write**, the child process *points at* Zygote’s memory pages instead of copying them. The ~15,000 preloaded framework classes, shared resources and the warmed-up **ART VM** are instantly there. The new process just sets its own UID/GID, SELinux context and nice name.',
    },
  },
  {
    kind: 'node',
    edge: '(fork returns in the child)',
    node: {
      id: 'activitythread',
      title: 'New app process starts',
      mono: 'ActivityThread.main()',
      notes: ['The real `main()` of every Android app', '`Looper.prepareMainLooper()` → the main thread is born', 'Thread name: `main`'],
      detail:
        'The child’s entry point is **`ActivityThread.main()`** — the closest thing an Android app has to a classic `main()`. It calls **`Looper.prepareMainLooper()`**, creating the **main (UI) thread’s** message loop, then calls `attach()`, which hands AMS a Binder (`IApplicationThread`) so the system can call *back into* the app. Finally it enters **`Looper.loop()`** — an infinite loop that the app never leaves; everything the app ever does happens as messages inside it.',
    },
  },
  {
    kind: 'node',
    edge: '(bindApplication)',
    node: {
      id: 'application',
      title: 'Application is created',
      mono: 'Application.onCreate()',
      notes: ['App’s `Application` object + base context built', 'ContentProviders initialise **before** `onCreate()`'],
      detail:
        'AMS answers with **`bindApplication`**: the app process loads the APK info, creates the **`Application`** object with its base `Context`, installs **ContentProviders** (note the classic trick question — providers initialise *before* `Application.onCreate()`), then runs **`Application.onCreate()`**. Keep it light: every millisecond here is cold-start time.',
    },
  },
  {
    kind: 'node',
    edge: '(ClientTransaction)',
    node: {
      id: 'activity',
      title: 'Activity launches & first frame',
      mono: 'onCreate → onStart → onResume',
      notes: ['Lifecycle driven by AMS, executed on the main thread', 'View tree measured, laid out & drawn', 'Choreographer syncs the frame to VSYNC'],
      detail:
        'AMS schedules the launch as a **`ClientTransaction`** message onto the main thread. `ActivityThread` instantiates the activity and drives **`onCreate()` → `onStart()` → `onResume()`**. `setContentView()` builds the view tree; **ViewRootImpl** runs the first **measure → layout → draw** pass, timed by the **Choreographer** against **VSYNC**, and SurfaceFlinger composites the first frame onto the screen. The app is visible.',
    },
  },
];

export function AppProcessFlow() {
  return (
    <NotesFlow
      title="App Process Creation"
      intro="From a tap on the launcher to the first rendered frame — six hand-offs across three processes."
      steps={steps}
    />
  );
}
