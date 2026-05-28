import type { ProjectRecord } from '@/content/types';

export const sidebarMeta: ProjectRecord = {
  id: 2,
  slug: 'sidebar',
  title: 'Sidebar',
  eyebrow: 'Sidebar transition',
  summary:
    'A fluid transition for a sidebar interface, utilizing spring-based motion to create a natural and engaging user experience.',
  description:
    'A sidebar interface that smoothly transitions in and out of view using spring-based motion. The animation creates a natural and engaging user experience, with the sidebar sliding in from the left and fading in simultaneously. The transition is designed to be responsive and adaptable to different screen sizes, ensuring a consistent experience across devices.',
  tags: ['Motion', 'Cards'],
  accent: '#17342F',
  preview: {
    kind: 'video',
    src: '/projects/flowers/sidenav.mp4',
    alt: 'Preview of the sidebar transition animation.',
  },
  stats: [{ label: 'Route', value: '/projects/sidebar' }],
  credit: 'https://youtube.com/shorts/s8TB6Dpq4jQ?si=NLuJOPo2ihJgVOYw',
};
