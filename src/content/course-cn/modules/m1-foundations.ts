import type { Module } from '@/content/types';

export const m1: Module = {
  id: 'cn-m1',
  slug: 'foundations',
  order: 1,
  title: 'Foundations & the OSI Model',
  subtitle: 'Layers, models & how data is packaged',
  icon: 'layers',
  lessons: [
    {
      id: 'cn-m1-l1',
      title: 'What is a network — and why layers?',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'A **computer network** is a set of devices (nodes) connected so they can exchange data. Networking is complicated — addressing, routing, errors, encryption — so we split the job into **layers**, each handling one concern and talking only to the layers directly above and below it.' },
        { type: 'keyterms', terms: [
          { term: 'Protocol', def: 'An agreed set of rules for how devices communicate (e.g. HTTP, TCP, IP).' },
          { term: 'LAN / WAN', def: 'Local Area Network (one building) vs Wide Area Network (across cities/countries, e.g. the internet).' },
          { term: 'Bandwidth vs Latency', def: 'Bandwidth = how much data per second; latency = how long one bit takes to arrive. Different problems!' },
        ] },
        { type: 'callout', variant: 'key', text: 'Why layering matters: each layer can change independently (swap Wi-Fi for Ethernet without touching HTTP). It’s separation of concerns for the network.' },
      ],
    },
    {
      id: 'cn-m1-l2',
      title: 'The OSI & TCP/IP models',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'The **OSI model** is the 7-layer reference everyone learns; the **TCP/IP model** is the 4-layer one the real internet runs on. Click through each layer — toggle between the two models:' },
        { type: 'widget', widget: 'osi-layers' },
        { type: 'callout', variant: 'tip', title: 'The mnemonic', text: 'Top→bottom (7→1): **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing — Application, Presentation, Session, Transport, Network, Data Link, Physical.' },
      ],
    },
    {
      id: 'cn-m1-l3',
      title: 'Encapsulation — how data travels down the stack',
      minutes: 5,
      blocks: [
        { type: 'p', text: 'As your data goes **down** the sending stack, each layer wraps it with its own **header** (and the data-link layer adds a trailer too). This is **encapsulation**. At the receiver, each layer peels off its header on the way **up** (decapsulation).' },
        { type: 'keyterms', title: 'What each layer’s unit is called (PDU)', terms: [
          { term: 'Transport → Segment', def: 'TCP adds ports, sequence numbers (a "segment"; UDP calls it a "datagram").' },
          { term: 'Network → Packet', def: 'IP adds source/destination IP addresses.' },
          { term: 'Data Link → Frame', def: 'Adds source/destination MAC addresses + an error-check trailer.' },
          { term: 'Physical → Bits', def: 'The frame becomes raw bits/signals on the wire.' },
        ] },
        { type: 'analogy', text: 'Like posting a letter inside an envelope, inside a bigger envelope, inside a mailbag — each layer adds its own addressing, and the receiver opens them in reverse.' },
        { type: 'callout', variant: 'key', text: 'Headers are added going down, removed going up. The same payload gains a TCP header, then an IP header, then a frame header — that’s encapsulation.' },
      ],
    },
  ],
  quiz: [
    { id: 'cn-m1-q1', type: 'single', prompt: 'How many layers does the OSI model have, and the TCP/IP model?', options: ['5 and 7', '7 and 4', '4 and 7', '7 and 5'], correct: [1], explanation: 'OSI = 7 layers; the practical TCP/IP model = 4 layers.' },
    { id: 'cn-m1-q2', type: 'single', prompt: 'Which OSI layer handles logical addressing (IP) and routing?', options: ['Transport', 'Network', 'Data Link', 'Session'], correct: [1], explanation: 'The Network layer (L3) does IP addressing and routing; routers operate here.' },
    { id: 'cn-m1-q3', type: 'single', prompt: 'The Data Link layer’s PDU is a…', options: ['Packet', 'Segment', 'Frame', 'Bit'], correct: [2], explanation: 'Data Link works with frames (adding MAC addresses + an error-check trailer).' },
    { id: 'cn-m1-q4', type: 'single', prompt: 'Adding a header at each layer as data moves down the stack is called…', options: ['Routing', 'Encapsulation', 'Switching', 'Multiplexing'], correct: [1], explanation: 'Each layer encapsulates the layer above by prepending its own header.' },
  ],
  resources: [
    { label: 'TutorialsPoint — Network Layer / OSI', url: 'https://www.tutorialspoint.com/data_communication_computer_network/network_layer_introduction.htm', kind: 'article', free: true },
    { label: 'Cloudflare — What is the OSI model?', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/', kind: 'article', free: true },
  ],
};
