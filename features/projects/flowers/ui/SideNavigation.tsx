import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  LayoutGrid,
  Wallet,
  Gift,
  RefreshCcw,
  MapPin,
  Heart,
  HelpCircle,
  LogOut,
} from 'lucide-react';

const navItems = [
  { icon: LayoutGrid, label: 'Categories' },
  { icon: Wallet, label: 'Wallet' },
  { icon: Gift, label: 'Gift Ideas' },
  { icon: RefreshCcw, label: 'Subscription' },
  { icon: MapPin, label: 'Store Locator' },
  { icon: Heart, label: 'Loyalty Program' },
  { icon: HelpCircle, label: 'Help & Support' },
  { icon: LogOut, label: 'Logout', isDanger: true },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.1,
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
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 28 },
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: { duration: 0.15 },
  },
};

const profileVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 280,
      damping: 26,
      delay: 0.05,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: 0.15 },
  },
};

export function SideNavigation({ isOpen }: { isOpen: boolean }) {
  return (
    <div className='absolute inset-0 z-10  h-full flex flex-col overflow-hidden'>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='nav-content'
            className='flex flex-col h-full px-8 pt-16 pb-10'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Profile */}
            <motion.div
              variants={profileVariants}
              className='flex items-center gap-4 mb-12'
            >
              <div className='w-14 h-14 rounded-full ring-2 ring-white/20 overflow-hidden shrink-0'>
                <img
                  src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              </div>
              <div>
                <h3 className='font-semibold text-[17px] text-white leading-tight'>
                  Alex Morgan
                </h3>
                <span className='text-xs text-green-200/80 mt-0.5 block'>
                  Premium Member
                </span>
              </div>
            </motion.div>

            <nav className='flex-1 flex flex-col gap-1'>
              {navItems.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.div key={item.label} variants={itemVariants}>
                    {/* Divider before logout */}
                    {item.isDanger && i > 0 && (
                      <div className='my-3 border-t border-white/10' />
                    )}
                    <motion.a
                      href='#'
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        flex items-center gap-4 px-3 py-2.5 rounded-2xl
                        text-[15px] font-medium tracking-wide
                        transition-colors duration-150
                        ${
                          item.isDanger
                            ? 'text-red-300/80 hover:text-red-300 hover:bg-red-500/10'
                            : 'text-green-50/80 hover:text-white hover:bg-white/8'
                        }
                      `}
                    >
                      <Icon
                        className='w-5.5 h-5.5 shrink-0'
                        strokeWidth={1.6}
                      />
                      <span>{item.label}</span>
                    </motion.a>
                  </motion.div>
                );
              })}
            </nav>

            <motion.p
              variants={itemVariants}
              className='text-[11px] text-green-200/30 mt-6'
            >
              Flowers v1.0
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
