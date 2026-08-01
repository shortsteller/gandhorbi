/**
 * firebase.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase app initialization (modular SDK v9+).
 * Direct firebaseConfig object initialization.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyALYLG9hyGNwvuBKANv0V5t13RO6c7t5rk",
  authDomain: "gandhorbi-folk-arts.firebaseapp.com",
  projectId: "gandhorbi-folk-arts",
  storageBucket: "gandhorbi-folk-arts.firebasestorage.app",
  messagingSenderId: "180655510644",
  appId: "1:180655510644:web:6d5dd4b75b50da016bed21",
  measurementId: "G-SDF3MQKP8Q"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {});

export { app, analytics };
