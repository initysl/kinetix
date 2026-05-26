'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { SideNavigation } from './ui/SideNavigation';
import { StoreFront } from './ui/StoreFront';

const springConfig = { type: 'spring', stiffness: 280, damping: 32 } as const;

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Swipe to close
  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.x < -60 && info.velocity.x < -100) {
      closeMenu();
    }
  };

  return (
    <div className='min-h-screen bg-[#214F3B] flex items-center justify-center'>
      <div className='relative w-full h-dvh sm:shadow-[0_32px_80px_rgba(0,0,0,0.45)] overflow-hidden bg-[#214F3B]'>
        <SideNavigation isOpen={isOpen} />
        <motion.div
          drag={isOpen ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.2, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{
            scale: isOpen ? 0.84 : 1,
            x: isOpen ? '62%' : '0%',
            borderRadius: isOpen ? '32px' : '0px',
          }}
          transition={springConfig}
          className='absolute inset-0 z-20 bg-[#F9FAFB] overflow-y-auto flex flex-col'
          style={{
            boxShadow: '-12px 0 40px rgba(0,0,0,0.18)',
          }}
        >
          {isOpen && (
            <motion.div
              key='overlay'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 z-50 cursor-pointer'
              onClick={closeMenu}
            />
          )}

          <StoreFront isOpen={isOpen} toggleMenu={toggleMenu} />
        </motion.div>
      </div>
    </div>
  );
}
