'use client';

import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
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

type CardDeckProps = {
  cards: CardType[];
  currentIndex: number;
  onSwipe: () => void;
};

export function CardDeck({ cards, currentIndex, onSwipe }: CardDeckProps) {
  return (
    <section className='h-full w-full'>
      <div className='relative h-full w-full'>
        <AnimatePresence mode='popLayout'>
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
                onCycleStories={onSwipe}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}

type PlaceCardProps = {
  card: CardType;
  active: boolean;
  offset: number;
  onCycleStories: () => void;
};

function PlaceCard({ card, active, offset, onCycleStories }: PlaceCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const [exitY, setExitY] = useState<number | null>(null);
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-300, 0, 300], [-6, 0, 6]);

  const opacity = useTransform(
    y,
    [-400, -200, 0, 200, 400],
    [0, 0.4, 1, 0.4, 0],
  );

  const scale = 1 - offset * 0.04;
  const stackY = offset * -20;
  const stackRotate = offset * 1.5;

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    handleSelect();

    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 140;

    if (info.offset.y > threshold) {
      setExitY(800);

      setTimeout(() => {
        onCycleStories();
      }, 260);

      return;
    }

    if (info.offset.y < -threshold) {
      setExitY(-800);

      setTimeout(() => {
        onCycleStories();
      }, 260);
    }
  };

  return (
    <motion.div
      className='absolute inset-0 overflow-hidden rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing'
      style={{
        background: card.bg,
        zIndex: 100 - offset,
        scale,
        opacity: active ? opacity : 1,
        y: active ? y : stackY,
        rotate: active ? rotate : stackRotate,
      }}
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 80,
      }}
      animate={{
        opacity: 1,
        scale,
        y: stackY,
        rotate: active ? 0 : stackRotate,
      }}
      exit={{
        y: exitY ?? 0,
        opacity: 0,
        scale: 0.82,
        rotate: exitY && exitY > 0 ? 12 : exitY && exitY < 0 ? -12 : 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      }}
      transition={{
        type: 'spring',
        stiffness: 340,
        damping: 20,
      }}
      drag={active ? 'y' : false}
      dragConstraints={{
        top: 0,
        bottom: 0,
      }}
      dragElastic={0.2}
      onDragEnd={active ? handleDragEnd : undefined}
    >
      <div className='px-6 pt-8 text-center text-white'>
        <h2 className='text-[clamp(1.75rem,8vw,3rem)] font-semibold leading-tight'>
          {card.title}
        </h2>

        <p className='mt-1 text-base text-white/60'>{card.location}</p>
      </div>

      <div className='absolute inset-x-2 bottom-2 top-36 overflow-hidden rounded-3xl'>
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
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          >
            {card.images.map((image, index) => (
              <CarouselItem key={index} className='basis-full'>
                <div className='relative h-[calc(100vh-18rem)] overflow-hidden rounded-3xl'>
                  <Image
                    src={image}
                    alt={`${card.title}-${index + 1}`}
                    fill
                    sizes='(max-width:768px) 100vw, 420px'
                    priority={index === 0}
                    unoptimized
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/30' />
                  <div className='absolute left-4 right-4 top-4 flex items-center justify-between gap-4'>
                    <div className='rounded-xl border border-white/15 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-xl'>
                      {card.type}
                    </div>

                    <div className='flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-xl'>
                      <Star size={16} className='fill-white' />

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
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
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
