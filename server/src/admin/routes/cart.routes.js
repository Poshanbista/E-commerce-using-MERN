import { Router } from "express";
import { addToCartItem, deleteCartItem, getCartItem, updateCartItem } from "../controller/cartProduct.js";
import { auth } from "../../user/middleware/auth.js";


const cartRoute = Router()

cartRoute.post("/addCart",auth,addToCartItem)
cartRoute.get("/getCart",auth,getCartItem)
cartRoute.put("/update-qty",auth,updateCartItem)
cartRoute.delete("/deleteCartItem",auth,deleteCartItem)

export default cartRoute