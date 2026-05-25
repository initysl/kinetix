import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Check, Plus, UserPlus } from 'lucide-react';
import { StoryCard } from '../types';
import CardDeck from './CardDeck';

interface ProfileViewProps {
  onBack: () => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
  stories: StoryCard[];
  onCycleStories: () => void;
  janeAvatar: string;
  key?: string;
}

export default function ProfileView({
  onBack,
  isFollowing,
  onToggleFollow,
  stories,
  onCycleStories,
  janeAvatar,
}: ProfileViewProps) {
  // Simple satellite metrics that pop out from behind Jane's avatar
  const statsBubbles = [
    {
      id: '15',
      value: '15',
      bg: 'bg-amber-400 border-amber-300 shadow-amber-400/30',
      pos: 'top-6 left-1.5 md:left-3',
    },
    {
      id: '28',
      value: '28',
      bg: 'bg-[#ea5d71] border-red-300 shadow-red-500/30',
      pos: 'top-0.5 right-2 md:right-4',
    },
    {
      id: '32',
      value: '32',
      bg: 'bg-[#3fb5a3] border-teal-300 shadow-teal-500/30',
      pos: 'top-11 -right-3 md:-right-1',
    },
    {
      id: '29',
      value: '29',
      bg: 'bg-indigo-400 border-indigo-300 shadow-indigo-500/30',
      pos: 'bottom-1.5 right-1 md:right-3',
    },
  ];

  return (
    <div className='flex flex-col h-full bg-white overflow-hidden relative'>
      {/* Morphing Header Banner serving as background layout wrapper */}
      <motion.div
        layoutId='profile-header-bg'
        className='w-full h-64 rounded-b-[48px] bg-linear-to-r from-[#31b3a5] to-[#40bdae] relative flex flex-col justify-between p-5 pb-8 overflow-hidden z-20 shadow-[0_15px_30px_-5px_rgba(49,179,165,0.25)]'
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 24,
        }}
      >
        {/* Sun ornament expanding inside background container */}
        <motion.div
          layoutId='profile-sun'
          className='absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full'
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24,
          }}
        />

        {/* Floating Top Navigation actions */}
        <div className='w-full flex items-center justify-between z-10 pt-2 select-none'>
          <button
            onClick={onBack}
            className='p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors active:scale-90 cursor-pointer'
          >
            <ArrowLeft
              className='w-5 h-5 pointer-events-none'
              strokeWidth={2.5}
            />
          </button>

          <span className='font-display font-black text-white tracking-widest text-[14px]'>
            PROFILE
          </span>

          <button className='p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors active:scale-90 cursor-pointer'>
            <Settings className='w-5 h-5' strokeWidth={2.2} />
          </button>
        </div>

        {/* Central Morphing Avatar & its satellite stat nodes */}
        <div className='flex justify-center items-center relative h-28 mt-2'>
          {/* Container grouping elements for centered scale */}
          <div className='relative w-24 h-24 flex items-center justify-center'>
            {/* Satellite Stat Bubbles with staggered delayed entry scaled via spring */}
            {statsBubbles.map((bubble, idx) => (
              <motion.div
                key={bubble.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                  delay: 0.15 + idx * 0.05,
                }}
                className={`absolute ${bubble.pos} w-7 h-7 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-lg border border-white/20 select-none scale-90 ${bubble.bg} z-35`}
              >
                {bubble.value}
              </motion.div>
            ))}

            {/* Glowing circular backdrop */}
            <div className='absolute inset-0 bg-teal-400/20 rounded-full blur-md animate-pulse'></div>

            {/* Main morphing avatar image frame */}
            <motion.div
              layoutId='profile-avatar-container'
              className='w-24 h-24 rounded-full border-[3px] border-white overflow-hidden shadow-2xl relative z-10 bg-slate-100'
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 24,
              }}
            >
              <motion.img
                layoutId='profile-avatar-img'
                referrerPolicy='no-referrer'
                src={janeAvatar}
                alt='Jane Smith'
                className='w-full h-full object-cover'
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 24,
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Bottom User details section sliding up */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 25,
          delay: 0.12,
        }}
        className='flex-1 flex flex-col items-center pt-5 px-6 pb-6 overflow-y-auto'
      >
        {/* Name and Stats */}
        <div className='text-center'>
          <h2 className='text-xl font-bold text-slate-800 tracking-wider font-display uppercase'>
            Jane Smith
          </h2>
          <p className='text-[11px] font-semibold text-slate-400 tracking-wide mt-1 uppercase'>
            127 stories <span className='mx-1.5 text-slate-300'>•</span> 325
            followers
          </p>
        </div>

        {/* Highly Interactive Morphing Follow Button */}
        <div className='mt-5 relative z-30'>
          <button
            onClick={onToggleFollow}
            className='cursor-pointer active:scale-95 transition-transform'
          >
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isFollowing ? '#3fb5a3' : '#ffffff',
                borderColor: isFollowing ? '#3fb5a3' : '#e2e8f0',
                color: isFollowing ? '#ffffff' : '#31b3a5',
                boxShadow: isFollowing
                  ? '0 4px 14px 0 rgba(63, 181, 163, 0.4)'
                  : '0 4px 10px 0 rgba(0, 0, 0, 0.04)',
              }}
              className='px-8 py-2 rounded-full border-2 text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-1.5 min-w-37.5 h-8'
              transition={{ duration: 0.25 }}
            >
              {isFollowing ? (
                <>
                  <Check className='w-3.5 h-3.5' strokeWidth={3} />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <Plus className='w-3.5 h-3.5' strokeWidth={3} />
                  <span>Follow</span>
                </>
              )}
            </motion.div>
          </button>
        </div>

        {/* Slide-Up Stories Card Stack Deck label & block */}
        <div className='w-full flex-1 mt-6 flex flex-col justify-end'>
          <div className='w-full max-w-70 mx-auto text-left py-1 flex items-center justify-between opacity-60'>
            <span className='text-[9px] font-bold tracking-widest uppercase text-slate-400'>
              Active story deck
            </span>
            <span className='text-[8px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase'>
              Swipe left / right
            </span>
          </div>

          <CardDeck stories={stories} onCycleStories={onCycleStories} />
        </div>
      </motion.div>
    </div>
  );
}
