/**
 * formatters.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared formatting utilities used across service modules and UI components.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Format a number as Indian Rupees.
 * @param {number} amount
 * @returns {string}   e.g. "₹18,500"
 */
export const formatPrice = (amount) =>
  `₹${amount.toLocaleString('en-IN')}`;

/**
 * Calculate the discount percentage between original and sale price.
 * @param {number} original
 * @param {number} sale
 * @returns {number}  e.g. 20 (for 20%)
 */
export const calcDiscount = (original, sale) =>
  original > 0 ? Math.round(((original - sale) / original) * 100) : 0;

/**
 * Convert a Firestore Timestamp to a JS Date.
 * Falls back to null if the value is not a valid Timestamp.
 * @param {import('firebase/firestore').Timestamp | any} timestamp
 * @returns {Date | null}
 */
export const firestoreTimestampToDate = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return null;
};

/**
 * Extract only the image display URL from a Cloudinary image object.
 * Useful when you just need the src for an <img> tag.
 * @param {{ url: string, publicId: string }} imageObj
 * @returns {string}
 */
export const getImageUrl = (imageObj) => imageObj?.url ?? '';

/**
 * Build a Cloudinary transformation URL for thumbnails (without needing the SDK).
 * @param {string} publicId
 * @param {{ width?: number, height?: number, crop?: string, quality?: string }} options
 * @returns {string}
 */
export const buildCloudinaryUrl = (
  publicId,
  { width = 400, height = 400, crop = 'fill', quality = 'auto' } = {}
) => {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${width},h_${height},c_${crop},q_${quality}/${publicId}`;
};
