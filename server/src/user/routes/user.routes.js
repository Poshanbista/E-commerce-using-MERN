import express, { Router } from "express";
import { forgotPassword, resetPassword, updateUserDetails, uploadAvatar, userDetails, userLogin, userLogout, UserRegister, verifyForgotPasswordOtp } from "../controller/user.js";
import { auth } from "../middleware/auth.js";
import upload from "../../common/utils/multer.js";



const userRoute = Router();

userRoute.post("/register",UserRegister);
userRoute.post("/login",userLogin);
userRoute.get("/logout",auth,userLogout)
userRoute.post("/uploadAvatar",auth, upload.single('avatar'), uploadAvatar)
userRoute.put("/updateUserDetails",auth,updateUserDetails)
userRoute.put("/forgotPassword",forgotPassword)
userRoute.put("/verifyOtp",verifyForgotPasswordOtp)
userRoute.put("/resetPassword",resetPassword)
userRoute.get("/user-details", auth,userDetails)

export default userRoute;

