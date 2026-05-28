import React from 'react';
import { Home, Heart, ShoppingBag, UserCircle } from 'lucide-react';

export function BottomBar() {
  return (
    <footer className='absolute bottom-0 w-full bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.06)] px-8 py-5 flex items-center justify-between z-30'>
      <button className='text-[#214F3B]'>
        <Home className='w-6.5 h-6.5' />
      </button>
      <button className='text-gray-400 hover:text-gray-900 transition-colors'>
        <Heart className='w-6.5 h-6.5' />
      </button>
      <button className='text-gray-400 hover:text-gray-900 transition-colors relative'>
        <ShoppingBag className='w-6.5 h-6.5' />
        <span className='absolute -top-1 right-0 w-3.5 h-3.5 bg-[#D95B4A] rounded-full border-2 border-white'></span>
      </button>
      <button className='text-gray-400 hover:text-gray-900 transition-colors'>
        <UserCircle className='w-6.5 h-6.5' />
      </button>
    </footer>
  );
}
