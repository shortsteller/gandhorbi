/**
 * schemas.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JSDoc type definitions for all Firestore document shapes.
 *
 * These types serve as the single source of truth for the database schema.
 * Import them with @typedef references in any service or component that needs
 * to describe Firestore data.
 *
 * NOTE: This project uses plain JavaScript.  If TypeScript is added later,
 * convert these JSDoc typedefs to interfaces / types.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * A Cloudinary image object.
 * BOTH fields are always stored together.  The publicId is required for
 * future deletion via a secure backend (Firebase Cloud Functions).
 *
 * @typedef {Object} CloudinaryImage
 * @property {string}  url       - Cloudinary secure_url — use for <img src>
 * @property {string}  publicId  - Cloudinary public_id  — use for deletion
 * @property {number}  [width]
 * @property {number}  [height]
 * @property {string}  [format]  - e.g. "jpg", "webp"
 * @property {number}  [bytes]   - file size in bytes
 */

/**
 * A product document as stored in the Firestore "products" collection.
 *
 * Deletion workflow (future):
 *   1. Extract images[].publicId → send to secure backend
 *   2. Backend deletes from Cloudinary
 *   3. Delete this Firestore document
 *
 * @typedef {Object} ProductDocument
 * @property {string}           id            - Firestore document ID (auto-generated)
 * @property {string}           name
 * @property {string}           category
 * @property {string}           description
 * @property {number}           price         - sale price in INR
 * @property {number|null}      originalPrice - MRP; null if no discount
 * @property {number|null}      discount      - discount percentage; null if none
 * @property {number}           stock         - units available (0 = out of stock)
 * @property {boolean}          featured      - show in featured section
 * @property {boolean}          trending      - show in trending section
 * @property {CloudinaryImage[]} images       - always [{url, publicId, ...}]
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updatedAt
 */

/**
 * The shape expected by addProduct() and updateProduct().
 *
 * @typedef {Object} ProductInput
 * @property {string}   name
 * @property {string}   category
 * @property {string}   description
 * @property {number}   price
 * @property {number}   [originalPrice]
 * @property {number}   [discount]
 * @property {number}   [stock]
 * @property {boolean}  [featured]
 * @property {boolean}  [trending]
 */

/**
 * A Firebase Admin / CMS user.
 * Corresponds to a Firebase Authentication user record.
 *
 * @typedef {Object} AdminUser
 * @property {string}  uid
 * @property {string}  email
 * @property {string|null} displayName
 * @property {boolean} emailVerified
 */

// Export an empty object so this file can be imported as a module.
export {};
