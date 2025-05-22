import { StatusCodes } from "http-status-codes"
import uploadImageCloudinary from "../../common/utils/uploadImageCloudinary.js"

export const uploadImageController = async (req, res) => {
    try {
        const file = req.file  
        const uploadImage = await uploadImageCloudinary(file)

        return res.status(StatusCodes.OK).json({
            message: "upload done",
            success: true,
            data: uploadImage
        })

        res.status(StatusCodes.OK).json({ message: "image uploaded", data: uploadImage, success: true })
    } catch (error) {
        console.log("error in uploading image", error)
        console.log("Server Error")
    }
} 