import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'cn-m3',
  slug: 'network-layer',
  order: 3,
  title: 'Network Layer & IP',
  subtitle: 'Addressing, subnetting & routing',
  icon: 'workflow',
  lessons: [
    {
      id: 'cn-m3-l1',
      title: 'IP addressing',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The **network layer** delivers packets across networks using **IP addresses**. An **IPv4** address is 32 bits, written as four octets (e.g. `192.168.1.10`). It splits into a **network part** and a **host part** — the split is set by the **subnet mask** / prefix.' },
        { type: 'keyterms', terms: [
          { term: 'IPv4 vs IPv6', def: 'IPv4 = 32-bit (~4.3 billion addresses, running out). IPv6 = 128-bit (essentially unlimited), written in hex groups.' },
          { term: 'Public vs Private IP', def: 'Private ranges (10.x, 172.16–31.x, 192.168.x) are reused inside LANs; public IPs are globally unique.' },
          { term: 'Subnet mask / prefix', def: 'Marks which bits are network vs host. /24 means the first 24 bits are the network.' },
          { term: 'Classful (A/B/C)', def: 'The old scheme of fixed network sizes; replaced by flexible CIDR.' },
          { term: 'CIDR', def: 'Classless Inter-Domain Routing — the `/n` prefix notation that lets networks be any size.' },
        ] },
        { type: 'callout', variant: 'info', text: 'Two addresses in every subnet are reserved: the **network address** (all host bits 0) and the **broadcast address** (all host bits 1) — which is why usable hosts = 2ⁿ − 2.' },
      ],
    },
    {
      id: 'cn-m3-l2',
      title: 'Subnetting — calculate it live',
      minutes: 7,
      blocks: [
        { type: 'p', text: '**Subnetting** borrows host bits to split one network into smaller ones. Type an IP and drag the prefix to watch the network, broadcast, host range, and host count update instantly:' },
        { type: 'widget', widget: 'subnet-calculator' },
        { type: 'callout', variant: 'key', text: 'The drill: each extra prefix bit **halves** the hosts and **doubles** the number of subnets. /24 → 254 hosts; /25 → 126; /26 → 62 … Remember usable = 2^(32−prefix) − 2.' },
      ],
    },
    {
      id: 'cn-m3-l3',
      title: 'Routing, NAT & ICMP',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A **router** connects different networks and forwards packets toward their destination using a **routing table** (longest-prefix match). Routes are learned by **routing protocols**.' },
        { type: 'keyterms', terms: [
          { term: 'Routing table', def: 'Maps destination networks → next hop. The router picks the most specific (longest-prefix) match.' },
          { term: 'Static vs Dynamic routing', def: 'Static = hand-configured. Dynamic = learned automatically via protocols like OSPF (link-state) or BGP (the internet’s backbone protocol).' },
          { term: 'NAT', def: 'Network Address Translation — lets many private devices share one public IP (your home router does this). Conserves IPv4 addresses.' },
          { term: 'ICMP', def: 'Control/error messaging for IP — powers `ping` (echo request/reply) and `traceroute`.' },
          { term: 'TTL', def: 'Time To Live — a hop counter in each packet; hits 0 → packet dropped (prevents infinite loops; traceroute exploits it).' },
        ] },
        { type: 'callout', variant: 'key', text: 'One-liner: **switches** forward by MAC *within* a network (L2); **routers** forward by IP *between* networks (L3). **NAT** is why your phone and laptop can both reach the internet through a single public IP.' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m3-q1', type: 'single', prompt: 'How many usable host addresses does a /26 subnet provide?', options: ['64', '62', '30', '126'], correct: [1], explanation: '2^(32−26) − 2 = 64 − 2 = 62 usable hosts (minus network & broadcast).' },
    { id: 'cn-m3-q2', type: 'single', prompt: 'Which two addresses are reserved in every subnet?', options: ['First and last usable', 'Network (all-0 hosts) and broadcast (all-1 hosts)', 'The gateway and DNS', 'None'], correct: [1], explanation: 'The all-zeros host (network) and all-ones host (broadcast) addresses are reserved.' },
    { id: 'cn-m3-q3', type: 'single', prompt: 'NAT primarily lets you…', options: ['Resolve domain names', 'Share one public IP among many private devices', 'Detect errors', 'Encrypt traffic'], correct: [1], explanation: 'NAT maps many private addresses to one (or few) public IPs, conserving IPv4 space.' },
    { id: 'cn-m3-q4', type: 'single', prompt: 'Which protocol does `ping` use?', options: ['TCP', 'ICMP', 'ARP', 'DNS'], correct: [1], explanation: 'ping sends ICMP echo request/reply messages.' },
    { id: 'cn-m3-q5', type: 'single', prompt: 'A router forwards based on ____, a switch forwards based on ____.', options: ['MAC / IP', 'IP / MAC', 'port / IP', 'DNS / MAC'], correct: [1], explanation: 'Routers use IP (L3) between networks; switches use MAC (L2) within a network.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Network Addressing', url: 'https://www.tutorialspoint.com/data_communication_computer_network/network_layer_introduction.htm', kind: 'article', free: true },
    { label: 'Cloudflare — What is a subnet?', url: 'https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/', kind: 'article', free: true },
  ],
};
