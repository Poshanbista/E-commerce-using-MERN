// =============================================================================
// Content-Based Recommendation Service
// =============================================================================
// Recommends products based on feature similarity using cosine similarity.
// Only compares products within the same category.
// Only returns products with cosine similarity exactly equal to 1 (100% match).
// =============================================================================

import { product } from "../model/add.product.js";
import {
  categoryFeatures,
  buildFeatureVector,
  cosineSimilarity,
} from "./featureConfig.js";

/**
 * Maximum number of content-based recommendations to return.
 */
const MAX_RECOMMENDATIONS = 4;

/**
 * Generates content-based recommendations for a given product.
 *
 * @param {string} productId - The ID of the product being viewed
 * @returns {Promise<Array>} Array of recommended product objects (max 4)
 */
export const getContentBasedRecommendations = async (productId) => {
  // Step 1: Fetch the viewed product and populate its category
  const viewedProduct = await product.findById(productId).populate("category");

  if (!viewedProduct || !viewedProduct.category) {
    return [];
  }

  const categoryName = viewedProduct.category.name;

  // Step 2: Check if this category has a feature configuration
  if (!categoryFeatures[categoryName]) {
    return [];
  }

  // Step 3: Fetch all products in the same category, excluding the current product
  const sameCategoryProducts = await product.find({
    category: viewedProduct.category._id,
    _id: { $ne: viewedProduct._id },
  });

  if (sameCategoryProducts.length === 0) {
    return [];
  }

  // Step 4: Build the feature vector for the viewed product
  const viewedVector = buildFeatureVector(viewedProduct, categoryName);

  // Step 5: Calculate cosine similarity with each same-category product
  const scored = sameCategoryProducts.map((candidate) => {
    const candidateVector = buildFeatureVector(candidate, categoryName);
    const similarity = cosineSimilarity(viewedVector, candidateVector);
    return { product: candidate, similarity };
  });

  // Step 6: Filter to only products with exactly 100% similarity
  const exactMatches = scored.filter(
    (item) => Math.abs(item.similarity - 1.0) < 1e-9
  );

  // Step 7: Sort by similarity descending (all are 1.0, so order is stable)
  exactMatches.sort((a, b) => b.similarity - a.similarity);

  // Step 8: Limit to maximum 4 products and return just the product objects
  const recommendations = exactMatches
    .slice(0, MAX_RECOMMENDATIONS)
    .map((item) => item.product);

  return recommendations;
};
