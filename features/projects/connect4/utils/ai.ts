import { BoardState, Player, CellValue, WinningLine } from '../types';

const ROWS = 6;
const COLS = 7;

/**
 * Returns the lowest available row index in the given column,
 * or -1 if the column is full.
 */
export function getLowestAvailableRow(board: BoardState, col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1;
}

/**
 * Checks if the board contains a winning line.
 */
export function checkWin(board: BoardState): WinningLine | null {
  // Horizontal check
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const p = board[r][c];
      if (
        (p === 1 || p === 2) &&
        p === board[r][c + 1] &&
        p === board[r][c + 2] &&
        p === board[r][c + 3]
      ) {
        return {
          winner: p,
          cells: [
            [r, c],
            [r, c + 1],
            [r, c + 2],
            [r, c + 3],
          ],
        };
      }
    }
  }

  // Vertical check
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = board[r][c];
      if (
        (p === 1 || p === 2) &&
        p === board[r + 1][c] &&
        p === board[r + 2][c] &&
        p === board[r + 3][c]
      ) {
        return {
          winner: p,
          cells: [
            [r, c],
            [r + 1, c],
            [r + 2, c],
            [r + 3, c],
          ],
        };
      }
    }
  }

  // Positive Diagonal check (bottom-left to top-right)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const p = board[r][c];
      if (
        (p === 1 || p === 2) &&
        p === board[r - 1][c + 1] &&
        p === board[r - 2][c + 2] &&
        p === board[r - 3][c + 3]
      ) {
        return {
          winner: p,
          cells: [
            [r, c],
            [r - 1, c + 1],
            [r - 2, c + 2],
            [r - 3, c + 3],
          ],
        };
      }
    }
  }

  // Negative Diagonal check (top-left to bottom-right)
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const p = board[r][c];
      if (
        (p === 1 || p === 2) &&
        p === board[r + 1][c + 1] &&
        p === board[r + 2][c + 2] &&
        p === board[r + 3][c + 3]
      ) {
        return {
          winner: p,
          cells: [
            [r, c],
            [r + 1, c + 1],
            [r + 2, c + 2],
            [r + 3, c + 3],
          ],
        };
      }
    }
  }

  return null;
}

/**
 * Checks if the board is completely full (Draw)
 */
export function isBoardFull(board: BoardState): boolean {
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) {
      return false;
    }
  }
  return true;
}

/**
 * Helper to count occurrences of a piece in a window of 4 cells
 */
function evaluateWindow(window: CellValue[], player: Player): number {
  let score = 0;
  const oppPlayer: Player = player === 1 ? 2 : 1;

  const playerCount = window.filter((cell) => cell === player).length;
  const emptyCount = window.filter((cell) => cell === null).length;
  const oppCount = window.filter((cell) => cell === oppPlayer).length;

  if (playerCount === 4) {
    score += 100000;
  } else if (playerCount === 3 && emptyCount === 1) {
    score += 500;
  } else if (playerCount === 2 && emptyCount === 2) {
    score += 15;
  }

  if (oppCount === 3 && emptyCount === 1) {
    score -= 800; // block opponent!
  } else if (oppCount === 2 && emptyCount === 2) {
    score -= 10;
  }

  return score;
}

/**
 * Position evaluation heuristic for a given player coordinate lookups.
 */
