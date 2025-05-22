import mongoose, { get } from "mongoose"
import { order } from "../model/order.js"
import { cartProduct } from "../model/cart.product.js"
import { User } from "../model/user.register.js"
import { StatusCodes } from "http-status-codes"


export const cashOnDeliveryOrder = async (req, res) => {
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressId, SubTotalAmt } = req.body

        const payload = list_items.map(el => {
            return ({
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    image: el.productId.image
                },
                paymentId: "",
                paymentStatus: "CASH ON DELIVERY",
                delivery_address: addressId,
                totalAmt: totalAmt,
                SubTotalAmt: SubTotalAmt,
            })
        })

        const generatedOrder = await order.insertMany(payload)

        //remove from cart
        const removeCart = await cartProduct.deleteMany({ userId: userId })
        const updateUser = await User.updateOne({ _id: userId }, { shopping_cart: [] })

        return res.status(StatusCodes.OK).json({
            message: "order successfully",
            success: true,
            data: generatedOrder
        })

    } catch (error) {
        console.log("Error in payment", error)
        console.log("Server Error")
    }
}

// get order 

export const getOrderDetails = async (req, res) => {
    try {
        const userId = req.userId

        const getList = await order.find({ userId: userId }).sort({ createdAt: -1 })


        return res.status(StatusCodes.OK).json({
            message: "getting order details",
            success: true,
            data: getList
        })


    } catch (error) {
        console.log("Error in getting order", error)
        console.log("Server Error")
    }
}