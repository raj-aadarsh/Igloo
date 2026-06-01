import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'devops-m5',
  slug: 'kubernetes',
  order: 5,
  title: 'Kubernetes',
  subtitle: 'Orchestrate containers at scale',
  icon: 'boxes',
  lessons: [
    {
      id: 'devops-m5-l1',
      title: 'Why orchestration?',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Running a few containers by hand is easy. Running *thousands* across many machines — restarting crashed ones, scaling with load, rolling out updates, networking them — is not. A **container orchestrator** automates all of that. **Kubernetes (K8s)** is the industry standard.' },
        { type: 'keyterms', title: 'What K8s does for you', terms: [
          { term: 'Self-healing', def: 'Restarts/reschedules failed containers automatically.' },
          { term: 'Scaling', def: 'Scales replicas up/down (even auto-scaling on CPU/traffic).' },
          { term: 'Rollouts & rollbacks', def: 'Built-in rolling updates with easy rollback.' },
          { term: 'Service discovery & load balancing', def: 'Gives stable addresses to ever-changing pods and balances traffic across them.' },
        ] },
        { type: 'callout', variant: 'key', text: 'The core idea is declarative + desired state: you describe what you want ("5 replicas of this image"), and Kubernetes continuously works to make reality match — you don’t script the steps.' },
      ],
    },
    {
      id: 'devops-m5-l2',
      title: 'The cluster: pods, nodes & control plane',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'A Kubernetes **cluster** = a control plane (the brain) + worker nodes (where containers run). Scale it and kill a pod to see self-healing:' },
        { type: 'widget', widget: 'k8s-architecture' },
        { type: 'keyterms', terms: [
          { term: 'Pod', def: 'The smallest deployable unit — one (or a few tightly-coupled) containers sharing network/storage. K8s schedules pods, not bare containers.' },
          { term: 'Node', def: 'A worker machine (VM/physical) running pods, managed by a kubelet agent.' },
          { term: 'Control plane', def: 'The brain: API server (front door), Scheduler (places pods on nodes), etcd (the cluster’s key-value state store), Controller Manager (runs the reconcile loops).' },
          { term: 'Reconciliation loop', def: 'Controllers constantly compare desired vs actual state and act to close the gap — the mechanism behind self-healing & scaling.' },
        ] },
      ],
    },
    {
      id: 'devops-m5-l3',
      title: 'The objects you’ll name in interviews',
      minutes: 6,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Deployment', def: 'Declares the desired replicas of a pod template and manages rolling updates/rollbacks (via a ReplicaSet under the hood). The object you usually create.' },
          { term: 'Service', def: 'A stable virtual IP + DNS name that load-balances across a changing set of pods — so clients don’t care which pods exist. (ClusterIP, NodePort, LoadBalancer.)' },
          { term: 'Ingress', def: 'HTTP(S) routing into the cluster (host/path-based) — the layer-7 entry point in front of Services.' },
          { term: 'ConfigMap & Secret', def: 'Inject configuration and sensitive values into pods (env vars / files) — keeping config out of the image.' },
          { term: 'Namespace', def: 'A virtual partition of the cluster for isolating teams/environments.' },
        ] },
        { type: 'code', caption: 'A Deployment, declaratively (YAML)', code: `apiVersion: apps/v1
kind: Deployment
metadata: { name: web }
spec:
  replicas: 5                # desired state
  selector: { matchLabels: { app: web } }
  template:
    metadata: { labels: { app: web } }
    spec:
      containers:
        - name: web
          image: myregistry/web:1.4.0
          ports: [{ containerPort: 80 }]` },
        { type: 'callout', variant: 'tip', text: 'Interview essentials: a Pod is the smallest unit; a Deployment manages replicas + rollouts; a Service gives pods a stable address & load-balances them. Say "declarative, desired-state, self-healing" and you’ve captured the soul of Kubernetes.' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m5-q1', type: 'single', prompt: 'The smallest deployable unit in Kubernetes is a…', options: ['Container', 'Pod', 'Node', 'Service'], correct: [1], explanation: 'K8s schedules pods (one or a few containers sharing network/storage), not bare containers.' },
    { id: 'devops-m5-q2', type: 'single', prompt: 'Kubernetes works on a model of…', options: ['Imperative step-by-step scripts', 'Declarative desired state that controllers reconcile', 'Manual restarts', 'One container per cluster'], correct: [1], explanation: 'You declare desired state; controllers continuously reconcile reality to match it.' },
    { id: 'devops-m5-q3', type: 'single', prompt: 'When a pod crashes, Kubernetes…', options: ['Pages you to fix it', 'Automatically recreates it to match desired replicas (self-healing)', 'Deletes the deployment', 'Stops the cluster'], correct: [1], explanation: 'The controller notices running < desired and recreates the pod — self-healing.' },
    { id: 'devops-m5-q4', type: 'single', prompt: 'A Service exists to…', options: ['Build images', 'Give a stable address + load-balance across changing pods', 'Store secrets', 'Schedule nodes'], correct: [1], explanation: 'Pods come and go; a Service provides a stable virtual IP/DNS and balances traffic to them.' },
    { id: 'devops-m5-q5', type: 'single', prompt: 'Which control-plane component stores the cluster’s state?', options: ['kubelet', 'etcd', 'Ingress', 'A Pod'], correct: [1], explanation: 'etcd is the key-value store holding the cluster’s desired & current state.' },
    { id: 'devops-m5-q6', type: 'single', prompt: 'A Deployment’s `replicas: 5` is an example of…', options: ['Imperative command', 'Declared desired state', 'A log entry', 'A network rule'], correct: [1], explanation: 'It declares the desired number of pods; K8s makes reality match.' },
  ],
  resources: [
    { label: 'Kubernetes — concepts', url: 'https://kubernetes.io/docs/concepts/', kind: 'docs', free: true },
  ],
};
