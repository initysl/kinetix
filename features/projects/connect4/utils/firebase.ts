import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { BoardState, Player } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Operational types
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Ensure database connection is valid at startup
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection established successfully.');
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error(
        'Firebase is offline. Please check your network and configuration.',
      );
    }
  }
}

// Generate 6-digit alphanumeric room code (e.g. 'A4F923')
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing characters like I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Online Game State interface that aligns with Firestore representation
export interface OnlineGameSession {
  id: string; // 6-digit room code
  status: 'waiting' | 'active' | 'finished' | 'draw';
  creatorId: string;
  creatorName: string;
  opponentId: string | null;
  opponentName: string | null;
  currentPlayer: Player; // 1 or 2
  boardJson: string; // Flattened or JSON string of 6x7 BoardState
  lastPlacedCellRow: number | null;
  lastPlacedCellCol: number | null;
  winner: string | null; // "1", "2", "draw", or empty
  winningCellsJson: string | null; // JSON string of [row, col][] or null
  rematchP1: boolean;
  rematchP2: boolean;
  p1Active: boolean;
  p2Active: boolean;
  p1Score: number;
  p2Score: number;
  emojiP1: string | null; // For sending live emoji reactions
  emojiP2: string | null;
  updatedAt: any;
}

// Authenticate user anonymously if not already logged in
export async function ensureUserAuthenticated(): Promise<string> {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  } catch (error) {
    throw new Error(
      'Authentication failed: ' +
        (error instanceof Error ? error.message : String(error)),
    );
  }
}

// Call test connection immediately
testFirestoreConnection();
