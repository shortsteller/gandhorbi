/**
 * firestore.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Firestore service layer.
 *
 * Provides generic CRUD helpers (get, add, update, delete, query) that higher-
 * level service modules (products.js, etc.) build on top of.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { app } from './firebase';

/** Shared Firestore instance (null if app init failed) */
export const db = app ? getFirestore(app) : null;

// Re-export Firestore utilities
export { serverTimestamp, Timestamp, where, orderBy, limit, query, collection, doc };

// ─── Generic Helpers ──────────────────────────────────────────────────────────

export const addDocument = async (collectionName, data) => {
  if (!db) return { success: false, error: 'Firestore is not initialized.' };
  try {
    const ref = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: ref.id };
  } catch (error) {
    console.error(`[Firestore] addDocument(${collectionName}) error:`, error);
    return { success: false, error: error.message };
  }
};

export const getDocument = async (collectionName, documentId) => {
  if (!db) return { success: false, error: 'Firestore is not initialized.' };
  try {
    const snap = await getDoc(doc(db, collectionName, documentId));
    if (!snap.exists()) {
      return { success: false, error: 'Document not found.' };
    }
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (error) {
    console.error(`[Firestore] getDocument(${collectionName}/${documentId}) error:`, error);
    return { success: false, error: error.message };
  }
};

export const getDocuments = async (collectionName) => {
  if (!db) return { success: false, error: 'Firestore is not initialized.' };
  try {
    const snap = await getDocs(collection(db, collectionName));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { success: true, data };
  } catch (error) {
    console.error(`[Firestore] getDocuments(${collectionName}) error:`, error);
    return { success: false, error: error.message };
  }
};

export const queryDocuments = async (collectionName, constraints = []) => {
  if (!db) return { success: false, error: 'Firestore is not initialized.' };
  try {
    const ref = collection(db, collectionName);
    const q   = query(ref, ...constraints);
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { success: true, data };
  } catch (error) {
    console.error(`[Firestore] queryDocuments(${collectionName}) error:`, error);
    return { success: false, error: error.message };
  }
};

export const updateDocument = async (collectionName, documentId, updates) => {
  if (!db) return { success: false, error: 'Firestore is not initialized.' };
  try {
    await updateDoc(doc(db, collectionName, documentId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error(`[Firestore] updateDocument(${collectionName}/${documentId}) error:`, error);
    return { success: false, error: error.message };
  }
};

export const deleteDocument = async (collectionName, documentId) => {
  if (!db) return { success: false, error: 'Firestore is not initialized.' };
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    return { success: true };
  } catch (error) {
    console.error(`[Firestore] deleteDocument(${collectionName}/${documentId}) error:`, error);
    return { success: false, error: error.message };
  }
};
