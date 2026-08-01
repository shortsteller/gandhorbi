/**
 * firebase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase app initialization (modular SDK v9+).
 * All other service modules (auth, firestore, etc.) import from here so that
 * only ONE Firebase app instance is ever created for the entire project.
 *
 * Environment variables are supplied via Vite's import.meta.env (VITE_ prefix).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Initialize only once (guards against React Strict Mode double-init).
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Analytics is browser-only; initialise lazily so SSR / Node builds don't crash.
 */
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics };
