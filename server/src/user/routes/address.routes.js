import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addAddress, deleteAddress, editAddress, getAddress } from "../controller/address.js";


const addressRoute = Router()

addressRoute.post("/addAddress",auth,addAddress)
addressRoute.get("/getAddress",auth,getAddress)
addressRoute.put("/editAddress",auth,editAddress)
addressRoute.delete("/deleteAddress",auth,deleteAddress)


export default addressRoute