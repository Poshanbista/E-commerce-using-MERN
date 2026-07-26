// =============================================================================
// User-Based Collaborative Filtering Service
// =============================================================================
// Recommends products based on what similar users have viewed.
// Uses Jaccard Similarity on product interaction sets.
// Falls back to popular/trending products when no similar users are found.
// =============================================================================

import mongoose from "mongoose";
import { userrecentview } from "../model/UserRecentView.js";
import { product } from "../model/add.product.js";

/**
 * Maximum number of collaborative filtering recommendations to return.
 */
const MAX_RECOMMENDATIONS = 4;

/**
 * Calculates Jaccard Similarity between two sets.
 * Jaccard(A, B) = |A intersection B| / |A union B|
 *
 * @param {Set} setA - First set of product IDs
 * @param {Set} setB - Second set of product IDs
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

  // Aggregate view counts across all users, exclude products the current user viewed
  const excludeIds = [...excludeProductIds].map((id) => new mongoose.Types.ObjectId(id));
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

  // Maintain the sorted order by view count
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  const ordered = popularProductIds
    .map((id) => productMap.get(id.toString()))
    .filter(Boolean);

  console.log("[Collaborative] Popular fallback returned", ordered.length, "products");
  return ordered;
};

/**
 * Generates user-based collaborative filtering recommendations for a user.
 *
 * @param {string} userId - The ID of the current user
 * @returns {Promise<Array>} Array of recommended product objects (max 4)
 */
export const getCollaborativeRecommendations = async (userId) => {
  console.log("[Collaborative] Starting collaborative filtering for userId:", userId);

  // Step 1: Fetch all interaction records for the current user
  const userInteractions = await userrecentview.find({ userId });
  console.log("[Collaborative] User has", userInteractions.length, "interaction records");

  if (!userInteractions || userInteractions.length === 0) {
    console.log("[Collaborative] No user interactions found, returning empty");
    return [];
  }

  // Step 2: Build the set of product IDs the current user has viewed
  const currentUserProductIds = new Set(
    userInteractions.map((interaction) => interaction.productId.toString())
  );
  console.log("[Collaborative] User viewed products:", [...currentUserProductIds]);

  // Step 3: Find all other users who viewed any of the same products
  const similarUserInteractions = await userrecentview.find({
    productId: { $in: [...currentUserProductIds] },
    userId: { $ne: userId },
  });
  console.log("[Collaborative] Found", similarUserInteractions.length, "interactions from other users");

  if (similarUserInteractions.length === 0) {
    console.log("[Collaborative] No other users viewed the same products, falling back to popular");
    return getPopularProducts(currentUserProductIds);
  }

  // Step 4: Group interactions by user ID to build each user's product set
  const userProductMap = new Map();
  for (const interaction of similarUserInteractions) {
    const uid = interaction.userId.toString();
    if (!userProductMap.has(uid)) {
      userProductMap.set(uid, new Set());
    }
    userProductMap.get(uid).add(interaction.productId.toString());
  }
  console.log("[Collaborative] Found", userProductMap.size, "similar users");

  // Step 5: Calculate Jaccard Similarity for each similar user
  const userSimilarities = [];
  for (const [otherUserId, otherUserProducts] of userProductMap) {
    const similarity = jaccardSimilarity(currentUserProductIds, otherUserProducts);
    console.log("[Collaborative] User", otherUserId, "- Jaccard similarity:", similarity.toFixed(3));
    if (similarity > 0) {
      userSimilarities.push({ userId: otherUserId, similarity });
    }
  }

  if (userSimilarities.length === 0) {
    console.log("[Collaborative] No users with positive similarity, falling back to popular");
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

  console.log("[Collaborative] Candidate products (unviewed by current user):", candidateScores.size);

  if (candidateScores.size === 0) {
    console.log("[Collaborative] No new candidate products, falling back to popular");
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

  console.log("[Collaborative] Returning", orderedRecommendations.length, "recommendations");
  return orderedRecommendations;
};
