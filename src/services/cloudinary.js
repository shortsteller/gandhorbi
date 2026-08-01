/**
 * cloudinary.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cloudinary image upload service — unsigned upload via the Upload API.
 *
 * Cloud Name:      wh7ywcjv
 * Upload Preset:   gandhorbi_uploads (Unsigned)
 * Upload Endpoint: https://api.cloudinary.com/v1_1/wh7ywcjv/image/upload
 * ─────────────────────────────────────────────────────────────────────────────
 */

const CLOUD_NAME    = 'wh7ywcjv';
const UPLOAD_PRESET = 'gandhorbi_uploads';
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
  formData.append('file',          file);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) {
    formData.append('folder',      folder);
  }

  try {
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body:   formData,
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('[Cloudinary] Upload failed with HTTP status:', response.status);
      console.error('[Cloudinary] Response error body:', JSON.stringify(errBody, null, 2));
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
    console.error('[Cloudinary] uploadImage Exception / Network Error:', error);
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
