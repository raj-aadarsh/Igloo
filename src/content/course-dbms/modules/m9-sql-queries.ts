import type { Module } from '@/content/types';

export const m9: Module = {
  id: 'dbms-m9',
  slug: 'querying-data',
  order: 9,
  title: 'Querying Data',
  subtitle: 'SELECT, WHERE, filtering & sorting',
  icon: 'search',
  lessons: [
    {
      id: 'dbms-m9-l1',
      title: 'SELECT, DISTINCT & WHERE',
      minutes: 5,
      blocks: [
        { type: 'p', text: '**SELECT** retrieves data. You name the columns (or `*` for all), the table, and optionally a filter.' },
        { type: 'code', code: `SELECT name, city FROM employees;     -- chosen columns
SELECT * FROM employees;              -- every column
SELECT DISTINCT city FROM employees;  -- de-duplicate values

SELECT name, salary
FROM employees
WHERE city = 'Bengaluru';             -- filter rows` },
        { type: 'keyterms', title: 'Comparison operators in WHERE', terms: [
          { term: '= , <> (or !=)', def: 'Equal / not equal.' },
          { term: '> , < , >= , <=', def: 'Greater / less than (or equal).' },
          { term: 'AND / OR / NOT', def: 'Combine conditions. AND = all true; OR = any true; NOT = negate.' },
        ] },
        { type: 'code', caption: 'Combining conditions', code: `SELECT * FROM employees
WHERE dept_id = 1 AND salary > 1300000;

SELECT * FROM employees
WHERE city = 'Mumbai' OR city = 'Pune';` },
      ],
    },
    {
      id: 'dbms-m9-l2',
      title: 'ORDER BY, LIKE, IN, BETWEEN & NULL',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'ORDER BY col ASC|DESC', def: 'Sort the result. ASC (ascending) is the default; DESC for descending.' },
          { term: "LIKE 'A%'", def: 'Pattern match. % = any sequence of chars, _ = exactly one char.' },
          { term: 'IN (a, b, c)', def: 'Shorthand for col = a OR col = b OR col = c.' },
          { term: 'BETWEEN x AND y', def: 'Range test, inclusive of both ends.' },
          { term: 'IS NULL / IS NOT NULL', def: 'Test for missing values. You cannot use = NULL — NULL is "unknown", so comparisons return unknown.' },
        ] },
        { type: 'code', code: `SELECT name FROM employees ORDER BY salary DESC;
SELECT name FROM employees WHERE name LIKE 'A%';
SELECT * FROM employees WHERE city IN ('Mumbai', 'Pune');
SELECT * FROM employees WHERE age BETWEEN 30 AND 40;
SELECT * FROM employees WHERE dept_id IS NULL;` },
        { type: 'callout', variant: 'key', text: 'NULL gotcha (very common interview question): NULL means "unknown", not "zero" or "empty". Any arithmetic or comparison with NULL yields NULL/unknown — that’s why you must use IS NULL, never = NULL.' },
        { type: 'p', text: 'Time to practice. The playground below has **guided challenges** — write the query, hit Run, and it grades your result against the correct answer. Solve all of them:' },
        { type: 'widget', widget: 'sql-playground' },
      ],
    },
  ],
  quiz: [
    { id: 'dbms-m9-q1', type: 'single', prompt: 'Which keyword removes duplicate values from a result?', options: ['UNIQUE', 'DISTINCT', 'ONLY', 'DEDUPE'], correct: [1], explanation: 'SELECT DISTINCT returns only different values.' },
    { id: 'dbms-m9-q2', type: 'single', prompt: 'To sort results from highest to lowest salary you write…', options: ['ORDER BY salary', 'ORDER BY salary ASC', 'ORDER BY salary DESC', 'SORT salary DESC'], correct: [2], explanation: 'DESC sorts descending; ASC (default) sorts ascending.' },
    { id: 'dbms-m9-q3', type: 'single', prompt: "LIKE 'A%' matches values that…", options: ['Contain A anywhere', 'Start with A', 'End with A', 'Are exactly "A"'], correct: [1], explanation: '% after A means "A followed by anything" → starts with A.' },
    { id: 'dbms-m9-q4', type: 'single', prompt: 'Why is `WHERE dept_id = NULL` wrong?', options: ['NULL is a reserved word', 'NULL means unknown, so = comparison yields unknown; use IS NULL', 'It should be == NULL', 'NULL can’t appear in WHERE'], correct: [1], explanation: 'NULL is "unknown"; comparisons with it are unknown. Use IS NULL / IS NOT NULL.' },
    { id: 'dbms-m9-q5', type: 'single', prompt: '`age BETWEEN 30 AND 40` includes…', options: ['Only 31–39', 'Both 30 and 40 (inclusive)', '30 but not 40', 'Neither endpoint'], correct: [1], explanation: 'BETWEEN is inclusive of both boundaries.' },
    { id: 'dbms-m9-q6', type: 'single', prompt: '`WHERE city IN (\'Mumbai\', \'Pune\')` is equivalent to…', options: ['city = Mumbai AND city = Pune', 'city = Mumbai OR city = Pune', 'city LIKE Mumbai', 'city BETWEEN Mumbai AND Pune'], correct: [1], explanation: 'IN is shorthand for a series of OR equality checks.' },
  ],
  resources: [
    { label: 'W3Schools — SQL WHERE', url: 'https://www.w3schools.com/sql/sql_where.asp', kind: 'docs', free: true },
  ],
};
