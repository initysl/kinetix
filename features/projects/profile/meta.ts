import type { ProjectRecord } from '@/content/types';

export const profileMeta: ProjectRecord = {
  id: 3,
  slug: 'profile-viewer',
  title: 'Profile Transition',
  eyebrow: 'Interactive Motion',
  summary:
    'A fluid, spring-physics-driven creator profile transition with integrated swipeable story card decks and organic visual morphs.',
  description:
    'An immersive interactive interface showcasing seamless layout morphing (via custom Framer Motion layoutId), adaptive dynamic theme styling, and a high-fidelity gesture-controlled spring card deck.',
  tags: ['Framer Motion', 'Shared Layout', 'Gestures', 'UI Design'],
  accent: '#31b3a5',
  preview: {
    kind: 'video',
    src: '/projects/profile/blog.mp4',
    alt: 'Preview of the interactive morphing profile transition.',
  },
  stats: [
    { label: 'Surface', value: 'Mobile' },
    { label: 'Focus', value: 'Dynamic Transitions' },
    { label: 'Route', value: '/projects/profile-viewer' },
  ],
  credit: 'https://youtube.com/shorts/s8TB6Dpq4jQ?si=NLuJOPo2ihJgVOYw',
};
