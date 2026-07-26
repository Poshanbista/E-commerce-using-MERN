// =============================================================================
// Recommendation Controller
// =============================================================================
// Runs content-based and collaborative filtering in parallel.
// Returns two separate arrays (up to 4 each) for interleaved display.
// =============================================================================

import { StatusCodes } from "http-status-codes";
import { getContentBasedRecommendations } from "../services/contentBased.js";
import { getCollaborativeRecommendations } from "../services/collaborativeFiltering.js";

export const getRecommendedProducts = async (req, res) => {
  try {
    const { userId, productId } = req.body;

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
