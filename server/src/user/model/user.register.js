import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Provide name"]
    },
    email:{
        type:String,
        required:[true, "Provide email"],
        unique:true
    },
    password : {
        type:String,
        requred:[true, "Provide password"]
    },
    avatar:{
        type:String,
        default:""
    },
    mobile:{
        type:Number,
        default:null
    },
    refresh_token:{
        type:String,
        default: ""
    },
    verify_email:{
        type:Boolean,
        default:false
    },
    last_login_data:{
        type:Date,
        default:""
    },
    status:{
        type:String,
        enum:["Active", "Unactive", "Suspended"],
        default:"Active"
    },
    address_details:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'address'
        }
    ],
    shopping_cart:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'cartProduct'
        }
    ],
    orderHistory:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'order'
        }
    ],
    forgot_password_otp:{
        type:String,
        default:null
    },
    forgot_password_expiry:{
        type:Date,
        default:""
    },
    role:{
        type:String,
        enum:["ADMIN", "USER"],
        default:"USER"
    }
},
{
    timestamps:true
})

export const User = mongoose.model("User",userSchema);