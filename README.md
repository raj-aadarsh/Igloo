# 🧊 Igloo — Learn All of AI

An interactive, **fully offline** website for learning everything about AI — from
"what's an LLM?" to confidently explaining the whole field. Built for a software
engineer who wants the complete map: concepts, history, the agentic stack (MCP,
LangChain, LangGraph…), and a browsable atlas of every major company, model, and tool.

It has two pillars:

1. **The Course** — *The Complete AI Map (Zero → Confident)*: 11 guided modules with
   interactive demos and unlimited-attempt quizzes.
2. **The AI Atlas** — a searchable/filterable encyclopedia of companies, models
   (Claude/Opus, GPT, Gemini, Llama, Grok, DeepSeek…), products (Perplexity, Cursor,
   Antigravity…), categories, hardware, and on-device/offline LLMs.

> Content is a snapshot as of **early 2026**. Because the app runs offline it can't
> auto-update, so each lesson/entry links out (free resources) to check the latest.

---

## Quick start

> Requires [Node.js](https://nodejs.org) 18+ (built and tested on Node 22/26).

```bash
npm install        # installs everything into ./node_modules (your isolated "venv")
npm run dev        # start the dev server → http://localhost:5173
```

That's it. All dependencies live inside this folder's `node_modules` — nothing is
installed globally and no other project is affected.

### Other commands

```bash
npm run build      # type-check + produce a static offline build in ./dist
npm run preview    # serve the production build locally
npm run lint       # lint (optional)
npm run format     # prettier (optional)
```

## Run it 100% offline

Everything is bundled locally — fonts included, no CDNs, no API calls at runtime.

- **Dev:** run `npm run dev` once (online to install), then it works with Wi-Fi off.
- **Production:** `npm run build`, then serve `./dist` with any static server, e.g.
  `npm run preview` or `npx serve dist`. Turn off your network and it still works.

The only links that need the internet are the optional "go deeper" **resource links**
in lessons — the app itself never requires it.

## How your data is stored

No backend, no login. Your **progress, quiz scores, and theme** are saved in your
browser's `localStorage` on this device only. Use the **Reset** button (top bar) to clear it.

## Tech stack

- **Vite + React + TypeScript** — fast dev, static offline build
- **Tailwind CSS** — clean, themeable design (light/dark)
- **Framer Motion** — smooth animations
- **React Router** (HashRouter) — works even when opening built files directly
- **lucide-react** — icons · **@fontsource** — self-hosted Inter font (offline)

## Project structure

```
src/
  components/
    ui/            # Button, Card, Pill, Callout, RichText, Icon
    interactive/   # the playable widgets (neuron, gradient descent, timeline, …)
    quiz/          # unlimited-attempt quiz engine
    layout/        # AppShell + Sidebar
  features/
    course/        # Home, Module page, lesson renderer
    atlas/         # companies / models / products / categories / hardware / on-device
    glossary/      # searchable glossary
    exam/          # final mixed exam
    progress/      # localStorage progress store + hooks
  content/
    course-ai/     # the course: modules/, glossary, manifest
    atlas/         # the atlas data (companies, models, products, hardware)
  theme/           # light/dark provider
```

## Adding more content later

- **A new lesson/module:** add a file under `src/content/course-ai/modules/` and
  register it in `src/content/course-ai/index.ts`. Lessons are plain data ("blocks"),
  and you can drop in any interactive widget via a `{ type: 'widget', widget: '…' }` block.
- **A new atlas entry:** just append to the arrays in `src/content/atlas/*.ts`.
- **A whole new course:** the architecture treats a course as one manifest entry, so a
  second self-made course can be added alongside the AI one.

---

Built to be fun, clean, and genuinely complete. Have a great time learning. 🚀
