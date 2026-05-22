'use client';

import { useEffect, useState } from 'react';
import { motion, type PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

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
        {cards.map((card, index) => {
          if (index < currentIndex) {
            return null;
          }

          const offset = index - currentIndex;
          const active = index === currentIndex;

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
  const opacity = useTransform(y, [0, 260], [1, 0.2]);
  const scale = 1 - offset * 0.04;
  const rotateZ = offset * 2;
  const translateY = offset * -20;

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    queueMicrotask(handleSelect);
    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
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
      className='absolute inset-0 cursor-grab rounded-3xl shadow-2xl'
      style={{
        background: card.bg,
        zIndex: 100 - offset,
        scale,
        y: active ? y : translateY,
        rotate: active ? rotate : rotateZ,
        opacity: active ? opacity : 1,
      }}
      initial={{
        y: active ? 0 : translateY,
        rotate: active ? 0 : rotateZ,
        scale,
        opacity: 1,
      }}
      animate={{
        y: active ? 0 : translateY,
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
      <div className='px-6 pt-8 text-center text-white'>
        <h2 className='text-[clamp(1.75rem,8vw,3rem)] font-semibold leading-tight'>
          {card.title}
        </h2>
        <p className='mt-1 text-base text-white/55'>{card.location}</p>
      </div>

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
            onPointerDown={(event) => event.stopPropagation()}
          >
            {card.images.map((image, index) => (
              <CarouselItem key={index} className='basis-full'>
                <div className='relative h-[calc(100vh-18rem)] overflow-hidden rounded-3xl'>
                  <Image
                    src={image}
                    alt={`${card.title}-${index + 1}`}
                    fill
                    sizes='(max-width: 768px) 100vw, 420px'
                    className='object-cover'
                    priority={index === 0}
                  />
                  <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />
                  <div className='absolute left-4 right-4 top-4 flex items-center justify-between gap-4'>
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

          <div className='pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2'>
            {card.images.map((_, index) => (
              <button
                key={index}
                type='button'
                onClick={(event) => {
                  event.stopPropagation();
                  api?.scrollTo(index);
                }}
                className={`pointer-events-auto h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
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
