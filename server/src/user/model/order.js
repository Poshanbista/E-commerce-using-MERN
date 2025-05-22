import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    ],
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
    invoice_receipt:{
        type:String,
        default:""
    }
},
{
    timestamps:true
})

export const order = mongoose.model("order", orderSchema);