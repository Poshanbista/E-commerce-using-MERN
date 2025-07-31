import mongoose from "mongoose";
import { orderStatus } from "../types/orderStatus.enum.js";


const orderSchema = new mongoose.Schema({
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

    orderId:{
        type:String,
        required:[true, "Provide orderId"],
        unique:true
    },
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:"product"
    },
    product_details:{
        name:String,
        image:Array
    },
    paymentId:{
        type:String,
        default:""
    },
    paymentStatus:{
        type:String,
        default:""
    },
    delivery_address:{
        type:mongoose.Schema.ObjectId,
        ref:"address"
    },
    totalAmt:{
        type:Number,
        default:null
    },
    SubTotalAmt:{
        type:Number,
        default:null
    },
    invoice_receipt:{ type:String, default:""},

    orderStatus :{type:String, enum:Object.values(orderStatus), default:orderStatus.PENDING},
},
{
    timestamps:true
})

export const order = mongoose.model("order", orderSchema);