import { useState } from 'react';
import Image from 'next/image';
import { Heart, Droplets, Sun, RefreshCw, Star } from 'lucide-react';

export interface PlantCardProps {
  id?: number;
  common_name: string;
  scientific_name?: string[];
  default_image?: {
    original_url?: string;
    regular_url?: string;
    medium_url?: string;
  };
  sunlight?: string[];
  watering?: string;
  cycle?: string;
  price?: string;
  rating?: number;
}

export function PlantCard({
  common_name,
  scientific_name,
  default_image,
  sunlight,
  watering,
  cycle,
  price = '$39.00',
  rating = 4.8,
}: PlantCardProps) {
  const [favorite, setFavorite] = useState(false);

  const image =
    default_image?.regular_url ||
    default_image?.medium_url ||
    default_image?.original_url ||
    '/placeholder-plant.png';

  return (
    <div className='group relative flex flex-col h-full overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.02)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-8px_rgba(15,23,42,0.08)]'>
      {/* IMAGE CONTAINER WITH ASPECT RATIO LOCK */}
      <div className='relative aspect-4/3 w-full overflow-hidden bg-slate-50 shrink-0 select-none'>
        {/* Soft immersive dark lens */}
        <div className='absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/10 pointer-events-none z-10' />

        <Image
          src={image}
          alt={common_name}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          className='object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106'
          priority
        />

        {/* Dynamic Category Pill */}
        <div className='absolute top-4 left-4 z-10 rounded-full bg-black/35 backdrop-blur-md px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white'>
          Indoor Plant
        </div>

        {/* Spring favorite button toggle */}
        <button
          onClick={() => setFavorite(!favorite)}
          className='absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-90 cursor-pointer shadow-sm'
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              favorite
                ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]'
                : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* DETAILED CONTENT HUB - FLOATING BENEATH THE RATIO STAGE */}
      <div className='p-5 flex flex-col grow justify-between gap-4'>
        {/* Header Metadata block */}
        <div className='space-y-2'>
          <div className='flex items-start justify-between gap-2.5'>
            <div className='min-w-0'>
              <h3 className='text-[17px] font-extrabold text-slate-850 tracking-tight leading-tight truncate'>
                {common_name}
              </h3>
              {scientific_name?.[0] && (
                <p className='text-[11px] italic text-slate-400 font-semibold truncate mt-0.5'>
                  {scientific_name[0]}
                </p>
              )}
            </div>

            <span className='shrink-0 rounded-xl bg-slate-900/5 text-slate-850 font-extrabold text-sm px-2.5 py-0.5'>
              {price}
            </span>
          </div>

          <div className='flex items-center gap-1.5 text-xs text-slate-500 font-semibold select-all'>
            <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
            <span className='font-bold'>{rating}</span>
            <span className='text-slate-350'>•</span>
            <span className='text-[9px] uppercase tracking-wider font-extrabold text-[#3fb5a3]'>
              Guaranteed Health
            </span>
          </div>

          <p className='text-[11.5px] leading-relaxed text-slate-400 line-clamp-2'>
            A beautiful ornamental plant selection perfect for modern interiors,
            promoting rich oxygen flow.
          </p>
        </div>

        {/* SPECIFICATIONS FEATURE STRIP */}
        <div className='flex flex-wrap items-center gap-1.5 pt-1'>
          {sunlight?.[0] && (
            <div className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700'>
              <Sun className='h-3 w-3 text-amber-500' />
              <span className='capitalize'>{sunlight[0]}</span>
            </div>
          )}

          {watering && (
            <div className='inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-extrabold text-sky-700'>
              <Droplets className='h-3 w-3 text-sky-500' />
              <span className='capitalize'>{watering}</span>
            </div>
          )}

          {cycle && (
            <div className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700'>
              <RefreshCw className='h-3 w-3 text-emerald-500' />
              <span className='capitalize'>{cycle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
