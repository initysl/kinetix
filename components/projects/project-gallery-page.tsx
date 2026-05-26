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
        <header className='flex items-center justify-between rounded-3xl border border-black/8 bg-white/65 px-4 py-3 backdrop-blur'>
          <div className='flex items-center gap-3'>
            <Image
              src='/kinetix.svg'
              width={50}
              height={50}
              alt='Kinetix'
              priority
            />
            <div>
              <h1 className='text-lg font-semibold'>Kinetix</h1>
              <p className='text-sm text-black/60'>
                Frontend Engineering Works
              </p>
            </div>
          </div>

          <span className='rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-black/70'>
            {projects.length} showcases
          </span>
        </header>

        {/* GRID */}
        <section className='grid gap-5 sm:grid-cols-2'>
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
              >
                <Link
                  href={href}
                  className='group flex items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 transition-all hover:-translate-y-1 hover:border-black/20 hover:shadow-md'
                >
                  <div className='relative h-14 w-14 overflow-hidden rounded-xl'>
                    <ProjectPreview preview={project.preview} />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium'>{project.title}</h3>
                    <p className='text-sm text-black/50 line-clamp-1'>
                      {project.summary}
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className='shrink-0 text-black/60'
                  >
                    <ArrowUpRight />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
