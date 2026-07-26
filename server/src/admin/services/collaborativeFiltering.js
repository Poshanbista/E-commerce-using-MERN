// =============================================================================
// User-Based Collaborative Filtering Service (Category-Level)
// =============================================================================
// Recommends products based on what similar users have viewed.
// Uses Jaccard Similarity on CATEGORY sets (not product sets).
// This allows recommendations even when users view different products
// within the same category.
// Falls back to popular/trending products when no similar users are found.
// =============================================================================

import mongoose from "mongoose";
import { userrecentview } from "../model/UserRecentView.js";
import { product } from "../model/add.product.js";

const MAX_RECOMMENDATIONS = 4;

/**
 * Calculates Jaccard Similarity between two sets.
 * Jaccard(A, B) = |A intersection B| / |A union B|
 *
 * @param {Set} setA - First set (e.g., categories)
 * @param {Set} setB - Second set (e.g., categories)
 * @returns {number} Jaccard similarity between 0 and 1
 */
const jaccardSimilarity = (setA, setB) => {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
};

/**
 * Fallback: Returns popular/trending products based on total view count.
 * Used when collaborative filtering cannot find similar users.
 *
 * @param {Set} excludeProductIds - Product IDs to exclude (already viewed by current user)
 * @returns {Promise<Array>} Array of popular product objects (max 4)
 */
const getPopularProducts = async (excludeProductIds) => {
  console.log("[Collaborative] Falling back to popular products");

  const excludeIds = [...excludeProductIds].map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  const popular = await userrecentview.aggregate([
    {
      $match: {
        productId: { $nin: excludeIds },
      },
    },
    {
      $group: {
        _id: "$productId",
        viewCount: { $sum: 1 },
      },
    },
    { $sort: { viewCount: -1 } },
    { $limit: MAX_RECOMMENDATIONS },
  ]);

  if (popular.length === 0) {
    console.log("[Collaborative] No popular products found either");
    return [];
  }

  const popularProductIds = popular.map((p) => p._id);
  const products = await product.find({ _id: { $in: popularProductIds } });

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  const ordered = popularProductIds
    .map((id) => productMap.get(id.toString()))
    .filter(Boolean);

  console.log(
    "[Collaborative] Popular fallback returned",
    ordered.length,
    "products"
  );
  return ordered;
};

/**
 * Generates user-based collaborative filtering recommendations using
 * category-level matching.
 *
 * Algorithm:
 * 1. Fetch current user's viewed categories
 * 2. Find other users who viewed products in those same categories
 * 3. Calculate Jaccard similarity on category sets
 * 4. Recommend products from similar categories the current user hasn't viewed
 * 5. Exclude products already viewed by current user
 * 6. Return max 4 products
 *
 * @param {string} userId - The ID of the current user
 * @returns {Promise<Array>} Array of recommended product objects (max 4)
 */
export const getCollaborativeRecommendations = async (userId) => {
  console.log(
    "[Collaborative] Starting category-based filtering for userId:",
    userId
  );

  // Step 1: Fetch all interaction records for the current user
  const userInteractions = await userrecentview.find({ userId });
  console.log(
    "[Collaborative] User has",
    userInteractions.length,
    "interaction records"
  );

  if (!userInteractions || userInteractions.length === 0) {
    console.log("[Collaborative] No user interactions found, returning empty");
    return [];
  }

  // Step 2: Build the set of categories and product IDs the current user has viewed
  const currentUserCategories = new Set();
  const currentUserProductIds = new Set();

  for (const interaction of userInteractions) {
    currentUserProductIds.add(interaction.productId.toString());
    if (interaction.category) {
      currentUserCategories.add(interaction.category);
    }
  }

  console.log(
    "[Collaborative] User viewed categories:",
    [...currentUserCategories]
  );
  console.log(
    "[Collaborative] User viewed products:",
    [...currentUserProductIds]
  );

  if (currentUserCategories.size === 0) {
    console.log("[Collaborative] No categories found for user, returning empty");
    return [];
  }

  // Step 3: Find all other users who viewed products in the SAME categories
  const similarUserInteractions = await userrecentview.find({
    category: { $in: [...currentUserCategories] },
    userId: { $ne: userId },
  });

  console.log(
    "[Collaborative] Found",
    similarUserInteractions.length,
    "interactions from other users in shared categories"
  );

  if (similarUserInteractions.length === 0) {
    console.log(
      "[Collaborative] No other users viewed products in shared categories, falling back to popular"
    );
    return getPopularProducts(currentUserProductIds);
  }

  // Step 4: Group interactions by user ID to build each user's category set
  const userCategoryMap = new Map();
  const userProductMap = new Map();

  for (const interaction of similarUserInteractions) {
    const uid = interaction.userId.toString();

    if (!userCategoryMap.has(uid)) {
      userCategoryMap.set(uid, new Set());
      userProductMap.set(uid, new Set());
    }

    if (interaction.category) {
      userCategoryMap.get(uid).add(interaction.category);
    }
    userProductMap.get(uid).add(interaction.productId.toString());
  }

  console.log(
    "[Collaborative] Found",
    userCategoryMap.size,
    "similar users"
  );

  // Step 5: Calculate Jaccard Similarity for each similar user (on category sets)
  const userSimilarities = [];
  for (const [otherUserId, otherUserCategories] of userCategoryMap) {
    const similarity = jaccardSimilarity(
      currentUserCategories,
      otherUserCategories
    );
    console.log(
      "[Collaborative] User",
      otherUserId,
      "- Category Jaccard similarity:",
      similarity.toFixed(3)
    );
    if (similarity > 0) {
      userSimilarities.push({ userId: otherUserId, similarity });
    }
  }

  if (userSimilarities.length === 0) {
    console.log(
      "[Collaborative] No users with positive similarity, falling back to popular"
    );
    return getPopularProducts(currentUserProductIds);
  }

  // Step 6: Sort similar users by similarity descending
  userSimilarities.sort((a, b) => b.similarity - a.similarity);

  // Step 7: Collect candidate products viewed by similar users but NOT by current user
  // Score each candidate by the sum of similarities of users who viewed it
  const candidateScores = new Map();

  for (const { userId: otherUserId, similarity } of userSimilarities) {
    const otherUserProducts = userProductMap.get(otherUserId);
    for (const productId of otherUserProducts) {
      // Skip products the current user has already viewed
      if (currentUserProductIds.has(productId)) continue;

      const currentScore = candidateScores.get(productId) || 0;
      candidateScores.set(productId, currentScore + similarity);
    }
  }

  console.log(
    "[Collaborative] Candidate products (unviewed by current user):",
    candidateScores.size
  );

  if (candidateScores.size === 0) {
    console.log(
      "[Collaborative] No new candidate products, falling back to popular"
    );
    return getPopularProducts(currentUserProductIds);
  }

  // Step 8: Sort candidates by score descending and take top N
  const sortedCandidates = [...candidateScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_RECOMMENDATIONS);

  // Step 9: Fetch full product documents for the recommended product IDs
  const productIds = sortedCandidates.map(([id]) => id);
  const recommendedProducts = await product.find({
    _id: { $in: productIds },
  });

  // Step 10: Maintain the sorted order from the scoring step
  const productMap = new Map(
    recommendedProducts.map((p) => [p._id.toString(), p])
  );
  const orderedRecommendations = productIds
    .map((id) => productMap.get(id))
    .filter(Boolean);

  console.log(
    "[Collaborative] Returning",
    orderedRecommendations.length,
    "recommendations"
  );
  return orderedRecommendations;
};
