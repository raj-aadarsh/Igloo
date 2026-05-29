import type { Module } from '@/content/types';

export const m3: Module = {
  id: 'm3',
  slug: 'neural-networks',
  order: 3,
  title: 'Neural Networks & Deep Learning',
  subtitle: 'From one neuron to deep networks',
  icon: 'network',
  lessons: [
    {
      id: 'm3-l1',
      title: 'The artificial neuron',
      minutes: 6,
      blocks: [
        { type: 'p', text: 'A neural network is built from a tiny unit: the **neuron**. It takes inputs, multiplies each by a **weight**, adds a **bias**, and squashes the result through an **activation function**. Drag the sliders:' },
        { type: 'widget', widget: 'neuron' },
        { type: 'keyterms', terms: [
          { term: 'Weight', def: 'How much each input matters. Learning = finding good weights.' },
          { term: 'Bias', def: 'A constant nudge that shifts the output up or down.' },
          { term: 'Activation function', def: 'A non-linear squash (ReLU, sigmoid, tanh) that lets networks learn complex shapes.' },
        ] },
      ],
    },
    {
      id: 'm3-l2',
      title: 'Layers, backprop & why it’s “deep”',
      minutes: 7,
      blocks: [
        { type: 'p', text: 'Stack neurons into **layers**, and layers into a network. Data flows in the **input layer**, through hidden layers, to the **output layer**. “**Deep**” just means *many* hidden layers.' },
        { type: 'h3', text: 'How it learns: backpropagation' },
        { type: 'p', text: '**Backpropagation** ("backprop") is the algorithm that figures out how much each weight contributed to the error, then nudges them all using gradient descent. You don’t need the calculus — just know: **forward pass** makes a prediction, **backward pass** assigns blame and updates weights.' },
        { type: 'analogy', text: 'A kitchen of many cooks makes a bad dish. Backprop is the head chef walking backward through the line saying “you over-salted, you under-cooked” so each cook adjusts next time.' },
        { type: 'callout', variant: 'key', text: 'Forward pass → predict. Compute loss → measure error. Backward pass (backprop) → update every weight. Repeat. That loop *is* deep learning.' },
      ],
    },
    {
      id: 'm3-l3',
      title: 'Architectures, embeddings & GPUs',
      minutes: 7,
      blocks: [
        { type: 'h2', text: 'Famous network shapes' },
        { type: 'ul', items: [
          '**CNN (Convolutional Neural Network)** — the king of **images**; learns edges → shapes → objects. (Powered the 2012 AlexNet moment.)',
          '**RNN / LSTM** — older designs for **sequences** (text, audio) that read one step at a time. Mostly replaced by Transformers.',
          '**Transformer** — the modern architecture behind all big language models. We’ll dig in next module.',
        ] },
        { type: 'h2', text: 'Embeddings: meaning as numbers' },
        { type: 'p', text: 'Neural nets turn words, images, and more into **embeddings** — points in space where similar things sit close together. Hover the points:' },
        { type: 'widget', widget: 'embedding-space' },
        { type: 'h2', text: 'Why GPUs matter' },
        { type: 'p', text: 'Training does billions of multiply-add operations. **GPUs** (and Google’s **TPUs**) do thousands of these in parallel, turning years of CPU work into days. This is why **NVIDIA** became one of the most valuable companies on Earth — they sell the “shovels” for the AI gold rush.' },
        { type: 'callout', variant: 'tip', text: 'The unofficial motto: *“Stack more layers, add more data, buy more GPUs.”* Scaling has been shockingly effective.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm3-q1',
      type: 'multi',
      prompt: 'What does a single neuron do to its inputs?',
      options: ['Multiplies each by a weight', 'Adds a bias', 'Applies an activation function', 'Stores them in a database'],
      correct: [0, 1, 2],
      explanation: 'Weighted sum + bias → activation. No database involved.',
    },
    {
      id: 'm3-q2',
      type: 'single',
      prompt: 'What does backpropagation do?',
      options: ['Renders graphics', 'Figures out how to adjust each weight to reduce error', 'Splits the dataset', 'Chooses the learning rate automatically'],
      correct: [1],
      explanation: 'Backprop assigns “blame” to weights and updates them via gradient descent.',
    },
    {
      id: 'm3-q3',
      type: 'single',
      prompt: 'Which architecture is most associated with image recognition?',
      options: ['CNN', 'RNN', 'Decision Tree', 'kNN'],
      correct: [0],
      explanation: 'Convolutional Neural Networks excel at images.',
    },
    {
      id: 'm3-q4',
      type: 'single',
      prompt: 'Why are GPUs central to deep learning?',
      options: ['They store more data', 'They do massive parallel math fast', 'They write the code', 'They reduce overfitting'],
      correct: [1],
      explanation: 'GPUs parallelize the billions of multiply-add operations training requires.',
    },
  ],
  resources: [
    { label: '3Blue1Brown: “But what is a neural network?” (YouTube)', url: 'https://www.youtube.com/watch?v=aircAruvnKk', kind: 'video', free: true },
    { label: 'TensorFlow Playground — train a net in your browser', url: 'https://playground.tensorflow.org/', kind: 'project', free: true },
    { label: 'Michael Nielsen: “Neural Networks and Deep Learning” (free online book)', url: 'http://neuralnetworksanddeeplearning.com/', kind: 'article', free: true },
  ],
};
