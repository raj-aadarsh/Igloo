import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'devops-m3',
  slug: 'ci-cd',
  order: 3,
  title: 'CI/CD Pipelines',
  subtitle: 'Automate build → test → ship',
  icon: 'infinity',
  lessons: [
    {
      id: 'devops-m3-l1',
      title: 'CI vs CD vs CD',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'CI/CD is the automation backbone of DevOps — it turns "every code change" into "automatically built, tested, and shipped". Three terms hide behind the acronym, and interviewers love to check you know the difference.' },
        { type: 'keyterms', terms: [
          { term: 'Continuous Integration (CI)', def: 'Developers merge to a shared branch frequently; every push automatically builds and runs the test suite. Catches integration bugs early, while they’re small.' },
          { term: 'Continuous Delivery (CD)', def: 'Every change that passes CI is automatically prepared into a deployable, release-ready artifact. The final push to production is a one-click manual decision.' },
          { term: 'Continuous Deployment (CD)', def: 'Goes one step further — every change that passes the pipeline is deployed to production automatically, with no human gate.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The distinction: Continuous Delivery keeps you always-ready-to-ship (a human clicks "go"); Continuous Deployment ships automatically (no human in the loop). Both rely on Continuous Integration underneath.' },
      ],
    },
    {
      id: 'devops-m3-l2',
      title: 'The pipeline in motion',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **pipeline** is the automated sequence a commit flows through. Push a commit and watch — then tick "make tests fail" to see it stop before production:' },
        { type: 'widget', widget: 'cicd-pipeline' },
        { type: 'keyterms', title: 'Typical stages', terms: [
          { term: 'Build', def: 'Compile and package the app — often into a container image, tagged with the commit.' },
          { term: 'Test', def: 'Unit, integration, and end-to-end tests. The quality gate — failures stop the pipeline (fail fast).' },
          { term: 'Scan', def: 'Static analysis & security/dependency scanning (SAST, vulnerability checks).' },
          { term: 'Deploy', def: 'Push the artifact to staging/production, often automatically (CD).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'Fail fast: ordering cheap, fast checks first (lint → unit tests → slower integration) gives quick feedback and avoids wasting time on a build that’s already broken.' },
      ],
    },
    {
      id: 'devops-m3-l3',
      title: 'Tools & pipeline-as-code',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'CI/CD tools', def: 'GitHub Actions, GitLab CI, Jenkins, CircleCI. They listen for pushes and run your pipeline on fresh, isolated runners.' },
          { term: 'Pipeline-as-code', def: 'The pipeline is defined in a YAML file in your repo (e.g. .github/workflows/ci.yml) — version-controlled and reviewed like any code.' },
          { term: 'Artifact', def: 'The output of the build (a container image, a JAR) — built once, then promoted unchanged through staging → production.' },
        ] },
        { type: 'code', caption: 'A minimal GitHub Actions workflow', code: `name: CI
on: [push]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./gradlew build      # build
      - run: ./gradlew test       # test (fails the job if tests fail)
      - run: docker build -t myapp:\${{ github.sha }} .   # package` },
        { type: 'callout', variant: 'key', text: 'Golden rule: build the artifact ONCE, then promote that exact same artifact through environments. Never rebuild per environment — rebuilding risks "works in staging, breaks in prod" drift.' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m3-q1', type: 'single', prompt: 'Continuous Integration mainly means…', options: ['Auto-deploying to prod', 'Frequently merging & automatically building/testing every change', 'Writing infrastructure code', 'Monitoring production'], correct: [1], explanation: 'CI = integrate often; every push is automatically built and tested.' },
    { id: 'devops-m3-q2', type: 'single', prompt: 'The difference between Continuous Delivery and Continuous Deployment is…', options: ['Nothing', 'Delivery keeps you release-ready (manual click to prod); Deployment ships to prod automatically', 'Deployment needs no tests', 'Delivery skips CI'], correct: [1], explanation: 'Delivery = always ready, human approves; Deployment = fully automatic to production.' },
    { id: 'devops-m3-q3', type: 'single', prompt: 'If the Test stage fails, a good pipeline…', options: ['Deploys anyway', 'Stops (fails fast) — the broken build never reaches production', 'Skips the build', 'Ignores it'], correct: [1], explanation: 'Failing fast prevents broken code from being deployed.' },
    { id: 'devops-m3-q4', type: 'single', prompt: '"Pipeline-as-code" means…', options: ['The app is one big file', 'The pipeline is defined in a version-controlled YAML in the repo', 'Code without tests', 'Manual deployment steps'], correct: [1], explanation: 'The pipeline definition lives in the repo (e.g. a YAML workflow), reviewed like code.' },
    { id: 'devops-m3-q5', type: 'single', prompt: 'Why build the artifact only once and promote it?', options: ['To save disk', 'To avoid environment drift — the exact tested artifact runs everywhere', 'Because rebuilding is impossible', 'To skip testing'], correct: [1], explanation: 'Promoting the same artifact prevents "works in staging, breaks in prod" rebuild drift.' },
    { id: 'devops-m3-q6', type: 'single', prompt: 'Which is a CI/CD tool?', options: ['Prometheus', 'GitHub Actions', 'PostgreSQL', 'Redis'], correct: [1], explanation: 'GitHub Actions (also Jenkins, GitLab CI, CircleCI) runs CI/CD pipelines.' },
  ],
  resources: [
    { label: 'GitHub Actions — quickstart', url: 'https://docs.github.com/actions/quickstart', kind: 'docs', free: true },
  ],
};
