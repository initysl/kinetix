'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { projects, getProjectBySlug } from '@/content/projects';

type Preview = {
  kind: 'video' | 'image';
  src: string;
  alt: string;
  poster?: string;
};

function ProjectPreview({ preview }: { preview: Preview }) {
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
      priority
      sizes='(max-width: 768px) 100vw, 50vw'
      unoptimized
      className='object-cover transition duration-700 group-hover:scale-[1.02] overflow-hidden'
    />
  );
}

export function ProjectGalleryPage() {
  const whereToGo = getProjectBySlug('where-to-go')!;
  const flowers = getProjectBySlug('flowers')!;
  const blog = getProjectBySlug('blog')!;

  if (!whereToGo || !flowers || !blog) return null;

  return (
    <main className='min-h-screen bg-[#f3efe7] text-[#161410]'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-5 sm:px-6 lg:px-8 lg:py-8'>
        <header className='flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-black/8 bg-white/65 px-4 py-3 backdrop-blur md:px-5'>
          <div className='flex items-center gap-3'>
            <Image
              src='/kinetix.svg'
              width={50}
              height={50}
              priority
              alt='Kinetix logo - Star'
              className='shrink-0'
            />
            <div>
              <p className='text-sm font-medium text-black/55'>Gallery</p>
              <h1 className='text-lg font-semibold tracking-tight'>Kinetix</h1>
            </div>
          </div>

          <div className='text-sm text-black/65'>
            <span className='rounded-full border border-black/10 bg-white px-3 py-1.5'>
              {projects.length} showcase
              {projects.length === 1 ? '' : 's'}
            </span>
          </div>
        </header>

        <h2 className='font-semibold text-black/50'>Collections</h2>

        <section className='grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'>
          {/* Where To Go card */}
          <div className='group relative min-h-96 overflow-hidden rounded-[2rem] border border-black/8 bg-black text-white'>
            <div className='absolute inset-0'>
              <ProjectPreview preview={whereToGo.preview} />
            </div>

            <div className='relative z-20 flex h-full flex-col justify-end p-6 sm:p-8'>
              <div className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {whereToGo.tags.map((tag) => (
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
                      {whereToGo.eyebrow}
                    </p>
                    <h3 className='text-3xl font-semibold tracking-tight'>
                      {whereToGo.title}
                    </h3>
                    <p className='text-sm leading-6 text-white/70'>
                      {whereToGo.summary}
                    </p>
                  </div>

                  <span className='relative z-30 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1'>
                    <Link
                      href={`/projects/${whereToGo.slug}`}
                      aria-label={`View ${whereToGo.title}`}
                      className='flex h-full w-full items-center justify-center rounded-full'
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </span>
                </div>

                <div className='relative z-30'>
                  <p className='text-xs font-medium text-white/70'>
                    UI animation prototype by{' '}
                    <a
                      href={whereToGo.credit}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='underline text-white/40 transition hover:text-white/70'
                    >
                      Mariia Petrovych
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flowers card */}
          <div className='group relative min-h-96 overflow-hidden rounded-[2rem] border border-black/8 bg-black text-white'>
            <div className='absolute inset-0'>
              <ProjectPreview preview={flowers.preview} />
            </div>

            <div className='relative z-20 flex h-full flex-col justify-end p-6 sm:p-8'>
              <div className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {flowers.tags.map((tag) => (
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
                      {flowers.eyebrow}
                    </p>
                    <h3 className='text-3xl font-semibold tracking-tight'>
                      {flowers.title}
                    </h3>
                    <p className='text-sm leading-6 text-white/70'>
                      {flowers.summary}
                    </p>
                  </div>

                  <span className='relative z-30 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1'>
                    <Link
                      href={`/projects/${flowers.slug}`}
                      aria-label={`View ${flowers.title}`}
                      className='flex h-full w-full items-center justify-center rounded-full'
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </span>
                </div>

                <div className='relative z-30'>
                  <p className='text-xs font-medium text-white/70'>
                    UI animation prototype by{' '}
                    <a
                      href={flowers.credit}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='underline text-white/40 transition hover:text-white/70'
                    >
                      {flowers.title}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Blog card */}
          <div className='group relative min-h-96 overflow-hidden rounded-[2rem] border border-black/8 bg-black text-white'>
            {/* Background Media Container */}
            <div className='absolute inset-0'>
              <ProjectPreview preview={blog.preview} />
            </div>

            {/* Content Overlay */}
            <div className='relative z-20 flex h-full flex-col justify-end p-6 sm:p-8'>
              <div className='space-y-4'>
                {/* Dynamic Tags Grid */}
                <div className='flex flex-wrap gap-2'>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur'
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Core Post Metadata */}
                <div className='flex items-end justify-between gap-4'>
                  <div className='max-w-xl space-y-2'>
                    <p className='text-sm font-medium text-white/60'>
                      {blog.eyebrow}
                    </p>
                    <h3 className='text-3xl font-semibold tracking-tight'>
                      {blog.title}
                    </h3>
                    <p className='text-sm leading-6 text-white/70'>
                      {blog.summary}
                    </p>
                  </div>

                  {/* Interactive Navigation Arrow */}
                  <span className='relative z-30 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1'>
                    <Link
                      href={`/projects/${blog.slug}`}
                      aria-label={`Read ${blog.title}`}
                      className='flex h-full w-full items-center justify-center rounded-full'
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </span>
                </div>

                {/* AI Bot Author Attribution */}
                <div className='relative z-30'>
                  <p className='text-xs font-medium text-white/70'>
                    AI article generated by{' '}
                    <a
                      href={blog.credit}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='underline text-white/40 transition hover:text-white/70'
                    >
                      {blog.credit}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
