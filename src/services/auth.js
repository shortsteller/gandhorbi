/**
 * auth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase Authentication service — Email / Password.
 *
 * Exports:
 *   auth          — the Auth instance (usable in React hooks like onAuthStateChanged)
 *   signUp        — create a new account
 *   signIn        — sign in with email & password
 *   signOut       — sign the current user out
 *   getCurrentUser— returns the currently signed-in user (or null)
 *   onAuthChanged — subscribe to auth state changes (for guards / context)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { app } from './firebase';

/** Shared Auth instance */
export const auth = getAuth(app);

// ─── Sign-Up ─────────────────────────────────────────────────────────────────

/**
 * Register a new user with email & password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signUp = async (email, password) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: credential.user };
  } catch (error) {
    return { success: false, error: _authErrorMessage(error.code) };
  }
};

// ─── Sign-In ─────────────────────────────────────────────────────────────────

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, user?: User, error?: string }>}
 */
export const signIn = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: credential.user };
  } catch (error) {
    return { success: false, error: _authErrorMessage(error.code) };
  }
};

// ─── Sign-Out ─────────────────────────────────────────────────────────────────

/**
 * Sign out the current user.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ─── Current User ─────────────────────────────────────────────────────────────

/**
 * Returns the currently authenticated Firebase user, or null if not signed in.
 * @returns {import('firebase/auth').User | null}
 */
export const getCurrentUser = () => auth.currentUser;

// ─── Auth State Observer ──────────────────────────────────────────────────────

/**
 * Subscribe to auth state changes.
 * Call this in a React effect or context provider.
 *
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} unsubscribe function
 *
 * @example
 *   useEffect(() => {
 *     const unsubscribe = onAuthChanged((user) => setUser(user));
 *     return unsubscribe;
 *   }, []);
 */
export const onAuthChanged = (callback) => onAuthStateChanged(auth, callback);

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Maps Firebase error codes to human-readable messages.
 * @param {string} code - Firebase error code
 * @returns {string}
 */
const _authErrorMessage = (code) => {
  const messages = {
    'auth/email-already-in-use':    'An account with this email already exists.',
    'auth/invalid-email':           'The email address is not valid.',
    'auth/operation-not-allowed':   'Email/password accounts are not enabled.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/too-many-requests':       'Too many failed attempts. Please try again later.',
    'auth/network-request-failed':  'Network error. Please check your connection.',
  };
  return messages[code] ?? `Authentication failed (${code}).`;
};
