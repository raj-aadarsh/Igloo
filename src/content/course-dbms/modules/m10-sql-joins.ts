import type { Module } from '@/content/types';

export const m10: Module = {
  id: 'dbms-m10',
  slug: 'aggregates-and-joins',
  order: 10,
  title: 'Aggregates, Grouping & Joins',
  subtitle: 'COUNT/SUM, GROUP BY, HAVING & JOINs',
  icon: 'workflow',
  lessons: [
    {
      id: 'dbms-m10-l1',
      title: 'Aggregate functions',
      minutes: 4,
      blocks: [
        { type: 'p', text: '**Aggregate functions** collapse many rows into a single summary value.' },
        { type: 'keyterms', terms: [
          { term: 'COUNT(*)', def: 'Number of rows (COUNT(col) ignores NULLs in that column).' },
          { term: 'SUM(col)', def: 'Total of a numeric column.' },
          { term: 'AVG(col)', def: 'Average (mean).' },
          { term: 'MIN(col) / MAX(col)', def: 'Smallest / largest value.' },
        ] },
        { type: 'code', code: `SELECT COUNT(*)       FROM employees;
SELECT AVG(salary)    FROM employees;
SELECT MAX(salary)    FROM employees WHERE dept_id = 1;` },
      ],
    },
    {
      id: 'dbms-m10-l2',
      title: 'GROUP BY & HAVING',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**GROUP BY** splits rows into buckets and runs the aggregate per bucket. **HAVING** filters those buckets *after* aggregation — because WHERE can’t use aggregate functions.' },
        { type: 'code', caption: 'Count employees per department, keep big departments', code: `SELECT dept_id, COUNT(*) AS headcount
FROM employees
GROUP BY dept_id
HAVING COUNT(*) > 2
ORDER BY headcount DESC;` },
        { type: 'callout', variant: 'key', text: 'WHERE vs HAVING — the classic interview line: **WHERE filters rows before grouping; HAVING filters groups after aggregation.** WHERE cannot contain COUNT/SUM/AVG; HAVING can.' },
        { type: 'callout', variant: 'tip', text: 'Logical order of evaluation: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. That’s why a column alias from SELECT may not be usable in WHERE.' },
      ],
    },
    {
      id: 'dbms-m10-l3',
      title: 'Joins',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **JOIN** combines rows from two tables based on a related column — the heart of relational querying. Normalisation splits data across tables; joins put it back together.' },
        { type: 'keyterms', title: 'Join types', terms: [
          { term: 'INNER JOIN', def: 'Only rows with a match in BOTH tables.' },
          { term: 'LEFT (OUTER) JOIN', def: 'All rows of the left table; NULLs where the right has no match.' },
          { term: 'RIGHT (OUTER) JOIN', def: 'All rows of the right table; NULLs where the left has no match.' },
          { term: 'FULL (OUTER) JOIN', def: 'All rows from both; NULLs on whichever side is missing.' },
          { term: 'CROSS JOIN', def: 'Cartesian product — every left row paired with every right row.' },
        ] },
        { type: 'code', caption: 'Employee name with department name', code: `SELECT e.name, d.name AS department
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;` },
        { type: 'callout', variant: 'info', text: 'SQLite (this playground’s engine) supports INNER, LEFT and CROSS joins. RIGHT/FULL joins are emulated by swapping sides or using UNION — the concept is identical across databases.' },
      ],
    },
    {
      id: 'dbms-m10-l4',
      title: 'UNION & practice',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'UNION', def: 'Stacks the rows of two SELECTs (must have matching column count/types) and removes duplicates.' },
          { term: 'UNION ALL', def: 'Same, but keeps duplicates (faster — no de-dup pass).' },
        ] },
        { type: 'code', code: `SELECT city FROM employees
UNION
SELECT name FROM departments;   -- combined, duplicates removed` },
        { type: 'p', text: 'Now finish the **guided challenges** — the later ones cover GROUP BY, HAVING and JOIN. Aim for all 9 solved:' },
        { type: 'widget', widget: 'sql-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m10-q1', type: 'single', prompt: 'Which function counts the number of rows?', options: ['SUM()', 'TOTAL()', 'COUNT()', 'ROWS()'], correct: [2], explanation: 'COUNT(*) returns the number of rows.' },
    { id: 'dbms-m10-q2', type: 'single', prompt: 'The key difference between WHERE and HAVING is…', options: ['No difference', 'WHERE filters rows before grouping; HAVING filters groups after aggregation', 'HAVING runs first', 'WHERE works only with joins'], correct: [1], explanation: 'WHERE pre-group, HAVING post-aggregation (and HAVING can use aggregates).' },
    { id: 'dbms-m10-q3', type: 'single', prompt: 'An INNER JOIN returns…', options: ['All rows from the left table', 'Only rows with a match in both tables', 'The cartesian product', 'All rows from both tables'], correct: [1], explanation: 'INNER JOIN keeps only matched rows from both sides.' },
    { id: 'dbms-m10-q4', type: 'single', prompt: 'You need every employee even those with no department, plus the dept name when it exists. Use…', options: ['INNER JOIN', 'LEFT JOIN (employees on the left)', 'CROSS JOIN', 'No join'], correct: [1], explanation: 'LEFT JOIN keeps all left-table (employee) rows, NULLing the right side when unmatched.' },
    { id: 'dbms-m10-q5', type: 'single', prompt: 'UNION differs from UNION ALL because UNION…', options: ['Keeps duplicates', 'Removes duplicate rows', 'Joins tables side by side', 'Requires a WHERE clause'], correct: [1], explanation: 'UNION de-duplicates; UNION ALL keeps every row.' },
    { id: 'dbms-m10-q6', type: 'single', prompt: 'A CROSS JOIN of an m-row and n-row table returns…', options: ['m + n rows', 'max(m, n) rows', 'm × n rows', 'min(m, n) rows'], correct: [2], explanation: 'CROSS JOIN is the Cartesian product → m × n rows.' },
  ],
  resources: [
    { label: 'W3Schools — SQL Joins', url: 'https://www.w3schools.com/sql/sql_join.asp', kind: 'docs', free: true },
    { label: 'Visual explanation of SQL Joins', url: 'https://www.w3schools.com/sql/sql_join.asp', kind: 'article', free: true },
  ],
};
