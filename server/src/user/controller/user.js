import statusCodes from "http-status-codes"
import { User } from "../model/user.register.js";
import bcrypt, { hash } from "bcryptjs";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import { transporter } from "../utils/mailSender.js";
import { generateOTP } from "../utils/otpGenerator.js";
import uploadImageCloudinary from "../../common/utils/uploadImageCloudinary.js";




// User Registration Controller

export async function UserRegister(req, res) {
    try {
        const { name, email, password, confirmpassword } = req.body;

        if (!name || !email || !password || !confirmpassword) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "All fields are required" });
        }

        const userexists = await User.findOne({ email });
        if (userexists) {
            return res.status(statusCodes.CONFLICT).json({ message: "email already exists" });
        }

        if (password !== confirmpassword) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "password and confirm password doesn't matched" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedpassword
        });

        await newUser.save();

        const mailoption = {
            from: process.env.email,
            to: email,
            subject: `Hi ${name}, welcome to Smart Bazaar`
        }
        await transporter.sendMail(mailoption);
        res.json({ message: "User successfully register" });


    } catch (error) {
        console.log("Error in Registration", error);
        console.log("Error in server");
    }
}



// User login controller

export async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(statusCodes.NOT_ACCEPTABLE).json({ message: "email or password is required" });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "Invalid email" });
        }

        if (user.status !== "Active") {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "Contact to admin" });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "Invalid password" });
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const updateUser = await User.findByIdAndUpdate(user?._id,
            {
                last_login_data: new Date()
            })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie("accesstoken", accessToken, cookiesOption);
        res.cookie("refreshtoken", refreshToken, cookiesOption);

        return res.status(statusCodes.OK).json({
            message: "login Successfully",
            data: {
                accessToken,
                refreshToken,
                userId: user._id,
                role:user.role
            }
        });

    }

    catch (error) {
        console.log("Error in logging", error);
        console.info("Server Error");
    }
}


// User Logout controller

export async function userLogout(req, res) {
    try {

        const userId = req.userId    // from middleware

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.clearCookie("accesstoken", cookiesOption)
        res.clearCookie("refreshtoken", cookiesOption)

        const removeRefreshToken = await User.findByIdAndUpdate(userId,
            {
                refresh_token: ""
            })

        return res.status(statusCodes.OK).json({ message: "Logout successfully", success: true });
    }
    catch (error) {
        console.error("Error in logout", error);
        console.info("Server Error");
    }
}

// Upload avatar(image)

export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId;   // from auth middleware
        const image = req.file;     //multer utils

        const upload = await uploadImageCloudinary(image)

        const updateUser = await User.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return res.status(statusCodes.OK).json({
            message: "avater upload", success: true,
            _id: userId,
            data: updateUser
        })



    } catch (error) {
        console.error("Error in upload avatar", error);
        console.info("Server Error");
    }
}


// update user details

export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId   // auth middleware
        const { name, email, password, mobile } = req.body;

        if (!name && !email && !password && !mobile) {
            return res.status(statusCodes.NOT_ACCEPTABLE).json({ message: "Atleast one field is required" });
        }

        let hashedpassword;
        if (password) {
            hashedpassword = await bcrypt.hash(password, 10);
        }


        const updateUser = await User.updateOne({ _id: userId },
            {
                name: name,
                email: email,
                password: hashedpassword,
                mobile: mobile
            })

        return res.status(statusCodes.OK).json({ message: "user details update successfully", success: true })
    }

    catch (error) {
        console.error("Error in updation", error);
        console.log("Server Error");
    }
}


// forgot password  

export async function forgotPassword(req, res) {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "email required" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "email not found" });
        }

        const otp = await generateOTP()
        const expireTime = new Date() + 60 * 60 * 1000  // 1hr

        const update = await User.findByIdAndUpdate(user._id,
            {
                forgot_password_otp: otp,
                forgot_password_expiry: new Date(expireTime).toISOString()
            })

        const mailOption = {
            from: "email",
            to: email,
            subject: "Password Reset OTP",
            text: "Dear " + user.name + "\n\n" +
                "Your OTP for password reset is " + otp + "\n\n" +
                "This OTP expires in 1 hour."

        }
        await transporter.sendMail(mailOption)

        return res.json({ message: "check your email" });
    }

    catch (error) {
        console.error("Error in process of forgot password", error);
        console.info("Server Error")
    }
}

// verify forgot password

export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "email or otp is required" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "email not available" });
        }

        const currentTime = new Date().toISOString
        if (currentTime > user.forgot_password_expiry) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: "otp is expired" });
        }

        if (user.forgot_password_otp !== otp) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "invalid otp" });
        }

        const updateUser = await User.findByIdAndUpdate(user._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        })

        res.json({ message: "otp verify successfully " });

    }
    catch (error) {
        console.error("Error while verifing OTP", error);
        console.info("Server Error")
    }
}


// resetting password

export async function resetPassword(req, res) {
    try {
        const { email, newpassword, confirmpassword } = req.body;

        if (!email || !newpassword || !confirmpassword) {
            return res.status(statusCodes.CONFLICT).json({ message: "All field are required" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "email not found" });
        }

        if (newpassword !== confirmpassword) {
            return res.status(statusCodes.NOT_ACCEPTABLE).json({ message: "newPassword and cPassword not matched" });
        }

        const newhashedPassword = await bcrypt.hash(newpassword, 10)

        const update = await User.findOneAndUpdate(user._id, {
            password: newhashedPassword
        })

        res.json({ message: "Password reset successfully" })
    }

    catch (error) {
        console.error("Error in resetting password", error);
        console.info("Server Error");
    }
}


// userDetails

export async function userDetails(req, res) {
    try {
        const userId = req.userId

        const user = await User.findById(userId).select('-password -refresh_token')
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({ message: "user not found" })
        }

        return res.status(statusCodes.OK).json({ message: "user Details", data: user })
    }

    catch (error) {
        console.error("Error in fetching user details", error);
        console.info("Server Error");
    }
}





