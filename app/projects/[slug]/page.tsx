import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import WhereToGoProject from '@/features/projects/where-to-go';
import Flowers from '@/features/projects/flowers';
import Blog from '@/features/projects/blog';
import Connect4 from '@/features/projects/connect4';
import { getProjectBySlug } from '@/content/projects';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const projectComponents = {
  'where-to-go': WhereToGoProject,
  flowers: Flowers,
  blog: Blog,
  connect4: Connect4,
} as const;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project not found',
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const ProjectComponent =
    projectComponents[slug as keyof typeof projectComponents];

  if (!project || !ProjectComponent) {
    notFound();
  }

  return (
    <>
      <div className='pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex items-center justify-between p-2 '>
        <Link
          href='/'
          className='pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-2xl transition hover:bg-black/60'
        >
          <ArrowLeft size={16} />
          All projects
        </Link>

        <div className='pointer-events-auto rounded-full border border-white/14 bg-black/45 px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-xl'>
          {project.title}
        </div>
      </div>

      <ProjectComponent />
    </>
  );
}
