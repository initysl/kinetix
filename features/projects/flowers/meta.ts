import type { ProjectRecord } from '@/content/types';

export const flowersMeta: ProjectRecord = {
  id: 2,
  slug: 'flowers',
  title: 'Flowers',
  eyebrow: 'Travel Discovery',
  summary:
    'A swipe-first destination concept with stacked cards, immersive imagery, and tactile motion.',
  description:
    'An immersive travel discovery interface built around vertical swipe gestures, layered place cards, and a mobile-first detail surface.',
  tags: ['Motion', 'Cards'],
  accent: '#17342F',
  preview: {
    kind: 'video',
    src: '/projects/flowers/sidenav.mp4',
    alt: 'Preview of the Flowers interface.',
  },
  stats: [
    { label: 'Surface', value: 'Mobile' },
    { label: 'Focus', value: 'Motion' },
    { label: 'Route', value: '/projects/flowers' },
  ],
  credit: 'https://youtube.com/shorts/s8TB6Dpq4jQ?si=NLuJOPo2ihJgVOYw',
};
