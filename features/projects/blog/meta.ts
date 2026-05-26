import type { ProjectRecord } from '@/content/types';

export const blogMeta: ProjectRecord = {
  id: 3,
  slug: 'blog',
  title: 'Blog',
  eyebrow: 'Travel Discovery',
  summary:
    'A swipe-first destination concept with stacked cards, immersive imagery, and tactile motion.',
  description:
    'An immersive travel discovery interface built around vertical swipe gestures, layered place cards, and a mobile-first detail surface.',
  tags: ['Motion', 'Cards'],
  accent: '#17342F',
  preview: {
    kind: 'video',
    src: '/projects/blog/blog.mp4',
    alt: 'Preview of the Flowers interface.',
  },
  stats: [
    { label: 'Surface', value: 'Mobile' },
    { label: 'Focus', value: 'Motion' },
    { label: 'Route', value: '/projects/blog' },
  ],
  credit: 'https://youtube.com/shorts/s8TB6Dpq4jQ?si=NLuJOPo2ihJgVOYw',
};
