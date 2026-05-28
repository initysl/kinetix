'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoardState,
  Player,
  Difficulty,
  GameMode,
  WinningLine,
  SeriesLength,
  GameEvent,
} from '../types';
import {
  getLowestAvailableRow,
  checkWin,
  isBoardFull,
  getComputerMove,
} from '../utils/ai';
import {
  playDropSound,
  playClickSound,
  playWinSound,
  playTimeoutSound,
} from '../utils/sound';

interface GameScreenProps {
  mode: GameMode;
  difficulty: Difficulty;
  seriesLength: SeriesLength;
  gameEvent: GameEvent;
  onBackToMenu: () => void;
}

const ROWS = 6;
const COLS = 7;

export default function GameScreen({
  mode,
  difficulty,
  seriesLength,
  gameEvent,
  onBackToMenu,
}: GameScreenProps) {
  // Dynamic Turn clock based on events: 5 seconds for Blitz, otherwise 30 seconds
  const defaultTurnLimit = gameEvent === 'blitz' ? 5 : 30;

  // Track the actual board creation setup
  const createInitialBoard = useCallback(() => {
    const newBoard = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null));

    if (gameEvent === 'obstacles') {
      // Place exactly 3 immovable stone blocks in row 3 to 5 randomly
      // ensuring columns chosen are distinct so they don't block an entire column at the start
      const colsToUse = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
      for (let i = 0; i < 3; i++) {
        const randomCol = colsToUse[i];
        const randomRow = Math.floor(Math.random() * 3) + 3; // row 3, 4, 5
        newBoard[randomRow][randomCol] = 'obstacle';
      }
    } else if (gameEvent === 'deficit') {
      // Pre-populate 3 Yellow CPU checkmarks at the bottom of standard central columns
      newBoard[5][2] = 2;
      newBoard[5][3] = 2;
      newBoard[5][4] = 2;
    }

    return newBoard;
  }, [gameEvent]);

  // Game Board state
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard());

  // Matches, Rounds, and Scores tracking states
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState({ scoreP1: 0, scoreP2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [timeLeft, setTimeLeft] = useState(defaultTurnLimit);
  const [isAILoading, setIsAILoading] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [lastPlacedCell, setLastPlacedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Custom game events notices
  const [anarchyNotification, setAnarchyNotification] = useState<string | null>(
    null,
  );

  // Match Series Championship Status
  const [seriesChampion, setSeriesChampion] = useState<Player | null>(null);

  // Advanced features state
  type HistoryItem = {
    board: BoardState;
    currentPlayer: Player;
    lastPlacedCell: { row: number; col: number } | null;
    timeLeft: number;
    winner: Player | 'draw' | null;
    winningLine: WinningLine | null;
  };
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [movesLog, setMovesLog] = useState<
    { stepNumber: number; player: Player; col: number; row: number }[]
  >([]);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // AI & Visual Juice status
  const [aiHintCol, setAiHintCol] = useState<number | null>(null);
  const [isBoardJuiced, setIsBoardJuiced] = useState(false);
  const [confetti, setConfetti] = useState<
    {
      id: number;
      x: number;
      color: string;
      size: number;
      delay: number;
      duration: number;
    }[]
  >([]);

  // Trigger rich falling confetti when either player wins
  useEffect(() => {
    if (winner !== null && winner !== 'draw') {
      const colors = [
        '#ef4444',
        '#facc15',
        '#3b82f6',
        '#10b981',
        '#ec4899',
        '#8b5cf6',
        '#a855f7',
      ];
      const generated = Array.from({ length: 100 }).map((_, idx) => ({
        id: idx,
        x: Math.random() * 100, // screen width percentage
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 6, // 6px to 16px
        delay: Math.random() * 4, // delay staggered up to 4s
        duration: Math.random() * 3 + 2.5, // fall speed
      }));
      setConfetti(generated);
    } else {
      setConfetti([]);
    }
  }, [winner]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // We keep a reference to current state to avoid closure bugs in intervals
  const stateRef = useRef({ board, currentPlayer, winner, isAILoading });
  useEffect(() => {
    stateRef.current = { board, currentPlayer, winner, isAILoading };
  }, [board, currentPlayer, winner, isAILoading]);

  // Restart the countdown timer for the current turn
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(defaultTurnLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isSoundMuted) {
            playTimeoutSound();
          }
          handleTimeout();
          return defaultTurnLimit; // reset counter
        }
        return prev - 1;
      });
    }, 1000);
  }, [defaultTurnLimit, isSoundMuted]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Drop a disc in column `colIndex`
  const makeMove = useCallback(
    (colIndex: number, bypassLoading = false) => {
      const {
        board: currentBoard,
        currentPlayer: curr,
        winner: currentWinner,
        isAILoading: loading,
      } = stateRef.current;
      if (
        currentWinner !== null ||
        seriesChampion !== null ||
        (loading && !bypassLoading) ||
        colIndex < 0 ||
        colIndex >= COLS
      )
        return;

      const row = getLowestAvailableRow(currentBoard, colIndex);
      if (row === -1) return; // Column full

      // Reset calculated AI hints upon any manual or automated drop
      setAiHintCol(null);

      // Punch the tactile physical board bounce juice animation
      setIsBoardJuiced(true);
      setTimeout(() => {
        setIsBoardJuiced(false);
      }, 250);

      if (!isSoundMuted) {
        playDropSound();
      }

      // Save previous state to history stack for advanced Undo feature
      setHistory((prev) => [
        ...prev,
        {
          board: currentBoard.map((r) => [...r]),
          currentPlayer: curr,
          lastPlacedCell: lastPlacedCell,
          timeLeft: timeLeft,
          winner: winner,
          winningLine: winningLine,
        },
      ]);

      // Copy and edit board
      const newBoard = currentBoard.map((r) => [...r]);
      newBoard[row][colIndex] = curr;

      // Prep variables for volcanic drops
      let actualBoard = newBoard;
      let nextWinner: Player | 'draw' | null = null;
      let nextWinningLine: WinningLine | null = null;

      // Check outcome
      const winResult = checkWin(actualBoard);

      const newMovesCount = movesLog.length + 1;

      // Volcanic Anarchy dynamic blocker drop code
      if (
        gameEvent === 'anarchy' &&
        !winResult &&
        !isBoardFull(actualBoard) &&
        newMovesCount % 4 === 0
      ) {
        // Collect valid non-full columns
        const availableCols: number[] = [];
        for (let c = 0; c < COLS; c++) {
          if (actualBoard[0][c] === null) {
            availableCols.push(c);
          }
        }
        if (availableCols.length > 0) {
          const volcanoCol =
            availableCols[Math.floor(Math.random() * availableCols.length)];
          const volcanoRow = getLowestAvailableRow(actualBoard, volcanoCol);
          if (volcanoRow !== -1) {
            actualBoard[volcanoRow][volcanoCol] = 'anarchy_disc';
            setAnarchyNotification(
              `🌋 Volcanic Debris crashed into Column ${volcanoCol + 1}!`,
            );
            setTimeout(() => setAnarchyNotification(null), 3500);
          }
        }
      }

      setBoard(actualBoard);
      setLastPlacedCell({ row, col: colIndex });

      // Populate game moves flow log
      setMovesLog((prev) => [
        ...prev,
        {
          stepNumber: prev.length + 1,
          player: curr,
          col: colIndex,
          row: row,
        },
      ]);

      // Re-evaluate win with possibly volcanic block pre-calculated
      const finalWinResult = checkWin(actualBoard);

      if (finalWinResult) {
        clearTimer();
        setWinner(finalWinResult.winner);
        setWinningLine(finalWinResult);
        if (!isSoundMuted) {
          playWinSound();
        }

        // Update round scores and evaluate series champion
        const updatedScores = {
          scoreP1:
            finalWinResult.winner === 1 ? scores.scoreP1 + 1 : scores.scoreP1,
          scoreP2:
            finalWinResult.winner === 2 ? scores.scoreP2 + 1 : scores.scoreP2,
        };
        setScores(updatedScores);

        const requiredWins = Math.floor(seriesLength / 2) + 1;
        if (
          finalWinResult.winner === 1 &&
          updatedScores.scoreP1 >= requiredWins
        ) {
          setSeriesChampion(1);
        } else if (
          finalWinResult.winner === 2 &&
          updatedScores.scoreP2 >= requiredWins
        ) {
          setSeriesChampion(2);
        }
        return;
      }

      if (isBoardFull(actualBoard)) {
        clearTimer();
        setWinner('draw');
        return;
      }

      // Toggle turn
      const nextPlayer: Player = curr === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      resetTimer();
    },
    [
      clearTimer,
      resetTimer,
      isSoundMuted,
      lastPlacedCell,
      timeLeft,
      winner,
      winningLine,
      mode,
      scores,
      gameEvent,
      movesLog.length,
      seriesLength,
      seriesChampion,
    ],
  );

  // Handles turn timeout (computes a random valid move for current player)
  const handleTimeout = useCallback(() => {
    const { board: currentBoard } = stateRef.current;
    const validCols: number[] = [];
    for (let c = 0; c < COLS; c++) {
      if (currentBoard[0][c] === null) {
        validCols.push(c);
      }
    }
    if (validCols.length > 0) {
      const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
      makeMove(randomCol, true);
    }
  }, [makeMove]);

  // Handle computer move logic (PvE AI)
  useEffect(() => {
    if (
      mode === 'pve' &&
      currentPlayer === 2 &&
      winner === null &&
      seriesChampion === null
    ) {
      clearTimer();
      setIsAILoading(true);

      // Slower thinking on Expert for realism, rapid on Easy
      const delay =
        difficulty === 'easy'
          ? 400 + Math.random() * 300
          : 900 + Math.random() * 650;

      const timer = setTimeout(() => {
        const { board: currentBoard } = stateRef.current;
        const aiMove = getComputerMove(currentBoard, difficulty);
        if (aiMove !== -1) {
          makeMove(aiMove, true); // Bypass the isAILoading block
        }
        setIsAILoading(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [
    currentPlayer,
    mode,
    winner,
    difficulty,
    makeMove,
    clearTimer,
    seriesChampion,
  ]);

  // Start game countdown initially
  useEffect(() => {
    resetTimer();
    return () => clearTimer();
  }, [resetTimer, clearTimer]);

  // Keyboard navigation support for Connect 4 Board
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (winner !== null || seriesChampion !== null || isAILoading) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setHoveredCol((prev) => {
          if (prev === null) return 3;
          const next = prev - 1;
          return next < 0 ? COLS - 1 : next;
        });
        if (!isSoundMuted) {
          playClickSound();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setHoveredCol((prev) => {
          if (prev === null) return 3;
          const next = prev + 1;
          return next >= COLS ? 0 : next;
        });
        if (!isSoundMuted) {
          playClickSound();
        }
      } else if (e.key === 'Spacebar' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (hoveredCol !== null) {
          makeMove(hoveredCol);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredCol, winner, seriesChampion, isAILoading, makeMove, isSoundMuted]);

  // Start next round in the series
  const handleNextRound = () => {
    clearTimer();
    setBoard(createInitialBoard());
    setCurrentRound((prev) => prev + 1);
    setCurrentPlayer(1);
    setWinner(null);
    setWinningLine(null);
    setLastPlacedCell(null);
    setHistory([]);
    setMovesLog([]);
    setAiHintCol(null);
    resetTimer();
  };

  // Quick reset for current board
  const handleQuickRestart = () => {
    clearTimer();
    setBoard(createInitialBoard());
    setCurrentRound(1);
    setScores({ scoreP1: 0, scoreP2: 0 });
    setSeriesChampion(null);
    setCurrentPlayer(1);
    setWinner(null);
    setWinningLine(null);
    setLastPlacedCell(null);
    setHistory([]);
    setMovesLog([]);
    setAiHintCol(null);
    resetTimer();
  };

  // Full Hard Reset
  const handleHardReset = () => {
    handleQuickRestart();
  };

  // Undo previous turn action
  const handleUndo = () => {
    if (
      history.length === 0 ||
      isAILoading ||
      winner !== null ||
      seriesChampion !== null
    )
      return;

    // For PvE games, we must undo TWO steps (AI move + player move) for a clean client state
    if (mode === 'pve') {
      if (history.length >= 2) {
        // Undo twice
        const targetState = history[history.length - 2];
        setBoard(targetState.board);
        setCurrentPlayer(targetState.currentPlayer);
        setLastPlacedCell(targetState.lastPlacedCell);
        setWinner(targetState.winner);
        setWinningLine(targetState.winningLine);
        setHistory((prev) => prev.slice(0, -2));
        setMovesLog((prev) => prev.slice(0, -2));
        if (!isSoundMuted) {
          playDropSound();
        }
        resetTimer();
      }
    } else {
      // Local 2 player PvP undoes one step
      const targetState = history[history.length - 1];
      setBoard(targetState.board);
      setCurrentPlayer(targetState.currentPlayer);
      setLastPlacedCell(targetState.lastPlacedCell);
      setWinner(targetState.winner);
      setWinningLine(targetState.winningLine);
      setHistory((prev) => prev.slice(0, -1));
      setMovesLog((prev) => prev.slice(0, -1));
      if (!isSoundMuted) {
        playDropSound();
      }
      resetTimer();
    }
  };

  // Suggest the single highest-probability win/block column using the minimax utility
  const handleGetHint = useCallback(() => {
    if (winner !== null || seriesChampion !== null || isAILoading) return;
    const bestMove = getComputerMove(board, 'hard');
    if (bestMove !== -1) {
      setAiHintCol(bestMove);
      if (!isSoundMuted) {
        playClickSound();
      }
    }
  }, [board, isAILoading, winner, seriesChampion, isSoundMuted]);

  const toggleSound = () => {
    setIsSoundMuted((p) => !p);
  };

  const isWinningCell = (r: number, c: number) => {
    if (!winningLine) return false;
    return winningLine.cells.some(([winR, winC]) => winR === r && winC === c);
  };

  const isPlayer1Turn = currentPlayer === 1;

  // Formatting strings for visual banners
  const getEventBannerText = () => {
    switch (gameEvent) {
      case 'blitz':
        return '⚡ Blitz Arena (5s turn clock!)';
      case 'obstacles':
        return '🪨 Obstacles Arena - Blocks are active';
      case 'anarchy':
        return '🌋 Volcanic Anarchy - Fast debris drops';
      case 'deficit':
        return '🛡️ Underdog Handicap - CPU is preloaded';
      default:
        return '🌟 Classic Connect Four Arena';
    }
  };

  return (
    <div
      id='game-screen-wrapper'
      className='min-h-screen py-6 px-4 bg-indigo-900 text-white flex flex-col items-center justify-between relative overflow-hidden'
    >
      {/* Visual background confetti explosion generator */}
      {confetti.map((c) => (
        <span
          key={c.id}
          className='absolute rounded-full pointer-events-none animate-confetti-fall z-50 text-xs shadow-md'
          style={{
            left: `${c.x}%`,
            top: `-24px`,
            backgroundColor: c.color,
            width: `${c.size}px`,
            height: `${c.size}px`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}

      {/* Volcanic Anarchy falling debri action alert */}
      {anarchyNotification && (
        <div className='fixed top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-black border-4 border-black px-6 py-2.5 rounded-full font-black text-xs uppercase z-50 tracking-wider shadow-[4px_4px_0_#000000] flex items-center gap-2 animate-bounce'>
          <span>🌋</span> {anarchyNotification}
        </div>
      )}

      {/* HEADER CONTROLS */}
      <header
        id='game-header-bar'
        className='w-full max-w-5xl flex items-center justify-between mb-4 z-20'
      >
        <button
          id='back-menu-btn'
          onClick={onBackToMenu}
          className='
            px-4 py-2 sm:px-6 sm:py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-xs sm:text-sm rounded-xl 
            border-b-4 border-black border-x-2 border-t-2 shadow-md transition-all cursor-pointer hover:scale-102 active:translate-y-px active:border-b-2
          '
        >
          Menu
        </button>

        <div className='flex flex-col items-center'>
          <p
            id='game-mode-banner'
            className='text-sm font-black text-slate-300 uppercase tracking-widest text-center'
          >
            {mode === 'pve' ? '🤖 Vs Computer' : '👥 Local Friends'}
          </p>
          <p
            id='game-event-banner'
            className='text-[10px] font-bold text-amber-300 uppercase tracking-wide mt-0.5 text-center px-2 bg-black/25 rounded-md'
          >
            {getEventBannerText()}
          </p>
        </div>

        <button
          id='quick-restart-btn'
          onClick={handleQuickRestart}
          className='
            px-4 py-2 sm:px-6 sm:py-2.5 bg-indigo-950 hover:bg-slate-800 text-white font-black uppercase text-xs sm:text-sm rounded-xl 
            border-b-4 border-white/20 border-x-2 border-t-2 shadow-md transition-all cursor-pointer hover:scale-102 active:translate-y-px active:border-b-0
          '
        >
          Restart Match
        </button>
      </header>

      {/* ROUND TRACKER SERIES HEADER */}
      {seriesLength > 1 && (
        <div
          id='series-rounds-panel'
          className='w-full max-w-md bg-black/30 border-2 border-black/40 rounded-2xl py-2 px-4 mb-4 flex items-center justify-between text-xs font-bold text-slate-350 tracking-wide'
        >
          <div className='flex items-center gap-1.5'>
            <span className='text-slate-400 uppercase'>Series Score:</span>
            <span className='bg-red-500 text-white px-2 py-0.5 rounded-md text-[11px] font-black'>
              {scores.scoreP1}
            </span>
            <span className='text-slate-500'>-</span>
            <span className='bg-yellow-400 text-black px-2 py-0.5 rounded-md text-[11px] font-black'>
              {scores.scoreP2}
            </span>
          </div>
          <div className='text-emerald-400 uppercase font-black tracking-wider bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-700/50'>
            Round {currentRound} of Best-of-{seriesLength}
          </div>
          <div className='text-[10px] font-extrabold text-slate-400 uppercase'>
            First to {Math.floor(seriesLength / 2) + 1} Wins
          </div>
        </div>
      )}

      {/* MAIN SCREEN INTERFACE CONTENT */}
      <main
        id='game-battlegrid-body'
        className='w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 sm:gap-8 flex-1'
      >
        {/* PLAYER 1 CARD */}
        <div className='flex w-full lg:w-auto items-center lg:items-stretch lg:flex-col justify-between lg:justify-center gap-4 lg:gap-1 z-15'>
          {/* Mobile Left card */}
          <div
            id='player-1-card-mobile'
            className='
              lg:hidden flex-1 flex items-center justify-between bg-white text-black border-b-8 border-black rounded-3xl p-3 px-5 relative shadow-xl
              border-x-2 border-t-2 min-h-17.5
            '
          >
            {/* Red smiley face overlay */}
            <div className='absolute -left-5 flex items-center'>
              <span className='w-12 h-12 rounded-full bg-red-500 border-4 border-black flex items-center justify-center shadow'>
                <span className='text-white font-black text-xs uppercase'>
                  YOU
                </span>
              </span>
            </div>

            <div className='pl-8 text-left'>
              <span
                id='p1-label-mobile'
                className='text-black font-black text-xs uppercase tracking-wider block opacity-70'
              >
                Player 1 (Red)
              </span>
              <p className='text-xs font-extrabold font-sans uppercase text-slate-600'>
                Human Challenger
              </p>
            </div>
            <div>
              <span
                id='p1-score-mobile'
                className='text-black font-black text-4xl'
              >
                {scores.scoreP1}
              </span>
            </div>
          </div>

          {/* Desktop Left card */}
          <div
            id='player-1-card-desktop'
            className='
              hidden lg:flex flex-col items-center justify-center bg-white text-black border-b-8 border-black border-x-4 border-t-4 rounded-3xl 
              w-36 p-6 relative shadow-2xl min-h-35
            '
          >
            <div className='absolute -top-6 w-12 h-12 bg-red-500 rounded-full border-4 border-black flex items-center justify-center shadow'>
              <span className='text-white font-black text-xs uppercase'>
                YOU
              </span>
            </div>
            <div className='text-center mt-4 w-full'>
              <span
                id='p1-label-desktop'
                className='text-black font-black text-xs uppercase tracking-wide block truncate'
              >
                Player 1 (Red)
              </span>
              <p className='text-[10px] font-semibold text-slate-500 block uppercase mb-1'>
                Human
              </p>
              <p
                id='p1-score-desktop'
                className='text-black font-black text-5xl'
              >
                {scores.scoreP1}
              </p>
            </div>
          </div>
        </div>

        {/* THE CENTRAL BOARD CONTAINER */}
        <div
          id='board-container'
          className='flex flex-col items-center relative z-10 w-full max-w-115 md:max-w-125'
        >
          {/* Column Drop Markers Indicator Row */}
          <div
            className='w-full flex justify-between px-3 mb-2 h-7'
            id='column-indicators'
          >
            {Array(COLS)
              .fill(null)
              .map((_, idx) => {
                const isHovered = hoveredCol === idx;
                const isHint = aiHintCol === idx;
                const activeColor = isPlayer1Turn
                  ? 'text-red-500'
                  : 'text-yellow-400';

                return (
                  <button
                    key={idx}
                    onMouseEnter={() => {
                      if (
                        winner === null &&
                        seriesChampion === null &&
                        !isAILoading
                      ) {
                        setHoveredCol(idx);
                      }
                    }}
                    onFocus={() => {
                      if (
                        winner === null &&
                        seriesChampion === null &&
                        !isAILoading
                      ) {
                        setHoveredCol(idx);
                      }
                    }}
                    onClick={() => makeMove(idx)}
                    disabled={
                      winner !== null ||
                      seriesChampion !== null ||
                      isAILoading ||
                      board[0][idx] !== null
                    }
                    className='flex-1 flex flex-col justify-center items-center relative transition-opacity focus:outline-none cursor-pointer group'
                    aria-label={`Drop checker in column ${idx + 1}`}
                  >
                    {isHovered &&
                      winner === null &&
                      seriesChampion === null && (
                        <svg
                          className={`w-5 h-5 ${activeColor} drop-shadow-md animate-bounce`}
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M11 4h2v12h-2zm-5 10l6 6 6-6z' />
                        </svg>
                      )}

                    {isHint &&
                      winner === null &&
                      seriesChampion === null &&
                      !isHovered && (
                        <div
                          className='absolute top-0 animate-pulse bg-emerald-500 text-white rounded-full p-1 border-2 border-black flex items-center justify-center shadow-lg -mt-1 scale-110 z-30'
                          title='AI Recommendation'
                        >
                          <span className='text-xs font-black'>💡</span>
                        </div>
                      )}
                  </button>
                );
              })}
          </div>

          {/* Main Outer Board (Tactile White shell with holes) */}
          <div
            id='game-board-block'
            onMouseLeave={() => setHoveredCol(null)}
            className={`
              w-full bg-white border-b-12 border-black border-x-4 border-t-4 rounded-[40px] p-4 shadow-2xl transition-all
              ${isBoardJuiced ? 'animate-juice ring-4 ring-indigo-400' : ''}
            `}
          >
            <div className='bg-indigo-700 p-4 rounded-[32px] grid grid-cols-7 gap-3 cursor-pointer select-none'>
              {board.map((rowCells, rIdx) =>
                rowCells.map((cell, cIdx) => {
                  const isWinning = isWinningCell(rIdx, cIdx);
                  const isJustPlaced =
                    lastPlacedCell &&
                    lastPlacedCell.row === rIdx &&
                    lastPlacedCell.col === cIdx;

                  // Destination prediction preview highlight
                  const lowestRow =
                    hoveredCol !== null
                      ? getLowestAvailableRow(board, hoveredCol)
                      : -1;
                  const isHoveredTarget =
                    hoveredCol === cIdx &&
                    rIdx === lowestRow &&
                    cell === null &&
                    winner === null &&
                    seriesChampion === null;

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => makeMove(cIdx)}
                      onMouseEnter={() => {
                        if (
                          winner === null &&
                          seriesChampion === null &&
                          !isAILoading
                        ) {
                          setHoveredCol(cIdx);
                        }
                      }}
                      onFocus={() => {
                        if (
                          winner === null &&
                          seriesChampion === null &&
                          !isAILoading
                        ) {
                          setHoveredCol(cIdx);
                        }
                      }}
                      disabled={
                        winner !== null ||
                        seriesChampion !== null ||
                        isAILoading ||
                        board[0][cIdx] !== null
                      }
                      id={`cell-${rIdx}-${cIdx}`}
                      className='
                        aspect-square rounded-full border-4 border-black bg-indigo-950
                        relative flex items-center justify-center overflow-hidden
                        focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all shadow-inner
                      '
                      aria-label={`Row ${rIdx + 1}, Column ${cIdx + 1}`}
                    >
                      {/* Nested Inner hole details */}
                      <span className='absolute w-[80%] h-[80%] rounded-full opacity-10 border border-slate-400 pointer-events-none'></span>

                      {/* Render custom blocks */}
                      {cell === 'obstacle' ? (
                        <div
                          className={`
                            absolute inset-0 rounded-full border-4 border-black bg-slate-500 flex items-center justify-center
                            shadow-md
                          `}
                        >
                          <span className='text-base sm:text-lg'>🪨</span>
                        </div>
                      ) : cell === 'anarchy_disc' ? (
                        <div
                          className={`
                            absolute inset-0 rounded-full border-4 border-black bg-amber-600 flex items-center justify-center
                            animate-pulse shadow-md
                          `}
                        >
                          <span className='text-base sm:text-lg'>🌋</span>
                        </div>
                      ) : cell !== null ? (
                        /* Standard Player discs */
                        <div
                          className={`
                            absolute inset-0 rounded-full border-4 border-black flex items-center justify-center
                            ${cell === 1 ? 'bg-red-500' : 'bg-yellow-400'}
                            ${isJustPlaced ? `animate-drop-row-${rIdx}` : ''}
                            ${isWinning ? 'ring-4 ring-white ring-offset-2 animate-pulse scale-105 z-10' : ''}
                          `}
                        >
                          {/* Checker inner ripple lines for realism */}
                          <span
                            className={`w-[60%] h-[60%] rounded-full border border-black/20`}
                          />

                          {/* Highlight dot when winning */}
                          {isWinning && (
                            <span className='absolute w-3.5 h-3.5 rounded-full bg-white border border-black animate-ping' />
                          )}
                        </div>
                      ) : isHoveredTarget ? (
                        /* Translucent target preview coin */
                        <div
                          className={`
                            absolute inset-0 rounded-full border-4 border-dashed border-black/40 flex items-center justify-center opacity-40 animate-pulse
                            ${isPlayer1Turn ? 'bg-red-500' : 'bg-yellow-400'}
                          `}
                        >
                          <span className='text-[10px] font-black text-black/50 uppercase'>
                            Drop
                          </span>
                        </div>
                      ) : null}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          {/* Turn Count overlay or Winner Screen Banner overlay */}
          <div className='w-full relative mt-3 flex justify-center z-20'>
            {seriesChampion !== null ? (
              <div
                id='champion-overlay'
                className='text-white rounded-[32px] p-5 px-8 flex flex-col items-center justify-center w-72 sm:w-80 text-center'
              >
                <h2
                  id='champion-text'
                  className='text-2xl font-black uppercase text-center mb-4 leading-tight'
                >
                  {seriesChampion === 1
                    ? 'PLAYER 1 WINS!'
                    : mode === 'pve'
                      ? 'COMPUTER WINS!'
                      : 'PLAYER 2 WINS!'}
                </h2>
                <button
                  onClick={handleQuickRestart}
                  className='px-6 py-2.5 bg-yellow-400 text-black font-extrabold uppercase rounded-2xl border-2 border-black tracking-wider hover:bg-yellow-300 transition-all cursor-pointer shadow-md text-xs'
                >
                  Start New Series
                </button>
              </div>
            ) : winner === null ? (
              /* Turn Indicator pointed card */
              <div
                id='turn-badge-card'
                className='w-48 bg-white border-b-8 border-black border-x-4 border-t-4 rounded-3xl p-4 flex flex-col items-center shadow-xl text-black'
              >
                <p className='font-black text-[10px] uppercase tracking-widest text-slate-500 mb-0.5'>
                  {mode === 'pve' && currentPlayer === 2
                    ? 'Computer Thinking'
                    : `Player ${currentPlayer}'s turn`}
                </p>
                <p
                  id='turn-timer-text'
                  className='text-black font-black text-3xl leading-none font-sans'
                >
                  {isAILoading ? '...' : `${timeLeft}s`}
                </p>
              </div>
            ) : (
              /* Game Winner overlay banner */
              <div
                id='winner-overlay'
                className='bg-white text-black border-b-8 border-black border-x-4 border-t-4 rounded-3xl p-4 px-6 flex flex-col items-center justify-center w-64 sm:w-72 shadow-2xl'
              >
                <span className='text-xs font-black uppercase tracking-widest text-slate-500 mb-1'>
                  {winner === 'draw' ? 'Match Draw' : 'Round Completed'}
                </span>

                <h2
                  id='winner-text'
                  className='text-xl sm:text-2xl font-black uppercase text-center mb-3'
                >
                  {winner === 'draw'
                    ? "It's a Draw!"
                    : winner === 1
                      ? 'Player 1 Wins'
                      : mode === 'pve'
                        ? 'Computer Wins'
                        : 'Player 2 Wins'}
                </h2>

                <div className='flex gap-2'>
                  {seriesLength > 1 ? (
                    <button
                      onClick={handleNextRound}
                      className='px-5 py-2 bg-emerald-500 text-white font-extrabold uppercase rounded-xl border-2 border-black text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-sm'
                    >
                      Next Round
                    </button>
                  ) : null}

                  <button
                    id='play-again-btn'
                    onClick={handleQuickRestart}
                    className='px-5 py-2 bg-red-500 text-white font-extrabold uppercase rounded-xl border-2 border-black text-xs hover:bg-red-400 transition-all cursor-pointer shadow-sm'
                  >
                    Reset Score
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PLAYER 2 / COMPUTER CARD */}
        <div className='flex w-full lg:w-auto items-center lg:items-stretch lg:flex-col justify-between lg:justify-center gap-4 lg:gap-1 z-15'>
          {/* Mobile Right card */}
          <div
            id='player-2-card-mobile'
            className='
              lg:hidden flex-1 flex items-center justify-between bg-white text-black border-b-8 border-black rounded-3xl p-3 px-5 relative shadow-xl
              border-x-2 border-t-2 min-h-17.5
            '
          >
            <div className='pr-8 text-right'>
              <span
                id='p2-label-mobile'
                className='text-black font-black text-xs uppercase tracking-wider block opacity-70'
              >
                {mode === 'pve' ? 'Computer (CPU)' : 'Player 2 (Yellow)'}
              </span>
              <p className='text-xs font-extrabold font-sans uppercase text-slate-600'>
                {mode === 'pve' ? `AI (${difficulty})` : 'Human Guest'}
              </p>
            </div>

            <div className='absolute -right-5 flex items-center'>
              <span className='w-12 h-12 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center shadow'>
                <span className='text-black font-black text-xs uppercase'>
                  CPU
                </span>
              </span>
            </div>

            <div>
              <span
                id='p2-score-mobile'
                className='text-black font-black text-4xl'
              >
                {scores.scoreP2}
              </span>
            </div>
          </div>

          {/* Desktop Right card */}
          <div
            id='player-2-card-desktop'
            className='
              hidden lg:flex flex-col items-center justify-center bg-white text-black border-b-8 border-black border-x-4 border-t-4 rounded-3xl 
              w-36 p-6 relative shadow-2xl min-h-35
            '
          >
            <span className='absolute -top-6 w-12 h-12 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center shadow'>
              <span className='text-black font-black text-xs uppercase'>
                CPU
              </span>
            </span>
            <div className='text-center mt-4 w-full'>
              <span
                id='p2-label-desktop'
                className='text-black font-black text-xs uppercase tracking-wide block truncate text-center'
              >
                {mode === 'pve' ? 'Computer' : 'Player 2'}
              </span>
              <p className='text-[10px] font-semibold text-slate-500 block uppercase mb-1 text-center truncate'>
                {mode === 'pve' ? `AI (${difficulty})` : 'Human'}
              </p>
              <p
                id='p2-score-desktop'
                className='text-black font-black text-5xl'
              >
                {scores.scoreP2}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER TOOL PANEL CONTROLS */}
      <footer
        id='game-tools-bar'
        className='w-full max-w-5xl mt-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white text-black rounded-[32px] p-5 shadow-xl relative z-20'
      >
        {/* Left Side: Controls Description & Key Commands */}
        <div className='flex flex-col gap-1 text-center md:text-left'>
          <h3 className='font-black text-sm uppercase text-indigo-950 tracking-wider'>
            Match Information Center
          </h3>
          <p className='text-xs text-slate-500 font-semibold tracking-wide uppercase'>
            Arrow Keys{' '}
            <kbd className='bg-slate-100 px-1 py-0.5 border-2 border-slate-300 rounded font-black'>
              ←
            </kbd>{' '}
            <kbd className='bg-slate-100 px-1 py-0.5 border-2 border-slate-300 rounded font-black'>
              →
            </kbd>{' '}
            to shift column •{' '}
            <kbd className='bg-slate-100 px-1.5 py-0.5 border-2 border-slate-300 rounded font-black'>
              Spacebar
            </kbd>{' '}
            to drop disc!
          </p>
        </div>

        {/* Action button bar */}
        <div className='flex flex-wrap justify-center items-center gap-3 w-full md:w-auto'>
          {/* Ask AI Hint Button */}
          <button
            id='hint-btn'
            onClick={handleGetHint}
            disabled={winner !== null || seriesChampion !== null || isAILoading}
            className={`
              py-2 px-4 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-black flex items-center justify-center gap-1.5
              ${
                winner !== null || seriesChampion !== null || isAILoading
                  ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none'
              }
            `}
          >
            <span className='text-base'>💡</span> Hint
          </button>

          {/* Undo Button */}
          <button
            id='undo-btn'
            onClick={handleUndo}
            disabled={
              history.length === 0 ||
              isAILoading ||
              winner !== null ||
              seriesChampion !== null
            }
            className={`
              py-2 px-4 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-black flex items-center justify-center gap-1.5
              ${
                history.length === 0 ||
                isAILoading ||
                winner !== null ||
                seriesChampion !== null
                  ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none'
              }
            `}
          >
            <svg
              className='w-3.5 h-3.5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='3'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
              />
            </svg>
            Undo
          </button>

          {/* Mute/Unmute Sound */}
          <button
            onClick={toggleSound}
            className='
              py-2 px-4 bg-slate-50 hover:bg-slate-100 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all 
              border-2 border-black shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none cursor-pointer flex items-center gap-1.5
            '
          >
            <span>{isSoundMuted ? '🔇' : '🔊'}</span>
            {isSoundMuted ? 'Unmute' : 'Mute'}
          </button>

          {/* Hard Reset Scores */}
          <button
            id='reset-series-btn'
            onClick={handleHardReset}
            className='
              py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs uppercase tracking-wider transition-all 
              border-2 border-black shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none cursor-pointer text-center
            '
          >
            Reset Match
          </button>
        </div>
      </footer>
    </div>
  );
}
