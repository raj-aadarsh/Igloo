import type { Module } from '@/content/types';

export const m7: Module = {
  id: 'cn-m7',
  slug: 'capstone',
  order: 7,
  title: 'Capstone & What’s Next',
  subtitle: 'The whole network, on one page',
  icon: 'cap',
  lessons: [
    {
      id: 'cn-m7-l1',
      title: 'The big picture',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'You’ve traced data from raw bits to a rendered web page. If you can explain this list, you’re ready:' },
        { type: 'ol', items: [
          'Networking is **layered** — OSI (7) / TCP-IP (4); each layer adds a header (**encapsulation**).',
          '**Physical/Data Link**: bits, MAC addresses, switches, ARP (IP→MAC), CRC error checks.',
          '**Network layer**: IP addressing, **subnetting**, routers, NAT, ICMP — gets packets across networks.',
          '**Transport**: **TCP** (reliable, 3-way handshake, flow & congestion control) vs **UDP** (fast, best-effort); ports identify apps.',
          '**Application**: HTTP/HTTPS, **DNS** (names→IPs), DHCP (DORA), cookies.',
          '**Security**: symmetric + asymmetric crypto, **TLS** (= HTTPS), certificates/CAs, firewalls/VPNs, and attacks (DDoS, MITM, phishing).',
          'The grand finale — typing a URL: **URL → DNS → TCP → TLS → HTTP → render.**',
        ] },
        { type: 'callout', variant: 'key', text: 'Take the **Final Exam** (sidebar) for a mixed set. Replay the OSI explorer, subnet calculator, TCP handshake, and URL journey until each feels obvious — those four cover most interview questions.' },
      ],
    },
    {
      id: 'cn-m7-l2',
      title: 'Go deeper (all free)',
      minutes: 3,
      blocks: [
        { type: 'ul', items: [
          '**Computer Networking: A Top-Down Approach** (Kurose & Ross) — the classic, approachable textbook.',
          '**Cloudflare Learning Center** — short, clear articles on DNS, TLS, DDoS, and more.',
          '**Ben Eater** (YouTube) — networking from first principles, beautifully visual.',
          '**TutorialsPoint — Data Communication & Computer Network** — the long-form reference for every topic here.',
        ] },
        { type: 'callout', variant: 'tip', text: 'Best next step: open your terminal and run `ping`, `traceroute` (or `tracert`), `nslookup google.com`, and your browser’s DevTools → Network tab. Watching real packets makes all of this click.' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m7-q1', type: 'single', prompt: 'The correct order when loading a web page is…', options: ['TCP → DNS → HTTP → TLS', 'URL → DNS → TCP → TLS → HTTP → render', 'DNS → HTTP → TCP → render', 'HTTP → DNS → TLS → TCP'], correct: [1], explanation: 'Resolve the name (DNS), connect (TCP), secure it (TLS), request (HTTP), then render.' },
    { id: 'cn-m7-q2', type: 'multi', prompt: 'Which belong to the transport layer?', options: ['TCP', 'UDP', 'IP', 'Ports'], correct: [0, 1, 3], explanation: 'TCP, UDP, and ports are transport-layer concepts; IP is the network layer.' },
  ],
  resources: [
    { label: 'Cloudflare Learning Center', url: 'https://www.cloudflare.com/learning/', kind: 'article', free: true },
    { label: 'TutorialsPoint — Computer Network Quick Guide', url: 'https://www.tutorialspoint.com/data_communication_computer_network/dcn_quick_guide.htm', kind: 'article', free: true },
  ],
};
