import type { Module } from '@/content/types';

export const m4: Module = {
  id: 'cn-m4',
  slug: 'transport-layer',
  order: 4,
  title: 'Transport Layer',
  subtitle: 'TCP vs UDP, ports & the handshake',
  icon: 'workflow',
  lessons: [
    {
      id: 'cn-m4-l1',
      title: 'Ports, TCP & UDP',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The **transport layer** delivers data between *applications* (not just machines). It uses **port numbers** to know which app a packet belongs to — IP gets you to the host, the port gets you to the right program on it.' },
        { type: 'keyterms', terms: [
          { term: 'Port', def: 'A 16-bit number identifying an application/endpoint (e.g. HTTP 80, HTTPS 443, DNS 53, SSH 22).' },
          { term: 'Socket', def: 'The combination IP + port that uniquely identifies one end of a connection.' },
          { term: 'Multiplexing', def: 'Using ports so many apps can share one network connection at once.' },
        ] },
        { type: 'h2', text: 'TCP vs UDP — the headline comparison' },
        { type: 'keyterms', terms: [
          { term: 'TCP', def: 'Connection-oriented, **reliable**, ordered, error-checked. Sets up a connection, retransmits lost data, controls flow & congestion. Used by HTTP, email, file transfer.' },
          { term: 'UDP', def: 'Connectionless, **fast**, no guarantees (data may be lost/out of order). No handshake, low overhead. Used by DNS, video/voice streaming, gaming.' },
        ] },
        { type: 'callout', variant: 'key', text: 'One-liner: **TCP = reliable but slower** (a phone call — you confirm you’re heard); **UDP = fast but best-effort** (shouting across a room — quick, no confirmation). Pick UDP when speed matters more than the odd lost packet.' },
      ],
    },
    {
      id: 'cn-m4-l2',
      title: 'The 3-way handshake',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'Before TCP sends data, it **establishes a connection** with a three-message handshake so both sides agree on starting sequence numbers. Step through it:' },
        { type: 'widget', widget: 'tcp-handshake' },
        { type: 'keyterms', terms: [
          { term: 'SYN / ACK', def: 'SYN = "synchronize" (start, here’s my sequence number). ACK = "acknowledge" (got it).' },
          { term: 'Sequence & ACK numbers', def: 'Byte counters that let TCP reorder data and detect loss.' },
          { term: 'Connection teardown', def: 'Closing is a 4-way exchange: FIN → ACK → FIN → ACK (each side closes its direction).' },
        ] },
      ],
    },
    {
      id: 'cn-m4-l3',
      title: 'Reliability, flow & congestion control',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'TCP’s "reliability" is a bundle of mechanisms working together:' },
        { type: 'keyterms', terms: [
          { term: 'Acknowledgements + retransmission', def: 'The receiver ACKs data; un-ACKed data is re-sent after a timeout.' },
          { term: 'Flow control (sliding window)', def: 'The receiver advertises how much buffer it has so a fast sender doesn’t overwhelm a slow receiver.' },
          { term: 'Congestion control', def: 'TCP slows down when the *network* is congested (algorithms like slow start & AIMD — additive increase, multiplicative decrease).' },
          { term: 'Checksum', def: 'Detects corrupted segments so they can be discarded and re-sent.' },
        ] },
        { type: 'callout', variant: 'tip', title: 'Flow vs congestion control', text: 'Easy to mix up: **flow control** protects the *receiver* (don’t overflow its buffer); **congestion control** protects the *network* (don’t overflow the routers in between).' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m4-q1', type: 'single', prompt: 'Which protocol is connectionless and best-effort (no guarantees)?', options: ['TCP', 'UDP', 'IP', 'ARP'], correct: [1], explanation: 'UDP is connectionless and unreliable but fast — good for streaming, DNS, gaming.' },
    { id: 'cn-m4-q2', type: 'single', prompt: 'Port 443 is used by…', options: ['HTTP', 'HTTPS', 'DNS', 'SSH'], correct: [1], explanation: 'HTTPS uses 443 (HTTP 80, DNS 53, SSH 22).' },
    { id: 'cn-m4-q3', type: 'single', prompt: 'The TCP 3-way handshake messages are…', options: ['SYN, FIN, ACK', 'SYN, SYN-ACK, ACK', 'GET, POST, ACK', 'ACK, NACK, SYN'], correct: [1], explanation: 'Client SYN → server SYN-ACK → client ACK establishes the connection.' },
    { id: 'cn-m4-q4', type: 'single', prompt: 'Flow control exists to protect the…', options: ['Network routers', 'Receiver’s buffer', 'Sender’s CPU', 'DNS cache'], correct: [1], explanation: 'Flow control prevents a fast sender from overrunning the receiver; congestion control protects the network.' },
    { id: 'cn-m4-q5', type: 'single', prompt: 'A socket uniquely identifies a connection endpoint as…', options: ['MAC + port', 'IP + port', 'IP + MAC', 'Domain + port'], correct: [1], explanation: 'A socket = IP address + port number.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Transport Layer', url: 'https://www.tutorialspoint.com/data_communication_computer_network/transport_layer_introduction.htm', kind: 'article', free: true },
    { label: 'Cloudflare — TCP vs UDP', url: 'https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/', kind: 'article', free: true },
  ],
};
