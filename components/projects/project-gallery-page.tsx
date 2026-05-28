'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { projects } from '@/content/projects';

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
        className='h-full w-full object-cover transition duration-700 group-hover:scale-105'
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
      unoptimized
      className='object-cover transition duration-700 group-hover:scale-105'
      sizes='(max-width: 768px) 100vw, 50vw'
    />
  );
}

export function ProjectGalleryPage() {
  return (
    <main className='min-h-screen bg-[#f3efe7] text-[#161410]'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-5 sm:px-6 lg:px-8 lg:py-8'>
        {/* HEADER */}
        <header className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl sm:rounded-3xl border border-black/5 bg-white/65 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md shadow-xs transition-all'>
          {/* Logo & Text Block */}
          <div className='flex items-center gap-3 w-full sm:w-auto'>
            <div className='relative shrink-0 w-10 s-10 sm:w-12 sm:h-12'>
              <Image
                src='/kinetix.svg'
                width={48}
                height={48}
                className='w-10 h-10 sm:w-12 sm:h-12 object-contain'
                alt='Kinetix'
                priority
              />
            </div>

            <div className='min-w-0'>
              <h1 className='text-base sm:text-lg font-bold tracking-tight text-gray-900 truncate'>
                Kinetix
              </h1>
              <p className='text-xs sm:text-sm text-black/60 truncate'>
                Frontend Engineering Works
              </p>
            </div>
          </div>

          {/* Showcase Counter Badge */}
          <span className='self-end sm:self-center shrink-0 rounded-full border border-black/10 bg-white px-3 py-1 text-xs sm:text-sm font-semibold text-black/70 shadow-sm'>
            {projects.length} showcases
          </span>
        </header>

        {/* GRID */}
        <section className='grid gap-5 lg:grid-cols-2 '>
          {projects.map((project, index) => {
            const href = `/projects/${project.slug}`;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                className='group relative flex items-center gap-4 rounded-3xl border border-black/10 bg-white px-5 py-4 duration-300 hover:border-black/20 transition-all hover:-translate-y-1  hover:shadow-md'
              >
                {/* 1. Preview Image/Video Container */}
                <div className='relative h-20 w-20 overflow-hidden rounded-2xl shrink-0 bg-slate-50 border border-slate-100/10'>
                  <ProjectPreview preview={project.preview} />
                </div>

                {/* 2. Metadata Content Column */}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-neutral-800 transition-colors duration-200 mt-0.5'>
                    {project.title}
                  </h3>
                  <p className='text-sm text-neutral-500  mt-0.5'>
                    {project.summary}
                  </p>

                  {project.credit && (
                    <p className='text-[10px] text-neutral-400 mt-1.5 font-mono uppercase tracking-wider truncate'>
                      UI Credit —{' '}
                      <span className=' transition-colors'>
                        {
                          project.credit
                            .replace(/^https?:\/\/(www\.)?/, '')
                            .split('/')[0]
                        }
                      </span>
                    </p>
                  )}
                </div>

                {/* 3. Redesigned Highly Polished Action Link Button */}
                <div className='shrink-0 pl-2'>
                  <Link
                    href={href}
                    aria-label={`View details for ${project.title}`}
                    className='relative flex items-center justify-center w-12 h-12 rounded-2xl border border-neutral-100  text-neutral-600  transition-all duration-300 active:scale-95 group/btn'
                  >
                    <ArrowUpRight
                      size={20}
                      className='relative z-10 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5'
                      strokeWidth={2.5}
                    />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
