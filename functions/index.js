/**
 * Cloud Functions for Gandhorbi Folk Arts
 * Automatically cleans up Cloudinary images when products or events are deleted from Firestore.
 */

const { onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { logger }            = require("firebase-functions");
const admin                 = require("firebase-admin");
const cloudinary            = require("cloudinary").v2;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "wh7ywcjv",
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true
});

/**
 * Helper to extract publicId from Cloudinary URL if not explicitly provided
 * e.g. "https://res.cloudinary.com/wh7ywcjv/image/upload/v12345/folder/sample.jpg" -> "folder/sample"
 */
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return null;
  }
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const path = parts[1].replace(/^v\d+\//, ""); // remove version string v1234/
    const filenameWithoutExt = path.substring(0, path.lastIndexOf("."));
    return filenameWithoutExt || path;
  } catch (e) {
    logger.warn("Failed to parse publicId from URL:", url, e);
    return null;
  }
}

/**
 * 📦 Firestore Trigger: onProductDeleted
 * Triggers automatically when any document in 'products' collection is deleted.
 */
exports.onProductDeleted = onDocumentDeleted("products/{productId}", async (event) => {
  const productId   = event.params.productId;
  const deletedData = event.data ? event.data.data() : null;

  if (!deletedData) {
    logger.info(`[onProductDeleted] No data found for deleted product ID: ${productId}`);
    return;
  }

  logger.info(`[onProductDeleted] Processing image destruction for product "${deletedData.name || productId}"`);

  const publicIds = new Set();

  // 1. Extract publicIds from 'images' array
  if (Array.isArray(deletedData.images)) {
    deletedData.images.forEach((imgObj) => {
      if (typeof imgObj === "object" && imgObj.publicId) {
        publicIds.add(imgObj.publicId);
      } else if (typeof imgObj === "string") {
        const parsed = extractPublicIdFromUrl(imgObj);
        if (parsed) publicIds.add(parsed);
      } else if (imgObj?.url) {
        const parsed = extractPublicIdFromUrl(imgObj.url);
        if (parsed) publicIds.add(parsed);
      }
    });
  }

  // 2. Extract publicId from top-level 'image' field if present
  if (deletedData.image) {
    if (typeof deletedData.image === "object" && deletedData.image.publicId) {
      publicIds.add(deletedData.image.publicId);
    } else if (typeof deletedData.image === "string") {
      const parsed = extractPublicIdFromUrl(deletedData.image);
      if (parsed) publicIds.add(parsed);
    }
  }

  if (publicIds.size === 0) {
    logger.info(`[onProductDeleted] No Cloudinary publicIds associated with product: ${productId}`);
    return;
  }

  logger.info(`[onProductDeleted] Destroying ${publicIds.size} Cloudinary image(s):`, Array.from(publicIds));

  // Destroy each image on Cloudinary
  const deletePromises = Array.from(publicIds).map(async (pubId) => {
    try {
      const res = await cloudinary.uploader.destroy(pubId);
      logger.info(`[Cloudinary Destroy] ${pubId}:`, res);
      return { pubId, result: res.result };
    } catch (err) {
      logger.error(`[Cloudinary Destroy Error] Failed to destroy ${pubId}:`, err);
      return { pubId, error: err.message };
    }
  });

  const results = await Promise.all(deletePromises);
  logger.info(`[onProductDeleted] Finished Cloudinary cleanup for product ${productId}:`, results);
});

/**
 * 📅 Firestore Trigger: onEventDeleted
 * Triggers automatically when any document in 'events' collection is deleted.
 */
exports.onEventDeleted = onDocumentDeleted("events/{eventId}", async (event) => {
  const eventId     = event.params.eventId;
  const deletedData = event.data ? event.data.data() : null;

  if (!deletedData) {
    logger.info(`[onEventDeleted] No data found for deleted event ID: ${eventId}`);
    return;
  }

  logger.info(`[onEventDeleted] Processing banner destruction for event "${deletedData.title || eventId}"`);

  const publicIds = new Set();

  // 1. Extract publicId from 'banner' field
  if (deletedData.banner) {
    if (typeof deletedData.banner === "object" && deletedData.banner.publicId) {
      publicIds.add(deletedData.banner.publicId);
    } else if (typeof deletedData.banner === "string") {
      const parsed = extractPublicIdFromUrl(deletedData.banner);
      if (parsed) publicIds.add(parsed);
    } else if (deletedData.banner?.url) {
      const parsed = extractPublicIdFromUrl(deletedData.banner.url);
      if (parsed) publicIds.add(parsed);
    }
  }

  // 2. Extract publicId from 'image' field if present
  if (deletedData.image) {
    if (typeof deletedData.image === "object" && deletedData.image.publicId) {
      publicIds.add(deletedData.image.publicId);
    } else if (typeof deletedData.image === "string") {
      const parsed = extractPublicIdFromUrl(deletedData.image);
      if (parsed) publicIds.add(parsed);
    }
  }

  if (publicIds.size === 0) {
    logger.info(`[onEventDeleted] No Cloudinary banner publicId associated with event: ${eventId}`);
    return;
  }

  logger.info(`[onEventDeleted] Destroying ${publicIds.size} Cloudinary banner(s):`, Array.from(publicIds));

  const deletePromises = Array.from(publicIds).map(async (pubId) => {
    try {
      const res = await cloudinary.uploader.destroy(pubId);
      logger.info(`[Cloudinary Destroy] ${pubId}:`, res);
      return { pubId, result: res.result };
    } catch (err) {
      logger.error(`[Cloudinary Destroy Error] Failed to destroy ${pubId}:`, err);
      return { pubId, error: err.message };
    }
  });

  const results = await Promise.all(deletePromises);
  logger.info(`[onEventDeleted] Finished Cloudinary cleanup for event ${eventId}:`, results);
});
