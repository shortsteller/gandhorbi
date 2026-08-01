/**
 * events.js
 * ─────────────────────────────────────────────────────────────────────────────
 * High-level Events service — combines Cloudinary banner upload + Firestore.
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

export const addEvent = async (eventData, bannerFile = null) => {
  let banner = null;
  let uploadResult = null;

  try {
    // 1. Upload banner to Cloudinary (if a file was provided)
    if (bannerFile) {
      uploadResult = await uploadImage(bannerFile, 'gandhorbi/events');

      if (!uploadResult || !uploadResult.success) {
        return { success: false, error: `Banner upload failed: ${uploadResult?.error || 'Unknown error'}` };
      }

      const { url, publicId, width, height, format, bytes } = uploadResult.image;
      banner = {
        url,
        publicId,
        width:  width ?? null,
        height: height ?? null,
        format: format ?? null,
        bytes:  bytes ?? null,
      };
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
      banner,
    };

    // 3. Write to Firestore
    const result = await addDocument(EVENTS_COLLECTION, document);
    return result.success
      ? { success: true, id: result.id }
      : { success: false, error: result.error };

  } catch (error) {
    console.error('[Events] addEvent Exception:', error);
    return { success: false, error: error.message || 'Unexpected error adding event.' };
  }
};

// ─── Get All Events ───────────────────────────────────────────────────────────

export const getEvents = async () => {
  return queryDocuments(EVENTS_COLLECTION, [
    orderBy('startDate', 'asc'),
  ]);
};

// ─── Get Event by ID ──────────────────────────────────────────────────────────

export const getEventById = async (eventId) => {
  return getDocument(EVENTS_COLLECTION, eventId);
};

// ─── Get Events by Status ─────────────────────────────────────────────────────

export const getEventsByStatus = async (status) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('status', '==', status),
    orderBy('startDate', 'asc'),
  ]);
};

// ─── Get Upcoming Events ──────────────────────────────────────────────────────

export const getUpcomingEvents = async (maxCount = 10) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('status', '==', EVENT_STATUS.UPCOMING),
    orderBy('startDate', 'asc'),
    limit(maxCount),
  ]);
};

// ─── Get Featured Events ──────────────────────────────────────────────────────

export const getFeaturedEvents = async (maxCount = 6) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('featured', '==', true),
    orderBy('startDate', 'asc'),
    limit(maxCount),
  ]);
};

// ─── Get Events by City ───────────────────────────────────────────────────────

export const getEventsByCity = async (city) => {
  return queryDocuments(EVENTS_COLLECTION, [
    where('city', '==', city),
    orderBy('startDate', 'asc'),
  ]);
};

// ─── Update Event ─────────────────────────────────────────────────────────────

export const updateEvent = async (eventId, updates, newBannerFile = null) => {
  const updatedFields = { ...updates };
  let uploadResult = null;

  try {
    if (newBannerFile) {
      uploadResult = await uploadImage(newBannerFile, 'gandhorbi/events');

      if (!uploadResult || !uploadResult.success) {
        return { success: false, error: `Banner upload failed: ${uploadResult?.error || 'Unknown error'}` };
      }

      const { url, publicId, width, height, format, bytes } = uploadResult.image;
      updatedFields.banner = { url, publicId, width, height, format, bytes };
    }

    return updateDocument(EVENTS_COLLECTION, eventId, updatedFields);
  } catch (error) {
    console.error('[Events] updateEvent Exception:', error);
    return { success: false, error: error.message || 'Unexpected error updating event.' };
  }
};

// ─── Delete Event ─────────────────────────────────────────────────────────────

export const deleteEvent = async (eventId) => {
  return deleteDocument(EVENTS_COLLECTION, eventId);
};
