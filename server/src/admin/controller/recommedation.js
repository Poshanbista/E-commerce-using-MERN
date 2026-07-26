// =============================================================================
// Hybrid Recommendation Controller
// =============================================================================
// Orchestrates content-based and user-based collaborative filtering
// to return two separate recommendation arrays.
// =============================================================================

import { StatusCodes } from "http-status-codes";
import { getContentBasedRecommendations } from "../services/contentBased.js";
import { getCollaborativeRecommendations } from "../services/collaborativeFiltering.js";

export const getRecommendedProducts = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Run both recommendation algorithms in parallel for better performance
    const [contentBasedRecommendations, userBasedRecommendations] =
      await Promise.all([
        getContentBasedRecommendations(productId),
        getCollaborativeRecommendations(userId),
      ]);

    return res.status(StatusCodes.OK).json({
      success: true,
      contentBasedRecommendations,
      userBasedRecommendations,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
