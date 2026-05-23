import { whereToGoProjectMeta } from '@/features/projects/where-to-go/meta';

export type ProjectPreview = {
  kind: 'video' | 'image';
  src: string;
  alt: string;
  poster?: string;
};

export type ProjectRecord = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  tags: ReadonlyArray<string>;
  accent: string;
  preview: ProjectPreview;
  stats: ReadonlyArray<{
    label: string;
    value: string;
  }>;
};

export const projects: ProjectRecord[] = [
  {
    ...whereToGoProjectMeta,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
