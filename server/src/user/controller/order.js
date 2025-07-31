import mongoose, { get } from "mongoose"
import { order } from "../model/order.js"
import { cartProduct } from "../model/cart.product.js"
import { User } from "../model/user.register.js"
import { StatusCodes } from "http-status-codes"
import { product } from "../../admin/model/add.product.js"
import { orderStatus } from "../types/orderStatus.enum.js"


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

    for (const item of list_items) {
      await product.updateOne(
        { _id: item.productId._id },
        { $inc: { stock: -item.quantity } }
      )
    }


    const orderIds = generatedOrder.map(order => order._id);

    // Remove from cart and update user
    await cartProduct.deleteMany({ userId: userId });

    await User.updateOne(
      { _id: userId },
      {
        $set: { shopping_cart: [] },
        $push: { orderHistory: { $each: orderIds } }
      }
    );

    return res.status(StatusCodes.OK).json({
      message: "Order placed successfully",
      success: true,
      data: generatedOrder
    });

  } catch (error) {
    console.log("Error in payment", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server Error",
      success: false
    });
  }

}

// get order 
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.userId;

    // Get the logged-in user from DB
    const user = await User.findById(userId);

    let getList;

    if (user?.role === "ADMIN") {
      // Admin: get all orders and populate user details
      getList = await order
        .find({})
        .populate("userId", "name email mobile") // You can add more fields like phone, address if needed
        .sort({ createdAt: -1 });
    } else {
      // Normal user: get only their orders
      getList = await order
        .find({ userId })
        .sort({ createdAt: -1 });
    }
    console.log(getList)

    return res.status(StatusCodes.OK).json({
      message: "Getting order details",
      success: true,
      data: getList,
    });

  } catch (error) {
    console.log("Error in getting order", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server Error",
      success: false,
    });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("order accept", id);

    const updatedOrder = await order.findByIdAndUpdate(
      id,
      { $set: { orderStatus: orderStatus.ACCEPT } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found",
        success: false,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Order accepted",
      success: true,
      data: updatedOrder,
    });

  } catch (error) {
    console.error("Error in accepting order:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      success: false,
    });
  }
};
