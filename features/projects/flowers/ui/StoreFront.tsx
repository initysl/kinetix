import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
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
          const validPlants = json.data.filter(
            (p: any) => p.default_image?.regular_url,
          );
          setPlants(validPlants.slice(0, 5)); // Fetch 5, 1 for popular, 4 for explore
        }
      } catch (error) {
        console.error('Failed to fetch plants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const colors = ['#E5E9E2', '#3B3834', '#D95B4A', '#F4C2C2', '#9CB4A1'];
  const popularPlant = plants.length > 0 ? plants[0] : null;
  const explorePlants = plants.slice(1);

  return (
    <div className='flex-1 flex flex-col relative w-full h-full bg-[#f8f9fc]'>
      {/* Header */}
      <TopBar isOpen={isOpen} toggleMenu={toggleMenu} />

      {/* Scrollable Content */}
      <main className='flex-1 px-6 pb-28'>
        {/* Popular Section */}
        <section className='mb-8 mt-2'>
          <h2 className='text-[22px] font-semibold text-gray-900 mb-5'>
            Popular
          </h2>

          <AnimatePresence mode='wait'>
            {loading ? (
              <motion.div
                key='popular-skeleton'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='bg-gray-200 animate-pulse rounded-[28px] p-6 h-47.5 w-full'
              />
            ) : popularPlant ? (
              <motion.div
                key='popular-data'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-[#EBEBE8] rounded-[28px] overflow-hidden p-6 pb-0 flex relative shadow-sm h-47.5'
              >
                {/* Content side */}
                <div className='flex-1 flex flex-col pt-2 pb-6 z-10 w-[60%] shrink-0'>
                  <span className='bg-[#D95B4A] text-white text-[10px] uppercase font-bold tracking-wider py-1.5 px-3 rounded-md w-max mb-3'>
                    Best Seller
                  </span>
                  <h3
                    className='text-[19px] font-bold text-gray-900 leading-tight mb-2 pr-4 line-clamp-2'
                    title={popularPlant.common_name}
                  >
                    {popularPlant.common_name}
                  </h3>
                  <p className='text-[17px] font-medium text-gray-700'>
                    ${(Math.random() * 30 + 20).toFixed(2)}
                  </p>

                  <button className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mt-auto shadow-md transform hover:scale-105 active:scale-95 transition-all'>
                    <Plus className='w-5 h-5' />
                  </button>
                </div>

                {/* Plant Image */}
                <div className='absolute -right-10 bottom-0 w-50 h-full flex items-end'>
                  <img
                    src={popularPlant.default_image.regular_url}
                    className='w-full h-[140%] object-contain py-2 object-bottom drop-shadow-2xl mix-blend-multiply'
                    alt={popularPlant.common_name}
                  />
                </div>
              </motion.div>
            ) : (
              <div className='bg-white rounded-[28px] p-6 h-47.5 w-full border border-gray-100 flex items-center justify-center text-sm text-gray-500'>
                <p>Check API key setup.</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Explore Section */}
        <section>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-[22px] font-semibold text-gray-900'>Explore</h2>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <AnimatePresence mode='wait'>
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((key) => (
                    <motion.div
                      key={`skeleton-${key}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='bg-gray-200 animate-pulse rounded-[24px] h-65 w-full'
                    />
                  ))}
                </>
              ) : explorePlants.length > 0 ? (
                explorePlants.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PlantCard
                      name={plant.common_name}
                      price={`${(Math.random() * 20 + 15).toFixed(2)}`}
                      image={plant.default_image?.regular_url}
                      tag={index === 0 ? 'New' : index === 1 ? 'Sale' : 'Rare'}
                      color={colors[index % colors.length]}
                      imageClassName='h-full object-contain py-2 object-bottom drop-shadow-md mix-blend-multiply'
                      sunlight={plant.sunlight}
                      watering={plant.watering}
                      cycle={plant.cycle}
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
