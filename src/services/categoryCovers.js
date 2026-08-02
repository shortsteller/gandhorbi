/**
 * categoryCovers.js
 * Firestore and Cloudinary service for Homepage Category Cover images.
 * Collection name: "categoryCovers"
 * Document ID: category.id (e.g. "kantha-dupattas")
 */

import { db, setDocument, deleteDocument, getDocuments } from './firestore';
import { uploadImage } from './cloudinary';
import { collection, onSnapshot } from 'firebase/firestore';

const COLLECTION = 'categoryCovers';

/**
 * Upload image to Cloudinary & save cover record in Firestore
 */
export const saveCategoryCover = async (categoryId, categoryName, file) => {
  if (!file) {
    return { success: false, error: 'Please select an image file.' };
  }

  // 1. Upload to Cloudinary
  const uploadRes = await uploadImage(file, 'gandhorbi/category_covers');
  if (!uploadRes.success || !uploadRes.image) {
    return { success: false, error: uploadRes.error || 'Failed to upload image to Cloudinary.' };
  }

  // 2. Save document to Firestore with document ID = categoryId
  const docData = {
    categoryId,
    categoryName,
    image: {
      url: uploadRes.image.url,
      publicId: uploadRes.image.publicId,
    },
    updatedAt: new Date().toISOString(),
  };

  const firestoreRes = await setDocument(COLLECTION, categoryId, docData);
  if (!firestoreRes.success) {
    return { success: false, error: firestoreRes.error || 'Failed to save cover record to Firestore.' };
  }

  return { success: true, cover: docData };
};

/**
 * Remove category cover from Firestore
 */
export const removeCategoryCover = async (categoryId) => {
  return deleteDocument(COLLECTION, categoryId);
};

/**
 * Real-time listener for category covers
 */
export const subscribeToCategoryCovers = (callback) => {
  if (!db) return () => {};
  try {
    return onSnapshot(
      collection(db, COLLECTION),
      (snap) => {
        const coversMap = {};
        snap.docs.forEach((doc) => {
          coversMap[doc.id] = doc.data();
        });
        callback(coversMap);
      },
      (err) => {
        console.warn('[categoryCovers] Firestore snapshot listener error:', err);
        callback({});
      }
    );
  } catch (e) {
    console.warn('[categoryCovers] Subscription exception:', e);
    return () => {};
  }
};
