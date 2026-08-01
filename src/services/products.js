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
 * @param {object} productData
 * @param {File[]} imageFiles   — raw image files selected by the admin
 * @returns {Promise<{ success: boolean, id?: string, errors?: string[], error?: string }>}
 */
export const addProduct = async (productData, imageFiles = []) => {
  let images = [];
  let uploadResult = null;

  try {
    // 1. Upload images to Cloudinary if provided
    if (imageFiles.length > 0) {
      uploadResult = await uploadImages(imageFiles, 'gandhorbi/products');

      if (!uploadResult || !uploadResult.success) {
        const errorMsg = uploadResult?.errors?.[0] || 'Image upload failed.';
        return {
          success: false,
          error:   errorMsg,
          errors:  uploadResult?.errors ?? [errorMsg],
        };
      }

      // Map each uploaded image to secure_url (url) & public_id (publicId)
      images = uploadResult.images.map(({ url, publicId, width, height, format, bytes }) => ({
        url,       // secure_url — used to display the image
        publicId,  // public_id  — used to delete the image later
        width:  width ?? null,
        height: height ?? null,
        format: format ?? null,
        bytes:  bytes ?? null,
      }));

      if (uploadResult.errors?.length > 0) {
        console.warn('[Products] Some images failed to upload:', uploadResult.errors);
      }
    }

    // 2. Build product document for Firestore
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
      images, // contains [{ url, publicId, ... }]
    };

    // 3. Save document to Firestore
    const result = await addDocument(PRODUCTS_COLLECTION, document);

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to save product to database.' };
    }

    return {
      success: true,
      id: result.id,
      uploadErrors: uploadResult?.errors ?? [],
    };

  } catch (error) {
    console.error('[Products] addProduct Exception:', error);
    return { success: false, error: error.message || 'Unexpected error adding product.' };
  }
};

// ─── Get All Products ─────────────────────────────────────────────────────────

export const getProducts = async () => {
  return getDocuments(PRODUCTS_COLLECTION);
};

// ─── Get Product by ID ────────────────────────────────────────────────────────

export const getProductById = async (productId) => {
  return getDocument(PRODUCTS_COLLECTION, productId);
};

// ─── Get Products by Category ─────────────────────────────────────────────────

export const getProductsByCategory = async (category) => {
  return queryDocuments(PRODUCTS_COLLECTION, [
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
  ]);
};

// ─── Get Featured Products ────────────────────────────────────────────────────

export const getFeaturedProducts = async (maxCount = 12) => {
  return queryDocuments(PRODUCTS_COLLECTION, [
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(maxCount),
  ]);
};

// ─── Get Trending Products ────────────────────────────────────────────────────

export const getTrendingProducts = async (maxCount = 8) => {
  return queryDocuments(PRODUCTS_COLLECTION, [
    where('trending', '==', true),
    orderBy('createdAt', 'desc'),
    limit(maxCount),
  ]);
};

// ─── Update Product ───────────────────────────────────────────────────────────

export const updateProduct = async (productId, updates, newImageFiles = []) => {
  let updatedFields = { ...updates };
  let uploadResult = null;

  try {
    if (newImageFiles.length > 0) {
      uploadResult = await uploadImages(newImageFiles, 'gandhorbi/products');
      if (!uploadResult || !uploadResult.success) {
        return { success: false, error: uploadResult?.errors?.[0] || 'Image upload failed during update.' };
      }

      const newImages = uploadResult.images.map(({ url, publicId, width, height, format, bytes }) => ({
        url, publicId, width, height, format, bytes,
      }));

      if (updates.replaceImages) {
        updatedFields.images = newImages;
      } else {
        updatedFields.images = newImages;
      }
      delete updatedFields.replaceImages;
    }

    return updateDocument(PRODUCTS_COLLECTION, productId, updatedFields);
  } catch (error) {
    console.error('[Products] updateProduct Exception:', error);
    return { success: false, error: error.message || 'Unexpected error updating product.' };
  }
};

// ─── Delete Product ───────────────────────────────────────────────────────────

export const deleteProduct = async (productId) => {
  return deleteDocument(PRODUCTS_COLLECTION, productId);
};
