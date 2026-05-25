import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { Heart, ChevronRight, RefreshCw } from 'lucide-react';
import { StoryCard } from '../types';

interface CardDeckProps {
  stories: StoryCard[];
  onCycleStories: () => void;
}

export default function CardDeck({ stories, onCycleStories }: CardDeckProps) {
  // Drag state trackers
  const [exitX, setExitX] = useState<number>(0);
  const x = useMotionValue(0);

  // Create rotation and opacity modifiers during drag
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitX(200);
      onCycleStories();
    } else if (info.offset.x < -threshold) {
      setExitX(-200);
      onCycleStories();
    }
  };

  return (
    <div className='w-full flex flex-col items-center select-none'>
      {/* Cards stack stage container */}
      <div className='relative w-full h-80 flex items-center justify-center pt-10'>
        <AnimatePresence mode='popLayout'>
          {stories.map((story, index) => {
            // Index 0 represents the active topmost card
            const isTop = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            // Calculate exact mechanical physical metrics for layered 3D depth
            const scale = isTop ? 1 : isSecond ? 0.94 : 0.88;
            const yOffset = isTop ? 0 : isSecond ? -16 : -32;
            const blur = isTop
              ? 'blur-0'
              : isSecond
                ? 'blur-[0.5px]'
                : 'blur-[1px]';
            const rotateConstant = isTop ? 0 : isSecond ? 1.5 : -2;

            // Framer motion animation properties
            return (
              <motion.div
                key={story.id}
                style={
                  isTop
                    ? { x, rotate, opacity, zIndex: 10 }
                    : { zIndex: 10 - index }
                }
                drag={isTop ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={isTop ? handleDragEnd : undefined}
                initial={
                  isTop
                    ? {
                        scale: 0.9,
                        y: 30,
                        opacity: 0,
                      }
                    : {
                        scale,
                        y: yOffset,
                        rotate: rotateConstant,
                      }
                }
                animate={{
                  scale,
                  y: yOffset,
                  opacity: 1,
                  rotate: isTop ? 0 : rotateConstant,
                }}
                exit={
                  isTop
                    ? {
                        x: exitX,
                        opacity: 0,
                        scale: 0.85,
                        rotate: exitX > 0 ? 20 : -20,
                        transition: { duration: 0.35, ease: 'easeOut' },
                      }
                    : undefined
                }
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 26,
                }}
                className={`absolute w-70 h-65 rounded-[32px] bg-white shadow-[0_20px_45px_-12px_rgba(15,23,42,0.15)] border border-slate-100 p-3 flex flex-col cursor-grab active:cursor-grabbing origin-bottom ${blur}`}
              >
                {/* Photo container */}
                <div className='w-full h-45 rounded-[24px] overflow-hidden bg-slate-100 relative pointer-events-none'>
                  <img
                    referrerPolicy='no-referrer'
                    src={story.image}
                    alt={story.title}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent' />
                </div>

                {/* Subtitle / Likes banner */}
                <div className='flex-1 flex items-center justify-between px-2 pt-2 pointer-events-none'>
                  <span className='text-[14px] font-semibold text-slate-800 tracking-wide'>
                    {story.title}
                  </span>

                  <div className='flex items-center gap-1 text-[#ea5d71] font-bold'>
                    <Heart className='w-4 h-4 fill-current' />
                    <span className='text-xs'>{story.likes}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cyclic feedback control line */}
      <button
        onClick={onCycleStories}
        className='mt-2 flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors text-[10px] font-bold uppercase tracking-wider shadow-sm border border-slate-200/50 cursor-pointer active:scale-95'
      >
        <RefreshCw className='w-3 h-3 animate-spin-slow text-slate-400' />
        Flick top card
      </button>
    </div>
  );
}
