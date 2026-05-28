'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Wifi, Battery, ShieldAlert as WifiOff } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // 12-hour format
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-4 md:p-8 selection:bg-teal-500 selection:text-white'>
      {/* Decorative environment details mimicking a design portfolio showcase */}
      <div className='absolute top-4 left-6 hidden xl:block font-display text-white/50 text-xs tracking-widest font-semibold uppercase'>
        Framer Motion Portfolio
      </div>
      <div className='absolute top-4 right-6 hidden xl:block font-display text-white/50 text-xs tracking-widest font-semibold uppercase'>
        Spring Physics Sandbox
      </div>

      <div className='relative w-full max-w-97.5 h-205 rounded-[48px] bg-slate-950 p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-slate-800/80 ring-1 ring-white/10 flex flex-col overflow-hidden'>
        {/* Front-Facing Camera / Dynamic Island notch simulation */}
        <div className='absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center p-1 border border-white/5 shadow-inner'>
          <div className='w-2.5 h-2.5 bg-slate-900 rounded-full border border-teal-900/40 ml-auto mr-2 flex items-center justify-center'>
            <div className='w-1 h-1 bg-teal-500/80 rounded-full'></div>
          </div>
        </div>

        {/* Home Indicator bar on iOS style */}
        <div className='absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/35 rounded-full z-50'></div>

        {/* Upper Status Bar Frame */}
        <div className='w-full h-8 flex items-center justify-between px-6 text-[11px] font-semibold text-slate-800 bg-white select-none z-40 pt-1'>
          {/* Time Display */}
          <span className='font-sans font-medium'>{time || '12:00 PM'}</span>

          {/* System Icons */}
          <div className='flex items-center gap-1.5 pt-0.5'>
            <svg
              className='w-4 h-4 fill-slate-800'
              viewBox='0 0 24 24'
              width='16'
              height='16'
            >
              <path d='M12 3c-1.2 0-2.4.3-3.5.9-.6.3-1.2.7-1.8 1.1-.3.2-.3.6-.1.8.2.3.6.3.8.1.5-.4 1.1-.7 1.6-1 .9-.5 2-.8 3-.8 3.3 0 6 2.7 6 6s-2.7 6-6 6c-1.3 0-2.5-.4-3.6-1.2-.3-.2-.7-.2-.9.1-.2.3-.2.7.1.9 1.3.9 2.8 1.4 4.4 1.4 4.4 0 8-3.6 8-8s-3.6-8-8-8zM7.5 12c.3 0 .5-.2.5-.5V8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v3.5c0 .3.2.5.5.5zM4.5 14c.3 0 .5-.2.5-.5v-4c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4c0 .3.2.5.5.5zM1.5 16c.3 0 .5-.2.5-.5v-4c0-.3-.2-.5-.5-.5s-.5.2-.5.5v4c0 .3.2.5.5.5z' />
            </svg>
            <Wifi className='w-3.5 h-3.5' strokeWidth={2.5} />
            <Battery className='w-3.5 h-3.5 rotate-90' strokeWidth={2.5} />
          </div>
        </div>

        {/* Content Box wrapping screen space */}
        <div className='w-full h-full bg-slate-50 flex flex-col relative overflow-hidden rounded-[36px]'>
          {children}
        </div>
      </div>

      {/* Instructional note below device */}
      <div className='mt-6 text-center max-w-sm text-white/70 text-xs select-none'>
        <p className='font-medium'>💡 Interactive Proof of Concept</p>
        <p className='mt-1 font-sans text-[11px] leading-relaxed opacity-80'>
          Click the Jane Smith circular banner profile card in the feed to
          trigger the spring-interpolated shared layout transition, then toggle
          follow or flick the active story card deck.
        </p>
      </div>
    </div>
  );
}
