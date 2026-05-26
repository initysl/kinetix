'use client';
import React, { useState } from 'react';
import { GamePhase, GameMode, Difficulty } from './types';
import GameScreen from './ui/GameScreen';
import MenuScreen from './ui/MenuScreen';
import RulesScreen from './ui/RulesScreen';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [mode, setMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const handleStartGame = (
    selectedMode: GameMode,
    selectedDifficulty: Difficulty,
  ) => {
    setMode(selectedMode);
    setDifficulty(selectedDifficulty);
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
          onBackToMenu={() => setPhase('menu')}
        />
      )}
    </div>
  );
}
