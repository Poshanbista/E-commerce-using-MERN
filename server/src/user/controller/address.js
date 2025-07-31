import { addressModel } from "../model/user.address.js"
import { User } from "../model/user.register.js"
import statusCodes from "http-status-codes"

// add address
export const addAddress = async (req, res) => {
    try {
        const userId = req.userId
        const { state, city, address, mobile } = req.body

        const createAddress = new addressModel({
            state,
            city,
            address,
            mobile,
            userId: userId
        })

        const saveAddress = await createAddress.save();
        
        const updateAddress = await User.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            },
            $set: { mobile: mobile }
        })

        return res.status(statusCodes.OK).json({
            message: "Address Added",
            success: true,
            data: saveAddress
        })



    } catch (error) {
        console.log("Error in adding address", error)
        console.log("Server Error")
    }
}

// get Address
export const getAddress = async (req, res) => {
    try {
        const userId = req.userId

        const data = await addressModel.find({ userId: userId }).sort({ createdAt: -1 })

        return res.status(statusCodes.OK).json({
            message: "List of address",
            data: data,
            success: true
        })

    } catch (error) {
        console.log("Error in getting address", error)
        console.log("Server Error")
    }
}


// edit address

export const editAddress = async (req, res) => {
    try {
        const userId = req.userId

        const { _id, state, city, address, mobile } = req.body

        const updateAddress = await addressModel.updateOne({ _id: _id, userId: userId }, {
            state,
            city,
            address,
            mobile
        })

        res.status(statusCodes.OK).json({
            message: "Address edit successfully",
            success: true,
            data: updateAddress
        })

    } catch (error) {
        console.log("Error in editing address", error)
        console.log("Server Error")
    }
}


//delete address

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.userId

        const { _id } = req.body

        const disableAddress = await addressModel.deleteOne({ _id: _id, userId }, {
            status: false
        })

        return res.status(statusCodes.OK).json({
            message:"Remove successfully",
            success:true,
            data:disableAddress
        })

    } catch (error) {
        console.log("Error in delete address", error)
        console.log("Server Error")
    }
}