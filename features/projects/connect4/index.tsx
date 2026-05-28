'use client';
import { useState } from 'react';
import {
  GamePhase,
  GameMode,
  Difficulty,
  SeriesLength,
  GameEvent,
} from './types';
import GameScreen from './ui/GameScreen';
import MenuScreen from './ui/MenuScreen';
import RulesScreen from './ui/RulesScreen';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [mode, setMode] = useState<GameMode>('pve');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [seriesLength, setSeriesLength] = useState<SeriesLength>(1);
  const [gameEvent, setGameEvent] = useState<GameEvent>('classic');

  const handleStartGame = (
    selectedMode: GameMode,
    selectedDifficulty: Difficulty,
    selectedSeriesLength: SeriesLength,
    selectedGameEvent: GameEvent,
  ) => {
    setMode(selectedMode);
    setDifficulty(selectedDifficulty);
    setSeriesLength(selectedSeriesLength);
    setGameEvent(selectedGameEvent);
    setPhase('playing');
  };

  return (
    <div className='min-h-screen bg-indigo-900 select-none overflow-x-hidden'>
      {phase === 'menu' && (
        <MenuScreen
          onStartGame={handleStartGame}
          onOpenRules={() => setPhase('rules')}
        />
      )}

      {phase === 'rules' && <RulesScreen onBack={() => setPhase('menu')} />}

      {phase === 'playing' && (
        <GameScreen
          mode={mode}
          difficulty={difficulty}
          seriesLength={seriesLength}
          gameEvent={gameEvent}
          onBackToMenu={() => setPhase('menu')}
        />
      )}
    </div>
  );
}
