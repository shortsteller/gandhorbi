/**
 * firebase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase app initialization (modular SDK v9+).
 * All other service modules (auth, firestore, etc.) import from here so that
 * only ONE Firebase app instance is ever created for the entire project.
 *
 * Environment variables are supplied via Vite's import.meta.env (VITE_ prefix).
 * Includes defensive fallback so missing env vars never cause top-level JS crashes.
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

let app = null;

try {
  if (getApps().length > 0) {
    app = getApp();
  } else if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key') {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn(
      '[Firebase] Warning: VITE_FIREBASE_API_KEY is missing or invalid in current environment. Firebase features will be disabled until environment variables are set.'
    );
  }
} catch (error) {
  console.error('[Firebase] Initialization error:', error);
}

let analytics = null;
if (app) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { app, analytics };
