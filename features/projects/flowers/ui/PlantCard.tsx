import React from 'react';
import { Heart, Sun, Droplets, Leaf } from 'lucide-react';

export interface PlantCardProps {
  name: string;
  price: string;
  image: string;
  tag: string;
  color: string;
  imageClassName?: string;
  sunlight?: string[];
  watering?: string;
  cycle?: string;
}

export function PlantCard({
  name,
  price,
  image,
  tag,
  color,
  sunlight,
  watering,
  cycle,
  imageClassName = 'h-[140%] object-contain mix-blend-multiply',
}: PlantCardProps) {
  return (
    <div className='bg-white rounded-[24px] p-4 flex flex-col relative shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow'>
      <button className='absolute right-4 top-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors'>
        <Heart className='w-4 h-4' />
      </button>
      <div className='h-32 mb-4 bg-gray-50 rounded-[18px] relative overflow-hidden flex items-center justify-center'>
        <img src={image} className={imageClassName} alt={name} />
      </div>
      <span className='text-[11px] font-semibold tracking-wider uppercase text-gray-500 mb-1'>
        {tag}
      </span>
      <h3
        className='font-bold text-gray-900 text-[15px] leading-tight mb-2 line-clamp-1'
        title={name}
      >
        {name}
      </h3>

      {/* Botanical Info */}
      <div className='flex items-center gap-2 mb-3 text-[10px] text-gray-500 font-medium'>
        {sunlight && sunlight.length > 0 && (
          <div className='flex items-center gap-0.5' title='Sunlight'>
            <Sun className='w-3 h-3 text-orange-400' />
            <span className='truncate max-w-10 capitalize'>{sunlight[0]}</span>
          </div>
        )}
        {watering && (
          <div className='flex items-center gap-0.5' title='Watering'>
            <Droplets className='w-3 h-3 text-blue-400' />
            <span className='truncate max-w-10'>{watering}</span>
          </div>
        )}
      </div>

      <div className='flex items-center justify-between mt-auto pt-2 border-t border-gray-50'>
        <div
          className='w-5 h-5 rounded-full shadow-inner'
          style={{ backgroundColor: color }}
        ></div>
        <span className='font-medium text-[15px]'>{price}</span>
      </div>
    </div>
  );
}
