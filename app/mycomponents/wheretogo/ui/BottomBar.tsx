'use client';

import { Bookmark, Filter, Home, Search } from 'lucide-react';

export function BottomBar() {
  return (
    <div className='flex  shrink-0 items-center justify-between'>
      <div className='flex items-center gap-5 rounded-full border border-white/10 bg-black/50 px-5 py-3.5 backdrop-blur-2xl'>
        <Home size={20} className='text-white' />
        <Search size={20} className='text-white/45' />
        <Bookmark size={20} className='text-white/45' />
      </div>

      <div className='flex items-center gap-2.5'>
        <button className='flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg'>
          <Filter size={18} />
        </button>
        <button className='flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg'>
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
}
