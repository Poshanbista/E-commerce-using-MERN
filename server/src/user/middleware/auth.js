import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accesstoken

        // console.log("Token",token)       to console the token fetch from login cookies

        if (!token) {
            return res.status(NOT_FOUND).json({ message: "Provide token" });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN || "ksjjdijsoijfjodjif")

        // console.log("Decode",decode)  to console the id of user after decoding Access_Token

        if (!decode) {
            return resstatus(StatusCodes.unauthorized).json({ message: "unauthorized accesss" });
        }

        req.userId = decode.id    // export userId in the userLogout

        next()
    }

    catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: error.message || error,
            success: false
        }) 
    }
}

