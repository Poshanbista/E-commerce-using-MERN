import { StatusCodes } from "http-status-codes";
import { product } from "../model/add.product.js";
import { userrecentview } from "../model/UserRecentView.js";

export const storeRecentView = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Fetch the product with its category populated to get the category name
        const resultProduct = await product.findById(productId).populate("category");
        if (!resultProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Product not found" });
        }

        // Store the view with category name for collaborative filtering
        // Use upsert to de-duplicate: same user viewing same product updates the timestamp
        await userrecentview.findOneAndUpdate(
            { userId, productId },
            {
                $set: {
                    category: resultProduct.category?.name || "",
                    viewAt: Date.now()
                }
            },
            { upsert: true, new: true }
        );

        res.status(StatusCodes.OK).json({ message: "successful", success: true });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
};
