// ---------------------------------------------------------------------------
// In-browser SQL engine for the DBMS course playground.
//
// Uses sql.js — a WebAssembly build of SQLite — vendored as an npm dependency.
// The .wasm file is imported with Vite's `?url` so it's bundled into dist and
// served locally: the playground runs 100% offline, nothing global, no backend.
// ---------------------------------------------------------------------------
import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let sqlPromise: Promise<SqlJsStatic> | null = null;

function getSql(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({ locateFile: () => wasmUrl });
  }
  return sqlPromise;
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | null)[][];
}

export interface RunOutcome {
  results: QueryResult[]; // one per statement that returns rows
  error?: string;
}

// The seed schema + data every playground instance starts from. A small, fun
// company dataset that exercises WHERE / ORDER BY / aggregates / GROUP BY /
// HAVING / JOIN / DISTINCT / LIKE / BETWEEN.
export const SEED_SQL = `
CREATE TABLE departments (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
INSERT INTO departments (id, name) VALUES
  (1, 'Engineering'),
  (2, 'Design'),
  (3, 'Sales'),
  (4, 'Marketing');

CREATE TABLE employees (
  id       INTEGER PRIMARY KEY,
  name     TEXT NOT NULL,
  dept_id  INTEGER,
  city     TEXT,
  age      INTEGER,
  salary   INTEGER,
  FOREIGN KEY (dept_id) REFERENCES departments(id)
);
INSERT INTO employees (id, name, dept_id, city, age, salary) VALUES
  (1,  'Aarav Sharma',   1, 'Bengaluru', 29, 1200000),
  (2,  'Diya Patel',     1, 'Bengaluru', 34, 1800000),
  (3,  'Vihaan Reddy',   2, 'Hyderabad', 27, 900000),
  (4,  'Ananya Iyer',    3, 'Mumbai',    41, 1500000),
  (5,  'Kabir Singh',    3, 'Mumbai',    38, 1350000),
  (6,  'Saanvi Gupta',   2, 'Pune',      31, 1100000),
  (7,  'Aditya Nair',    1, 'Bengaluru', 45, 2400000),
  (8,  'Myra Joshi',     4, 'Delhi',     26, 800000),
  (9,  'Reyansh Das',    3, 'Mumbai',    33, 1250000),
  (10, 'Ishaan Verma',   1, 'Pune',      30, 1400000);
`;

let staticCache: SqlJsStatic | null = null;

// Build a fresh in-memory database, seeded. Each "Run" gets a clean DB so that
// learners can freely CREATE/INSERT/UPDATE/DROP without breaking later runs.
export async function freshDatabase(): Promise<Database> {
  if (!staticCache) staticCache = await getSql();
  const db = new staticCache.Database();
  db.run(SEED_SQL);
  return db;
}

// Run one or more SQL statements; return the result of each SELECT-style query.
export async function runSql(sql: string, db?: Database): Promise<RunOutcome> {
  let database = db;
  let owns = false;
  try {
    if (!database) {
      database = await freshDatabase();
      owns = true;
    }
    const stmts = database.exec(sql);
    const results: QueryResult[] = stmts.map((s) => ({
      columns: s.columns,
      rows: s.values as (string | number | null)[][],
    }));
    return { results };
  } catch (e) {
    return { results: [], error: (e as Error).message };
  } finally {
    if (owns && database) database.close();
  }
}

// Normalise a result's rows into a comparable shape (used to grade challenges).
function rowsKey(r: QueryResult, ordered: boolean): string {
  const lines = r.rows.map((row) => row.map((c) => (c === null ? 'NULL' : String(c))).join(''));
  return (ordered ? lines : [...lines].sort()).join('');
}

// Grade a learner's query against a reference query on identical fresh data.
export async function gradeQuery(
  userSql: string,
  expectedSql: string,
  ordered: boolean,
): Promise<{ correct: boolean; user?: QueryResult; error?: string }> {
  const userDb = await freshDatabase();
  const refDb = await freshDatabase();
  try {
    let userRes: RunOutcome;
    try {
      userRes = await runSql(userSql, userDb);
    } catch (e) {
      return { correct: false, error: (e as Error).message };
    }
    if (userRes.error) return { correct: false, error: userRes.error };
    if (userRes.results.length === 0) {
      return { correct: false, error: 'Query returned no result set — write a SELECT that returns rows.' };
    }
    const refRes = await runSql(expectedSql, refDb);
    const user = userRes.results[userRes.results.length - 1];
    const ref = refRes.results[refRes.results.length - 1];
    const correct = rowsKey(user, ordered) === rowsKey(ref, ordered);
    return { correct, user };
  } finally {
    userDb.close();
    refDb.close();
  }
}
