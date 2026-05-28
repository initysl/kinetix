export type Player = 1 | 2;

export type CellValue = Player | 'obstacle' | 'anarchy_disc' | null;

export type BoardState = CellValue[][];

export type GameMode = 'pvp' | 'pve';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GamePhase = 'menu' | 'rules' | 'playing' | 'paused' | 'gameover';

export type SeriesLength = 1 | 3 | 5; // Total rounds in the match series: single game, best of 3, best of 5

export type GameEvent =
  | 'classic'
  | 'blitz'
  | 'obstacles'
  | 'anarchy'
  | 'deficit';

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  turnLimitSeconds: number; // e.g., 30
  seriesLength: SeriesLength;
  gameEvent: GameEvent;
}

export interface PlayerStats {
  scoreP1: number;
  scoreP2: number;
}

export interface WinningLine {
  cells: [number, number][]; // coordinates [row, col] of the winning 4
  winner: Player;
}
