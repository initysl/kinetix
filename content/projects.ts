import { whereToGoProjectMeta } from '@/features/projects/where-to-go/meta';
import { sidebarMeta } from '@/features/projects/sidebar/meta';
import { profileMeta } from '@/features/projects/profile/meta';
import { connect4Meta } from '@/features/projects/connect4/meta';
import type { ProjectRecord } from './types';

export type { ProjectPreview, ProjectRecord } from './types';

export const projects: ProjectRecord[] = [
  whereToGoProjectMeta,
  sidebarMeta,
  profileMeta,
  connect4Meta,
];

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return projects.find((p) => p.slug === slug);
}
