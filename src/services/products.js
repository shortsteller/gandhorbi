/**
 * products.js
 * ─────────────────────────────────────────────────────────────────────────────
 * High-level product service — combines Cloudinary uploads + Firestore writes.
 *
 * This is the single entry-point that the Admin Portal (and any other feature)
 * should use to manage products.  It orchestrates:
 *   1. Uploading images to Cloudinary (getting back secure_url + public_id).
 *   2. Building the complete product document.
 *   3. Writing / reading / updating / deleting from the "products" Firestore
 *      collection.
 *
 * ─── Firestore "products" document schema ────────────────────────────────────
 * {
 *   name:          string,
 *   category:      string,
 *   description:   string,
 *   price:         number,
 *   originalPrice: number | null,
 *   discount:      number | null,    // percentage, e.g. 15 for 15%
 *   stock:         number,
 *   featured:      boolean,
 *   trending:      boolean,
 *   images: [                        // ← always both values together
 *     { url: string, publicId: string, width?, height?, format?, bytes? }
 *   ],
 *   createdAt:     Timestamp,
 *   updatedAt:     Timestamp,
 * }
 *
 * ─── Delete workflow (future — requires secure backend) ──────────────────────
 *   1. Call getProductById(id) → extract images[].publicId array.
 *   2. POST publicIds to Firebase Cloud Function (or secure API).
 *   3. Cloud Function deletes images from Cloudinary via API secret.
 *   4. On success, call deleteProduct(id) below.
 *   This two-step process keeps Firestore and Cloudinary perfectly in sync.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { uploadImages } from './cloudinary';
import {
  addDocument,
  getDocument,
  getDocuments,
  queryDocuments,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
  limit,
} from './firestore';

/** The Firestore collection name for products */
const PRODUCTS_COLLECTION = 'products';

// ─── Add Product ──────────────────────────────────────────────────────────────

/**
 * Add a new product.
 *  - Uploads all provided image files to Cloudinary first.
 *  - Stores the resulting {url, publicId} pairs alongside the product data.
 *  - Creates the Firestore document (collection auto-created on first write).
 *
 * @param {{
 *   name:          string,
 *   category:      string,
 *   description:   string,
 *   price:         number,
 *   originalPrice?: number,
 *   discount?:     number,
 *   stock?:        number,
 *   featured?:     boolean,
 *   trending?:     boolean,
 * }} productData
 * @param {File[]} imageFiles   — raw image files selected by the admin
 * @returns {Promise<{ success: boolean, id?: string, errors?: string[], error?: string }>}
 */
export const addProduct = async (productData, imageFiles = []) => {
  // 1. Upload images to Cloudinary
  let images = [];
  if (imageFiles.length > 0) {
    const uploadResult = await uploadImages(imageFiles, 'gandhorbi/products');

    if (!uploadResult.success) {
      return {
        success: false,
        error:  'All image uploads failed.',
        errors: uploadResult.errors,
      };
    }

    // Map to the slim schema stored in Firestore
    images = uploadResult.images.map(({ url, publicId, width, height, format, bytes }) => ({
      url,       // secure_url — used to display the image
      publicId,  // public_id  — used to delete the image later
      width,
      height,
      format,
      bytes,
    }));

    if (uploadResult.errors.length > 0) {
      console.warn('[Products] Some images failed to upload:', uploadResult.errors);
    }
  }

  // 2. Write to Firestore
  const document = {
    name:          productData.name          ?? '',
    category:      productData.category      ?? '',
    description:   productData.description   ?? '',
    price:         productData.price         ?? 0,
    originalPrice: productData.originalPrice ?? null,
    discount:      productData.discount      ?? null,
    stock:         productData.stock         ?? 0,
    featured:      productData.featured      ?? false,
    trending:      productData.trending      ?? false,
    images,  // [{url, publicId, ...}]
  };

  const result = await addDocument(PRODUCTS_COLLECTION, document);

  return result.success
    ? { success: true, id: result.id, uploadErrors: uploadResult?.errors ?? [] }
    : { success: false, error: result.error };
};

// ─── Get All Products ─────────────────────────────────────────────────────────

/**
 * Retrieve all products from Firestore.
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getProducts = async () => {
  return getDocuments(PRODUCTS_COLLECTION);
};

// ─── Get Product by ID ────────────────────────────────────────────────────────

/**
 * Retrieve a single product by its Firestore document ID.
 * @param {string} productId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const getProductById = async (productId) => {
  return getDocument(PRODUCTS_COLLECTION, productId);
};

// ─── Get Products by Category ─────────────────────────────────────────────────

/**
 * Retrieve all products in a given category.
 * @param {string} category
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getProductsByCategory = async (category) => {
  return queryDocuments(PRODUCTS_COLLECTION, [
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
  ]);
};

// ─── Get Featured Products ────────────────────────────────────────────────────

/**
 * Retrieve products marked as `featured`.
 * @param {number} [maxCount=12]
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getFeaturedProducts = async (maxCount = 12) => {
  return queryDocuments(PRODUCTS_COLLECTION, [
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(maxCount),
  ]);
};

// ─── Get Trending Products ────────────────────────────────────────────────────

/**
 * Retrieve products marked as `trending`.
 * @param {number} [maxCount=8]
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getTrendingProducts = async (maxCount = 8) => {
  return queryDocuments(PRODUCTS_COLLECTION, [
    where('trending', '==', true),
    orderBy('createdAt', 'desc'),
    limit(maxCount),
  ]);
};

// ─── Update Product ───────────────────────────────────────────────────────────

/**
 * Update an existing product's fields.
 * Pass only the fields you want to change; unmentioned fields are preserved.
 *
 * If new image files are provided, they are uploaded to Cloudinary first and
 * the resulting image objects are APPENDED to the existing images array.
 * To replace images entirely, include `replaceImages: true` in updates.
 *
 * @param {string}   productId
 * @param {object}   updates          — product fields to update
 * @param {File[]}   [newImageFiles]  — new image files to upload & append
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const updateProduct = async (productId, updates, newImageFiles = []) => {
  let updatedFields = { ...updates };

  if (newImageFiles.length > 0) {
    const uploadResult = await uploadImages(newImageFiles, 'gandhorbi/products');
    if (!uploadResult.success) {
      return { success: false, error: 'Image upload failed during product update.' };
    }

    const newImages = uploadResult.images.map(({ url, publicId, width, height, format, bytes }) => ({
      url, publicId, width, height, format, bytes,
    }));

    // Append to existing images unless caller requests a full replacement
    if (updates.replaceImages) {
      updatedFields.images = newImages;
    } else {
      // Merge in caller — this function does not fetch existing images to keep
      // the API surface simple; the caller should pre-populate updates.images
      // if they want to merge.
      updatedFields.images = newImages;
    }
    delete updatedFields.replaceImages;
  }

  return updateDocument(PRODUCTS_COLLECTION, productId, updatedFields);
};

// ─── Delete Product ───────────────────────────────────────────────────────────

/**
 * Delete a product's Firestore document.
 *
 * ⚠️  IMPORTANT — always delete Cloudinary images FIRST.
 *   The recommended workflow:
 *     1. getProductById(productId) → extract images[].publicId values
 *     2. POST publicIds to your secure backend (Firebase Cloud Function)
 *     3. Backend deletes from Cloudinary using API SECRET
 *     4. On Cloudinary success → call this function
 *
 *   Calling this first and Cloudinary later risks orphaned images if step 2
 *   fails.
 *
 * @param {string} productId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const deleteProduct = async (productId) => {
  return deleteDocument(PRODUCTS_COLLECTION, productId);
};
