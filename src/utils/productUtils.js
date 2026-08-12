/**
 * productUtils.js
 * Utility helpers for Gandhorbi Folk Arts products.
 */

/**
 * Returns formatted return policy text for a product.
 * Examples: "Non-returnable", "7-day return", "15-day return", "30-day return"
 * 
 * Backward-compatible with legacy products that do not yet have return policy fields.
 * 
 * @param {object} product
 * @returns {string}
 */
export const getReturnPolicyText = (product) => {
  if (!product) return '7-day return';

  // 1. Explicitly marked non-returnable
  if (
    product.isReturnable === false ||
    product.returnDays === 0 ||
    product.returnDays === '0' ||
    (typeof product.returnPolicy === 'string' && product.returnPolicy.toLowerCase().includes('non'))
  ) {
    return 'Non-returnable';
  }

  // 2. Return days explicitly specified
  if (product.returnDays !== undefined && product.returnDays !== null) {
    const days = Number(product.returnDays);
    if (!isNaN(days) && days > 0) {
      return `${days}-day return`;
    }
  }

  // 3. String returnPolicy already formatted (e.g. "15-day return")
  if (typeof product.returnPolicy === 'string' && product.returnPolicy.trim()) {
    return product.returnPolicy.trim();
  }

  // 4. Safe default for legacy products
  return '7-day return';
};
