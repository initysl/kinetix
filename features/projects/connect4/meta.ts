import type { ProjectRecord } from '@/content/types';

export const connect4Meta: ProjectRecord = {
  id: 4,
  slug: 'connect4',
  title: 'Connect4',
  eyebrow: 'Game',
  summary: 'A tactical game of connect four.',
  description:
    'A highly polished, tactile, physical-style Connect Four tabletop arena. Features customizable best-of-series formats, smart depth-calculated computer opponents (using a local Minimax engine), complete keyboard accessibility, and dynamic event configurations including Rocky Obstacles, speed Blitz setups, and random Volcanic debris showers.',
  tags: ['Minimax AI', 'Interactive Loop', 'Tabletop Game'],
  accent: '#1e1b4b', // Championship deep indigo coordination
  preview: {
    kind: 'image',
    src: '/projects/connect4/connect4.jpg',
    alt: 'Championship Connect Four board game interface.',
  },
  stats: [
    { label: 'Surface', value: 'Responsive Desktop & Mobile' },
    { label: 'Focus', value: 'Minimax Engine & State Persistence' },
    { label: 'Route', value: '/projects/connect4' },
  ],
  credit: 'https://youtube.com/shorts/s8TB6Dpq4jQ?si=NLuJOPo2ihJgVOYw',
};
