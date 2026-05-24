import React from 'react';
import { motion } from 'framer-motion';
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

export function SideNavigation({ isOpen }: { isOpen: boolean }) {
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

  return (
    <div className='absolute inset-0 z-10 w-full h-full p-8 pt-16 flex flex-col text-green-50 overflow-y-auto'>
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className='flex items-center space-x-4 mb-12 relative z-0'
      >
        <div className='w-14 h-14 bg-white/20 rounded-full flex items-center justify-center p-1'>
          <img
            src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
            alt='Profile'
            className='w-full h-full object-cover rounded-full'
          />
        </div>
        <div>
          <h3 className='font-semibold text-lg text-white'>Alex Morgan</h3>
          <p className='text-sm text-green-100 flex items-center mt-0.5'>
            Premium Member
          </p>
        </div>
      </motion.div>

      {/* Nav Links */}
      <nav className='flex-1 space-y-7 pl-2'>
        {navItems.map((item, index) => {
          const delay = 0.15 + index * 0.05; // Stagger animation
          const Icon = item.icon;
          return (
            <motion.a
              href='#'
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ delay, duration: 0.3 }}
              className={`flex items-center space-x-4 text-[17px] font-medium tracking-wide transition-colors ${item.isDanger ? 'hover:text-red-300 mt-12' : 'hover:text-white'}`}
            >
              <Icon className='w-6 h-6 opacity-80' strokeWidth={1.75} />
              <span>{item.label}</span>
            </motion.a>
          );
        })}
      </nav>
    </div>
  );
}
