import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, FolderOpen, Sparkles } from 'lucide-react';
import { projects } from '@/content/projects';

function ProjectPreview({
  preview,
}: {
  preview: {
    kind: 'video' | 'image';
    src: string;
    alt: string;
    poster?: string;
  };
}) {
  if (preview.kind === 'video') {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        poster={preview.poster}
        aria-label={preview.alt}
        className='h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]'
      >
        <source src={preview.src} type='video/mp4' />
      </video>
    );
  }

  return (
    <Image
      src={preview.src}
      alt={preview.alt}
      fill
      sizes='(max-width: 768px) 100vw, 50vw'
      className='h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]'
    />
  );
}

export function ProjectGalleryPage() {
  const [featuredProject, ...otherProjects] = projects;

  return (
    <main className='min-h-screen bg-[#f3efe7] text-[#161410]'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-5 sm:px-6 lg:px-8 lg:py-8'>
        <header className='flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-black/8 bg-white/65 px-4 py-3 backdrop-blur md:px-5'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#161410] text-white'>
              <Sparkles size={18} />
            </div>
            <div>
              <p className='text-sm font-medium text-black/55'>Gallery</p>
              <h1 className='text-lg font-semibold tracking-tight'>Kinetix</h1>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2 text-sm text-black/65'>
            <span className='rounded-full border border-black/10 bg-white px-3 py-1.5'>
              {projects.length} showcase{projects.length === 1 ? '' : 's'}
            </span>
            <span className='rounded-full border border-black/10 bg-[#d5ebdf] px-3 py-1.5'>
              Built in one deploy
            </span>
          </div>
        </header>

        <section className='grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'>
          <div className='flex min-h-[24rem] flex-col justify-between rounded-[2rem] border border-black/8 bg-[#161410] px-6 py-6 text-white sm:px-8 sm:py-8'>
            <div className='space-y-6'>
              <span className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-white/72'>
                <FolderOpen size={16} />
                UI experiments under one root app
              </span>

              <div className='space-y-4'>
                <h2 className='max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl'>
                  A single gallery for every high-craft interface study.
                </h2>
                <p className='max-w-2xl text-base leading-7 text-white/70'>
                  Each project lives on its own route, keeps its own interaction
                  model, and stays isolated from the rest of the collection.
                </p>
              </div>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              {featuredProject.stats.map((stat) => (
                <div
                  key={stat.label}
                  className='rounded-2xl border border-white/10 bg-white/6 px-4 py-4'
                >
                  <p className='text-sm text-white/55'>{stat.label}</p>
                  <p className='mt-1 text-sm font-medium text-white'>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`/projects/${featuredProject.slug}`}
            className='group relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-black/8 bg-black text-white'
          >
            <ProjectPreview preview={featuredProject.preview} />
            <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/72' />
            <div className='absolute inset-x-0 bottom-0 space-y-4 p-6 sm:p-8'>
              <div className='flex flex-wrap gap-2'>
                {featuredProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className='flex items-end justify-between gap-4'>
                <div className='max-w-xl space-y-2'>
                  <p className='text-sm font-medium text-white/60'>
                    {featuredProject.eyebrow}
                  </p>
                  <h3 className='text-3xl font-semibold tracking-tight'>
                    {featuredProject.title}
                  </h3>
                  <p className='text-sm leading-6 text-white/70'>
                    {featuredProject.summary}
                  </p>
                </div>
                <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg transition group-hover:translate-x-1'>
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </div>
          </Link>
        </section>

        <section className='space-y-4'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-sm font-medium text-black/50'>Collection</p>
              <h2 className='text-2xl font-semibold tracking-tight'>
                Routed showcases
              </h2>
            </div>

            <Link
              href={`/projects/${featuredProject.slug}`}
              className='inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white'
            >
              Open featured project
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className='grid gap-4'>
            {[featuredProject, ...otherProjects].map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className='group grid overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)] md:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)]'
              >
                <div className='flex flex-col justify-between gap-8 p-6 sm:p-8'>
                  <div className='space-y-4'>
                    <div className='flex flex-wrap items-center gap-2 text-sm text-black/50'>
                      <span className='rounded-full border border-black/10 bg-[#f3efe7] px-3 py-1.5'>
                        {project.eyebrow}
                      </span>
                      <span className='rounded-full border border-black/10 px-3 py-1.5'>
                        {project.slug}
                      </span>
                    </div>

                    <div className='space-y-3'>
                      <h3 className='text-2xl font-semibold tracking-tight'>
                        {project.title}
                      </h3>
                      <p className='max-w-2xl text-sm leading-6 text-black/65'>
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div className='flex flex-wrap gap-2'>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className='rounded-full border border-black/10 px-3 py-1.5 text-sm text-black/60'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className='inline-flex items-center gap-2 text-sm font-medium text-black/70'>
                      View project
                      <ArrowUpRight
                        size={16}
                        className='transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                      />
                    </span>
                  </div>
                </div>

                <div className='relative min-h-[18rem] overflow-hidden bg-[#161410]'>
                  <ProjectPreview preview={project.preview} />
                  <div className='absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/55' />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
