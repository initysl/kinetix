import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  LayoutGrid,
  Gift,
  RefreshCcw,
  MapPin,
  Heart,
  LogOut,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { icon: LayoutGrid, label: 'Categories' },
  { icon: Gift, label: 'Gift Flower' },
  { icon: RefreshCcw, label: 'Subscription' },
  { icon: MapPin, label: 'Store' },
  { icon: Heart, label: 'Favourite' },
  { icon: LogOut, label: 'Logout', isDanger: true },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 320, damping: 26 },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: 0.15 },
  },
};

const profileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, x: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24,
      delay: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: -12,
    transition: { duration: 0.15 },
  },
};

export function SideNavigation({ isOpen }: { isOpen: boolean }) {
  return (
    <div className='absolute inset-0 z-10 h-full flex flex-col overflow-hidden select-none'>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='nav-content'
            className='flex flex-col h-full px-8 pt-18 pb-10 bg-[#162723] border-r border-white/5 shadow-2xl'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* AMBIENT GLOW BACKDROP */}
            <div className='absolute top-0 left-0 w-44 h-44 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none' />

            {/* Profile Element */}
            <motion.div
              variants={profileVariants}
              className='flex items-center gap-4 mb-10 z-10'
            >
              <div className='w-13 h-13 rounded-full ring-2 ring-emerald-400/20 overflow-hidden shrink-0 border border-white/10 relative'>
                <Image
                  src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  width={100}
                  height={100}
                  alt='Profile picture'
                  className='w-full h-full object-cover'
                />
              </div>
              <div>
                <h3 className='font-extrabold text-[16px] text-white leading-tight'>
                  Alex Morgan
                </h3>
                <span className='inline-flex items-center gap-1 text-[10px] text-emerald-300 font-bold tracking-wider mt-1'>
                  <Sparkles className='w-2.5 h-2.5' /> Premium Member
                </span>
              </div>
            </motion.div>

            {/* Navigation item lists */}
            <nav className='flex-1 flex flex-col gap-1 z-10'>
              {navItems.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.div key={item.label} variants={itemVariants}>
                    {/* Visual Segment Line Divider before logout action */}
                    {item.isDanger && i > 0 && (
                      <div className='my-3 border-t border-white/5' />
                    )}

                    <motion.a
                      href='#'
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-3.5 px-4 py-2.5 rounded-2xl
                        text-[14px] font-bold tracking-wider 
                        transition-all duration-150
                        ${
                          item.isDanger
                            ? 'text-red-300/85 hover:text-red-300 hover:bg-rose-500/10'
                            : 'text-slate-200/80 hover:text-white hover:bg-white/8'
                        }
                      `}
                    >
                      <Icon
                        className='w-5 h-5 shrink-0 text-emerald-400'
                        strokeWidth={2.4}
                      />
                      <span>{item.label}</span>
                    </motion.a>
                  </motion.div>
                );
              })}
            </nav>

            {/* App Footer Marker */}
            <motion.p
              variants={itemVariants}
              className='text-[9px] font-mono tracking-widest text-emerald-400/30 uppercase mt-6 border-t border-white/5 pt-4'
            >
              Flora Sanctuary v1.0
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