function evaluateBoard(board: BoardState, player: Player): number {
  let score = 0;

  // Center column preference
  const centerCol = 3;
  let centerCount = 0;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol] === player) {
      centerCount++;
    }
  }
  score += centerCount * 30;

  // Adjacent columns preference
  for (let r = 0; r < ROWS; r++) {
    if (board[r][2] === player) score += 10;
    if (board[r][4] === player) score += 10;
  }

  // Horizontal evaluation
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [
        board[r][c],
        board[r][c + 1],
        board[r][c + 2],
        board[r][c + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Vertical evaluation
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const window = [
        board[r][c],
        board[r + 1][c],
        board[r + 2][c],
        board[r + 3][c],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Positive diagonal
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [
        board[r][c],
        board[r - 1][c + 1],
        board[r - 2][c + 2],
        board[r - 3][c + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  // Negative diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [
        board[r][c],
        board[r + 1][c + 1],
        board[r + 2][c + 2],
        board[r + 3][c + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }

  return score;
}

/**
 * Minimax with Alpha-Beta pruning
 */
function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player,
): { score: number; column: number } {
  const humanPlayer: Player = aiPlayer === 1 ? 2 : 1;
  const win = checkWin(board);
  const full = isBoardFull(board);

  if (win) {
    if (win.winner === aiPlayer) {
      return { score: 1000000 + depth, column: -1 }; // prefer winning sooner
    } else {
      return { score: -1000000 - depth, column: -1 }; // prefer losing later if inevitable
    }
  }

  if (full) {
    return { score: 0, column: -1 };
  }

  if (depth === 0) {
    return { score: evaluateBoard(board, aiPlayer), column: -1 };
  }

  // Get valid moves (columns that are not full)
  const validCols: number[] = [];
  // Prioritize middle columns for search efficiency
  const colOrder = [3, 2, 4, 1, 5, 0, 6];
  for (const c of colOrder) {
    if (board[0][c] === null) {
      validCols.push(c);
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let bestColumn = validCols[0] ?? 0;

    for (const col of validCols) {
      const row = getLowestAvailableRow(board, col);
      // Make move
      board[row][col] = aiPlayer;
      const result = minimax(board, depth - 1, alpha, beta, false, aiPlayer);
      // Undo move
      board[row][col] = null;

      if (result.score > value) {
        value = result.score;
        bestColumn = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        break; // beta cutoff
      }
    }
    return { score: value, column: bestColumn };
  } else {
    let value = Infinity;
    let bestColumn = validCols[0] ?? 0;

    for (const col of validCols) {
      const row = getLowestAvailableRow(board, col);
      // Make move
      board[row][col] = humanPlayer;
      const result = minimax(board, depth - 1, alpha, beta, true, aiPlayer);
      // Undo move
      board[row][col] = null;

      if (result.score < value) {
        value = result.score;
        bestColumn = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) {
        break; // alpha cutoff
      }
    }
    return { score: value, column: bestColumn };
  }
}

/**
 * Calculates the best move for Player 2 (AI),
 * using the selected difficulty level.
 */
export function getComputerMove(
  board: BoardState,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert',
  aiPlayer: Player = 2,
): number {
  const validCols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) {
      validCols.push(c);
    }
  }

  if (validCols.length === 0) {
    return -1;
  }

  const humanPlayer: Player = aiPlayer === 1 ? 2 : 1;

  // 1. EASY DIFFICULTY:
  // Pure random choice, but very tiny chance to win if right there
  if (difficulty === 'easy') {
    // 20% chance of making a logical winning or blocking move if one exists, 80% random
    if (Math.random() > 0.2) {
      return validCols[Math.floor(Math.random() * validCols.length)];
    }
    // Check if can win or must block, otherwise random
  }

  // 2. MEDIUM DIFFICULTY:
  // Immediate win lookup, and immediate single-step block lookup, else random positional choose
  if (difficulty === 'easy' || difficulty === 'medium') {
    // Check if AI can win right now
    for (const col of validCols) {
      const row = getLowestAvailableRow(board, col);
      const tempBoard = board.map((r) => [...r]);
      tempBoard[row][col] = aiPlayer;
      if (checkWin(tempBoard)) {
        return col;
      }
    }

    // Check if opponent is about to win and block them
    for (const col of validCols) {
      const row = getLowestAvailableRow(board, col);
      const tempBoard = board.map((r) => [...r]);
      tempBoard[row][col] = humanPlayer;
      if (checkWin(tempBoard)) {
        return col;
      }
    }

    if (difficulty === 'medium') {
      // Pick columns closer to the center preferentially
      const scoreCol = (col: number) => {
        return 6 - Math.abs(col - 3); // column 3 is score 6, col 2&4 is score 5, col 1&5 is 4, col 0&6 is 3
      };
      const sortedCols = [...validCols].sort(
        (a, b) => scoreCol(b) - scoreCol(a),
      );
      // Add a bit of randomness
      if (Math.random() < 0.4) {
        return validCols[Math.floor(Math.random() * validCols.length)];
      }
      return sortedCols[0];
    }
  }

  // 3. HARD DIFFICULTY:
  // Minimax with depth 3
  if (difficulty === 'hard') {
    const tempBoard = board.map((r) => [...r]);
    const { column } = minimax(
      tempBoard,
      3,
      -Infinity,
      Infinity,
      true,
      aiPlayer,
    );
    return column !== -1 ? column : validCols[0];
  }

  // 4. EXPERT DIFFICULTY:
  // Minimax with depth 5 (really smart!)
  if (difficulty === 'expert') {
    const tempBoard = board.map((r) => [...r]);
    const { column } = minimax(
      tempBoard,
      5,
      -Infinity,
      Infinity,
      true,
      aiPlayer,
    );
    return column !== -1 ? column : validCols[0];
  }

  return validCols[Math.floor(Math.random() * validCols.length)];
}
