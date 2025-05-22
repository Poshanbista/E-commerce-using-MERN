import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    state:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    address:{
        type:String
    },
    mobile:{
        type:Number,
        default:""
    },
    status:{
        type:Boolean,
        default:true
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        default:""
    }
},
{
    timestamps:true
})

export const addressModel = mongoose.model("addressModel",addressSchema);