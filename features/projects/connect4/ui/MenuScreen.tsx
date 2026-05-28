import React, { useState } from 'react';
import { GameMode, Difficulty, SeriesLength, GameEvent } from '../types';
import {
  Play,
  BookOpen,
  Bot,
  Users,
  Trophy,
  Zap,
  Flame,
  Shield,
  Sparkles,
  Grid,
  Gamepad2,
} from 'lucide-react';

interface MenuScreenProps {
  onStartGame: (
    mode: GameMode,
    difficulty: Difficulty,
    seriesLength: SeriesLength,
    gameEvent: GameEvent,
  ) => void;
  onOpenRules: () => void;
}

export default function MenuScreen({
  onStartGame,
  onOpenRules,
}: MenuScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('pve');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [seriesLength, setSeriesLength] = useState<SeriesLength>(1);
  const [gameEvent, setGameEvent] = useState<GameEvent>('classic');

  const handleStart = () => {
    onStartGame(selectedMode, difficulty, seriesLength, gameEvent);
  };

  // Descriptive list of available challenge events with custom colored Lucide icons
  const eventsInfo = [
    {
      id: 'classic' as GameEvent,
      name: 'Classic Arena',
      icon: <Sparkles className='w-5 h-5 text-emerald-500' />,
      desc: 'Standard professional rules with 30s turn limits.',
      bgColor: 'bg-emerald-50/10 border-emerald-500/25',
    },
    {
      id: 'blitz' as GameEvent,
      name: 'Blitz Arena',
      icon: <Zap className='w-5 h-5 text-amber-500' />,
      desc: 'Fast paced high-intensity battle with a 5s turn timer!',
      bgColor: 'bg-amber-50/10 border-amber-500/25',
    },
    {
      id: 'obstacles' as GameEvent,
      name: 'Rocky Obstacles',
      icon: <Grid className='w-5 h-5 text-indigo-505 text-indigo-500' />,
      desc: 'Immovable stone boulders block cells randomly across rows 3-5.',
      bgColor: 'bg-indigo-50/10 border-indigo-500/25',
    },
    {
      id: 'anarchy' as GameEvent,
      name: 'Volcanic Anarchy',
      icon: <Flame className='w-5 h-5 text-orange-500' />,
      desc: 'A random neutral blocker falls onto the layout every 4 steps.',
      bgColor: 'bg-orange-50/10 border-orange-500/25',
    },
    {
      id: 'deficit' as GameEvent,
      name: 'Underdog Deficit',
      icon: <Shield className='w-5 h-5 text-rose-500' />,
      desc: 'Start with 3 pre-loaded computer chips at the bottom rows.',
      bgColor: 'bg-rose-50/10 border-rose-500/25',
    },
  ];

  return (
    <div
      id='menu-screen-container'
      className='min-h-screen w-full flex items-center justify-center bg-indigo-950 font-sans'
    >
      <div
        id='menu-card'
        className='w-full bg-white text-black  p-4 relative flex flex-col items-center shadow-2xl transition-all'
      >
        {/* Connect Four Emblem & Game Header */}
        <div
          id='menu-logo'
          className='flex flex-col items-center gap-3 mb-10 text-center w-full'
        >
          <div className='flex gap-3 p-3.5 sm:px-6 bg-indigo-900 border-4 border-black rounded-[24px] mb-2 shadow-md animate-pulse'>
            <span className='w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-red-500 border-3 border-black block shadow-inner'></span>
            <span className='w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-yellow-400 border-3 border-black block shadow-inner'></span>
            <span className='w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-red-500 border-3 border-black block shadow-inner'></span>
          </div>
          <h1 className='text-4xl sm:text-6xl font-black tracking-tighter uppercase text-indigo-950 leading-none'>
            CONNECT FOUR
          </h1>
          <p className='text-xs font-black text-slate-400 uppercase tracking-widest mt-1'>
            Championship Arena Setup
          </p>
        </div>

        {/* Responsive Grid Panel - Wide Max width Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-stretch'>
          {/* LEFT SIDE (5 Cols): Mode Selector, Game Details, Actions */}
          <div className='lg:col-span-5 flex flex-col justify-between gap-8 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-150 pb-8 lg:pb-0 lg:pr-8'>
            <div className='space-y-6'>
              <div>
                <p className='text-xs font-black tracking-widest text-indigo-950 uppercase flex items-center gap-2 mb-3 text-left'>
                  <Gamepad2 size={20} />
                  Game Mode
                </p>

                {/* Mode tabs */}
                <div className='w-full flex flex-col sm:flex-row gap-2 border-[3px] border-black rounded-3xl p-1.5 bg-slate-100 shadow-sm'>
                  <button
                    id='mode-pve-tab'
                    onClick={() => setSelectedMode('pve')}
                    className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 rounded-2xl font-black text-xs tracking-wide transition-all cursor-pointer ${
                      selectedMode === 'pve'
                        ? 'bg-indigo-900 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-950 hover:bg-slate-200'
                    }`}
                  >
                    <Bot className='w-4 h-4' />
                    VS COMPUTER
                  </button>
                  <button
                    id='mode-pvp-tab'
                    onClick={() => setSelectedMode('pvp')}
                    className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 rounded-2xl font-black text-xs tracking-wide transition-all cursor-pointer ${
                      selectedMode === 'pvp'
                        ? 'bg-indigo-900 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-950 hover:bg-slate-200'
                    }`}
                  >
                    <Users className='w-4 h-4' />
                    LOCAL FRIEND
                  </button>
                </div>
              </div>

              {/* Mode Description panel */}
              <div className='bg-slate-50 border-[3px] border-black rounded-2xl p-5 text-left'>
                <span className='text-[10px] font-black uppercase text-indigo-950 tracking-wider flex items-center gap-1.5 mb-1.5'>
                  <Sparkles className='w-3.5 h-3.5 text-indigo-900' />
                  Active Arena Dynamics
                </span>
                <p className='text-xs font-bold text-slate-500 leading-relaxed'>
                  {selectedMode === 'pve'
                    ? 'Play against our smart Minimax computer! Experience fine-grained modifiers, including Rocky Obstacles, Volcanic debris drops, fast 5s Blitz formats, or the Underdog handicap preload.'
                    : 'A classic local head-to-head match. Play with a friend on the same device. Tracks moves and scores perfectly with standard 30s turn clocks.'}
                </p>
              </div>
            </div>

            {/* Launch Action Buttons */}
            <div id='menu-actions' className='w-full space-y-4 lg:mt-auto'>
              <button
                id='start-game-btn'
                onClick={handleStart}
                className='w-full py-4.5 bg-yellow-400 border-b-8 border-black border-x-2 border-t-2 rounded-2xl font-black text-black text-lg sm:text-2xl tracking-widest uppercase hover:bg-yellow-300 hover:scale-[1.01] active:translate-y-0.5 active:border-b-4 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2'
              >
                <Play size={20} className=' fill-black' />
                PLAY GAME
              </button>

              <button
                id='rules-view-btn'
                onClick={onOpenRules}
                className='w-full py-4 bg-indigo-50 border-b-8 border-black border-x-2 border-t-2 rounded-2xl font-black text-indigo-950 text-base sm:text-lg tracking-widest uppercase hover:bg-indigo-100 hover:text-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-2'
              >
                <BookOpen size={20} />
                GAME RULES
              </button>
            </div>
          </div>

          {/* RIGHT SIDE (7 Cols): Custom Event maps, Round Format lengths, CPU difficulty */}
          <div className='lg:col-span-7 flex flex-col gap-6'>
            {/* Match format Panel */}
            <div className='w-full p-5 bg-slate-50 border-[3px] border-black rounded-2xl text-left'>
              <p className='text-xs font-black tracking-widest text-indigo-950 uppercase flex items-center gap-2 mb-3'>
                <Trophy className='w-4 h-4 text-indigo-950' />
                Match Format Length
              </p>
              <div className='grid grid-cols-3 gap-2'>
                {([1, 3, 5] as SeriesLength[]).map((rounds) => (
                  <button
                    key={rounds}
                    onClick={() => setSeriesLength(rounds)}
                    className={`py-3 text-xs sm:text-sm font-black uppercase rounded-xl border-[3px] transition-all cursor-pointer ${
                      seriesLength === rounds
                        ? 'bg-indigo-950 border-black text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {rounds === 1 ? 'Single Game' : `Best of ${rounds}`}
                  </button>
                ))}
              </div>
              <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-3'>
                {seriesLength === 1
                  ? '🔥 High stakes: a single match takes immediate victory.'
                  : `⏳ Match format series: first candidate to capture ${Math.floor(seriesLength / 2) + 1} wins takes the trophy.`}
              </p>
            </div>

            {/* AI smartness - only shown if PvE is chosen */}
            {selectedMode === 'pve' ? (
              <div
                id='ai-difficulty-selector'
                className='w-full p-5 bg-slate-50 border-[3px] border-black rounded-2xl text-left'
              >
                <div className='flex justify-between items-center mb-3'>
                  <p className='text-xs font-black tracking-widest text-indigo-950 uppercase flex items-center gap-2'>
                    <Bot className='w-4 h-4 text-indigo-950' />
                    Computer Smartness
                  </p>
                  <span className='text-[9px] uppercase font-black px-2 py-0.5 bg-indigo-950 text-white rounded-md tracking-wider'>
                    MINIMAX ENGINE
                  </span>
                </div>
                <div className='grid grid-cols-4 gap-2'>
                  {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(
                    (level) => {
                      return (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`py-2.5 text-[10px] sm:text-xs font-black uppercase rounded-xl border-[3px] tracking-wider transition-all cursor-pointer ${
                            difficulty === level
                              ? 'bg-indigo-950 border-black text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {level}
                        </button>
                      );
                    },
                  )}
                </div>
                <p className='text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-3'>
                  {difficulty === 'easy' &&
                    '👶 computer moves semi-randomly. perfect for beginners!'}
                  {difficulty === 'medium' &&
                    '🧠 computer actively blocks lines & looks one step ahead.'}
                  {difficulty === 'hard' &&
                    '🔥 computer intercepts tactical sequences with deeper planning.'}
                  {difficulty === 'expert' &&
                    '💀 flawless minimax machine calculation. almost impossible to beat!'}
                </p>
              </div>
            ) : (
              /* Local PVP setup cards */
              <div className='w-full p-5 bg-slate-50 border-[3px] border-black rounded-2xl text-left'>
                <p className='text-xs font-black tracking-widest text-indigo-950 uppercase mb-3'>
                  👥 Seat Assignments & Colors
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <div className='flex items-center gap-3.5 p-3.5 bg-white border-2 border-black rounded-xl shadow-sm'>
                    <span className='w-8 h-8 rounded-full bg-red-500 border-2 border-black shadow-inner relative flex items-center justify-center font-black text-white text-[10px]'>
                      1
                    </span>
                    <div>
                      <p className='font-extrabold text-xs uppercase text-indigo-950'>
                        Player One (Red)
                      </p>
                      <p className='text-[10px] text-slate-450 font-bold uppercase text-slate-400'>
                        First Action
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3.5 p-3.5 bg-white border-2 border-black rounded-xl shadow-sm'>
                    <span className='w-8 h-8 rounded-full bg-yellow-400 border-2 border-black shadow-inner relative flex items-center justify-center font-black text-black text-[10px]'>
                      2
                    </span>
                    <div>
                      <p className='font-extrabold text-xs uppercase text-indigo-950'>
                        Player Two (Yellow)
                      </p>
                      <p className='text-[10px] text-slate-450 font-bold uppercase text-slate-400'>
                        Second Action
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PVE Event selection list - only visible when PVE is picked */}
            {selectedMode === 'pve' && (
              <div className='w-full p-5 bg-slate-50 border-[3px] border-black rounded-2xl text-left'>
                <p className='text-xs font-black tracking-widest text-indigo-950 uppercase mb-3'>
                  🎭 Active Arena Event Maps
                </p>
                <div className='space-y-2 max-h-46.25 md:max-h-60 overflow-y-auto pr-1'>
                  {eventsInfo.map((evt) => {
                    const isSelected = gameEvent === evt.id;
                    return (
                      <button
                        key={evt.id}
                        onClick={() => setGameEvent(evt.id)}
                        className={`w-full flex items-start gap-3.5 p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-amber-50 border-black shadow-[3px_3px_0_#000000] -translate-y-0.5'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className='p-2 bg-slate-50 border-2 border-black rounded-xl flex items-center justify-center'>
                          {evt.icon}
                        </span>
                        <div className='flex-1'>
                          <div className='flex justify-between items-center'>
                            <span className='font-black text-xs uppercase tracking-wide text-indigo-950'>
                              {evt.name}
                            </span>
                            {isSelected && (
                              <span className='text-[9px] bg-amber-400 px-2 py-0.5 rounded-md font-black uppercase text-black border border-black shadow-sm tracking-wider'>
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className='text-[10px] sm:text-xs text-slate-500 font-semibold leading-normal mt-1'>
                            {evt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer label */}
        <p className='text-[10px] sm:text-xs font-black text-slate-400 mt-8 tracking-wider uppercase'>
          100% Offline Compatible
        </p>
      </div>
    </div>
  );
}
