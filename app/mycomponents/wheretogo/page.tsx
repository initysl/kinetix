'use client';

import { useState } from 'react';
import { BottomBar } from './ui/BottomBar';
import { CardStack } from './ui/CardStack';
import { TopBar } from './ui/TopBar';
import { CardType } from './ui/CardStack';

const CARDS: CardType[] = [
  {
    id: 1,
    title: "Duck's Lake",
    location: 'Stryiska St, 200a',
    type: 'Business Park',
    rating: 4.8,
    bg: '#17342F',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    id: 2,
    title: 'Shalom',
    location: 'Bratiy Rohatyntsiv St, 32',
    type: 'Restaurant',
    rating: 4.6,
    bg: '#2D2F3B',
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    id: 3,
    title: 'Jam Factory',
    location: 'Bohdana Khmelnytskoho St, 124',
    type: 'Art Center',
    rating: 4.9,
    bg: '#2F4035',
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    ],
  },
];

export default function Page() {
  const [cards, setCards] = useState<CardType[]>(CARDS);

  const handleSwipe = () => {
    setCards((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <main
      className='h-dvh overflow-hidden transition-colors duration-700'
      style={{ background: cards[0].bg }}
    >
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute left-[-20%] top-[-10%] h-80 w-80 rounded-full bg-white/5 blur-3xl' />
        <div className='absolute bottom-[-20%] right-[-10%] h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl' />
      </div>

      <div className='relative mx-auto flex h-full w-full max-w-107.5 flex-col px-5 pt-12 pb-5'>
        <div className='relative z-200 shrink-0'>
          <TopBar />
        </div>

        <div className='relative z-10 min-h-0 flex-1 overflow-hidden py-4'>
          <CardStack cards={cards} currentIndex={0} onSwipe={handleSwipe} />
        </div>

        <div className='relative z-200 shrink-0'>
          <BottomBar />
        </div>
      </div>
    </main>
  );
}
