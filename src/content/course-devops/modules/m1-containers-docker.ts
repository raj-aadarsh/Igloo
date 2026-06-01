import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'devops-m1',
  slug: 'containers-and-docker',
  order: 1,
  title: 'Containers & Docker',
  subtitle: 'Package once, run anywhere',
  icon: 'boxes',
  lessons: [
    {
      id: 'devops-m1-l1',
      title: 'Why containers? VMs vs containers',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **container** packages an app *with all its dependencies* into one portable unit that runs identically on any machine — solving the eternal "but it works on my machine!" problem.' },
        { type: 'p', text: 'The classic comparison is with virtual machines. The difference is what each app drags along:' },
        { type: 'widget', widget: 'container-vs-vm' },
        { type: 'keyterms', terms: [
          { term: 'Virtual Machine', def: 'Virtualizes hardware; each VM runs a full guest OS on a hypervisor. Strong isolation, but heavy (GBs, boots in minutes).' },
          { term: 'Container', def: 'Virtualizes the OS; processes share the host kernel but are isolated. Lightweight (MBs, starts in ms), so you pack many per host.' },
          { term: 'Isolation mechanism', def: 'Linux namespaces (isolate what a process can see) + cgroups (limit CPU/memory) make a container feel like its own machine.' },
        ] },
        { type: 'callout', variant: 'key', text: 'One-liner: a VM virtualizes the hardware (its own OS each); a container virtualizes the OS (shares the kernel). Containers trade a bit of isolation for huge gains in speed, size, and density.' },
      ],
    },
    {
      id: 'devops-m1-l2',
      title: 'Images, layers & the Dockerfile',
      minutes: 7,
      blocks: [
        { type: 'p', text: '**Docker** is the tool that made containers mainstream. Two core concepts:' },
        { type: 'keyterms', terms: [
          { term: 'Image', def: 'A read-only, immutable template — the app + dependencies + config — built from a Dockerfile. The blueprint.' },
          { term: 'Container', def: 'A running instance of an image (image is to container as class is to object). Adds a thin writable layer on top.' },
          { term: 'Dockerfile', def: 'A recipe of instructions (FROM, COPY, RUN, CMD…) that builds an image — each instruction adds a cached layer.' },
        ] },
        { type: 'p', text: 'Images are built in **layers**. Tap through a Dockerfile to see how, and why instruction order controls caching:' },
        { type: 'widget', widget: 'image-layers' },
        { type: 'callout', variant: 'tip', text: 'Interview favourite — image vs container: the image is the immutable blueprint (like a class); the container is a running instance of it (like an object). You can spin up many containers from one image.' },
      ],
    },
    {
      id: 'devops-m1-l3',
      title: 'Registries & the workflow',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'The everyday Docker loop is just three verbs: **build → push/pull → run**.' },
        { type: 'code', caption: 'The commands you must know', code: `# build an image from the Dockerfile in the current dir
docker build -t myapp:1.0 .

# run a container from it, mapping a port
docker run -d -p 8080:80 myapp:1.0

# share it via a registry
docker push   myregistry/myapp:1.0
docker pull   myregistry/myapp:1.0

docker ps          # list running containers
docker logs <id>   # view a container's logs` },
        { type: 'keyterms', terms: [
          { term: 'Registry', def: 'A store for images (Docker Hub, AWS ECR, GitHub Container Registry). push to share, pull to deploy — the hand-off point between build and deploy.' },
          { term: 'Tag', def: 'A version label on an image (myapp:1.0, myapp:latest). Use real version tags in production, not just :latest.' },
          { term: 'Image vs container, again', def: 'build makes an image; run starts a container from it. push/pull move images via a registry.' },
        ] },
        { type: 'callout', variant: 'key', text: 'This portability is why containers power modern DevOps: build the image once in CI, push it to a registry, and run that exact same image in test, staging, and production — identical everywhere.' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m1-q1', type: 'single', prompt: 'The key difference between a container and a VM is that a container…', options: ['Runs its own full guest OS', 'Shares the host OS kernel (virtualizes the OS, not hardware)', 'Needs a hypervisor per app', 'Is always slower'], correct: [1], explanation: 'Containers share the host kernel; VMs each run a full guest OS on a hypervisor.' },
    { id: 'devops-m1-q2', type: 'single', prompt: 'The relationship between an image and a container is like…', options: ['Object and class', 'Class (blueprint) and object (instance)', 'Two unrelated things', 'A copy and paste'], correct: [1], explanation: 'An image is the immutable blueprint; a container is a running instance of it.' },
    { id: 'devops-m1-q3', type: 'single', prompt: 'A Dockerfile is…', options: ['A running container', 'A recipe of instructions that builds an image (in layers)', 'A registry', 'A type of VM'], correct: [1], explanation: 'The Dockerfile’s instructions build the image, each adding a cached layer.' },
    { id: 'devops-m1-q4', type: 'single', prompt: 'Why put `RUN npm install` before `COPY . .` in a Dockerfile?', options: ['It looks neater', 'So the expensive install layer stays cached when only source code changes', 'It’s required syntax', 'To run faster at runtime'], correct: [1], explanation: 'Ordering rarely-changing steps first keeps expensive layers cached across builds.' },
    { id: 'devops-m1-q5', type: 'single', prompt: 'A container registry (Docker Hub, ECR) is used to…', options: ['Run containers', 'Store and share images (push/pull)', 'Write Dockerfiles', 'Monitor apps'], correct: [1], explanation: 'Registries store images; you push to share and pull to deploy.' },
    { id: 'devops-m1-q6', type: 'single', prompt: 'Containers solve "it works on my machine" by…', options: ['Adding more RAM', 'Packaging the app with all its dependencies to run identically anywhere', 'Using a faster language', 'Avoiding testing'], correct: [1], explanation: 'The image bundles app + deps + config, so it runs the same in every environment.' },
  ],
  resources: [
    { label: 'Docker — getting started', url: 'https://docs.docker.com/get-started/', kind: 'docs', free: true },
  ],
};
