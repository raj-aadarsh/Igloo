import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'devops-m2',
  slug: 'docker-in-practice',
  order: 2,
  title: 'Docker in Practice',
  subtitle: 'Volumes, networks & Compose',
  icon: 'boxes',
  lessons: [
    {
      id: 'devops-m2-l1',
      title: 'Containers are ephemeral — volumes persist',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A container’s writable layer disappears when the container is removed. That’s fine for stateless apps — but databases and uploads need data to survive. Enter **volumes**.' },
        { type: 'keyterms', terms: [
          { term: 'Ephemeral by design', def: 'Containers are meant to be disposable — kill and recreate them freely. Never store important data inside the container’s writable layer.' },
          { term: 'Volume', def: 'Storage managed by Docker that lives outside the container’s lifecycle, so data persists across restarts/recreations. Mount it into the container.' },
          { term: 'Bind mount', def: 'Maps a host folder into the container (great in development for live-reloading your source code).' },
        ] },
        { type: 'code', caption: 'Persist a database with a named volume', code: `docker volume create pgdata
docker run -d \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16` },
        { type: 'callout', variant: 'key', text: 'Mental model: treat containers as "cattle, not pets" — disposable and identical. Anything that must survive lives in a volume (or an external managed service), never inside the container.' },
      ],
    },
    {
      id: 'devops-m2-l2',
      title: 'Networking & environment config',
      minutes: 5,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Docker network', def: 'Containers on the same user-defined network can reach each other by name (e.g. the app connects to "db:5432"). Docker provides built-in DNS.' },
          { term: 'Port mapping (-p)', def: 'Expose a container port to the host: -p 8080:80 maps host 8080 → container 80, so the outside world can reach it.' },
          { term: 'Environment variables', def: 'Pass config in at runtime (-e DB_URL=…) instead of baking it into the image — same image, different config per environment.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'This reflects a core 12-factor principle: build the image once, then inject configuration via environment variables at run time. Never hard-code secrets/config into the image.' },
      ],
    },
    {
      id: 'devops-m2-l3',
      title: 'Docker Compose — multi-container apps',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Real apps are several containers (web + API + database + cache). **Docker Compose** defines them all in one YAML file and runs them together with a single command.' },
        { type: 'code', caption: 'docker-compose.yml', code: `services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - DB_URL=postgres://db:5432/app
    depends_on:
      - db
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:` },
        { type: 'code', caption: 'One command to rule them all', code: `docker compose up -d     # start the whole stack
docker compose down      # stop & remove it` },
        { type: 'callout', variant: 'key', text: 'Compose is declarative: you describe the desired set of services and Docker makes it so. It’s perfect for local dev and small deployments — but for production scale & self-healing across many machines, you graduate to an orchestrator like Kubernetes (coming up).' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m2-q1', type: 'single', prompt: 'To persist a database’s data beyond a container’s life, use…', options: ['The container’s writable layer', 'A volume', 'An environment variable', 'A bigger image'], correct: [1], explanation: 'Volumes live outside the container lifecycle, so data survives restarts/recreation.' },
    { id: 'devops-m2-q2', type: 'single', prompt: '"Cattle, not pets" means containers should be…', options: ['Carefully kept alive forever', 'Disposable and identical — kill & recreate freely', 'Named individually', 'Never restarted'], correct: [1], explanation: 'Treat containers as interchangeable and disposable; persist state outside them.' },
    { id: 'devops-m2-q3', type: 'single', prompt: '`-p 8080:80` does what?', options: ['Maps host port 8080 to container port 80', 'Creates a volume', 'Sets an env variable', 'Limits CPU'], correct: [0], explanation: 'Port mapping exposes a container port on the host (host:container).' },
    { id: 'devops-m2-q4', type: 'single', prompt: 'How should configuration/secrets be supplied to a container?', options: ['Hard-coded in the image', 'Injected at runtime via environment variables', 'Written into the Dockerfile', 'Never — containers can’t be configured'], correct: [1], explanation: '12-factor: build once, inject config via env vars at run time (don’t bake it in).' },
    { id: 'devops-m2-q5', type: 'single', prompt: 'Docker Compose is best for…', options: ['Defining & running a multi-container app together (esp. local/dev)', 'Replacing Kubernetes at huge scale', 'Writing Dockerfiles', 'Monitoring production'], correct: [0], explanation: 'Compose declares multiple services in YAML; great for dev/small deploys, not large-scale orchestration.' },
    { id: 'devops-m2-q6', type: 'single', prompt: 'On a Docker network, one container reaches another by…', options: ['Its IP only', 'Its service/container name (built-in DNS)', 'A volume', 'The host port always'], correct: [1], explanation: 'User-defined networks give name-based DNS, e.g. connecting to "db:5432".' },
  ],
  resources: [
    { label: 'Docker Compose docs', url: 'https://docs.docker.com/compose/', kind: 'docs', free: true },
    { label: 'The Twelve-Factor App', url: 'https://12factor.net/', kind: 'article', free: true },
  ],
};
