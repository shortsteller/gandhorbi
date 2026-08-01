/**
 * firestore.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Firestore service layer.
 *
 * Provides generic CRUD helpers (get, add, update, delete, query) that higher-
 * level service modules (products.js, etc.) build on top of.
 *
 * All functions are async/await and return a consistent shape:
 *   { success: true,  data: <result>  }  — on success
 *   { success: false, error: <string> }  — on failure
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

/** Shared Firestore instance */
export const db = getFirestore(app);

// Re-export Firestore utilities so callers don't need to import firebase/firestore directly
export { serverTimestamp, Timestamp, where, orderBy, limit, query, collection, doc };

// ─── Generic Helpers ──────────────────────────────────────────────────────────

/**
 * Add a new document to a collection.
 * Automatically injects `createdAt` and `updatedAt` server timestamps.
 *
 * @param {string} collectionName
 * @param {object} data
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export const addDocument = async (collectionName, data) => {
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

/**
 * Fetch a single document by its ID.
 *
 * @param {string} collectionName
 * @param {string} documentId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const getDocument = async (collectionName, documentId) => {
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

/**
 * Fetch all documents in a collection.
 *
 * @param {string} collectionName
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getDocuments = async (collectionName) => {
  try {
    const snap = await getDocs(collection(db, collectionName));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { success: true, data };
  } catch (error) {
    console.error(`[Firestore] getDocuments(${collectionName}) error:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Run a Firestore query with optional constraints.
 *
 * @param {string} collectionName
 * @param {import('firebase/firestore').QueryConstraint[]} constraints
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const queryDocuments = async (collectionName, constraints = []) => {
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

/**
 * Update specific fields of an existing document.
 * Automatically refreshes `updatedAt`.
 *
 * @param {string} collectionName
 * @param {string} documentId
 * @param {object} updates   — only the fields to change
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const updateDocument = async (collectionName, documentId, updates) => {
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

/**
 * Delete a document permanently.
 *
 * ⚠️  IMPORTANT for image deletion workflow:
 *   Always retrieve the product's `images` array (which contains Cloudinary
 *   public_id values) BEFORE calling this function.  Delete all Cloudinary
 *   images via the secure backend FIRST, then call deleteDocument.
 *   This ensures Firestore and Cloudinary stay in sync with no orphaned assets.
 *
 * @param {string} collectionName
 * @param {string} documentId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const deleteDocument = async (collectionName, documentId) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    return { success: true };
  } catch (error) {
    console.error(`[Firestore] deleteDocument(${collectionName}/${documentId}) error:`, error);
    return { success: false, error: error.message };
  }
};
