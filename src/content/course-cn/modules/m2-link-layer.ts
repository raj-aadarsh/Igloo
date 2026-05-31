import type { Module } from '@/content/types';

export const m2: Module = {
  id: 'cn-m2',
  slug: 'link-layer',
  order: 2,
  title: 'Physical & Data Link',
  subtitle: 'MAC addresses, switches, framing & errors',
  icon: 'network',
  lessons: [
    {
      id: 'cn-m2-l1',
      title: 'Topologies & the physical layer',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'The **physical layer** moves raw bits over a medium (copper, fibre, radio). How devices are wired together is the **topology**.' },
        { type: 'keyterms', title: 'Common topologies', terms: [
          { term: 'Star', def: 'All nodes connect to a central switch/hub. Most common in practice; one cable fault isolates one node.' },
          { term: 'Bus', def: 'All nodes share one backbone cable. Cheap but a break kills the whole segment.' },
          { term: 'Ring', def: 'Each node connects to two neighbours forming a loop.' },
          { term: 'Mesh', def: 'Nodes interconnect directly (full/partial). Very reliable, lots of cabling — used in network cores.' },
        ] },
        { type: 'callout', variant: 'info', title: 'Hub vs Switch', text: 'A **hub** blindly repeats bits to every port (one collision domain — dumb). A **switch** learns which MAC is on which port and forwards frames only where needed (smart, the modern default).' },
      ],
    },
    {
      id: 'cn-m2-l2',
      title: 'MAC addresses, framing & ARP',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'The **data link layer** delivers frames between directly-connected nodes using **MAC addresses** — a 48-bit hardware address burned into each network card (e.g. `00:1A:2B:3C:4D:5E`).' },
        { type: 'keyterms', terms: [
          { term: 'MAC address', def: 'A permanent, physical, layer-2 address unique to a network interface.' },
          { term: 'MAC vs IP', def: 'MAC is the *physical* address (local, never changes); IP is the *logical* address (can change by network). A frame uses MACs to hop link-to-link; the packet inside keeps the same source/dest IPs end-to-end.' },
          { term: 'ARP', def: 'Address Resolution Protocol — finds the MAC address for a known IP on the local network ("who has 192.168.1.1? tell me your MAC").' },
        ] },
        { type: 'callout', variant: 'key', text: 'Great interview line: **IP gets the packet to the right network; MAC gets the frame to the right machine on that network.** ARP is the bridge that maps IP → MAC locally.' },
      ],
    },
    {
      id: 'cn-m2-l3',
      title: 'Error detection & access control',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'Links are noisy, so the data link layer adds **error detection** (and sometimes correction).' },
        { type: 'keyterms', terms: [
          { term: 'Parity bit', def: 'One extra bit making the number of 1s even/odd. Detects single-bit errors only.' },
          { term: 'Checksum', def: 'Sum of data chunks sent along for verification (used by IP/TCP/UDP headers).' },
          { term: 'CRC', def: 'Cyclic Redundancy Check — a polynomial-division checksum that catches burst errors well. Used in Ethernet frames.' },
        ] },
        { type: 'h3', text: 'Sharing one medium: CSMA' },
        { type: 'p', text: 'When devices share a medium they can **collide**. Ethernet historically used **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection): listen, transmit, and if a collision is detected, back off and retry. Wi-Fi uses **CSMA/CA** (Collision *Avoidance*), since radios can’t easily detect collisions.' },
        { type: 'callout', variant: 'tip', text: 'CRC catches errors but doesn’t fix them — the frame is simply discarded and a higher layer (TCP) re-sends. Detection ≠ correction.' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m2-q1', type: 'single', prompt: 'A switch differs from a hub because it…', options: ['Repeats bits to every port', 'Learns MAC addresses and forwards frames only where needed', 'Routes between networks', 'Assigns IP addresses'], correct: [1], explanation: 'A switch is smart: it builds a MAC table and forwards selectively; a hub blindly repeats to all ports.' },
    { id: 'cn-m2-q2', type: 'single', prompt: 'ARP is used to…', options: ['Find the IP for a domain name', 'Find the MAC address for a known IP on the LAN', 'Route packets between networks', 'Detect errors'], correct: [1], explanation: 'ARP maps a known IP address to its MAC address on the local network (DNS maps names→IPs).' },
    { id: 'cn-m2-q3', type: 'single', prompt: 'Which best contrasts MAC and IP addresses?', options: ['They’re the same', 'MAC is logical/changes; IP is physical/permanent', 'MAC is physical/local; IP is logical and gets packets across networks', 'IP is only for Wi-Fi'], correct: [2], explanation: 'MAC = physical/local (layer 2); IP = logical and routable across networks (layer 3).' },
    { id: 'cn-m2-q4', type: 'single', prompt: 'Ethernet frames detect transmission errors using…', options: ['A parity bit', 'CRC', 'ARP', 'NAT'], correct: [1], explanation: 'Ethernet uses a CRC in the frame trailer to detect (burst) errors.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Data Link Layer', url: 'https://www.tutorialspoint.com/data_communication_computer_network/data_link_layer_introduction.htm', kind: 'article', free: true },
  ],
};
