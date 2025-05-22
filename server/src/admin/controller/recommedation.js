import { StatusCodes } from "http-status-codes";
import { product } from "../model/add.product.js";
import { userrecentview } from "../model/UserRecentView.js";

// Define allowed values for encoding (optional if cosine similarity is used)
const ramValues = ['4GB', '8GB', '16GB', '32GB'];
const ssdValues = ['128GB', '256GB', '512GB', '1TB'];
const processorValues = ['i3', 'i5', 'i7', 'i9', 'Ryzen 5', 'Ryzen 7'];

// Normalize a value for safe comparison
const normalize = (val) => val?.toString().trim().toLowerCase();

// Encode categorical features into numeric indexes
const encodeFeature = (value, list) => list.indexOf(value);

// Convert a product to a vector based on encoded features
const getVector = (product) => {
  return [
    encodeFeature(product.ram, ramValues),
    encodeFeature(product.ssd, ssdValues),
    encodeFeature(product.processor, processorValues)
  ];
};

// Calculate cosine similarity between two numeric vectors
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

// Main recommendation controller
export const getRecommendedProducts = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch the most recent view by the user
    const recentView = await userrecentview.find({ userId }).sort({ viewedAt: -1 });

    if (!recentView || recentView.length === 0) {
      return res.status(StatusCodes.OK).json({ success: true, data: [] });
    }

    const recent = recentView[0];
    const targetVector = getVector(recent);

    // Normalize fields of the recent product
    const normRam = normalize(recent.ram);
    const normSsd = normalize(recent.ssd);
    const normProcessor = normalize(recent.processor);

    // Fetch all products
    const allProducts = await product.find({});

    // Filter products with same specs and exclude viewed product
    const matchingProducts = allProducts.filter(p =>
      normalize(p.ram) === normRam &&
      normalize(p.ssd) === normSsd &&
      normalize(p.processor) === normProcessor &&
      String(p._id) !== String(recent.productId)
    );

    // Compute similarity scores (optional since all are same, but for future extensibility)
    const scored = matchingProducts.map(p => ({
      product: p,
      score: cosineSimilarity(targetVector, getVector(p))
    }));

    // Sort by similarity score descending
    scored.sort((a, b) => b.score - a.score);

    // Return all matching products
    const topRecommended = scored.map(item => item.product);

    console.log("Generating recommendations for:", userId);
    return res.status(StatusCodes.OK).json({ success: true, data: topRecommended });

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};
