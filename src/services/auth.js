/**
 * auth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase Authentication service — Email / Password.
 *
 * Safe exports:
 *   auth          — the Auth instance (or null if Firebase is not initialized)
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

/** Shared Auth instance (null if app init failed) */
export const auth = app ? getAuth(app) : null;

// ─── Sign-Up ─────────────────────────────────────────────────────────────────

export const signUp = async (email, password) => {
  if (!auth) {
    return { success: false, error: 'Firebase Auth is not configured. Please check environment variables.' };
  }
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: credential.user };
  } catch (error) {
    return { success: false, error: _authErrorMessage(error.code) };
  }
};

// ─── Sign-In ─────────────────────────────────────────────────────────────────

export const signIn = async (email, password) => {
  if (!auth) {
    return { success: false, error: 'Firebase Auth is not configured. Please check environment variables.' };
  }
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: credential.user };
  } catch (error) {
    return { success: false, error: _authErrorMessage(error.code) };
  }
};

// ─── Sign-Out ────────────────────────────────────────────────────────────────

export const signOut = async () => {
  if (!auth) return { success: true };
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ─── Current User ────────────────────────────────────────────────────────────

export const getCurrentUser = () => (auth ? auth.currentUser : null);

// ─── Auth State Observer ─────────────────────────────────────────────────────

export const onAuthChanged = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// ─── Internal Helpers ────────────────────────────────────────────────────────

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
    'auth/invalid-credential':      'Invalid login credentials. Please check email and password.',
  };
  return messages[code] ?? `Authentication failed (${code}).`;
};
