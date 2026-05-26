import React, { useState } from 'react';
import { GameMode, Difficulty } from '../types';

interface MenuScreenProps {
  onStartGame: (mode: GameMode, difficulty: Difficulty) => void;
  onOpenRules: () => void;
}

export default function MenuScreen({
  onStartGame,
  onOpenRules,
}: MenuScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleStart = () => {
    onStartGame(selectedMode, difficulty);
  };

  return (
    <div
      id='menu-screen-container'
      className='min-h-screen flex items-center justify-center p-4 bg-indigo-900'
    >
      <div
        id='menu-card'
        className='w-full max-w-md bg-white text-black border-b-12 border-black border-x-4 border-t-4 rounded-[40px] p-8 relative flex flex-col items-center shadow-2xl'
      >
        {/* Connect Four Logo in menu header */}
        <div id='menu-logo' className='flex flex-col items-center gap-1 mb-6'>
          <div className='flex gap-2.5 p-3 bg-indigo-900 border-4 border-black rounded-3xl mb-1 shadow-md'>
            <span className='w-6 h-6 rounded-full bg-red-500 border-[3px] border-black block'></span>
            <span className='w-6 h-6 rounded-full bg-yellow-400 border-[3px] border-black block'></span>
            <span className='w-6 h-6 rounded-full bg-red-500 border-[3px] border-black block'></span>
          </div>
          <h1 className='text-3xl font-black tracking-wider uppercase text-indigo-950'>
            CONNECT FOUR
          </h1>
        </div>

        {/* Content Tabs for Game Mode */}
        <div className='w-full flex flex-col gap-2 border-[3px] border-black rounded-3xl mb-6 p-2 bg-slate-100 shadow-sm'>
          <div className='flex gap-1.5'>
            <button
              id='mode-pve-tab'
              onClick={() => setSelectedMode('pve')}
              className={`flex-1 py-3 text-center rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
                selectedMode === 'pve'
                  ? 'bg-indigo-900 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-250'
              }`}
            >
              🤖 VS COMPUTER
            </button>
            <button
              id='mode-pvp-tab'
              onClick={() => setSelectedMode('pvp')}
              className={`flex-1 py-3 text-center rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
                selectedMode === 'pvp'
                  ? 'bg-indigo-900 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-250'
              }`}
            >
              👥 PASS & PLAY
            </button>
          </div>
          <button
            id='mode-online-tab'
            onClick={() => setSelectedMode('online')}
            className={`w-full py-3 text-center rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer border-t border-slate-200 ${
              selectedMode === 'online'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            🌐 ONLINE MULTIPLAYER (FIRESTORE)
          </button>
        </div>

        {/* AI Difficulty configuration - only visible when PVE is picked */}
        {selectedMode === 'pve' && (
          <div
            id='ai-difficulty-selector'
            className='w-full mb-6 p-4 bg-slate-50 border-[3px] border-black rounded-2xl transition-all'
          >
            <p className='text-xs font-black tracking-widest text-slate-500 uppercase mb-3 text-center'>
              Computer Smartness
            </p>
            <div className='grid grid-cols-2 gap-2'>
              {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(
                (level) => {
                  const colorsMap: Record<Difficulty, string> = {
                    easy: 'border-emerald-500 text-emerald-600',
                    medium: 'border-sky-500 text-sky-600',
                    hard: 'border-orange-500 text-orange-600',
                    expert: 'border-red-500 text-red-500',
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-2 text-xs font-black uppercase rounded-xl border-[3px] tracking-widest transition-all cursor-pointer ${
                        difficulty === level
                          ? 'bg-indigo-950 border-black text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div id='menu-actions' className='w-full space-y-4'>
          <button
            id='start-game-btn'
            onClick={handleStart}
            className='w-full py-4 bg-yellow-400 border-b-8 border-black border-x-2 border-t-2 rounded-2xl font-black text-black text-lg tracking-widest uppercase hover:bg-yellow-300 transition-all cursor-pointer shadow-lg'
          >
            Play Game
          </button>

          <button
            id='rules-view-btn'
            onClick={onOpenRules}
            className='w-full py-4 bg-indigo-50 border-b-8 border-black border-x-2 border-t-2 rounded-2xl font-black text-indigo-950 text-lg tracking-widest uppercase hover:bg-indigo-100 hover:text-black transition-all cursor-pointer shadow-lg'
          >
            Game Rules
          </button>
        </div>

        {/* Footer info decoration */}
        <p className='text-xs font-bold text-slate-400 mt-6 tracking-wide'>
          Play online & offline • Free & Instant
        </p>
      </div>
    </div>
  );
}
