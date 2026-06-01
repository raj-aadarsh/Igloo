import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'devops-m6',
  slug: 'infrastructure-as-code',
  order: 6,
  title: 'Infrastructure as Code',
  subtitle: 'Provision servers like software',
  icon: 'infinity',
  lessons: [
    {
      id: 'devops-m6-l1',
      title: 'Why IaC?',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Clicking around a cloud console to set up servers ("click-ops") is slow, error-prone, and impossible to reproduce. **Infrastructure as Code (IaC)** defines your infrastructure — servers, networks, databases — in version-controlled config files you can review, diff, and re-run.' },
        { type: 'keyterms', terms: [
          { term: 'Reproducible', def: 'Spin up identical environments (dev/staging/prod) from the same code — no "snowflake" servers configured by hand.' },
          { term: 'Version-controlled', def: 'Infra changes are committed, reviewed in pull requests, and rolled back via Git like any code.' },
          { term: 'Declarative', def: 'You describe the desired end state ("3 servers, this network"); the tool figures out how to get there — the same desired-state idea as Kubernetes.' },
          { term: 'Idempotent', def: 'Running it repeatedly converges to the same result; if reality already matches, nothing changes. No accidental duplicates.' },
        ] },
        { type: 'callout', variant: 'key', text: 'Declarative + idempotent is the heart of IaC: you commit the desired state, and applying it makes (only) the changes needed to match — safely, repeatably, every time.' },
      ],
    },
    {
      id: 'devops-m6-l2',
      title: 'Terraform & the plan/apply loop',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**Terraform** is the leading IaC tool — cloud-agnostic, declarative, with a killer feature: it shows you a **plan** (a diff of what will change) before touching anything.' },
        { type: 'code', caption: 'Declaring a server (Terraform HCL)', code: `resource "aws_instance" "web" {
  ami           = "ami-0abc123"
  instance_type = "t3.micro"
  tags = { Name = "web-server" }
}` },
        { type: 'code', caption: 'The safe workflow', code: `terraform plan    # preview the diff: + create, ~ change, - destroy
terraform apply   # make reality match the code
terraform destroy # tear it all down cleanly` },
        { type: 'keyterms', terms: [
          { term: 'State file', def: 'Terraform records what it has created in a state file, so it knows the diff between code and reality. Store it remotely & locked for team use.' },
          { term: 'plan before apply', def: 'Always review the plan — it prevents surprise deletions. This diff-then-apply loop is exactly why IaC is safer than click-ops.' },
        ] },
      ],
    },
    {
      id: 'devops-m6-l3',
      title: 'Provisioning vs configuration',
      minutes: 4,
      blocks: [
        { type: 'keyterms', terms: [
          { term: 'Provisioning (Terraform)', def: 'Creates the infrastructure itself — VMs, networks, load balancers, databases.' },
          { term: 'Configuration management (Ansible, Chef, Puppet)', def: 'Configures what runs *inside* the machines — installs packages, sets up services, applies settings.' },
          { term: 'Declarative vs imperative', def: 'Terraform/Ansible are largely declarative (describe the end state). Older scripts are imperative (list every step). Declarative is more robust & idempotent.' },
        ] },
        { type: 'callout', variant: 'tip', text: 'A common combo: Terraform provisions the servers, then Ansible configures them — or, increasingly, you bake config into a container image and skip per-server config entirely (immutable infrastructure).' },
        { type: 'callout', variant: 'key', text: 'Immutable infrastructure is the modern ideal: never patch a live server — instead build a new image/instance and replace the old one (pairs perfectly with containers & blue-green/rolling deploys).' },
      ],
    },
  ],
  quiz: [
    { id: 'devops-m6-q1', type: 'single', prompt: 'Infrastructure as Code means…', options: ['Writing app code faster', 'Defining infrastructure in version-controlled config files', 'Manually clicking in the cloud console', 'Coding inside servers'], correct: [1], explanation: 'IaC declares infrastructure in code you can review, diff, version, and re-run.' },
    { id: 'devops-m6-q2', type: 'single', prompt: 'Idempotent means applying the config repeatedly…', options: ['Creates duplicates each time', 'Converges to the same result (no change if already matching)', 'Fails the second time', 'Requires manual steps'], correct: [1], explanation: 'Idempotency: re-running makes only the changes needed; matching state → no-op.' },
    { id: 'devops-m6-q3', type: 'single', prompt: 'In Terraform, you should always run ___ before ___.', options: ['apply / plan', 'plan / apply', 'destroy / plan', 'apply / destroy'], correct: [1], explanation: 'terraform plan previews the diff so you can review before terraform apply changes reality.' },
    { id: 'devops-m6-q4', type: 'single', prompt: 'Terraform vs Ansible, roughly…', options: ['Terraform provisions infrastructure; Ansible configures what’s inside it', 'They are identical', 'Ansible provisions VMs; Terraform writes apps', 'Both only monitor'], correct: [0], explanation: 'Terraform = provisioning infra; Ansible/Chef/Puppet = configuration management inside machines.' },
    { id: 'devops-m6-q5', type: 'single', prompt: '"Immutable infrastructure" means…', options: ['Never change anything ever', 'Replace servers with new images instead of patching live ones', 'Servers can’t be deleted', 'Config is hard-coded'], correct: [1], explanation: 'You build & deploy a new image rather than mutating running servers — safer and reproducible.' },
    { id: 'devops-m6-q6', type: 'single', prompt: 'A "snowflake" server is one that…', options: ['Is in the cloud', 'Was hand-configured and can’t be reliably reproduced', 'Runs containers', 'Is defined in code'], correct: [1], explanation: 'Snowflakes are uniquely hand-tuned servers — exactly what IaC eliminates.' },
  ],
  resources: [
    { label: 'Terraform — intro', url: 'https://developer.hashicorp.com/terraform/intro', kind: 'docs', free: true },
  ],
};
