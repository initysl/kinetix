import { whereToGoProjectMeta } from '@/features/projects/where-to-go/meta';
import { flowersMeta } from '@/features/projects/flowers/meta';
import { blogMeta } from '@/features/projects/blog/meta';
import { connect4Meta } from '@/features/projects/connect4/meta';
import type { ProjectRecord } from './types';

export type { ProjectPreview, ProjectRecord } from './types';

export const projects: ProjectRecord[] = [
  whereToGoProjectMeta,
  flowersMeta,
  blogMeta,
  connect4Meta,
];

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return projects.find((p) => p.slug === slug);
}
