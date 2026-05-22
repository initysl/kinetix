'use client';

import { LocateFixed } from 'lucide-react';

export function TopBar() {
  return (
    <div className='flex shrink-0 items-center justify-between'>
      <div>
        <h1 className='text-xl font-semibold tracking-tight text-white'>
          Where To Go
        </h1>
        <p className='mt-0.5 text-sm text-white/60'>Lviv</p>
      </div>

      <button className='flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:bg-white/90'>
        <LocateFixed size={18} />
      </button>
    </div>
  );
}
