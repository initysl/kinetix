import React from 'react';
import { Menu, X, Search } from 'lucide-react';

export function TopBar({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) {
  return (
    <header className='flex items-center justify-between px-6 py-6 pb-2 mt-4 sm:mt-0'>
      <button
        onClick={toggleMenu}
        className='p-3 -ml-3 rounded-full hover:bg-gray-200 transition-colors'
      >
        {isOpen ? (
          <X className='w-7 h-7 text-gray-800' />
        ) : (
          <Menu className='w-7 h-7 text-gray-800' />
        )}
      </button>
      <button className='p-3 -mr-3 rounded-full hover:bg-gray-200 transition-colors'>
        <Search className='w-6 h-6 text-gray-800' />
      </button>
    </header>
  );
}
