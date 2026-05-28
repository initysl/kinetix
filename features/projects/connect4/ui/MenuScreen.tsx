import { useState } from 'react';
import { GameMode, Difficulty, SeriesLength, GameEvent } from '../types';

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

  const eventsInfo = [
    {
      id: 'classic' as GameEvent,
      name: 'Classic Arena',
      icon: '🌟',
      desc: 'Standard professional rules with 30s turns.',
      color: 'border-emerald-400 text-emerald-800',
    },
    {
      id: 'blitz' as GameEvent,
      name: 'Blitz Arena',
      icon: '⚡',
      desc: 'High-speed battle with 5s turn timer!',
      color: 'border-amber-400 text-amber-800',
    },
    {
      id: 'obstacles' as GameEvent,
      name: 'Rocky Obstacles',
      icon: '🪨',
      desc: 'Immovable stone boulders block cells randomly.',
      color: 'border-indigo-400 text-indigo-800',
    },
    {
      id: 'anarchy' as GameEvent,
      name: 'Volcanic Anarchy',
      icon: '🌋',
      desc: 'A random neutral blocker falls every 4 plays.',
      color: 'border-orange-400 text-orange-800',
    },
    {
      id: 'deficit' as GameEvent,
      name: 'Underdog Deficit',
      icon: '🛡️',
      desc: 'You start with 3 pre-placed CPU chips at the bottom.',
      color: 'border-rose-400 text-rose-800',
    },
  ];

  return (
    <div
      id='menu-screen-container'
      className='min-h-screen flex items-center justify-center py-10 px-4 bg-indigo-900'
    >
      <div
        id='menu-card'
        className='w-full max-w-lg bg-white text-black border-b-12 border-black border-x-4 border-t-4 rounded-[40px] p-6 sm:p-8 relative flex flex-col items-center shadow-2xl'
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
        <div className='w-full flex gap-1.5 border-[3px] border-black rounded-3xl mb-5 p-1.5 bg-slate-100 shadow-sm'>
          <button
            id='mode-pve-tab'
            onClick={() => setSelectedMode('pve')}
            className={`flex-1 py-3 text-center rounded-xl font-black text-xs tracking-wide transition-all cursor-pointer ${
              selectedMode === 'pve'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            🤖 VS COMPUTER (AI)
          </button>
          <button
            id='mode-pvp-tab'
            onClick={() => setSelectedMode('pvp')}
            className={`flex-1 py-3 text-center rounded-xl font-black text-xs tracking-wide transition-all cursor-pointer ${
              selectedMode === 'pvp'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            👥 PASS & PLAY (FRIEND)
          </button>
        </div>

        {/* --- Series Rounds (Match Format) Configuration --- */}
        <div className='w-full mb-5 p-4 bg-slate-50 border-[3px] border-black rounded-2xl'>
          <p className='text-xs font-black tracking-widest text-indigo-950 uppercase mb-3 text-center'>
            🏆 Match Format (Series)
          </p>
          <div className='grid grid-cols-3 gap-2'>
            {([1, 3, 5] as SeriesLength[]).map((rounds) => (
              <button
                key={rounds}
                onClick={() => setSeriesLength(rounds)}
                className={`py-2 text-xs font-black uppercase rounded-xl border-[3px] transition-all cursor-pointer ${
                  seriesLength === rounds
                    ? 'bg-indigo-950 border-black text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                }`}
              >
                {rounds === 1 ? 'Single Game' : `Best of ${rounds}`}
              </button>
            ))}
          </div>
          <p className='text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider mt-2.5'>
            {seriesLength === 1
              ? '🔥 High stakes: play one winner-take-all round.'
              : `⏳ Marathon: first player to win ${Math.floor(seriesLength / 2) + 1} rounds wins the match.`}
          </p>
        </div>

        {/* AI Difficulty configuration - only visible when PVE is picked */}
        {selectedMode === 'pve' && (
          <div
            id='ai-difficulty-selector'
            className='w-full mb-5 p-4 bg-slate-50 border-[3px] border-black rounded-2xl'
          >
            <p className='text-xs font-black tracking-widest text-indigo-950 uppercase mb-3 text-center'>
              🤖 Computer Smartness
            </p>
            <div className='grid grid-cols-4 gap-1.5'>
              {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(
                (level) => {
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-2 text-[10px] sm:text-xs font-black uppercase rounded-xl border-[3px] tracking-wider transition-all cursor-pointer ${
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
          </div>
        )}

        {/* PVE Event selection list - only visible when PVE is picked */}
        {selectedMode === 'pve' && (
          <div className='w-full mb-6 p-4 bg-slate-50 border-[3px] border-black rounded-2xl'>
            <p className='text-xs font-black tracking-widest text-indigo-950 uppercase mb-3 text-center'>
              🎭 Computer Arena Event Map
            </p>
            <div className='space-y-2 max-h-43.75 overflow-y-auto pr-1'>
              {eventsInfo.map((evt) => {
                const isSelected = gameEvent === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setGameEvent(evt.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-black shadow-[2px_2px_0_#000000]'
                        : 'bg-white border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <span className='text-2xl pt-0.5'>{evt.icon}</span>
                    <div className='flex-1 text-left'>
                      <div className='flex justify-between items-center'>
                        <span className='font-extrabold text-xs uppercase tracking-wide text-indigo-950'>
                          {evt.name}
                        </span>
                        {isSelected && (
                          <span className='text-[9px] bg-amber-400 px-1.5 py-0.5 rounded-md font-black uppercase text-black border border-black shadow-sm'>
                            SELECTED
                          </span>
                        )}
                      </div>
                      <p className='text-[10px] text-slate-500 font-semibold leading-snug mt-0.5'>
                        {evt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div id='menu-actions' className='w-full space-y-4'>
          <button
            id='start-game-btn'
            onClick={handleStart}
            className='w-full py-4 bg-yellow-400 border-b-8 border-black border-x-2 border-t-2 rounded-2xl font-black text-black text-lg tracking-widest uppercase hover:bg-yellow-300 hover:scale-[1.01] active:translate-y-0.5 active:border-b-4 transition-all cursor-pointer shadow-lg'
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
          Custom Arena Matches • No Installation Needed
        </p>
      </div>
    </div>
  );
}
