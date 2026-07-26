// =============================================================================
// Hybrid Recommendation Service
// =============================================================================
// Combines content-based and collaborative filtering using dynamic weights.
// When both algorithms return results, scores are blended.
// When one is empty, the other carries full weight.
// =============================================================================

import { getContentBasedRecommendations } from "./contentBased.js";
import { getCollaborativeRecommendations } from "./collaborativeFiltering.js";

const MAX_RECOMMENDATIONS = 4;

const CONTENT_WEIGHT = 0.6;
const COLLABORATIVE_WEIGHT = 0.4;

/**
 * Normalizes an array of scored items to [0, 1] range.
 * Each score is divided by the maximum score in the array.
 *
 * @param {Array<{product, score}>} scoredItems
 * @returns {Array<{product, normalizedScore}>}
 */
const normalizeScores = (scoredItems) => {
  if (scoredItems.length === 0) return [];

  const maxScore = Math.max(...scoredItems.map((item) => item.score));
  if (maxScore === 0) {
    return scoredItems.map((item) => ({
      product: item.product,
      normalizedScore: 0,
    }));
  }

  return scoredItems.map((item) => ({
    product: item.product,
    normalizedScore: item.score / maxScore,
  }));
};

/**
 * Generates hybrid recommendations by combining content-based and
 * collaborative filtering with dynamic weight adjustment.
 *
 * @param {string} userId - The current user's ID
 * @param {string} productId - The currently viewed product's ID
 * @returns {Promise<Array>} Array of recommended product objects (max 4)
 */
export const getHybridRecommendations = async (userId, productId) => {
  const [contentResults, collabResults] = await Promise.all([
    getContentBasedRecommendations(productId),
    getCollaborativeRecommendations(userId),
  ]);

  const hasContent = contentResults.length > 0;
  const hasCollab = collabResults.length > 0;

  // Both empty — nothing to recommend
  if (!hasContent && !hasCollab) {
    return [];
  }

  // Only content-based has results — return them directly
  if (hasContent && !hasCollab) {
    return contentResults.slice(0, MAX_RECOMMENDATIONS);
  }

  // Only collaborative has results — return them directly
  if (!hasContent && hasCollab) {
    return collabResults.slice(0, MAX_RECOMMENDATIONS);
  }

  // Both have results — blend scores with dynamic weights
  // Content-based: similarity is always 1.0 (exact match), use count-based scoring
  // Collaborative: already has weighted scores from Jaccard similarity sums

  const contentScored = contentResults.map((p, index) => ({
    product: p,
    score: 1.0 - index * 0.01, // Slight rank-based decay for ordering
  }));

  const collabScored = collabResults.map((p, index) => ({
    product: p,
    score: 1.0 - index * 0.01,
  }));

  const normalizedContent = normalizeScores(contentScored);
  const normalizedCollab = normalizeScores(collabScored);

  // Build a map of product ID -> combined score
  const productScores = new Map();

  for (const item of normalizedContent) {
    const id = item.product._id.toString();
    productScores.set(id, {
      product: item.product,
      finalScore: CONTENT_WEIGHT * item.normalizedScore,
    });
  }

  for (const item of normalizedCollab) {
    const id = item.product._id.toString();
    const existing = productScores.get(id);

    if (existing) {
      // Product appears in both lists — boost its score
      existing.finalScore += COLLABORATIVE_WEIGHT * item.normalizedScore;
    } else {
      productScores.set(id, {
        product: item.product,
        finalScore: COLLABORATIVE_WEIGHT * item.normalizedScore,
      });
    }
  }

  // Sort by final score descending and return top N
  const sorted = [...productScores.values()]
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, MAX_RECOMMENDATIONS)
    .map((item) => item.product);

  return sorted;
};
