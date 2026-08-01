/**
 * services/index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Barrel file — re-exports every service so consumers can import from a
 * single location instead of multiple deep paths.
 *
 * Usage:
 *   import { addProduct, signIn, uploadImage } from '../services';
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Firebase core
export { app, analytics } from './firebase';

// Authentication
export {
  auth,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthChanged,
} from './auth';

// Firestore generic layer
export {
  db,
  addDocument,
  getDocument,
  getDocuments,
  queryDocuments,
  updateDocument,
  deleteDocument,
  serverTimestamp,
} from './firestore';

// Cloudinary
export { uploadImage, uploadImages } from './cloudinary';

// Products (combines Cloudinary + Firestore)
export {
  addProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getTrendingProducts,
  updateProduct,
  deleteProduct,
} from './products';
