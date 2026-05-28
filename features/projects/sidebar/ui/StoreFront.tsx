import React, { useState, useEffect } from 'react';
import { Plus, Flame, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { PlantCard } from './PlantCard';

export function StoreFront({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch('/api/plants');
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          // Filter to only display items that have an associated visual asset
          const validPlants = json.data.filter(
            (p: any) => p.default_image?.regular_url,
          );
          setPlants(validPlants.slice(0, 9));
        }
      } catch (error) {
        console.error('Failed to fetch plants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const popularPlant = plants.length > 0 ? plants[0] : null;
  const explorePlants = plants.slice(1);

  return (
    <div className='flex-1 flex flex-col relative w-full h-full bg-[#fcfdfd]'>
      <TopBar isOpen={isOpen} toggleMenu={toggleMenu} />

      <main className='flex-1 px-6 pb-28 pt-2 overflow-y-auto max-w-7xl mx-auto w-full'>
        <section className='mb-10'>
          <div className='flex items-center gap-2 mb-4'>
            <Flame className='w-5 h-5 text-rose-500 fill-rose-500' />
            <h2 className='text-xl font-extrabold text-slate-950 font-sans tracking-tight uppercase'>
              Popular Picks
            </h2>
          </div>

          <AnimatePresence mode='wait'>
            {loading ? (
              <motion.div
                key='popular-skeleton'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='bg-slate-100 animate-pulse rounded-[32px] p-8 h-48 w-full relative overflow-hidden'
              >
                <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]' />
              </motion.div>
            ) : popularPlant ? (
              <motion.div
                key='popular-data'
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className='bg-linear-to-br from-[#E8ECE5] to-[#DFE4DA] rounded-[32px] overflow-hidden p-7 flex relative shadow-[0_12px_32px_-8px_rgba(110,123,101,0.18)] border border-white/40 h-48 group cursor-pointer hover:shadow-[0_16px_40px_-8px_rgba(110,123,101,0.25)] transition-shadow duration-300'
              >
                {/* Decorative Soft Ring */}
                <div className='absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-600/5 rounded-full blur-xl pointer-events-none' />

                {/* Left Side Metadata Column */}
                <div className='flex-1 flex flex-col justify-between z-10 w-[55%] shrink-0'>
                  <div className='space-y-2'>
                    <span className='inline-flex items-center gap-1.5 bg-linear-to-r from-emerald-600 to-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-widest py-1 px-2.5 rounded-full shadow-sm'>
                      <Sparkles className='w-2.5 h-2.5' /> Best Seller
                    </span>
                    <h3
                      className='text-xl font-bold text-slate-800 tracking-tight leading-tight line-clamp-2'
                      title={popularPlant.common_name}
                    >
                      {popularPlant.common_name}
                    </h3>
                  </div>

                  <div className='flex items-center gap-3 mt-2'>
                    <span className='text-lg font-black text-slate-900'>
                      $49.00
                    </span>
                    <div className='flex items-center gap-0.5 text-xs text-amber-600 bg-white/65 px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold'>
                      <Star className='w-3 h-3 fill-amber-500 text-amber-500' />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Tactile Circular Plus Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className='w-9 h-9 rounded-full bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer mt-3'
                  >
                    <Plus className='w-5 h-5' strokeWidth={2.4} />
                  </motion.button>
                </div>

                {/* Overhanging Focal Organic Layer */}
                <div className='absolute -right-4 bottom-0 w-[45%] h-full flex items-end justify-end select-none'>
                  <img
                    src={popularPlant.default_image.regular_url}
                    className='w-full h-[135%] object-contain py-2 object-bottom drop-shadow-[0_16px_24px_rgba(0,0,0,0.14)] select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]'
                    alt={popularPlant.common_name}
                  />
                </div>
              </motion.div>
            ) : (
              <div className='bg-white rounded-[32px] p-6 h-48 w-full border border-slate-100 flex flex-col items-center justify-center text-sm text-slate-400 font-medium shadow-xs'>
                <p>No plants discovered. Check configurations.</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* EXPLORE SECTION SECTION */}
        <section>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-xl font-extrabold text-slate-900 font-sans tracking-tight uppercase'>
              Explore Flora
            </h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            <AnimatePresence mode='wait'>
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((key) => (
                    <motion.div
                      key={`skeleton-${key}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='bg-slate-50 border border-slate-150 animate-pulse rounded-2xl h-85 w-full'
                    />
                  ))}
                </>
              ) : explorePlants.length > 0 ? (
                explorePlants.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.06,
                      type: 'spring',
                      stiffness: 260,
                      damping: 25,
                    }}
                  >
                    <PlantCard
                      common_name={plant.common_name}
                      scientific_name={plant.scientific_name}
                      default_image={plant.default_image}
                      sunlight={plant.sunlight}
                      watering={plant.watering}
                      cycle={plant.cycle}
                      price={`$${(35.0 + (index % 3) * 12.5).toFixed(2)}`}
                    />
                  </motion.div>
                ))
              ) : null}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
