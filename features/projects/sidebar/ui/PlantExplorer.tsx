import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  X,
  Sun,
  Droplets,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Heart,
  Activity,
} from 'lucide-react';
import { PlantCard } from './PlantCard';

export interface Plant {
  id: number;
  common_name: string;
  scientific_name: string[];
  image: string;
  sunlight: string[];
  watering: string;
  cycle: string;
  price: string;
  rating: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  purifyingVolume: string;
}

const STATIC_PLANTS: Plant[] = [
  {
    id: 1,
    common_name: 'Monstera Deliciosa',
    scientific_name: ['Monstera deliciosa'],
    image:
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=650&auto=format&fit=crop',
    sunlight: ['Bright indirect'],
    watering: 'Weekly',
    cycle: 'Perennial',
    price: '$95',
    rating: 4.9,
    category: 'Indoor',
    difficulty: 'Easy',
    purifyingVolume: '94%',
  },
  {
    id: 2,
    common_name: 'Golden Pothos',
    scientific_name: ['Epipremnum aureum'],
    image:
      'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=650&auto=format&fit=crop',
    sunlight: ['Low light'],
    watering: 'Bi-weekly',
    cycle: 'Perennial',
    price: '$45',
    rating: 4.7,
    category: 'Low Light',
    difficulty: 'Easy',
    purifyingVolume: '88%',
  },
  {
    id: 3,
    common_name: 'Fiddle Leaf Fig',
    scientific_name: ['Ficus lyrata'],
    image:
      'https://images.unsplash.com/photo-1597055181300-e3633a207518?q=80&w=650&auto=format&fit=crop',
    sunlight: ['Bright indirect'],
    watering: 'Weekly',
    cycle: 'Perennial',
    price: '$120',
    rating: 4.8,
    category: 'Indoor',
    difficulty: 'Medium',
    purifyingVolume: '91%',
  },
  {
    id: 4,
    common_name: 'Calathea Orbifolia',
    scientific_name: ['Calathea orbifolia'],
    image:
      'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=650&auto=format&fit=crop',
    sunlight: ['Partial shade'],
    watering: 'Semi-weekly',
    cycle: 'Perennial',
    price: '$78',
    rating: 4.6,
    category: 'Indoor',
    difficulty: 'Expert',
    purifyingVolume: '85%',
  },
  {
    id: 5,
    common_name: 'Snake Plant',
    scientific_name: ['Sansevieria trifasciata'],
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=650&auto=format&fit=crop',
    sunlight: ['Shade'],
    watering: 'Monthly',
    cycle: 'Perennial',
    price: '$58',
    rating: 4.8,
    category: 'Low Light',
    difficulty: 'Easy',
    purifyingVolume: '96%',
  },
  {
    id: 6,
    common_name: 'Zebra Cactus',
    scientific_name: ['Haworthiopsis attenuata'],
    image:
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=650&auto=format&fit=crop',
    sunlight: ['Full sun'],
    watering: 'Monthly',
    cycle: 'Perennial',
    price: '$29',
    rating: 4.9,
    category: 'Succulents',
    difficulty: 'Easy',
    purifyingVolume: '65%',
  },
];

