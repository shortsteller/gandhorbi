/**
 * events.js
 * ─────────────────────────────────────────────────────────────────────────────
 * High-level Events service — combines Cloudinary banner upload + Firestore.
 *
 * This is the single entry-point for all event management.  It orchestrates:
 *   1. Uploading the event banner image to Cloudinary (secure_url + public_id).
 *   2. Building the complete event document.
 *   3. Writing / reading / updating / deleting from the "events" Firestore
 *      collection (auto-created on first write — no manual setup needed).
 *
 * ─── Firestore "events" document schema ──────────────────────────────────────
 * {
 *   title:            string,
 *   description:      string,
 *   venue:            string,
 *   address:          string | null,
 *   city:             string | null,
 *   state:            string | null,
 *   startDate:        string,          // ISO date "YYYY-MM-DD"
 *   endDate:          string,          // ISO date "YYYY-MM-DD"
 *   startTime:        string | null,   // "HH:MM" (24-h) or human-readable
 *   endTime:          string | null,
 *   status:           "Upcoming" | "Ongoing" | "Completed",
 *   featured:         boolean,
 *   organizer:        string | null,
 *   contactNumber:    string | null,
 *   registrationLink: string | null,
 *   banner: {                          // ← always BOTH values
 *     url:      string,               //   Cloudinary secure_url (display)
 *     publicId: string,               //   Cloudinary public_id  (deletion)
 *     width?:   number,
 *     height?:  number,
 *     format?:  string,
 *     bytes?:   number,
 *   } | null,
 *   createdAt:  Timestamp,
 *   updatedAt:  Timestamp,
 * }
 *
 * ─── Delete workflow (future — requires secure backend) ──────────────────────
 *   1. getEventById(id) → extract banner.publicId
 *   2. POST publicId to Firebase Cloud Function (or secure API)
 *   3. Cloud Function calls Cloudinary Destroy API (uses API SECRET server-side)
 *   4. On Cloudinary confirmation → call deleteEvent(id)
 *   This keeps Firestore and Cloudinary perfectly in sync with zero orphaned assets.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { uploadImage } from './cloudinary';
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

/** The Firestore collection name for events */
const EVENTS_COLLECTION = 'events';

/** Valid event status values */
export const EVENT_STATUS = Object.freeze({
  UPCOMING:  'Upcoming',
  ONGOING:   'Ongoing',
  COMPLETED: 'Completed',
});

// ─── Add Event ────────────────────────────────────────────────────────────────

