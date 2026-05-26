import type { ProjectRecord } from '@/content/types';

export const connect4Meta: ProjectRecord = {
  id: 4,
  slug: 'connect4',
  title: 'Connect4',
  eyebrow: 'Travel Discovery',
  summary:
    'A swipe-first destination concept with stacked cards, immersive imagery, and tactile motion.',
  description:
    'An immersive travel discovery interface built around vertical swipe gestures, layered place cards, and a mobile-first detail surface.',
  tags: ['Motion', 'Cards'],
  accent: '#17342F',
  preview: {
    kind: 'image',
    src: '/projects/connect4/connect4.jpg',
    alt: 'Preview of the Flowers interface.',
  },
  stats: [
    { label: 'Surface', value: 'Mobile' },
    { label: 'Focus', value: 'Motion' },
    { label: 'Route', value: '/projects/connect4' },
  ],
  credit: 'https://youtube.com/shorts/s8TB6Dpq4jQ?si=NLuJOPo2ihJgVOYw',
};
