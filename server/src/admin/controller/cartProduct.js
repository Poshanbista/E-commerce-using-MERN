import { StatusCodes } from "http-status-codes";
import { cartProduct } from "../../user/model/cart.product.js";
import { User } from "../../user/model/user.register.js"


// add to cart product
export const addToCartItem = async (req, res) => {
    try {
        const userId = req.userId
        const { productId } = req.body

        if (!userId) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "login in first",
                success: false
            })
        }

        if (!productId) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "provide productId"
            })
        }

        const checkItem = await cartProduct.findOne({
            userId: userId,
            productId: productId
        })

        if (checkItem) {
            return res.status(StatusCodes.CONFLICT).json({
                message: "item already cart"
            })
        }

        const cartItem = new cartProduct({
            quantity: 1,
            userId: userId,
            productId: productId
        })

        await cartItem.save()

        const updateCartUser = await User.updateOne({ _id: userId }, {
            $push: {
                shopping_cart: productId
            }
        })

        return res.status(StatusCodes.OK).json({
            message: "item add successfully",
            success: true,
            data: cartItem
        })

    } catch (error) {
        return res.status(500).json({
            message: "login first",
            success: false
        })
    }
}

//getCart Item 

export const getCartItem = async (req, res) => {
    try {
        const userId = req.userId

        const cartItem = await cartProduct.find({
            userId: userId
        }).populate('productId')

        return res.status(StatusCodes.OK).json({
            data: cartItem,
            success: true
        })


    } catch (error) {
        console.log("error", error)
        console.log("Server Error")
    }
}

//update cart item
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.userId
        const { _id, quantity } = req.body

        if (!_id || !quantity) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "provide _id and qty"
            })
        }

        const updateCartItem = await cartProduct.updateOne(
            {
                _id,
                userId: userId
            },

            { quantity }
        )

        return res.status(StatusCodes.OK).json({
            success: true,
            data: updateCartItem
        })

    } catch (error) {
        console.log("error", error)
        console.log("Server Error")
    }
}


// delete cart item
export const deleteCartItem = async (req, res) => {
    try {

        const userId = req.userId
        const { _id } = req.body

        if (!_id) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Provide _id"
            })
        }

        const deleteCartItem = await cartProduct.deleteOne({ _id: _id, userId: userId })

        return res.status(StatusCodes.OK).json({
            success: true,
            data: deleteCartItem
        })


    } catch (error) {
        console.log("error", error)
        console.log("Server Error")
    }
}