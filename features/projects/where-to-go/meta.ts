import type { ProjectRecord } from '@/content/types';

export const whereToGoProjectMeta: ProjectRecord = {
  id: 1,
  slug: 'where-to-go',
  title: 'Where To Go',
  eyebrow: 'Travel Discovery',
  summary: 'A swipe-first destination concept with stacked cards.',
  description:
    'An immersive travel discovery interface built around vertical swipe gestures, layered place cards, and a mobile-first detail surface.',
  tags: ['Motion', 'Cards'],
  accent: '#17342F',
  preview: {
    kind: 'video',
    src: '/projects/where-to-go/wtg.mp4',
    alt: 'Preview of the Where To Go travel discovery interface.',
  },
  stats: [
    { label: 'Surface', value: 'Mobile' },
    { label: 'Focus', value: 'Motion' },
    { label: 'Route', value: '/projects/where-to-go' },
  ],
  credit: 'https://dribbble.com/shots/25468979--Where-To-Go-Cards-Animation',
};
