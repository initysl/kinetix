'use client';

import React, { useEffect, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Image from 'next/image';

export type CardType = {
  id: number;
  title: string;
  location: string;
  type: string;
  rating: number;
  bg: string;
  images: string[];
};

type CardStackProps = {
  cards: CardType[];
  currentIndex: number;
  onSwipe: () => void;
};

export function CardStack({ cards, currentIndex, onSwipe }: CardStackProps) {
  return (
    <section className='h-full'>
      <div className='relative h-full shrink-0'>
        {cards.map((card, i) => {
          if (i < currentIndex) return null;

          const offset = i - currentIndex;
          const active = i === currentIndex;

          return (
            <PlaceCard
              key={card.id}
              card={card}
              active={active}
              offset={offset}
              onSwipe={onSwipe}
            />
          );
        })}
      </div>
    </section>
  );
}

type PlaceCardProps = {
  card: CardType;
  active: boolean;
  offset: number;
  onSwipe: () => void;
};

function PlaceCard({ card, active, offset, onSwipe }: PlaceCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const y = useMotionValue(0);
  const rotate = useTransform(y, [-300, 300], [-7, 7]);
  const opacity = useTransform(y, [0, 260], [1, 0]);
  const scale = 1 - offset * 0.04;
  const rotateZ = offset * 2;
  const translateX = 0;
  const translateY = offset * -20;

  // Sync active carousel slides
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > 180) {
      onSwipe();
    }
  };

  return (
    <motion.div
      className='absolute inset-0 rounded-3xl shadow-2xl cursor-grab  '
      style={{
        background: card.bg,
        zIndex: 100 - offset,
        scale,
        y: active ? y : translateY,
        x: active ? 0 : translateX,
        rotate: active ? rotate : rotateZ,
        // opacity,
      }}
      initial={{
        y: active ? 0 : translateY,
        x: 0,
        rotate: active ? 0 : rotateZ,
        scale,
        opacity: 1,
      }}
      animate={{
        y: active ? 0 : translateY,
        x: active ? 0 : translateX,
        rotate: active ? 0 : rotateZ,
      }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 24,
      }}
      drag={active ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 300 }}
      dragElastic={0.3}
      onDragEnd={active ? handleDragEnd : undefined}
    >
      {/* Header */}
      <div className='px-6 pt-8 text-center text-white'>
        <h2 className='text-[clamp(1.75rem,8vw,3rem)] font-semibold leading-tight tracking-tighter'>
          {card.title}
        </h2>
        <p className='mt-1 text-base text-white/55'>{card.location}</p>
      </div>

      {/* Image Area */}
      <div className='absolute inset-x-2 bottom-2 top-36 overflow-hidden'>
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className='h-full w-full overflow-hidden rounded-3xl'
        >
          <CarouselContent
            className='h-full'
            onPointerDown={(e) => e.stopPropagation()}
          >
            {card.images.map((image, index) => (
              <CarouselItem key={index} className='basis-full'>
                <div className='relative h-[calc(100vh-18rem)]  overflow-hidden rounded-3xl'>
                  <Image
                    src={image}
                    alt={`${card.title}-${index}`}
                    fill
                    sizes='(max-width: 768px) 100vw, 420px'
                    className='object-cover'
                    priority={index === 0}
                  />
                  {/* Overlay */}
                  <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />
                  {/* Pills */}
                  <div className='absolute left-4 right-4 top-4 flex items-center justify-between'>
                    <div className='rounded-xl border border-white/15 bg-white/10 px-2 py-1 text-sm text-white backdrop-blur-xl'>
                      {card.type}
                    </div>
                    <div className='flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2 py-1 text-sm text-white backdrop-blur-xl'>
                      <Star size={18} className='fill-white' />
                      {card.rating}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Dynamic Pagination Indicators */}
          <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 pointer-events-none'>
            {card.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  api?.scrollTo(index);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full pointer-events-auto cursor-pointer ${
                  index === current
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </motion.div>
  );
}
