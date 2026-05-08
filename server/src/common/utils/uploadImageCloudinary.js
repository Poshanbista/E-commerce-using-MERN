import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "de52yud6d",
    api_key: process.env.CLOUDINARY_API_KEY || 527475726184874,
    api_secret: process.env.CLOUDINARY_API_SECRET || "MEBusqSGv4_nDKalO6nJP2Y7duk",
    secure: true
})

const uploadImageCloudinary = async (image) => {
    if (!image || !image.buffer) {
        throw new Error("No image buffer found");
    }

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "Smart Bazaar" },
            (error, uploadResult) => {
                
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult)
            }
        ).end(image.buffer)
    })

    return uploadImage
}

export default uploadImageCloudinary