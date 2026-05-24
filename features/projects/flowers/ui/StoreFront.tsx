import React from 'react';
import { Plus } from 'lucide-react';
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
          <div className='bg-[#EBEBE8] rounded-[28px] overflow-hidden p-6 pb-0 flex relative shadow-sm h-[190px]'>
            {/* Content side */}
            <div className='flex-1 flex flex-col pt-2 pb-6 z-10 w-[60%] shrink-0'>
              <span className='bg-[#D95B4A] text-white text-[10px] uppercase font-bold tracking-wider py-1.5 px-3 rounded-md w-max mb-3'>
                Best Seller
              </span>
              <h3 className='text-[19px] font-bold text-gray-900 leading-tight mb-2 pr-4'>
                Large Fiddle
                <br />
                Leaf Fig Bush
              </h3>
              <p className='text-[17px] font-medium text-gray-700'>$29.99</p>

              <button className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mt-auto shadow-md'>
                <Plus className='w-5 h-5' />
              </button>
            </div>

            {/* Plant Image */}
            <div className='absolute right-[-40px] bottom-0 w-[200px] h-full flex items-end'>
              <img
                src='https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=400&q=80'
                className='w-full h-[120%] object-cover object-bottom mix-blend-multiply drop-shadow-2xl'
                alt='Fiddle Leaf'
              />
            </div>
          </div>
        </section>

        {/* Explore Section */}
        <section>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-[22px] font-semibold text-gray-900'>Explore</h2>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <PlantCard
              name='Peperomia'
              price='$18.50'
              image='https://images.unsplash.com/photo-1598583486255-a28a3f81e3dc?auto=format&fit=crop&w=300&q=80'
              tag='New'
              color='#E5E9E2'
              imageClassName='h-[140%] object-contain mix-blend-multiply pt-4'
            />
            <PlantCard
              name='Dracaena'
              price='$21.00'
              image='https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=300&q=80'
              tag='Sale'
              color='#3B3834'
              imageClassName='h-[140%] object-contain mix-blend-multiply pt-2'
            />
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomBar />
    </div>
  );
}
