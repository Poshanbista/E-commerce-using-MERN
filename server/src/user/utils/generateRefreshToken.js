import jwt from "jsonwebtoken";
import { User } from "../model/user.register.js";

const generateRefreshToken = async(userId)=>{
    const token = await jwt.sign({id:userId},
        process.env.SECRET_KEY_REFRESH_TOKEN || "JSDJSJFJSKDFKSEINWHUSD",
        {expiresIn:"30d"}
    )

    const updateRefreshToken = await User.updateOne(
        {_id:userId},
        {
            refresh_token : token

        }
    )
    return token;
}

export default generateRefreshToken;
