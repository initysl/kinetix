import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SideNavigation } from './ui/SideNavigation';
import { StoreFront } from './ui/StoreFront';

export default function Flowers() {
  const [isOpen, setIsOpen] = useState(false);

  // Smooth toggle handler
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    // Outer Container - Centers for desktop, full bleed on mobile
    <div className='min-h-screen bg-gray-50 flex items-center justify-center sm:p-8'>
      {/* 
        Mobile Device Frame Constraint
        In a Next.js environment, this would define your global layout shell on mobile, 
        and you could adapt the width constraint for desktop via media queries.
      */}
      <div className='w-full max-w-md h-[100dvh] sm:h-[850px] relative overflow-hidden sm:rounded-[36px] sm:shadow-2xl sm:border-[4px] border-slate-900 bg-[#214F3B]'>
        {/* Navigation Drawer (Background Layer) */}
        <SideNavigation isOpen={isOpen} />

        {/* Foreground App View (The Scalable 'Card') */}
        <motion.div
          animate={{
            scale: isOpen ? 0.85 : 1,
            x: isOpen ? '65%' : '0%',
            borderRadius: isOpen ? '32px' : '0px', // On mobile '0px', on constrained desktop shell we adapt later
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
          className='absolute inset-0 z-20 bg-[#F9FAFB] shadow-[-10px_0_30px_rgba(0,0,0,0.15)] overflow-y-auto flex flex-col'
          style={{
            // To ensure the border radius adapts cleanly when placed over the white bg
            borderBottomLeftRadius: isOpen ? '32px' : '0px',
            borderTopLeftRadius: isOpen ? '32px' : '0px',
          }}
        >
          {/* Transparent Overlay to Catch Clicks when Menu is Open */}
          {isOpen && (
            <div
              className='absolute inset-0 z-50 bg-black/5'
              onClick={() => setIsOpen(false)}
            />
          )}

          <StoreFront isOpen={isOpen} toggleMenu={toggleMenu} />
        </motion.div>
      </div>
    </div>
  );
}
