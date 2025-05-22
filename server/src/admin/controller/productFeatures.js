import { StatusCodes } from "http-status-codes";
import { product } from "../model/add.product.js"
import { userrecentview } from "../model/UserRecentView.js";

export const storeRecentView = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const resultProduct = await product.findById(productId)
        if (!resultProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Product not found" });
        }

         // 🧹 Delete previous views for this user
         await userrecentview.deleteMany({ userId });
         
        await userrecentview.create({
            userId: userId,
            productId,
            ram: resultProduct.ram,
            ssd: resultProduct.ssd,
            processor: resultProduct.processor,
            viewAt: Date.now()
        });

        res.status(StatusCodes.OK).json({ message: "successful", success: true });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
};
