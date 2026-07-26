// =============================================================================
// Feature Configuration for Content-Based Recommendation
// =============================================================================
// Maps each product category to its relevant feature fields and encoding type.
// To add a new category, simply add an entry to categoryFeatures below.
// =============================================================================

/**
 * Category feature configuration
 * - fields: array of product field names used for comparison
 * - encoding: determines how feature vectors are built
 *   - 'numeric': extract numeric values from strings (e.g., "8GB" -> 8)
 *   - 'categorical': one-hot encode string values (e.g., "Wired" -> [1,0,0])
 *   - 'mixed': combination of numeric and categorical parsing
 */
export const categoryFeatures = {
  Laptop: {
    fields: ["ram", "ssd", "processor"],
    encoding: "numeric",
  },
  Keyboard: {
    fields: ["connectivity"],
    encoding: "categorical",
  },
  Mouse: {
    fields: ["connectivity"],
    encoding: "categorical",
  },
  Headphone: {
    fields: ["connectivity"],
    encoding: "categorical",
  },
  Monitor: {
    fields: ["resolution", "refreshRate"],
    encoding: "mixed",
  },
};

// Known categorical values for one-hot encoding
const connectivityValues = ["wired", "wireless", "bluetooth"];

/**
 * Extracts a numeric value from a string.
 * Examples:
 *   "8GB"     -> 8
 *   "512GB"   -> 512
 *   "i7"      -> 7
 *   "Ryzen 5" -> 5
 *   "144Hz"   -> 144
 *   "1TB"     -> 1000 (converted from TB to GB for consistency)
 */
export const extractNumeric = (str) => {
  if (!str) return 0;
  const s = str.toString().trim();

  // Handle "1TB" -> 1000
  if (/^(\d+)\s*tb$/i.test(s)) {
    return parseInt(s.match(/^(\d+)\s*tb$/i)[1]) * 1000;
  }

  // Extract leading numeric value
  const match = s.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * Parses a resolution string into numeric width and height.
 * Example: "1920x1080" -> [1920, 1080]
 * Also handles: "2560x1440", "1920*1080"
 */
export const parseResolution = (str) => {
  if (!str) return [0, 0];
  const s = str.toString().trim().toLowerCase().replace(/[x\u00d7*]/, "x");
  const parts = s.split("x");
  if (parts.length === 2) {
    return [parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0];
  }
  return [0, 0];
};

/**
 * One-hot encodes a connectivity value.
 * Returns a vector of length 3: [wired, wireless, bluetooth]
 */
const encodeConnectivity = (value) => {
  const normalized = value?.toString().trim().toLowerCase() || "";
  const vector = new Array(connectivityValues.length).fill(0);
  const index = connectivityValues.indexOf(normalized);
  if (index !== -1) {
    vector[index] = 1;
  }
  return vector;
};

/**
 * Builds a numeric feature vector for a product based on its category.
 * This vector is used for cosine similarity calculation.
 *
 * @param {Object} product - The product document from MongoDB
 * @param {string} categoryName - The category name (e.g., "Laptop")
 * @returns {number[]} Numeric feature vector
 */
export const buildFeatureVector = (product, categoryName) => {
  const config = categoryFeatures[categoryName];
  if (!config) return [];

  switch (config.encoding) {
    case "numeric":
      // Laptop: extract numeric from each field
      // e.g., ram="8GB", ssd="512GB", processor="i7" -> [8, 512, 7]
      return config.fields.map((field) => extractNumeric(product[field]));

    case "categorical":
      // Keyboard/Mouse/Headphone: one-hot encode connectivity
      // e.g., connectivity="Wireless" -> [0, 1, 0]
      return encodeConnectivity(product[config.fields[0]]);

    case "mixed":
      // Monitor: parse resolution to [width, height], extract numeric from refreshRate
      // e.g., resolution="1920x1080", refreshRate="144Hz" -> [1920, 1080, 144]
      const resolutionVector = parseResolution(product[config.fields[0]]);
      const refreshRateValue = extractNumeric(product[config.fields[1]]);
      return [...resolutionVector, refreshRateValue];

    default:
      return [];
  }
};

/**
 * Calculates cosine similarity between two numeric vectors.
 * Returns a value between 0 and 1, where 1 means identical direction.
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};
