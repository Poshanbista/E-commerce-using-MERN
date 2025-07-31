import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { acceptOrder, cashOnDeliveryOrder, getOrderDetails } from "../controller/order.js";




const orderRoute = Router()

orderRoute.post("/cash-on-delivery",auth,cashOnDeliveryOrder)
orderRoute.get("/getOrder",auth,getOrderDetails)
orderRoute.post("/accept/:id",auth,acceptOrder);

export default orderRoute