/**
 * Add a new event.
 *  - Uploads the banner image to Cloudinary first (if provided).
 *  - Stores the resulting { url, publicId } inside the Firestore document.
 *  - Creates the "events" Firestore collection automatically on first write.
 *
 * @param {{
 *   title:             string,
 *   description?:      string,
 *   venue:             string,
 *   address?:          string,
 *   city?:             string,
 *   state?:            string,
 *   startDate:         string,
 *   endDate:           string,
 *   startTime?:        string,
 *   endTime?:          string,
 *   status?:           'Upcoming' | 'Ongoing' | 'Completed',
 *   featured?:         boolean,
 *   organizer?:        string,
 *   contactNumber?:    string,
 *   registrationLink?: string,
 * }} eventData
 * @param {File|null} [bannerFile]  — optional banner image File
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export const addEvent = async (eventData, bannerFile = null) => {
  // 1. Upload banner to Cloudinary (if a file was provided)
  let banner = null;
  if (bannerFile) {
    const uploadResult = await uploadImage(bannerFile, 'gandhorbi/events');

    if (!uploadResult.success) {
      return { success: false, error: `Banner upload failed: ${uploadResult.error}` };
    }

    // Always store both url (secure_url) and publicId (public_id)
    const { url, publicId, width, height, format, bytes } = uploadResult.image;
    banner = { url, publicId, width, height, format, bytes };
  }

  // 2. Build the Firestore document
  const document = {
    title:            eventData.title            ?? '',
    description:      eventData.description      ?? '',
    venue:            eventData.venue            ?? '',
    address:          eventData.address          ?? null,
    city:             eventData.city             ?? null,
    state:            eventData.state            ?? null,
    startDate:        eventData.startDate        ?? '',
    endDate:          eventData.endDate          ?? '',
    startTime:        eventData.startTime        ?? null,
    endTime:          eventData.endTime          ?? null,
    status:           eventData.status           ?? EVENT_STATUS.UPCOMING,
    featured:         eventData.featured         ?? false,
    organizer:        eventData.organizer        ?? null,
    contactNumber:    eventData.contactNumber    ?? null,
    registrationLink: eventData.registrationLink ?? null,
    banner,  // { url, publicId, ... } or null
  };

  // 3. Write to Firestore (collection auto-created on first write)
  const result = await addDocument(EVENTS_COLLECTION, document);
  return result.success
    ? { success: true, id: result.id }
    : { success: false, error: result.error };
};

// ─── Get All Events ───────────────────────────────────────────────────────────

/**
 * Retrieve all events, ordered by startDate ascending (soonest first).
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getEvents = async () => {
  return queryDocuments(EVENTS_COLLECTION, [
    orderBy('startDate', 'asc'),
  ]);
};

// ─── Get Event by ID ──────────────────────────────────────────────────────────

/**
 * Retrieve a single event by its Firestore document ID.
 * @param {string} eventId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const getEventById = async (eventId) => {
  return getDocument(EVENTS_COLLECTION, eventId);
};

// ─── Get Events by Status ─────────────────────────────────────────────────────

/**
 * Retrieve events filtered by status.
 * @param {'Upcoming'|'Ongoing'|'Completed'} status
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getEventsByStatus = async (status) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('status', '==', status),
    orderBy('startDate', 'asc'),
  ]);
};

// ─── Get Upcoming Events ──────────────────────────────────────────────────────

/**
 * Retrieve all Upcoming events ordered by start date.
 * @param {number} [maxCount=10]
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getUpcomingEvents = async (maxCount = 10) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('status', '==', EVENT_STATUS.UPCOMING),
    orderBy('startDate', 'asc'),
    limit(maxCount),
  ]);
};

// ─── Get Featured Events ──────────────────────────────────────────────────────

/**
 * Retrieve events marked as featured.
 * @param {number} [maxCount=6]
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getFeaturedEvents = async (maxCount = 6) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('featured', '==', true),
    orderBy('startDate', 'asc'),
    limit(maxCount),
  ]);
};

// ─── Get Events by City ───────────────────────────────────────────────────────

/**
 * Retrieve events in a specific city.
 * @param {string} city
 * @returns {Promise<{ success: boolean, data?: object[], error?: string }>}
 */
export const getEventsByCity = async (city) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('city', '==', city),
    orderBy('startDate', 'asc'),
  ]);
};

// ─── Update Event ─────────────────────────────────────────────────────────────

/**
 * Update an existing event's fields.
 * Pass only the fields you want to change; unmentioned fields are preserved.
 *
 * If a new banner file is provided, it is uploaded to Cloudinary and the
 * new { url, publicId } replaces the previous banner in Firestore.
 *
 * ⚠️  If replacing the banner, delete the OLD banner from Cloudinary first
 *     via your secure backend (Cloud Functions) to avoid orphaned assets.
 *
 * @param {string}  eventId
 * @param {object}  updates          — event fields to update
 * @param {File}    [newBannerFile]  — new banner image to upload (optional)
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const updateEvent = async (eventId, updates, newBannerFile = null) => {
  const updatedFields = { ...updates };

  if (newBannerFile) {
    const uploadResult = await uploadImage(newBannerFile, 'gandhorbi/events');

    if (!uploadResult.success) {
      return { success: false, error: `Banner upload failed: ${uploadResult.error}` };
    }

    const { url, publicId, width, height, format, bytes } = uploadResult.image;
    updatedFields.banner = { url, publicId, width, height, format, bytes };
  }

  return updateDocument(EVENTS_COLLECTION, eventId, updatedFields);
};

// ─── Delete Event ─────────────────────────────────────────────────────────────

/**
 * Delete an event's Firestore document.
 *
 * ⚠️  IMPORTANT — always delete the Cloudinary banner FIRST.
 *   The recommended workflow:
 *     1. getEventById(eventId) → extract banner.publicId
 *     2. POST publicId to your secure backend (Firebase Cloud Function)
 *     3. Backend deletes from Cloudinary using API SECRET
 *     4. On Cloudinary success → call this function
 *
 *   Calling this first and Cloudinary later risks an orphaned banner image
 *   in Cloudinary if step 2 fails.
 *
 * @param {string} eventId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const deleteEvent = async (eventId) => {
  return deleteDocument(EVENTS_COLLECTION, eventId);
};