export function PlantExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );
  const [focusedPlant, setFocusedPlant] = useState<Plant | null>(null);

  const categories = ['All', 'Indoor', 'Low Light', 'Succulents'];

  // Filter pipeline
  const filteredPlants = useMemo(() => {
    return STATIC_PLANTS.filter((plant) => {
      const matchSearch =
        plant.common_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientific_name[0]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' || plant.category === selectedCategory;
      const matchDifficulty =
        !selectedDifficulty || plant.difficulty === selectedDifficulty;

      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className='w-full min-h-screen bg-[#f8f9fc] pb-24'>
      {/* HEADER HERO AREA */}
      <section className='bg-linear-to-br from-[#1b2b22] to-[#0e1712] px-6 py-12 text-white relative overflow-hidden rounded-b-[40px] shadow-sm'>
        <div className='absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute -bottom-10 left-10 w-60 h-60 bg-teal-600/10 rounded-full blur-[80px] pointer-events-none' />

        <div className='max-w-7xl mx-auto space-y-4 relative z-10'>
          <div className='inline-flex items-center gap-2 px-3  rounded-full bg-emerald-500/10 border border-emerald-400/20 text-[10px] font-bold uppercase tracking-widest text-[#5fd29d]'>
            <Sparkles className='w-3.5 h-3.5' /> Curated Collection
          </div>
          <h1 className='text-3xl md:text-5xl font-black tracking-tight leading-tight'>
            Botanical Sanctuary
          </h1>
          <p className='max-w-lg text-sm text-slate-300 leading-relaxed font-sans'>
            Filtered by lighting thresholds, watering cycles, and structural
            requirements to find perfect spatial integrations.
          </p>
        </div>
      </section>

      {/* SEARCH AND CONTROLS CONTAINER */}
      <div className='max-w-7xl mx-auto px-6 mt-10 space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-xs'>
          {/* Realtime Input */}
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <input
              type='text'
              placeholder='Search botanical names...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-11 pl-10 pr-4 rounded-2xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm font-sans placeholder-slate-400 transition-colors outline-none text-slate-800 bg-slate-50/50'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rounded bg-slate-200 p-0.5'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            )}
          </div>

          {/* Categories Tab Pill Bar */}
          <div className='flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200 select-none ${
                  selectedCategory === cat
                    ? 'bg-[#111827] text-white shadow-md shadow-slate-900/15'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* QUICK OPTION PILLS */}
        <div className='flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans'>
          <span>Difficulty:</span>
          {['Easy', 'Medium', 'Expert'].map((diff) => (
            <button
              key={diff}
              onClick={() =>
                setSelectedDifficulty(selectedDifficulty === diff ? null : diff)
              }
              className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-350'
              }`}
            >
              {diff}
            </button>
          ))}
          {selectedDifficulty && (
            <button
              onClick={() => setSelectedDifficulty(null)}
              className='text-[11px] text-red-500 hover:underline font-bold uppercase tracking-wider ml-1'
            >
              Clear filters
            </button>
          )}
        </div>

        {/* DYNAMIC SHIELDED BENTO GRID */}
        <div>
          {filteredPlants.length > 0 ? (
            <motion.div
              layout
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'
            >
              <AnimatePresence mode='popLayout'>
                {filteredPlants.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                      delay: index * 0.05,
                    }}
                    className='h-full flex flex-col'
                  >
                    <PlantCard
                      common_name={plant.common_name}
                      scientific_name={plant.scientific_name}
                      default_image={{ regular_url: plant.image }}
                      sunlight={plant.sunlight}
                      watering={plant.watering}
                      cycle={plant.cycle}
                      price={plant.price}
                      rating={plant.rating}
                    />

                    {/* Secondary details inspector line */}
                    <button
                      onClick={() => setFocusedPlant(plant)}
                      className='mt-3 w-full h-10 rounded-xl border border-dashed border-slate-200 hover:border-emerald-500/40 hover:bg-emerald-50/20 text-[11px] font-bold tracking-widest uppercase text-slate-500 hover:text-emerald-700 transition-all flex items-center justify-center gap-1.5'
                    >
                      <Activity className='w-4 h-4' /> Inspect Air Purifying
                      Matrix
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className='w-full text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6'>
              <span className='p-4 rounded-full bg-slate-50 text-slate-400 mb-4 select-none'>
                <SlidersHorizontal className='w-7 h-7' />
              </span>
              <p className='font-extrabold text-slate-800 text-base'>
                No plants match current filters
              </p>
              <p className='text-xs text-slate-400 mt-1 max-w-xs font-sans'>
                Try widening your search terms or clearing difficulty selectors.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDifficulty(null);
                }}
                className='mt-6 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider select-none active:scale-95 transition-all shadow-md'
              >
                Reset All Parameters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL DRAWER / BOTTOM SHEET ELEMENT */}
      <AnimatePresence>
        {focusedPlant && (
          <div className='fixed inset-0 z-50 overflow-hidden flex items-end justify-center bg-slate-950/40 backdrop-blur-xs p-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0'
              onClick={() => setFocusedPlant(null)}
            />

            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className='w-full max-w-md bg-white rounded-3xl overflow-hidden flex flex-col relative z-20 shadow-2xl border border-slate-100'
            >
              {/* Image Banner Segment */}
              <div className='relative aspect-video w-full overflow-hidden'>
                <img
                  src={focusedPlant.image}
                  alt={focusedPlant.common_name}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none' />
                <button
                  onClick={() => setFocusedPlant(null)}
                  className='absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
                <div className='absolute left-6 bottom-4 text-white'>
                  <span className='text-[10px] uppercase font-bold text-emerald-400 tracking-wider'>
                    Classification
                  </span>
                  <h3 className='text-xl font-bold font-sans'>
                    {focusedPlant.common_name}
                  </h3>
                </div>
              </div>

              {/* Data Strip Grid */}
              <div className='p-6 space-y-5'>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center'>
                    <Sun className='w-4 h-4 text-amber-500 mx-auto mb-1' />
                    <span className='text-[9px] text-slate-400 font-semibold block uppercase'>
                      Lighting
                    </span>
                    <span className='text-xs font-bold text-slate-700 block'>
                      {focusedPlant.sunlight[0]}
                    </span>
                  </div>

                  <div className='bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center'>
                    <Droplets className='w-4 h-4 text-sky-500 mx-auto mb-1' />
                    <span className='text-[9px] text-slate-400 font-semibold block uppercase'>
                      Water
                    </span>
                    <span className='text-xs font-bold text-slate-700 block'>
                      {focusedPlant.watering}
                    </span>
                  </div>

                  <div className='bg-slate-50 border border-slate-100 p-3 rounded-2xl text-center'>
                    <RefreshCw className='w-4 h-4 text-emerald-500 mx-auto mb-1' />
                    <span className='text-[9px] text-slate-400 font-semibold block uppercase'>
                      Cycle
                    </span>
                    <span className='text-xs font-bold text-slate-700 block'>
                      {focusedPlant.cycle}
                    </span>
                  </div>
                </div>

                {/* Progress Meters */}
                <div className='space-y-3 pt-2'>
                  <span className='text-[10px] font-bold text-slate-400 block tracking-widest uppercase border-b border-slate-100 pb-1.5'>
                    Oxygen Production Levels
                  </span>

                  <div className='space-y-2 font-sans'>
                    <div>
                      <div className='flex justify-between text-xs text-slate-500 font-medium mb-1'>
                        <span>Air Purifying Efficiency</span>
                        <span className='text-emerald-600 font-bold'>
                          {focusedPlant.purifyingVolume}
                        </span>
                      </div>
                      <div className='w-full h-1.5 bg-slate-100 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-emerald-500 rounded-full transition-all duration-500'
                          style={{ width: focusedPlant.purifyingVolume }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFocusedPlant(null)}
                  className='w-full h-11 bg-slate-900 rounded-xl font-bold text-white text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors'
                >
                  Dismiss Parameters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
