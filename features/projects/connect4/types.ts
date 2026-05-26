export type Player = 1 | 2;

export type CellValue = Player | null;

/**
 * Representing the 6 rows x 7 columns board.
 * board[row][col] is the cell at that row and column from top (0) to bottom (5).
 */
export type BoardState = CellValue[][];

export type GameMode = 'pvp' | 'pve' | 'online';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GamePhase = 'menu' | 'rules' | 'playing' | 'paused' | 'gameover';

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  turnLimitSeconds: number; // e.g., 30
}

export interface PlayerStats {
  scoreP1: number;
  scoreP2: number;
}

export interface WinningLine {
  cells: [number, number][]; // coordinates [row, col] of the winning 4
  winner: Player;
}
