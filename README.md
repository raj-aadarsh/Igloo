# 🧊 Igloo

> *Warm up to hard ideas.*

Igloo is an interactive learning platform with hands-on demos and pressure-free practice, designed so difficult topics actually feel enjoyable to learn. Almost everything runs offline — the one exception is running Java (used in the DSA Dojo and Core Java courses), which loads its engine from a CDN (details below).

---

## Courses

| # | Course | What you'll learn |
|---|--------|-------------------|
| 01 | **The Complete AI Map** | Everything about AI — from the basics to LLMs, agents, MCP, and the full industry landscape. |
| 02 | **DSA Dojo** | Data structures & algorithms, code-first: learn each topic, then write & run real Java in the built-in playground, ending with an Interview Arena. |
| 03 | **Operating Systems** | A visual, interactive tour of OS interview topics — processes, scheduling, synchronization, deadlocks, memory, virtual memory, file systems, disk scheduling & I/O — light on reading, heavy on diagrams. |
| 04 | **Computer Networks** | How the internet works — OSI/TCP-IP layers, IP & live subnetting, TCP/UDP & the 3-way handshake, DNS/HTTP, TLS & security, and the "what happens when you type a URL" capstone — interactive throughout. |
| 05 | **Database Management (DBMS)** | ER modeling, keys & constraints, functional dependencies & normalization (1NF–BCNF), relational algebra, transactions/ACID & serializability, indexing (B/B+ trees), and SQL — with a built-in **live SQL playground** that runs real queries in your browser. |
| 06 | **Core Java Concepts** | The Java that interviews & real work demand — how the JVM runs code, OOP (the 4 pillars), the `equals`/`hashCode` contract, collections (incl. HashMap internals), generics, lambdas & streams, concurrency, and JVM memory/GC — with a built-in **Java playground** that compiles & runs real Java in your browser. |
| 07 | **Low-Level Design (LLD)** | Turn requirements into clean, extensible class designs — UML & class relationships, SOLID, design patterns (creational/structural/behavioral), and full FAANG machine-coding case studies (Parking Lot, BookMyShow, Splitwise, Vending Machine, Rate Limiter & more) — interactive throughout, with runnable Java. |
| 08 | **High-Level / System Design** | Architect systems that scale to millions — scaling & load balancing, caching & CDNs, SQL vs NoSQL, replication, sharding & consistent hashing, CAP & consistency, messaging, microservices, and full FAANG case studies (URL shortener, Twitter, Chat, YouTube, Uber) — interactive throughout (in progress). |
| 09 | **Coming soon** | More courses on the way. |

### 🥋 DSA Dojo (Course 02)

A **code-first** course for cracking coding interviews. It's built in Java and runs real Java
right in the browser. Each topic (a **sub-course**) follows the same addictive loop:

1. **Learn the idea** — short, visual theory with the points interviewers actually probe.
2. **Learn the Java** — the exact syntax you need (arrays, `ArrayList`, `Scanner`/`BufferedReader`
   I/O, `StringBuilder`, common gotchas).
3. **Solve problems** — write a complete program *from scratch* in the playground, hit
   **Run & check**, and see it compiled and run against real test cases. Stuck? Reveal hints one
   at a time; then study the worked **brute-force → optimal** solutions with Big-O.
4. **Earn the badge**, then test yourself in the **Interview Arena** — the "boss" set of hard,
   real interview questions.

> **Heads-up:** the Java engine (CheerpJ) loads from its CDN, so clicking **Run & check** needs
> an internet connection. Everything else — reading, the AI course — works offline.

All 15 topics are live: **Arrays, Strings, Hashing, Two Pointers & Sliding Window, Stacks,
Queues & Deques, Linked Lists, Recursion & Backtracking, Binary Search, Sorting, Trees & BST,
Heaps, Graphs, Dynamic Programming, and Greedy** — 90 problems in all, plus the Interview Arena.
Every solution is compiled & run against its tests with `javac --release 8` (matching the
browser's Java engine).

---

## Tech Stack

- **React + Vite + TypeScript** — fast, modern frontend
- **Tailwind CSS** — clean, responsive styling
- **Framer Motion** — smooth animations
- **React Router** — client-side navigation
- **CodeMirror + CheerpJ** — the DSA playground compiles & runs **real Java** in your browser (CheerpJ is a WebAssembly JVM)
- **localStorage** — progress, quiz scores, solved problems (no backend, no login)

> The AI course and all reading work fully offline. The DSA **"Run & check"** button uses CheerpJ's free runtime, which loads from its CDN — so running Java needs an internet connection (everything else stays offline).

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
