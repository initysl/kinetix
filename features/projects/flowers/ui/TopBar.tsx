import { motion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

export function TopBar({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) {
  return (
    <header className='flex items-center justify-between px-5 pt-8 pb-2'>
      <motion.button
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
        className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors'
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <AnimatedMenuIcon isOpen={isOpen} />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors'
        aria-label='Search'
      >
        <Search className='w-5 h-5 text-gray-700' />
      </motion.button>
    </header>
  );
}

function AnimatedMenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.div
      key={isOpen ? 'x' : 'menu'}
      initial={{ opacity: 0, rotate: isOpen ? -90 : 90 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      {isOpen ? (
        <X className='w-5 h-5 text-gray-800' />
      ) : (
        <Menu className='w-5 h-5 text-gray-800' />
      )}
    </motion.div>
  );
}
