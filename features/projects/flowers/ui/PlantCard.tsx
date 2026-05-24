import React from 'react';
import { Heart } from 'lucide-react';

export interface PlantCardProps {
  name: string;
  price: string;
  image: string;
  tag: string;
  color: string;
  imageClassName?: string;
}

export function PlantCard({
  name,
  price,
  image,
  tag,
  color,
  imageClassName = 'h-[140%] object-contain mix-blend-multiply',
}: PlantCardProps) {
  return (
    <div className='bg-white rounded-[24px] p-4 flex flex-col relative shadow-sm border border-gray-100/50'>
      <button className='absolute right-4 top-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors'>
        <Heart className='w-4 h-4' />
      </button>
      <div className='h-32 mb-4 bg-gray-100 rounded-[18px] relative overflow-hidden flex items-center justify-center'>
        <img src={image} className={imageClassName} alt={name} />
      </div>
      <span className='text-[11px] font-semibold tracking-wider uppercase text-gray-500 mb-1'>
        {tag}
      </span>
      <h3 className='font-bold text-gray-900 text-lg mb-1'>{name}</h3>
      <div className='flex items-center justify-between mt-auto pt-2'>
        <div
          className='w-6 h-6 rounded-full'
          style={{ backgroundColor: color }}
        ></div>
        <span className='font-medium text-[15px]'>{price}</span>
      </div>
    </div>
  );
}
