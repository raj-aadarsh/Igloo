# 🧊 Igloo

> *Warm up to hard ideas.*

Igloo is an interactive learning platform with hands-on demos and pressure-free quizzes, designed so difficult topics actually feel enjoyable to learn. Everything works completely offline — no internet required after the first setup.

---

## Courses

| # | Course | What you'll learn |
|---|--------|-------------------|
| 01 | **The Complete AI Map** | Everything about AI — from the basics to LLMs, agents, MCP, and the full industry landscape. |
| 02 | **DSA Dojo** | Data structures & algorithms, code-first: learn each topic, then write & run real Python in the built-in playground, ending with an Interview Arena. |
| 03 | **Coming soon** | More courses on the way. |

---

## Tech Stack

- **React + Vite + TypeScript** — fast, modern frontend
- **Tailwind CSS** — clean, responsive styling
- **Framer Motion** — smooth animations
- **React Router** — client-side navigation
- **CodeMirror + Pyodide** — the DSA playground runs real Python entirely in your browser, offline (Pyodide is vendored locally on `npm install`)
- **localStorage** — progress, quiz scores, solved problems (no backend, no login)

> The DSA coding playground's first run loads the local Python engine (a few seconds, once); after that it's instant and works offline.

---

## Setup & Run

### macOS

**1. Install Node.js** (if you don't have it)

Go to [nodejs.org](https://nodejs.org) and download the **LTS** version. Run the installer.

Verify it worked:
```bash
node -v
npm -v
```

**2. Clone the repo**
```bash
git clone https://github.com/raj-aadarsh/Igloo.git
cd Igloo
```

**3. Install dependencies**
```bash
npm install
```

**4. Start the app**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. That's it.

---

### Windows

**1. Install Node.js** (if you don't have it)

Go to [nodejs.org](https://nodejs.org), download the **LTS** Windows installer (`.msi`), and run it. Keep all default options.

Open **Command Prompt** or **PowerShell** and verify:
```
node -v
npm -v
```

**2. Clone the repo**
```
git clone https://github.com/raj-aadarsh/Igloo.git
cd Igloo
```

> If you don't have Git, download it from [git-scm.com](https://git-scm.com/download/win) first.

**3. Install dependencies**
```
npm install
```

**4. Start the app**
```
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Other Commands

```bash
npm run build      # build for production (outputs to ./dist)
npm run preview    # preview the production build locally
```

---

*Want to know more about this project and the person behind it? Head to the **About** section inside the app. 🙂*
