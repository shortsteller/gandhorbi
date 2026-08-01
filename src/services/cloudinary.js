/**
 * cloudinary.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cloudinary image upload service — unsigned upload via the Upload API.
 *
 * Key design decisions:
 *  • Uses unsigned uploads (no server secret required for uploads).
 *  • Always returns BOTH `secure_url` AND `public_id` — the public_id is
 *    essential for future deletion via a secure backend (Cloud Functions, etc.).
 *  • Never stores credentials server-side; the unsigned preset is safe for
 *    client-side code.
 *  • Does NOT use Firebase Storage — all product images live in Cloudinary.
 *
 * Exports:
 *   uploadImage    — upload a single File / Blob
 *   uploadImages   — upload an array of File / Blob (returns array of results)
 *
 * Returned image object shape (stored in Firestore):
 *   {
 *     url:       string   // secure_url  — use this to display the image
 *     publicId:  string   // public_id   — use this to delete the image later
 *     width:     number
 *     height:    number
 *     format:    string
 *     bytes:     number
 *     createdAt: string   // ISO timestamp from Cloudinary
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const CLOUD_NAME    = "wh7ywcjv";
const UPLOAD_PRESET = "gandhorbi_uploads";
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// ─── Single Upload ────────────────────────────────────────────────────────────

/**
 * Upload a single image file to Cloudinary.
 *
 * @param {File|Blob} file       — the image to upload
 * @param {string}    [folder]   — optional Cloudinary folder path
 *                                 e.g. "gandhorbi/products"
 * @returns {Promise<{
 *   success:  boolean,
 *   image?:   { url: string, publicId: string, width: number,
 *               height: number, format: string, bytes: number,
 *               createdAt: string },
 *   error?:   string
 * }>}
 */
export const uploadImage = async (file, folder = 'gandhorbi/products') => {
  if (!file) {
    return { success: false, error: 'No file provided for upload.' };
  }

  const formData = new FormData();
  formData.append('file',         file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder',        folder);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body:   formData,
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message = errBody?.error?.message ?? `HTTP ${response.status}`;
      return { success: false, error: `Cloudinary upload failed: ${message}` };
    }

    const data = await response.json();

    // Always capture both secure_url and public_id
    const image = {
      url:       data.secure_url,   // displayed on the website
      publicId:  data.public_id,    // required for future deletion
      width:     data.width,
      height:    data.height,
      format:    data.format,
      bytes:     data.bytes,
      createdAt: data.created_at,
    };

    return { success: true, image };

  } catch (error) {
    console.error('[Cloudinary] uploadImage error:', error);
    return { success: false, error: error.message ?? 'Unknown upload error.' };
  }
};

// ─── Batch Upload ─────────────────────────────────────────────────────────────

/**
 * Upload multiple image files concurrently.
 *
 * @param {File[]|Blob[]} files   — array of images
 * @param {string}        [folder]
 * @returns {Promise<{
 *   success:  boolean,
 *   images:   Array<{ url: string, publicId: string, ... }>,
 *   errors:   string[],
 *   allSucceeded: boolean
 * }>}
 */
export const uploadImages = async (files, folder = 'gandhorbi/products') => {
  if (!files || files.length === 0) {
    return { success: false, images: [], errors: ['No files provided.'], allSucceeded: false };
  }

  const results = await Promise.all(
    Array.from(files).map((file) => uploadImage(file, folder))
  );

  const images    = results.filter((r) => r.success).map((r) => r.image);
  const errors    = results.filter((r) => !r.success).map((r) => r.error);
  const allSucceeded = errors.length === 0;

  if (!allSucceeded) {
    console.warn('[Cloudinary] Some uploads failed:', errors);
  }

  return {
    success:      images.length > 0,
    images,
    errors,
    allSucceeded,
  };
};

// ─── Future Delete Reference ──────────────────────────────────────────────────

/**
 * deleteCloudinaryImages (NOT implemented here — requires a secure backend)
 * ─────────────────────────────────────────────────────────────────────────────
 * Cloudinary image deletion MUST happen server-side (Firebase Cloud Functions
 * or another API) because it requires the API SECRET, which must never be
 * exposed in client-side code.
 *
 * Future workflow when an Admin deletes a product:
 *   1. Retrieve the product document from Firestore.
 *   2. Extract all `images[].publicId` values.
 *   3. POST those public_ids to your secure backend endpoint
 *      (e.g. Firebase Cloud Function).
 *   4. The backend calls Cloudinary's Destroy API with the API SECRET.
 *   5. On Cloudinary confirmation, the backend (or client) deletes the
 *      Firestore document via deleteDocument().
 *
 * This ensures Firestore and Cloudinary stay perfectly in sync.
 */
