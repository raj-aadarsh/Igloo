import type { Module } from '@/content/types';

export const m5: Module = {
  id: 'cn-m5',
  slug: 'application-layer',
  order: 5,
  title: 'Application Layer',
  subtitle: 'HTTP, DNS, DHCP & the protocols you use daily',
  icon: 'message',
  lessons: [
    {
      id: 'cn-m5-l1',
      title: 'HTTP & HTTPS',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**HTTP** is the request/response protocol of the web. The client sends a request (method + path + headers), the server replies with a status code + headers + body. It’s **stateless** — each request stands alone (cookies add memory on top).' },
        { type: 'keyterms', title: 'Methods & status codes', terms: [
          { term: 'GET / POST / PUT / DELETE', def: 'Read / create / update / delete — the common HTTP verbs.' },
          { term: '2xx / 3xx', def: 'Success (200 OK) / redirection (301 Moved, 304 Not Modified).' },
          { term: '4xx / 5xx', def: 'Client error (404 Not Found, 401 Unauthorized) / server error (500, 503).' },
          { term: 'Cookies & sessions', def: 'Small tokens the server sets in your browser to remember you across stateless requests (login, cart).' },
        ] },
        { type: 'callout', variant: 'key', text: '**HTTPS = HTTP over TLS.** Same protocol, but the connection is encrypted and the server’s identity is verified by a certificate — so nobody in between can read or tamper with the traffic.' },
      ],
    },
    {
      id: 'cn-m5-l2',
      title: 'DNS & DHCP',
      minutes: 6,
      blocks: [
        { type: 'h2', text: 'DNS — the internet’s phone book' },
        { type: 'p', text: '**DNS** translates human names (google.com) into IP addresses. Your **recursive resolver** queries a hierarchy: **root** servers → **TLD** servers (.com) → the domain’s **authoritative** server, then caches the answer (governed by its **TTL**).' },
        { type: 'keyterms', title: 'Common DNS records', terms: [
          { term: 'A / AAAA', def: 'Maps a name to an IPv4 / IPv6 address.' },
          { term: 'CNAME', def: 'An alias pointing one name to another.' },
          { term: 'MX', def: 'Mail server for the domain.' },
          { term: 'NS', def: 'The authoritative name servers for the domain.' },
        ] },
        { type: 'h2', text: 'DHCP — automatic addressing' },
        { type: 'p', text: 'When a device joins a network, **DHCP** automatically leases it an IP address (plus subnet mask, gateway, and DNS server) — no manual config. The exchange is **DORA**: Discover → Offer → Request → Acknowledge.' },
        { type: 'callout', variant: 'tip', text: 'Don’t confuse them: **DNS** maps *names → IPs*; **ARP** maps *IPs → MACs* (locally); **DHCP** *hands out* IPs to new devices.' },
      ],
    },
    {
      id: 'cn-m5-l3',
      title: 'Putting it together: typing a URL',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The interview classic — "what happens when you type google.com and hit Enter?" — exercises almost every layer at once. Tap through the journey:' },
        { type: 'widget', widget: 'url-journey' },
        { type: 'callout', variant: 'key', text: 'Memorise the chain: **URL → DNS → TCP → TLS → HTTP → render.** If you can narrate those seven steps, you can answer the whole question (and the follow-ups about each layer).' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m5-q1', type: 'single', prompt: 'HTTP is described as "stateless" because…', options: ['It uses UDP', 'Each request is independent; the server doesn’t inherently remember previous ones', 'It can’t send data', 'It has no headers'], correct: [1], explanation: 'Each HTTP request stands alone; cookies/sessions add memory on top.' },
    { id: 'cn-m5-q2', type: 'single', prompt: 'A 404 status code means…', options: ['Success', 'Redirect', 'Client error — resource not found', 'Server crashed'], correct: [2], explanation: '4xx = client errors; 404 = the requested resource was not found.' },
    { id: 'cn-m5-q3', type: 'single', prompt: 'DNS primarily…', options: ['Maps domain names to IP addresses', 'Maps IPs to MAC addresses', 'Assigns IPs to new devices', 'Encrypts traffic'], correct: [0], explanation: 'DNS resolves names → IPs. (ARP does IP→MAC; DHCP assigns IPs.)' },
    { id: 'cn-m5-q4', type: 'single', prompt: 'HTTPS differs from HTTP in that it…', options: ['Is faster', 'Runs HTTP over an encrypted TLS connection with a verified certificate', 'Uses UDP', 'Has no status codes'], correct: [1], explanation: 'HTTPS = HTTP over TLS: encrypted + server identity verified.' },
    { id: 'cn-m5-q5', type: 'single', prompt: 'The DHCP exchange (DORA) stands for…', options: ['Discover, Offer, Request, Acknowledge', 'Detect, Open, Read, Acknowledge', 'Deliver, Order, Receive, Ack', 'Domain, Origin, Route, Address'], correct: [0], explanation: 'DHCP: Discover → Offer → Request → Acknowledge.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Application Layer', url: 'https://www.tutorialspoint.com/data_communication_computer_network/application_layer_introduction.htm', kind: 'article', free: true },
    { label: 'Cloudflare — What is DNS?', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/', kind: 'article', free: true },
  ],
};
