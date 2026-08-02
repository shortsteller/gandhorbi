/**
 * coupons.js
 * Firestore service layer for Offers & Coupons.
 * Collection: "coupons"
 */

import { db, setDocument, updateDocument, deleteDocument, getDocuments } from './firestore';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';

const COLLECTION = 'coupons';

/**
 * Save or Update a Coupon
 */
export const saveCoupon = async (couponData, existingId = null) => {
  const code = couponData.code ? couponData.code.trim().toUpperCase() : '';

  if (!code) {
    return { success: false, error: 'Coupon code is required.' };
  }

  const docId = existingId || code;

  const payload = {
    code,
    name: couponData.name?.trim() || code,
    description: couponData.description?.trim() || '',
    discountType: couponData.discountType || 'percentage', // 'percentage' | 'fixed'
    discountValue: Number(couponData.discountValue) || 0,
    minOrderAmount: Number(couponData.minOrderAmount) || 0,
    maxDiscountAmount: couponData.maxDiscountAmount ? Number(couponData.maxDiscountAmount) : null,
    validFrom: couponData.validFrom || new Date().toISOString().slice(0, 16),
    expiryDate: couponData.expiryDate || null,
    maxUses: couponData.maxUses ? Number(couponData.maxUses) : null,
    usageCount: couponData.usageCount ?? 0,
    maxUsesPerCustomer: couponData.maxUsesPerCustomer ? Number(couponData.maxUsesPerCustomer) : 1,
    applicability: couponData.applicability || 'all', // 'all' | 'categories' | 'products'
    applicableCategories: couponData.applicableCategories || [],
    applicableProducts: couponData.applicableProducts || [],
    active: couponData.active !== false,
    totalDiscountGiven: couponData.totalDiscountGiven ?? 0,
    createdAt: couponData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return setDocument(COLLECTION, docId, payload);
};

/**
 * Delete a Coupon
 */
export const deleteCoupon = async (couponId) => {
  return deleteDocument(COLLECTION, couponId);
};

/**
 * Toggle Active Status of a Coupon
 */
export const toggleCouponActive = async (couponId, currentStatus) => {
  return updateDocument(COLLECTION, couponId, { active: !currentStatus });
};

/**
 * Subscribe to Coupons in Real-Time
 */
export const subscribeToCoupons = (callback) => {
  if (!db) return () => {};
  try {
    return onSnapshot(
      collection(db, COLLECTION),
      (snap) => {
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(list);
      },
      (err) => {
        console.warn('[coupons] Snapshot error:', err);
        callback([]);
      }
    );
  } catch (e) {
    console.warn('[coupons] Subscription exception:', e);
    return () => {};
  }
};

/**
 * Validate and Calculate Coupon Discount for Cart
 */
export const validateCoupon = async (rawCode, cartItems = [], cartSubtotal = 0) => {
  if (!rawCode || !rawCode.trim()) {
    return { valid: false, error: 'Please enter a coupon code.' };
  }

  const code = rawCode.trim().toUpperCase();

  if (!db) {
    return { valid: false, error: 'Database service unavailable.' };
  }

  try {
    const q = query(collection(db, COLLECTION), where('code', '==', code));
    const snap = await getDocs(q);

    if (snap.empty) {
      return { valid: false, error: `Coupon code "${code}" is invalid.` };
    }

    const couponDoc = snap.docs[0];
    const coupon = { id: couponDoc.id, ...couponDoc.data() };

    // 1. Check Active Status
    if (!coupon.active) {
      return { valid: false, error: `Coupon "${code}" is currently disabled.` };
    }

    // 2. Check Validity Dates
    const now = new Date();
    if (coupon.validFrom) {
      const validFromDate = new Date(coupon.validFrom);
      if (now < validFromDate) {
        return { valid: false, error: `Coupon "${code}" is not yet active.` };
      }
    }

    if (coupon.expiryDate) {
      const expiryDate = new Date(coupon.expiryDate);
      if (now > expiryDate) {
        return { valid: false, error: `Coupon "${code}" has expired.` };
      }
    }

    // 3. Check Usage Limit
    if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
      return { valid: false, error: `Coupon "${code}" has reached its maximum usage limit.` };
    }

    // 4. Check Minimum Order Amount
    if (coupon.minOrderAmount && cartSubtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        error: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for coupon "${code}".`
      };
    }

    // 5. Check Applicability & Calculate Eligible Subtotal
    let eligibleSubtotal = 0;

    if (coupon.applicability === 'all') {
      eligibleSubtotal = cartSubtotal;
    } else if (coupon.applicability === 'categories') {
      const appCats = new Set(coupon.applicableCategories || []);
      cartItems.forEach((item) => {
        if (appCats.has(item.product?.category)) {
          eligibleSubtotal += (item.product?.price || 0) * item.quantity;
        }
      });
      if (eligibleSubtotal <= 0) {
        return {
          valid: false,
          error: `Coupon "${code}" is only applicable to categories: ${coupon.applicableCategories.join(', ')}.`
        };
      }
    } else if (coupon.applicability === 'products') {
      const appProds = new Set(coupon.applicableProducts || []);
      cartItems.forEach((item) => {
        if (appProds.has(item.product?.id)) {
          eligibleSubtotal += (item.product?.price || 0) * item.quantity;
        }
      });
      if (eligibleSubtotal <= 0) {
        return {
          valid: false,
          error: `Coupon "${code}" is not applicable to any items in your cart.`
        };
      }
    } else {
      eligibleSubtotal = cartSubtotal;
    }

    // 6. Calculate Discount Amount
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((eligibleSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, eligibleSubtotal);
    }

    if (discountAmount <= 0) {
      return { valid: false, error: `Coupon "${code}" cannot be applied to this order.` };
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      code: coupon.code,
    };

  } catch (err) {
    console.error('[coupons] validateCoupon error:', err);
    return { valid: false, error: 'Error validating coupon code.' };
  }
};

/**
 * Record Usage upon successful order completion
 */
export const recordCouponUsage = async (couponId, discountAmount = 0) => {
  if (!db || !couponId) return;
  try {
    const docSnap = await getDocuments(COLLECTION);
    const existing = docSnap.data?.find((d) => d.id === couponId);
    const currentUsage = existing?.usageCount || 0;
    const currentTotalGiven = existing?.totalDiscountGiven || 0;

    await updateDocument(COLLECTION, couponId, {
      usageCount: currentUsage + 1,
      totalDiscountGiven: currentTotalGiven + discountAmount,
    });
  } catch (err) {
    console.warn('[coupons] recordCouponUsage warning:', err);
  }
};
