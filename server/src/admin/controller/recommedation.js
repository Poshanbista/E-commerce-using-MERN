// =============================================================================
// Hybrid Recommendation Controller
// =============================================================================
// Uses the hybrid recommendation service that combines content-based
// and collaborative filtering with dynamic weight adjustment.
// =============================================================================

import { StatusCodes } from "http-status-codes";
import { getHybridRecommendations } from "../services/hybridRecommendation.js";

export const getRecommendedProducts = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const recommendations = await getHybridRecommendations(userId, productId);

    return res.status(StatusCodes.OK).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
