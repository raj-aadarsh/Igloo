import type { Module } from '@/content/types';

export const m8: Module = {
  id: 'dbms-m8',
  slug: 'sql-and-ddl',
  order: 8,
  title: 'SQL & Defining Data (DDL)',
  subtitle: 'The 4 sublanguages + creating tables',
  icon: 'database',
  lessons: [
    {
      id: 'dbms-m8-l1',
      title: 'The four sublanguages of SQL',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**SQL** (Structured Query Language) is the standard language for relational databases. Every SQL command falls into one of four families — interviewers love asking which command belongs where.' },
        { type: 'keyterms', title: 'DDL · DML · DCL · TCL', terms: [
          { term: 'DDL — Data Definition', def: 'Defines/changes structure: CREATE, ALTER, DROP, TRUNCATE, RENAME.' },
          { term: 'DML — Data Manipulation', def: 'Works with the rows: SELECT, INSERT, UPDATE, DELETE, MERGE.' },
          { term: 'DCL — Data Control', def: 'Permissions: GRANT, REVOKE.' },
          { term: 'TCL — Transaction Control', def: 'Transaction boundaries: COMMIT, ROLLBACK, SAVEPOINT.' },
        ] },
        { type: 'callout', variant: 'warning', text: 'Classic trap: TRUNCATE is **DDL**, not DML. DELETE (DML) removes rows one-by-one and can be rolled back & filtered with WHERE; TRUNCATE wipes the whole table fast, resets storage, and (in most DBs) can’t be rolled back.' },
        { type: 'callout', variant: 'tip', text: 'DROP removes the whole object (table + data + structure). TRUNCATE empties it but keeps the empty table. DELETE removes selected rows.' },
      ],
    },
    {
      id: 'dbms-m8-l2',
      title: 'CREATE, ALTER, DROP, TRUNCATE',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**DDL** statements shape your schema. The essentials:' },
        { type: 'code', caption: 'Create a table with column types & constraints', code: `CREATE TABLE employees (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  dept_id INTEGER,
  salary  INTEGER,
  FOREIGN KEY (dept_id) REFERENCES departments(id)
);` },
        { type: 'code', caption: 'Modify an existing table', code: `ALTER TABLE employees ADD email TEXT;        -- add a column
ALTER TABLE employees DROP COLUMN email;     -- remove a column

TRUNCATE TABLE employees;   -- delete ALL rows, keep the table
DROP TABLE employees;       -- delete the table entirely` },
        { type: 'keyterms', title: 'Common constraints (set at CREATE/ALTER time)', terms: [
          { term: 'PRIMARY KEY', def: 'Uniquely identifies each row; implies NOT NULL + UNIQUE.' },
          { term: 'FOREIGN KEY', def: 'Enforces referential integrity — values must exist in the referenced table.' },
          { term: 'NOT NULL / UNIQUE', def: 'Disallow nulls / disallow duplicate values.' },
          { term: 'CHECK / DEFAULT', def: 'Enforce a condition / supply a value when none is given.' },
        ] },
      ],
    },
    {
      id: 'dbms-m8-l3',
      title: 'Putting data in & changing it (DML)',
      minutes: 5,
      blocks: [
        { type: 'code', caption: 'INSERT, UPDATE, DELETE', code: `INSERT INTO employees (id, name, dept_id, salary)
VALUES (11, 'Tara Bose', 2, 1000000);

UPDATE employees
SET salary = salary + 50000
WHERE dept_id = 1;          -- forget WHERE → every row updates!

DELETE FROM employees
WHERE id = 11;` },
        { type: 'callout', variant: 'warning', text: 'The #1 production accident: UPDATE/DELETE without a WHERE clause changes/erases the *entire table*. Always write the WHERE first.' },
        { type: 'p', text: 'Now try it yourself. Switch to the **Free SQL** tab below and run any DDL/DML you like against the sample database — every Run starts from a fresh, fully-seeded copy, so experiment freely:' },
        { type: 'widget', widget: 'sql-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m8-q1', type: 'single', prompt: 'Which command is part of DDL?', options: ['SELECT', 'TRUNCATE', 'GRANT', 'COMMIT'], correct: [1], explanation: 'TRUNCATE defines/clears structure → DDL. SELECT=DML, GRANT=DCL, COMMIT=TCL.' },
    { id: 'dbms-m8-q2', type: 'single', prompt: 'The difference between DELETE and TRUNCATE is…', options: ['They are identical', 'DELETE can use WHERE & be rolled back; TRUNCATE wipes all rows fast and is DDL', 'TRUNCATE deletes the table itself', 'DELETE removes the table structure'], correct: [1], explanation: 'DELETE (DML) is row-wise, filterable, rollback-able; TRUNCATE (DDL) fast-empties the whole table.' },
    { id: 'dbms-m8-q3', type: 'single', prompt: 'GRANT and REVOKE belong to which sublanguage?', options: ['DDL', 'DML', 'DCL', 'TCL'], correct: [2], explanation: 'GRANT/REVOKE control access privileges → Data Control Language.' },
    { id: 'dbms-m8-q4', type: 'single', prompt: 'Which clause prevents an UPDATE from changing every row?', options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'], correct: [2], explanation: 'WHERE restricts which rows the UPDATE/DELETE affects.' },
    { id: 'dbms-m8-q5', type: 'single', prompt: 'COMMIT, ROLLBACK and SAVEPOINT are…', options: ['DDL', 'TCL', 'DCL', 'DML'], correct: [1], explanation: 'They control transaction boundaries → Transaction Control Language.' },
  ],
  resources: [
    { label: 'W3Schools — SQL Tutorial', url: 'https://www.w3schools.com/sql/', kind: 'docs', free: true },
    { label: 'SQLite — supported SQL', url: 'https://www.sqlite.org/lang.html', kind: 'docs', free: true },
  ],
};
