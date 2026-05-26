'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoardState,
  Player,
  Difficulty,
  GameMode,
  WinningLine,
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
import {
  db,
  auth,
  ensureUserAuthenticated,
  generateRoomCode,
  OnlineGameSession,
  OperationType,
  handleFirestoreError,
} from '../utils/firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

interface GameScreenProps {
  mode: GameMode;
  difficulty: Difficulty;
  onBackToMenu: () => void;
}

const ROWS = 6;
const COLS = 7;
const DEFAULT_TIME = 30;

export default function GameScreen({
  mode,
  difficulty,
  onBackToMenu,
}: GameScreenProps) {
  // Game Board: 6 rows x 7 cols
  const [board, setBoard] = useState<BoardState>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null)),
  );

  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [scores, setScores] = useState({ scoreP1: 0, scoreP2: 0 });
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isAILoading, setIsAILoading] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [lastPlacedCell, setLastPlacedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Online Multiplayer States
  const [onlineUserId, setOnlineUserId] = useState<string | null>(null);
  const [onlineLobbyId, setOnlineLobbyId] = useState<string | null>(null);
  const [onlineRole, setOnlineRole] = useState<1 | 2 | null>(null); // 1 = Red Creator, 2 = Yellow Joiner
  const [roomState, setRoomState] = useState<OnlineGameSession | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [isLobbySearching, setIsLobbySearching] = useState(false);
  const [invitedUrlCopied, setInvitedUrlCopied] = useState(false);
  const [localPlayerName, setLocalPlayerName] = useState(() => {
    const suffixes = [
      'Red',
      'Yellow',
      'Challenger',
      'GridMaster',
      'Tactician',
      'Strategist',
      'Pro',
    ];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    return `${suffix}${num}`;
  });
  const [latestEmojiP1, setLatestEmojiP1] = useState<string | null>(null);
  const [latestEmojiP2, setLatestEmojiP2] = useState<string | null>(null);

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

  // Brand-new animated features states
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

    // In online multiplayer, only run countdown for the active local player
    if (mode === 'online' && currentPlayer !== onlineRole) {
      setTimeLeft(DEFAULT_TIME);
      return;
    }

    setTimeLeft(DEFAULT_TIME);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time is up! Trigger random move or forfeit
          if (!isSoundMuted) {
            playTimeoutSound();
          }
          handleTimeout();
          return DEFAULT_TIME;
        }
        return prev - 1;
      });
    }, 1000);
  }, [mode, currentPlayer, onlineRole, isSoundMuted]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Online Multiplayer handlers and action hooks
  useEffect(() => {
    if (mode === 'online') {
      ensureUserAuthenticated()
        .then((uid) => {
          setOnlineUserId(uid);
        })
        .catch((err) => {
          console.error('Authentication check error:', err);
        });

      // Retrieve room from url if present
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('room');
      if (urlCode) {
        setRoomCodeInput(urlCode.toUpperCase());
      }
    }
  }, [mode]);

  // Firestore real-time session listener
  useEffect(() => {
    if (mode !== 'online' || !onlineLobbyId) return;

    const docRef = doc(db, 'games', onlineLobbyId);

    // Periodic presence heartbeat
    const heartbeatTimer = setInterval(() => {
      if (onlineRole === 1) {
        updateDoc(docRef, {
          p1Active: true,
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      } else if (onlineRole === 2) {
        updateDoc(docRef, {
          p2Active: true,
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      }
    }, 10000);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data() as OnlineGameSession;

        // Unpack matrix board
        if (data.boardJson) {
          const syncedBoard = JSON.parse(data.boardJson) as BoardState;

          // Count placed checkers on board to play drop sound
          const currentCount = syncedBoard
            .flat()
            .filter((c) => c !== null).length;
          const previousCount = stateRef.current.board
            .flat()
            .filter((c) => c !== null).length;
          if (currentCount > previousCount) {
            if (!isSoundMuted) {
              playDropSound();
            }
          }
          setBoard(syncedBoard);
        }

        // Live Emoji Signal Receivers
        if (data.emojiP1) {
          setLatestEmojiP1(data.emojiP1);
          setTimeout(() => setLatestEmojiP1(null), 3000);
          if (onlineRole === 2) {
            updateDoc(docRef, { emojiP1: null }).catch(() => {});
          }
        }
        if (data.emojiP2) {
          setLatestEmojiP2(data.emojiP2);
          setTimeout(() => setLatestEmojiP2(null), 3000);
          if (onlineRole === 1) {
            updateDoc(docRef, { emojiP2: null }).catch(() => {});
          }
        }

        // Sync active turn indicators
        setCurrentPlayer(data.currentPlayer);

        // Sync victory, draw, and tie limits
        if (data.winner) {
          if (data.winner === 'draw') {
            setWinner('draw');
            setWinningLine(null);
          } else {
            const wIndicator = Number(data.winner) as Player;
            setWinner(wIndicator);
            if (data.winningCellsJson) {
              setWinningLine({
                winner: wIndicator,
                cells: JSON.parse(data.winningCellsJson),
              });
            }
          }
        } else {
          setWinner(null);
          setWinningLine(null);
        }

        // Sync game scoreboards
        setScores({ scoreP1: data.p1Score, scoreP2: data.p2Score });

        // Highlight cell coordinates
        if (
          data.lastPlacedCellRow !== null &&
          data.lastPlacedCellCol !== null
        ) {
          setLastPlacedCell({
            row: data.lastPlacedCellRow,
            col: data.lastPlacedCellCol,
          });
        } else {
          setLastPlacedCell(null);
        }

        // Dynamic Auto-Rematch Sync
        if (data.rematchP1 && data.rematchP2) {
          updateDoc(docRef, {
            boardJson: JSON.stringify(
              Array(ROWS)
                .fill(null)
                .map(() => Array(COLS).fill(null)),
            ),
            status: 'active',
            currentPlayer: 1,
            winner: null,
            winningCellsJson: null,
            lastPlacedCellRow: null,
            lastPlacedCellCol: null,
            rematchP1: false,
            rematchP2: false,
            updatedAt: serverTimestamp(),
          }).catch(() => {});
        }

        setRoomState(data);
      },
      (error) => {
        handleFirestoreError(
          error,
          OperationType.GET,
          `games/${onlineLobbyId}`,
        );
      },
    );

    return () => {
      unsubscribe();
      clearInterval(heartbeatTimer);
      if (onlineRole === 1) {
        updateDoc(docRef, {
          p1Active: false,
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      } else if (onlineRole === 2) {
        updateDoc(docRef, {
          p2Active: false,
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      }
    };
  }, [mode, onlineLobbyId, onlineRole, isSoundMuted]);

  const handleOnlineCreateRoom = async () => {
    if (!onlineUserId) return;
    setIsLobbySearching(true);
    const code = generateRoomCode();

    const newSession: OnlineGameSession = {
      id: code,
      status: 'waiting',
      creatorId: onlineUserId,
      creatorName: localPlayerName,
      opponentId: null,
      opponentName: null,
      currentPlayer: 1,
      boardJson: JSON.stringify(
        Array(ROWS)
          .fill(null)
          .map(() => Array(COLS).fill(null)),
      ),
      lastPlacedCellRow: null,
      lastPlacedCellCol: null,
      winner: null,
      winningCellsJson: null,
      rematchP1: false,
      rematchP2: false,
      p1Active: true,
      p2Active: false,
      p1Score: 0,
      p2Score: 0,
      emojiP1: null,
      emojiP2: null,
      updatedAt: null,
    };

    try {
      const docRef = doc(db, 'games', code);
      await setDoc(docRef, {
        ...newSession,
        updatedAt: serverTimestamp(),
      });
      setOnlineRole(1);
      setOnlineLobbyId(code);
      // Append room to active URL to let them easily share with friends
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?room=${code}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `games/${code}`);
    } finally {
      setIsLobbySearching(false);
    }
  };

  const handleOnlineJoinRoom = async (optCode?: string) => {
    if (!onlineUserId) return;
    const code = (optCode || roomCodeInput).trim().toUpperCase();
    if (!code) {
      alert('Please enter a valid 6-character room lobby code!');
      return;
    }

    setIsLobbySearching(true);
    try {
      const docRef = doc(db, 'games', code);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        alert('Enter code is not valid or room lobby has expired!');
        setIsLobbySearching(false);
        return;
      }
      const data = docSnap.data() as OnlineGameSession;

      if (data.creatorId === onlineUserId) {
        setOnlineRole(1);
        setOnlineLobbyId(code);
        setIsLobbySearching(false);
        return;
      }

      if (data.opponentId && data.opponentId !== onlineUserId) {
        alert('This online lobby is already full is busy playing!');
        setIsLobbySearching(false);
        return;
      }

      await updateDoc(docRef, {
        opponentId: onlineUserId,
        opponentName: localPlayerName,
        status: 'active',
        p2Active: true,
        updatedAt: serverTimestamp(),
      });

      setOnlineRole(2);
      setOnlineLobbyId(code);
      // Append room to active URL
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?room=${code}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `games/${code}`);
    } finally {
      setIsLobbySearching(false);
    }
  };

  const handleSendEmoji = async (emoji: string) => {
    if (!onlineLobbyId || !onlineRole) return;
    const docRef = doc(db, 'games', onlineLobbyId);
    try {
      if (onlineRole === 1) {
        await updateDoc(docRef, {
          emojiP1: emoji,
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(docRef, {
          emojiP2: emoji,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `games/${onlineLobbyId}`);
    }
  };

  const handleOnlineRematchVote = async () => {
    if (!onlineLobbyId || !onlineRole) return;
    const docRef = doc(db, 'games', onlineLobbyId);
    try {
      if (onlineRole === 1) {
        await updateDoc(docRef, {
          rematchP1: true,
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(docRef, {
          rematchP2: true,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `games/${onlineLobbyId}`);
    }
  };

  const handleLeaveOnlineLobby = () => {
    setOnlineLobbyId(null);
    setOnlineRole(null);
    setRoomState(null);
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null)),
    );
    setCurrentPlayer(1);
    setWinner(null);
    setWinningLine(null);
    setScores({ scoreP1: 0, scoreP2: 0 });
    window.history.replaceState({}, document.title, window.location.pathname);
  };

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
        (loading && !bypassLoading) ||
        colIndex < 0 ||
        colIndex >= COLS
      )
        return;

      if (mode === 'online') {
        if (!onlineLobbyId || !roomState) return;
        if (roomState.status !== 'active') return;
        if (currentPlayer !== onlineRole) return; // Ignore out of turn moves
      }

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

      setBoard(newBoard);
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

      const winResult = checkWin(newBoard);
      let databaseStatus: 'active' | 'finished' | 'draw' = 'active';
      let databaseWinner: string | null = null;
      let databaseWinningCells: string | null = null;
      let nextScoreP1 = scores.scoreP1;
      let nextScoreP2 = scores.scoreP2;

      if (winResult) {
        clearTimer();
        setWinner(winResult.winner);
        setWinningLine(winResult);
        if (!isSoundMuted) {
          playWinSound();
        }

        databaseStatus = 'finished';
        databaseWinner = String(winResult.winner);
        databaseWinningCells = JSON.stringify(winResult.cells);

        if (winResult.winner === 1) {
          setScores((prev) => ({ ...prev, scoreP1: prev.scoreP1 + 1 }));
          nextScoreP1 += 1;
        } else {
          setScores((prev) => ({ ...prev, scoreP2: prev.scoreP2 + 1 }));
          nextScoreP2 += 1;
        }

        if (mode === 'online') {
          const docRef = doc(db, 'games', onlineLobbyId!);
          updateDoc(docRef, {
            boardJson: JSON.stringify(newBoard),
            currentPlayer: curr === 1 ? 2 : 1,
            lastPlacedCellRow: row,
            lastPlacedCellCol: colIndex,
            winner: databaseWinner,
            winningCellsJson: databaseWinningCells,
            status: databaseStatus,
            p1Score: nextScoreP1,
            p2Score: nextScoreP2,
            updatedAt: serverTimestamp(),
          }).catch((err) =>
            handleFirestoreError(
              err,
              OperationType.UPDATE,
              `games/${onlineLobbyId}`,
            ),
          );
        }
        return;
      }

      if (isBoardFull(newBoard)) {
        clearTimer();
        setWinner('draw');
        databaseStatus = 'draw';
        databaseWinner = 'draw';

        if (mode === 'online') {
          const docRef = doc(db, 'games', onlineLobbyId!);
          updateDoc(docRef, {
            boardJson: JSON.stringify(newBoard),
            currentPlayer: curr === 1 ? 2 : 1,
            lastPlacedCellRow: row,
            lastPlacedCellCol: colIndex,
            winner: databaseWinner,
            winningCellsJson: null,
            status: databaseStatus,
            p1Score: nextScoreP1,
            p2Score: nextScoreP2,
            updatedAt: serverTimestamp(),
          }).catch((err) =>
            handleFirestoreError(
              err,
              OperationType.UPDATE,
              `games/${onlineLobbyId}`,
            ),
          );
        }
        return;
      }

      // Toggle turn
      const nextPlayer: Player = curr === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      resetTimer();

      if (mode === 'online') {
        const docRef = doc(db, 'games', onlineLobbyId!);
        updateDoc(docRef, {
          boardJson: JSON.stringify(newBoard),
          currentPlayer: nextPlayer,
          lastPlacedCellRow: row,
          lastPlacedCellCol: colIndex,
          winner: null,
          winningCellsJson: null,
          status: 'active',
          p1Score: nextScoreP1,
          p2Score: nextScoreP2,
          updatedAt: serverTimestamp(),
        }).catch((err) =>
          handleFirestoreError(
            err,
            OperationType.UPDATE,
            `games/${onlineLobbyId}`,
          ),
        );
      }
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
      onlineLobbyId,
      onlineRole,
      roomState,
      scores,
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

  // Handle computer move logic
  useEffect(() => {
    if (mode === 'pve' && currentPlayer === 2 && winner === null) {
      clearTimer();
      setIsAILoading(true);

      // Brief thinking delay for realism
      const timer = setTimeout(
        () => {
          const { board: currentBoard } = stateRef.current;
          const aiMove = getComputerMove(currentBoard, difficulty);
          if (aiMove !== -1) {
            makeMove(aiMove, true); // Bypass the isAILoading block
          }
          setIsAILoading(false);
        },
        900 + Math.random() * 600,
      ); // 0.9s to 1.5s thinking

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, mode, winner, difficulty, makeMove, clearTimer]);

  // Start game countdown initially
  useEffect(() => {
    resetTimer();
    return () => clearTimer();
  }, [resetTimer, clearTimer]);

  // Keyboard navigation support for Connect 4 Board
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (winner !== null || isAILoading) return;

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
  }, [hoveredCol, winner, isAILoading, makeMove, isSoundMuted]);

  // Quick reset for current board
  const handleQuickRestart = () => {
    clearTimer();
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null)),
    );
    setCurrentPlayer(1);
    setWinner(null);
    setWinningLine(null);
    setLastPlacedCell(null);
    setHoveredCol(null);
    setIsAILoading(false);
    setHistory([]);
    setMovesLog([]);
    setAiHintCol(null);
    resetTimer();
  };

  // Full hard reset (including scores)
  const handleHardReset = () => {
    setScores({ scoreP1: 0, scoreP2: 0 });
    handleQuickRestart();
  };

  // Undo last move (dual undo for PvE so it returns to Human turn)
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isAILoading || winner !== null) return;

    setAiHintCol(null);

    if (mode === 'pve') {
      if (history.length >= 2) {
        const targetState = history[history.length - 2];
        setBoard(targetState.board);
        setCurrentPlayer(targetState.currentPlayer);
        setLastPlacedCell(targetState.lastPlacedCell);
        setTimeLeft(targetState.timeLeft);
        setWinner(targetState.winner);
        setWinningLine(targetState.winningLine);

        setHistory((prev) => prev.slice(0, prev.length - 2));
        setMovesLog((prev) => prev.slice(0, prev.length - 2));
        resetTimer();
      } else {
        const targetState = history[history.length - 1];
        setBoard(targetState.board);
        setCurrentPlayer(targetState.currentPlayer);
        setLastPlacedCell(targetState.lastPlacedCell);
        setTimeLeft(targetState.timeLeft);
        setWinner(targetState.winner);
        setWinningLine(targetState.winningLine);

        setHistory((prev) => prev.slice(0, prev.length - 1));
        setMovesLog((prev) => prev.slice(0, prev.length - 1));
        resetTimer();
      }
    } else {
      const targetState = history[history.length - 1];
      setBoard(targetState.board);
      setCurrentPlayer(targetState.currentPlayer);
      setLastPlacedCell(targetState.lastPlacedCell);
      setTimeLeft(targetState.timeLeft);
      setWinner(targetState.winner);
      setWinningLine(targetState.winningLine);

      setHistory((prev) => prev.slice(0, prev.length - 1));
      setMovesLog((prev) => prev.slice(0, prev.length - 1));
      resetTimer();
    }

    if (!isSoundMuted) {
      playClickSound();
    }
  }, [history, isAILoading, winner, mode, resetTimer, isSoundMuted]);

  // Suggest the single highest-probability win/block column using the minimax utility
  const handleGetHint = useCallback(() => {
    if (winner !== null || isAILoading) return;
    const bestMove = getComputerMove(board, 'hard');
    if (bestMove !== -1) {
      setAiHintCol(bestMove);
      if (!isSoundMuted) {
        playClickSound();
      }
    }
  }, [board, winner, isAILoading, isSoundMuted]);

  // Check if a cell is part of the winning line of four
  const isWinningCell = (r: number, c: number): boolean => {
    if (!winningLine) return false;
    return winningLine.cells.some(([row, col]) => row === r && col === c);
  };

  const isPlayer1Turn = currentPlayer === 1;

  if (mode === 'online' && !onlineLobbyId) {
    return (
      <div
        id='lobby-setup-view'
        className='min-h-screen bg-indigo-950 flex items-center justify-center p-4'
      >
        {/* Beautiful Neo-brutalist Lobby Matchmaker */}
        <div
          id='lobby-setup-card'
          className='w-full max-w-md bg-white text-black border-b-12 border-black border-x-4 border-t-4 rounded-[40px] p-8 flex flex-col items-center shadow-2xl relative'
        >
          <header className='flex flex-col items-center gap-1.5 mb-6 text-center'>
            <span className='text-4xl animate-pulse'>🌐</span>
            <h1 className='text-2xl font-black text-indigo-950 uppercase tracking-widest mt-1'>
              FIRESTORE MULTIPLAYER
            </h1>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wide'>
              Real-time Online Matchmaker
            </p>
          </header>

          <div className='w-full space-y-4'>
            {/* Nickname selection */}
            <div className='bg-indigo-50 border-[3px] border-black rounded-2xl p-4 shadow-sm'>
              <label
                htmlFor='nickname-input'
                className='text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-1.5 text-center'
              >
                Your Nickname
              </label>
              <input
                id='nickname-input'
                type='text'
                maxLength={18}
                value={localPlayerName}
                onChange={(e) =>
                  setLocalPlayerName(
                    e.target.value.replace(/[^a-zA-Z0-9_\s]/g, ''),
                  )
                }
                className='w-full bg-white border-2 border-black font-black text-center text-sm uppercase px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-slate-400'
                placeholder='Enter Nickname'
              />
            </div>

            {/* Action 1: Create room */}
            <div className='flex flex-col gap-2'>
              <button
                id='lobby-create-btn'
                onClick={handleOnlineCreateRoom}
                disabled={isLobbySearching}
                className='w-full py-3.5 bg-yellow-400 border-b-6 border-black border-x-2 border-t-2 rounded-2xl font-black text-black text-sm tracking-widest uppercase hover:bg-yellow-300 transition-all cursor-pointer shadow-md disabled:opacity-50'
              >
                {isLobbySearching
                  ? 'Creating Room...'
                  : 'Create New Room (Host)'}
              </button>
            </div>

            <div className='flex items-center justify-between text-slate-300 font-bold text-xs uppercase px-1 my-3'>
              <span className='h-0.5 bg-slate-200 flex-1'></span>
              <span className='px-2 text-slate-500 font-black'>
                OR JOIN WITH CODE
              </span>
              <span className='h-0.5 bg-slate-200 flex-1'></span>
            </div>

            {/* Action 2: Enter Join code */}
            <div className='flex flex-col gap-2 bg-slate-50 border-[3px] border-black rounded-2xl p-4 shadow-sm'>
              <label
                htmlFor='lobby-code-field'
                className='text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-1.5 text-center'
              >
                6-Digit Room Code
              </label>
              <input
                id='lobby-code-field'
                type='text'
                maxLength={6}
                value={roomCodeInput}
                onChange={(e) =>
                  setRoomCodeInput(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                  )
                }
                className='w-full bg-white border-2 border-black font-black text-center text-lg tracking-widest uppercase px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-slate-300 animate-pulse'
                placeholder='ABCDEF'
              />
              <button
                id='lobby-join-btn'
                onClick={() => handleOnlineJoinRoom()}
                disabled={isLobbySearching || !roomCodeInput}
                className='w-full mt-2 py-3 bg-emerald-500 border-b-4 border-black border-x-2 border-t-2 rounded-xl font-black text-white text-xs tracking-wider uppercase hover:bg-emerald-400 transition-all cursor-pointer shadow-md disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300'
              >
                {isLobbySearching ? 'Joining...' : 'Join Lobby Game'}
              </button>
            </div>

            {/* Menu Return button */}
            <button
              id='lobby-back-menu-btn'
              onClick={onBackToMenu}
              className='w-full py-3 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-2xl font-black text-slate-700 text-xs tracking-wider uppercase transition-all shadow-md mt-4 cursor-pointer focus:outline-none'
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id='game-view'
      className='min-h-screen bg-primary-purple p-4 relative flex flex-col justify-between overflow-hidden select-none'
    >
      {/* Dynamic celebratory falling confetti on victory */}
      {confetti.length > 0 && (
        <div className='absolute inset-0 pointer-events-none overflow-hidden z-99'>
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className='absolute animate-confetti rounded'
              style={
                {
                  left: `${particle.x}%`,
                  top: `-20px`,
                  width: `${particle.size}px`,
                  height: `${particle.size * 1.6}px`,
                  backgroundColor: particle.color,
                  '--duration': `${particle.duration}s`,
                  animationDelay: `${particle.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* 1. Header (Menu, Grid, Restart) */}
      <header
        id='game-header'
        className='max-w-4xl w-full mx-auto flex items-center justify-between py-2 mb-4'
      >
        <button
          id='game-menu-btn'
          onClick={onBackToMenu}
          className='px-6 py-2 bg-indigo-800 text-white font-bold rounded-2xl uppercase tracking-wider hover:bg-pink-600 border-2 border-transparent hover:border-pink-300 transition-all cursor-pointer shadow-lg'
        >
          Menu
        </button>

        {/* Logo Icon */}
        <div id='header-logo' className='flex gap-2'>
          <div className='w-10 h-10 bg-red-500 rounded-full border-4 border-black shadow'></div>
          <div className='w-10 h-10 bg-yellow-400 rounded-full border-4 border-black shadow'></div>
        </div>

        <button
          id='game-restart-btn'
          onClick={handleQuickRestart}
          className='px-6 py-2 bg-indigo-800 text-white font-bold rounded-2xl uppercase tracking-wider hover:bg-pink-600 border-2 border-transparent hover:border-pink-300 transition-all cursor-pointer shadow-lg'
        >
          Restart
        </button>
      </header>

      {/* Main Grid Content Area (Responsive Grid) */}
      <main
        id='game-main-content'
        className='max-w-6xl w-full mx-auto flex-1 flex flex-col justify-center items-center my-2 gap-4'
      >
        {/* Responsive score cards layout */}
        {/* Grid setup: desktop has sidebars; tablet/mobile has horizontal headers */}
        <div
          id='responsive-layout'
          className='w-full flex flex-col lg:flex-row items-center justify-center gap-6 xl:gap-12 relative'
        >
          {/* PLAYER 1 CARD */}
          {/* Shown on left side of board in lg screen, or side-by-side on top in mobile/tablet */}
          <div
            id='player-1-card'
            className='
              bg-white text-black border-b-8 border-black rounded-3xl p-4 px-6 flex items-center justify-between
              w-full max-w-sm lg:hidden relative shadow-xl my-2 sm:my-3
            '
          >
            {/* Red smiley face overlay */}
            <div className='absolute -left-5 flex items-center'>
              <span className='w-12 h-12 rounded-full bg-red-500 border-4 border-black flex items-center justify-center shadow'>
                <span className='text-white font-black text-xs uppercase'>
                  {mode === 'online' && onlineRole === 1 ? 'YOU' : 'P1'}
                </span>
              </span>
            </div>

            <div className='pl-10 text-left'>
              <span
                id='p1-label-mobile'
                className='text-black font-black text-xs uppercase tracking-wider opacity-70 flex items-center gap-1.5'
              >
                {mode === 'online' && (
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${roomState?.p1Active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}
                  />
                )}
                {mode === 'online'
                  ? roomState?.creatorName || 'Host'
                  : 'Player 1'}
              </span>
              <p className='text-xs font-extrabold font-sans uppercase text-slate-600'>
                {mode === 'online' ? 'RED HOST' : 'Human'}
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

            {/* Bubble floating emoji reaction */}
            {latestEmojiP1 && (
              <div className='absolute -top-10 left-12 bg-white border-2 border-black rounded-full px-2.5 py-0.5 shadow-md text-xl animate-bounce z-40'>
                {latestEmojiP1}
              </div>
            )}
          </div>

          {/* Desktop Left card */}
          <div
            id='player-1-card-desktop'
            className='
              hidden lg:flex flex-col items-center justify-center bg-white border-b-8 border-black rounded-3xl 
              w-36 p-6 relative shadow-2xl min-h-35
            '
          >
            <div className='absolute -top-6 w-12 h-12 bg-red-500 rounded-full border-4 border-black flex items-center justify-center shadow'>
              <span className='text-white font-black text-xs uppercase'>
                {mode === 'online' && onlineRole === 1 ? 'YOU' : 'P1'}
              </span>
            </div>
            <div className='text-center mt-4 w-full'>
              <span
                id='p1-label-desktop'
                className='text-black font-black text-xs uppercase tracking-wide truncate flex items-center justify-center gap-1'
              >
                {mode === 'online' && (
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${roomState?.p1Active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}
                  />
                )}
                {mode === 'online'
                  ? roomState?.creatorName || 'Host'
                  : 'Player 1'}
              </span>
              <p className='text-[10px] font-semibold text-slate-500 block uppercase mb-1'>
                {mode === 'online' ? 'RED HOST' : 'Human'}
              </p>
              <p
                id='p1-score-desktop'
                className='text-black font-black text-5xl'
              >
                {scores.scoreP1}
              </p>
            </div>

            {/* Bubble floating emoji reaction */}
            {latestEmojiP1 && (
              <div className='absolute -top-14 left-1/2 -translate-x-1/2 bg-white border-2 border-black rounded-full px-3 py-1 shadow-lg text-2xl animate-bounce z-40'>
                {latestEmojiP1}
              </div>
            )}
          </div>

          {/* 2. THE CENTRAL BOARD CONTAINER */}
          {mode === 'online' && roomState?.status === 'waiting' ? (
            <div
              id='online-waiting-panel'
              className='bg-white text-black p-8 border-b-12 border-black border-x-4 border-t-4 rounded-[40px] shadow-2xl w-full max-w-115 flex flex-col items-center text-center'
            >
              <span className='text-4xl animate-bounce mb-3'>📡</span>
              <h2 className='text-xl font-black text-indigo-950 uppercase tracking-widest'>
                Lobby Created!
              </h2>
              <p className='text-xs font-bold text-slate-500 uppercase tracking-wide mt-1'>
                Waiting for opponent to connect...
              </p>

              <div className='w-full bg-slate-50 border-4 border-dashed border-black rounded-3xl p-5 my-6'>
                <span className='text-[10px] font-black uppercase text-slate-400 tracking-wider'>
                  SHARE LOBBY CODE
                </span>
                <p className='text-4xl font-black text-indigo-950 tracking-widest uppercase mt-1 mb-2'>
                  {onlineLobbyId}
                </p>

                <button
                  id='copy-invite-link-btn'
                  onClick={() => {
                    const inviteUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?room=${onlineLobbyId}`;
                    navigator.clipboard.writeText(inviteUrl);
                    setInvitedUrlCopied(true);
                    setTimeout(() => setInvitedUrlCopied(false), 2500);
                  }}
                  className='w-full py-2 bg-yellow-400 border-2 border-black rounded-xl font-black text-xs text-black uppercase hover:bg-yellow-300 transition-all cursor-pointer shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none'
                >
                  {invitedUrlCopied
                    ? '📋 COPIED LOBBY LINK!'
                    : '🔗 COPY INVITE LINK'}
                </button>
              </div>

              <div className='flex items-center gap-2 mb-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping'></span>
                <span className='text-xs font-bold text-slate-600 uppercase'>
                  Searching for active signals...
                </span>
              </div>

              <button
                onClick={handleLeaveOnlineLobby}
                className='mt-2 py-2 px-6 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl font-bold text-xs text-slate-700 uppercase cursor-pointer'
              >
                Cancel & Leave Lobby
              </button>
            </div>
          ) : (
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
                          if (winner === null && !isAILoading) {
                            setHoveredCol(idx);
                            if (!isSoundMuted) {
                              playClickSound();
                            }
                          }
                        }}
                        onFocus={() => {
                          if (winner === null && !isAILoading) {
                            setHoveredCol(idx);
                          }
                        }}
                        onClick={() => makeMove(idx)}
                        disabled={
                          winner !== null ||
                          isAILoading ||
                          board[0][idx] !== null
                        }
                        className='flex-1 flex flex-col justify-center items-center relative transition-opacity focus:outline-none cursor-pointer group'
                        aria-label={`Drop checker in column ${idx + 1}`}
                      >
                        {isHovered && winner === null && (
                          <svg
                            className={`w-5 h-5 ${activeColor} drop-shadow-md animate-bounce`}
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M11 4h2v12h-2zm-5 10l6 6 6-6z' />
                          </svg>
                        )}

                        {isHint && winner === null && !isHovered && (
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
                        winner === null;

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => makeMove(cIdx)}
                          onMouseEnter={() => {
                            if (winner === null && !isAILoading) {
                              setHoveredCol(cIdx);
                            }
                          }}
                          onFocus={() => {
                            if (winner === null && !isAILoading) {
                              setHoveredCol(cIdx);
                            }
                          }}
                          disabled={
                            winner !== null ||
                            isAILoading ||
                            board[0][cIdx] !== null
                          }
                          id={`cell-${rIdx}-${cIdx}`}
                          className='
                          aspect-square rounded-full border-4 border-black bg-indigo-950
                          relative flex items-center justify-center overflow-hidden
                          focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all shadow-inner
                        '
                          aria-label={`Row ${rIdx + 1}, Column ${cIdx + 1}. ${
                            cell === null
                              ? 'Empty'
                              : cell === 1
                                ? 'Player 1 Red Disc'
                                : 'Player 2 Yellow Disc'
                          }`}
                        >
                          {/* Nested Inner hole details */}
                          <span className='absolute w-[80%] h-[80%] rounded-full opacity-10 border border-slate-400 pointer-events-none'></span>

                          {/* Display placed Checker with Falling Animation */}
                          {cell !== null ? (
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
              <div className='w-full relative -mt-3 flex justify-center z-20'>
                {winner === null ? (
                  /* Turn Indicator pointed card */
                  <div
                    id='turn-badge-card'
                    className='w-48 bg-white border-b-8 border-black border-x-4 border-t-4 rounded-3xl p-4 flex flex-col items-center shadow-xl text-black'
                  >
                    <p className='text-black font-black text-xs uppercase'>
                      {mode === 'online'
                        ? currentPlayer === onlineRole
                          ? '🎯 YOUR TURN'
                          : '⏳ OPPONENT TURN'
                        : mode === 'pve' && currentPlayer === 2
                          ? 'Computer thinking'
                          : `Player ${currentPlayer}'s turn`}
                    </p>
                    <p
                      id='turn-timer-text'
                      className='text-black font-black text-3xl leading-tight mt-0.5 font-sans'
                    >
                      {isAILoading ? '...' : `${timeLeft}s`}
                    </p>
                  </div>
                ) : (
                  /* Game Winner overlay banner */
                  <div
                    id='winner-overlay'
                    className='bg-white text-black border-b-8 border-black border-x-4 border-t-4 rounded-3xl p-5 px-8 flex flex-col items-center justify-center w-64 sm:w-72 shadow-2xl'
                  >
                    <span className='text-xs font-black uppercase tracking-widest text-slate-500 mb-1'>
                      {winner === 'draw' ? 'Match Draw' : 'Game Finished'}
                    </span>

                    <h2
                      id='winner-text'
                      className='text-2xl sm:text-3xl font-black uppercase text-center mb-3'
                    >
                      {winner === 'draw'
                        ? 'Draw!'
                        : winner === 1
                          ? mode === 'online' && roomState
                            ? `${roomState.creatorName} Wins`
                            : 'Player 1 Wins'
                          : mode === 'online' && roomState
                            ? `${roomState.opponentName || 'Player 2'} Wins`
                            : mode === 'pve'
                              ? 'Computer Wins'
                              : 'Player 2 Wins'}
                    </h2>

                    <button
                      id='play-again-btn'
                      onClick={
                        mode === 'online'
                          ? handleOnlineRematchVote
                          : handleQuickRestart
                      }
                      className='px-6 py-2.5 bg-red-500 text-white font-extrabold uppercase rounded-2xl border-2 border-black tracking-wider hover:bg-pink-600 hover:border-pink-300 transition-all cursor-pointer shadow-md text-sm'
                    >
                      {mode === 'online'
                        ? onlineRole === 1
                          ? roomState?.rematchP1
                            ? 'Rematch Voted ✓'
                            : 'Vote Rematch'
                          : roomState?.rematchP2
                            ? 'Rematch Voted ✓'
                            : 'Vote Rematch'
                        : 'Play Again'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PLAYER 2 CARD */}
          {/* Shown on right side of board in lg screen, or side-by-side on top in mobile/tablet */}
          <div
            id='player-2-card'
            className='
              bg-white text-black border-b-8 border-black rounded-3xl p-4 px-6 flex items-center justify-between
              w-full max-w-sm lg:hidden relative shadow-xl my-2 sm:my-3
            '
          >
            <div>
              <span
                id='p2-score-mobile'
                className='text-black font-black text-4xl'
              >
                {scores.scoreP2}
              </span>
            </div>

            <div className='pr-10 text-right'>
              <span
                id='p2-label-mobile'
                className='text-black font-black text-xs uppercase tracking-wider opacity-70 flex items-center gap-1.5 justify-end'
              >
                {mode === 'online'
                  ? roomState?.opponentName || 'Opponent'
                  : 'Player 2'}
                {mode === 'online' && (
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${roomState?.p2Active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}
                  />
                )}
              </span>
              <p className='text-xs font-extrabold font-sans uppercase text-slate-600'>
                {mode === 'online'
                  ? 'YELLOW GUEST'
                  : mode === 'pve'
                    ? `AI (${difficulty})`
                    : 'Human'}
              </p>
            </div>

            {/* Yellow smiley face overlay */}
            <div className='absolute -right-5 flex items-center'>
              <span className='w-12 h-12 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center shadow'>
                <span className='text-black font-black text-xs uppercase'>
                  {mode === 'online' && onlineRole === 2 ? 'YOU' : 'P2'}
                </span>
              </span>
            </div>

            {/* Bubble floating emoji reaction */}
            {latestEmojiP2 && (
              <div className='absolute -top-10 right-12 bg-white border-2 border-black rounded-full px-2.5 py-0.5 shadow-md text-xl animate-bounce z-40'>
                {latestEmojiP2}
              </div>
            )}
          </div>

          {/* Desktop Right card */}
          <div
            id='player-2-card-desktop'
            className='
              hidden lg:flex flex-col items-center justify-center bg-white border-b-8 border-black rounded-3xl 
              w-36 p-6 relative shadow-2xl min-h-35
            '
          >
            <span className='absolute -top-6 w-12 h-12 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center shadow'>
              <span className='text-black font-black text-xs uppercase'>
                {mode === 'online' && onlineRole === 2 ? 'YOU' : 'P2'}
              </span>
            </span>
            <div className='text-center mt-4 w-full'>
              <span
                id='p2-label-desktop'
                className='text-black font-black text-xs uppercase tracking-wide truncate flex items-center justify-center gap-1'
              >
                {mode === 'online'
                  ? roomState?.opponentName || 'Opponent'
                  : 'Player 2'}
                {mode === 'online' && (
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${roomState?.p2Active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}
                  />
                )}
              </span>
              <p className='text-[10px] font-semibold text-slate-500 block uppercase mb-1 text-center truncate'>
                {mode === 'online'
                  ? 'YELLOW GUEST'
                  : mode === 'pve'
                    ? `AI (${difficulty})`
                    : 'Human'}
              </p>
              <p
                id='p2-score-desktop'
                className='text-black font-black text-5xl'
              >
                {scores.scoreP2}
              </p>
            </div>

            {/* Bubble floating emoji reaction */}
            {latestEmojiP2 && (
              <div className='absolute -top-14 left-1/2 -translate-x-1/2 bg-white border-2 border-black rounded-full px-3 py-1 shadow-lg text-2xl animate-bounce z-40'>
                {latestEmojiP2}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Game Extras: Bento Actions Bar & Log */}
        <div
          className='w-full max-w-4xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'
          id='advanced-bento-dashboard'
        >
          {/* Action Card: Undo / Restart / Mute */}
          <div
            className='bg-white text-black p-5 border-b-8 border-black border-x-4 border-t-4 rounded-3xl shadow-xl flex flex-col justify-between'
            id='bento-dashboard-actions'
          >
            <h3 className='font-black text-sm uppercase tracking-wider text-indigo-950 mb-3 border-b-2 border-black/10 pb-1'>
              ✨ Controls
            </h3>

            <div className='flex flex-col gap-2.5'>
              {mode === 'online' ? (
                /* Online specific chat/reaction emojis */
                <div className='flex flex-col gap-2 mb-1'>
                  <span className='text-[10px] font-black uppercase text-slate-400 tracking-wider'>
                    Send Reaction
                  </span>
                  <div className='grid grid-cols-6 gap-1.5'>
                    {['❤️', '😂', '🔥', '😮', '👑', '👍'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleSendEmoji(emoji)}
                        className='py-1.5 bg-slate-50 hover:bg-slate-100 border border-black/25 rounded-lg text-lg flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm'
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className='text-[9px] font-semibold text-slate-400 text-center uppercase tracking-wider mt-1'>
                    Tap to pop on opponent's card
                  </div>
                </div>
              ) : (
                <>
                  {/* Ask AI Hint Button */}
                  <button
                    id='hint-btn'
                    onClick={handleGetHint}
                    disabled={winner !== null || isAILoading}
                    className={`
                      w-full py-2.5 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-black flex items-center justify-center gap-2
                      ${
                        winner !== null || isAILoading
                          ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none'
                      }
                    `}
                  >
                    <span className='text-base'>💡</span> Get AI Hint
                  </button>

                  {/* Undo Button */}
                  <button
                    id='undo-btn'
                    onClick={handleUndo}
                    disabled={
                      history.length === 0 || isAILoading || winner !== null
                    }
                    className={`
                      w-full py-2.5 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-black flex items-center justify-center gap-2
                      ${
                        history.length === 0 || isAILoading || winner !== null
                          ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                          : 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none'
                      }
                    `}
                  >
                    <svg
                      className='w-4 h-4'
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
                    Undo Move
                  </button>
                </>
              )}

              {/* Mute/Unmute Sound */}
              <button
                id='sound-toggle-btn'
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className='w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-black shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none cursor-pointer flex items-center justify-center gap-2'
              >
                {isSoundMuted ? (
                  <>
                    <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                      <path d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51c.66-1.24 1.03-2.65 1.03-4.15 0-4.28-2.99-7.86-7-8.76v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.03c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z' />
                    </svg>
                    Unmute Sound FX
                  </>
                ) : (
                  <>
                    <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                      <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
                    </svg>
                    Mute Sound FX
                  </>
                )}
              </button>

              {/* Hard Reset Scores */}
              {mode !== 'online' && (
                <button
                  id='reset-series-btn'
                  onClick={handleHardReset}
                  className='w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-black shadow-[2px_2px_0_#000000] active:translate-y-px active:shadow-none cursor-pointer text-center'
                >
                  Reset Scores
                </button>
              )}
            </div>
          </div>

          {/* Action Card: Real-time Stats & Mode config */}
          <div
            className='bg-white text-black p-5 border-b-8 border-black border-x-4 border-t-4 rounded-3xl shadow-xl flex flex-col justify-between'
            id='bento-dashboard-stats'
          >
            <div>
              <h3 className='font-black text-sm uppercase tracking-wider text-indigo-950 mb-3 border-b-2 border-black/10 pb-1'>
                📊 Session Insights
              </h3>
              <div className='space-y-2 mt-1.5 text-xs'>
                <div className='flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5'>
                  <span className='font-bold text-slate-500'>Game Type:</span>
                  <span className='font-black text-indigo-950'>
                    {mode === 'online'
                      ? 'Online Multiplayer'
                      : mode === 'pve'
                        ? 'Computer vs Human'
                        : 'Local 2 Players'}
                  </span>
                </div>
                {mode === 'online' ? (
                  <>
                    <div className='flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5'>
                      <span className='font-bold text-slate-500'>
                        Lobby Code:
                      </span>
                      <span className='font-black text-indigo-950 font-mono tracking-wider select-all uppercase'>
                        {onlineLobbyId}
                      </span>
                    </div>
                    <div className='flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5'>
                      <span className='font-bold text-slate-500'>
                        Signal link:
                      </span>
                      <span className='font-black text-emerald-600'>
                        Active 🟢
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5'>
                      <span className='font-bold text-slate-500'>
                        AI Level:
                      </span>
                      <span className='font-black text-indigo-950 capitalize'>
                        {mode === 'pve' ? difficulty : 'N/A'}
                      </span>
                    </div>
                    <div className='flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5'>
                      <span className='font-bold text-slate-500'>
                        Keyboard Controls:
                      </span>
                      <span className='font-black text-emerald-600'>
                        Active ⌨️
                      </span>
                    </div>
                  </>
                )}
                <div className='flex justify-between items-center pb-0.5'>
                  <span className='font-bold text-slate-500'>Total Moves:</span>
                  <span className='font-black text-indigo-950'>
                    {movesLog.length}
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-indigo-50 p-2.5 rounded-xl text-[10px] text-indigo-950 font-bold uppercase tracking-wider text-center mt-3 border border-indigo-100'>
              {winner === null ? (
                <span>In-progress • Have Fun!</span>
              ) : (
                <span className='text-red-500 font-black'>Game Over</span>
              )}
            </div>
          </div>

          {/* Action Card: Scrollable Move History Log */}
          <div
            className='bg-white text-black p-5 border-b-8 border-black border-x-4 border-t-4 rounded-3xl shadow-xl flex flex-col'
            id='bento-dashboard-log'
          >
            <h3 className='font-black text-sm uppercase tracking-wider text-indigo-950 mb-2.5 border-b-2 border-black/10 pb-1'>
              📝 Game Log
            </h3>

            <div
              className='flex-1 overflow-y-auto max-h-30 pr-1 space-y-1.5 text-xs'
              style={{ scrollbarWidth: 'thin' }}
            >
              {movesLog.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-slate-400 py-4 text-center'>
                  <span className='text-2xl'>⏳</span>
                  <p className='mt-1 font-bold text-slate-500'>No moves yet</p>
                  <p className='text-[10px] opacity-75 leading-tight'>
                    Click on any column above to place a disc!
                  </p>
                </div>
              ) : (
                [...movesLog].reverse().map((m) => (
                  <div
                    key={m.stepNumber}
                    className='flex justify-between items-center bg-slate-50 border border-slate-200 p-1.5 rounded-lg'
                  >
                    <span className='font-black text-indigo-950 text-[10px] bg-slate-200 px-1.5 py-0.5 rounded-md'>
                      #{m.stepNumber}
                    </span>
                    <span
                      className={`font-bold flex items-center gap-1 text-[11px] ${m.player === 1 ? 'text-red-600' : 'text-yellow-600'}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full border border-black/40 inline-block ${m.player === 1 ? 'bg-red-500' : 'bg-yellow-400'}`}
                      ></span>
                      P{m.player}{' '}
                      {m.player === 2 && mode === 'pve' ? '(AI)' : ''}
                    </span>
                    <span className='font-black text-slate-600'>
                      Col {m.col + 1}, Row {6 - m.row}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer credits area */}
      <footer
        id='game-footer'
        className='text-center text-[10px] text-slate-400 font-bold mb-1 tracking-wider uppercase'
      >
        Connect Four Arcade • Powered by Antigravity engine
      </footer>
    </div>
  );
}
