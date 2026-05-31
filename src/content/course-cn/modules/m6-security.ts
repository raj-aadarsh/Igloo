import type { Module } from '@/content/types';

export const m6: Module = {
  id: 'cn-m6',
  slug: 'security',
  order: 6,
  title: 'Network Security & TLS',
  subtitle: 'Encryption, certificates & common attacks',
  icon: 'shield',
  lessons: [
    {
      id: 'cn-m6-l1',
      title: 'Encryption basics',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Security rests on three goals — **confidentiality** (no eavesdropping), **integrity** (no tampering), and **authentication** (you’re really talking to who you think). Encryption provides them.' },
        { type: 'keyterms', terms: [
          { term: 'Symmetric encryption', def: 'One shared secret key encrypts & decrypts (e.g. AES). Fast, but both sides must somehow share the key safely.' },
          { term: 'Asymmetric encryption', def: 'A public/private key pair (e.g. RSA). Anyone can encrypt with the public key; only the private key decrypts. Solves key sharing — but it’s slower.' },
          { term: 'Hashing', def: 'A one-way fingerprint of data (e.g. SHA-256). Used for integrity checks and storing passwords — not reversible.' },
          { term: 'Digital certificate', def: 'A document binding a public key to an identity, signed by a trusted Certificate Authority (CA).' },
        ] },
        { type: 'callout', variant: 'key', text: 'The clever combo (used by TLS): use slow **asymmetric** crypto just to safely exchange a **symmetric** session key, then use fast symmetric encryption for the actual data. Best of both.' },
      ],
    },
    {
      id: 'cn-m6-l2',
      title: 'TLS & defences',
      minutes: 6,
      blocks: [
        { type: 'p', text: '**TLS** (what makes HTTP into HTTPS) secures a connection in a short handshake: the client and server agree on a cipher, the server presents its **certificate** (which the browser verifies against trusted CAs), and they derive a shared **session key**. After that, everything is encrypted.' },
        { type: 'keyterms', title: 'Network defences', terms: [
          { term: 'Firewall', def: 'Filters traffic by rules (allowed ports, IPs, protocols) — your network’s gatekeeper.' },
          { term: 'VPN', def: 'An encrypted tunnel over the public internet, making you appear on a remote private network.' },
          { term: 'IDS / IPS', def: 'Intrusion Detection / Prevention Systems — spot (and block) suspicious traffic.' },
        ] },
        { type: 'h3', text: 'Attacks to know by name' },
        { type: 'keyterms', terms: [
          { term: 'DDoS', def: 'Distributed Denial of Service — flood a target with traffic from many machines so it can’t serve real users.' },
          { term: 'Man-in-the-Middle (MITM)', def: 'An attacker secretly relays/alters traffic between two parties (TLS defeats this by verifying identity).' },
          { term: 'Phishing', def: 'Tricking users into revealing credentials via fake sites/messages.' },
          { term: 'SQL injection / XSS', def: 'Application-layer attacks injecting malicious input/scripts (defend by validating & escaping input).' },
        ] },
        { type: 'callout', variant: 'tip', text: 'The padlock in your browser means TLS verified the site’s certificate and the channel is encrypted — defeating eavesdropping and most MITM attacks.' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m6-q1', type: 'single', prompt: 'Symmetric vs asymmetric encryption: which uses a public/private key pair?', options: ['Symmetric', 'Asymmetric', 'Both', 'Neither'], correct: [1], explanation: 'Asymmetric (e.g. RSA) uses a public + private key pair; symmetric uses one shared key.' },
    { id: 'cn-m6-q2', type: 'single', prompt: 'How does TLS combine the two encryption types?', options: ['Uses only symmetric', 'Uses asymmetric to exchange a symmetric session key, then symmetric for data', 'Uses only asymmetric', 'Uses neither'], correct: [1], explanation: 'Asymmetric securely shares a session key; fast symmetric encryption then protects the bulk data.' },
    { id: 'cn-m6-q3', type: 'single', prompt: 'A flood of traffic from many machines to take a service offline is a…', options: ['MITM', 'DDoS attack', 'Phishing attack', 'SQL injection'], correct: [1], explanation: 'Distributed Denial of Service overwhelms the target from many sources.' },
    { id: 'cn-m6-q4', type: 'single', prompt: 'A digital certificate is trusted because it is…', options: ['Encrypted with AES', 'Signed by a trusted Certificate Authority (CA)', 'Stored on the client', 'Hashed with SHA-256'], correct: [1], explanation: 'A CA’s signature vouches that the public key really belongs to that identity.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Network Security', url: 'https://www.tutorialspoint.com/data_communication_computer_network/computer_network_security.htm', kind: 'article', free: true },
    { label: 'Cloudflare — What is TLS?', url: 'https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/', kind: 'article', free: true },
  ],
};
