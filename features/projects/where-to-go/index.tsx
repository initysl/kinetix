'use client';

import { useState } from 'react';
import { whereToGoCards } from './data';
import { BottomBar } from './ui/BottomBar';
import { CardStack } from './ui/CardStack';
import { TopBar } from './ui/TopBar';
import type { CardType } from './ui/CardStack';

export default function WhereToGoProject() {
  const [cards, setCards] = useState<CardType[]>(whereToGoCards);

  const handleSwipe = () => {
    setCards((prev) => {
      if (prev.length <= 1) {
        return prev;
      }

      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <main
      className='h-dvh overflow-hidden transition-colors duration-700'
      style={{ background: cards[0]?.bg ?? '#17342F' }}
    >
      <div className='relative mx-auto flex h-full w-full max-w-[430px] flex-col px-5 pt-12 pb-5'>
        <div className='relative z-20 shrink-0'>
          <TopBar />
        </div>

        <div className='relative z-10 flex-1 py-4'>
          <CardStack cards={cards} currentIndex={0} onSwipe={handleSwipe} />
        </div>

        <div className='relative z-20 shrink-0'>
          <BottomBar />
        </div>
      </div>
    </main>
  );
}
