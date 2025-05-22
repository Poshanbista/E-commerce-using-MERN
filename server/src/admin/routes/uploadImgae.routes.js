import { Router } from "express";
import { uploadImageController } from "../controller/uploadImage.js";
import { auth } from "../../user/middleware/auth.js";
import upload from "../../common/utils/multer.js";


const uploadImageRoute = Router()

uploadImageRoute.post("/upload",auth,upload.single("image"),uploadImageController)


export default uploadImageRoute