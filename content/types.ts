export type ProjectPreview = {
  kind: 'video' | 'image';
  src: string;
  alt: string;
  poster?: string;
};

export type ProjectRecord = {
  id: number | null | undefined;
  credit: string;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  tags: ReadonlyArray<string>;
  accent: string;
  preview: ProjectPreview;
  stats: ReadonlyArray<{ label: string; value: string }>;
};
