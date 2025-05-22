import mongoose from "mongoose";


const subcategorySchema = new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    category:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"category"
        }
    ]
},
{
    timestamps:true
})

export const subCategory = mongoose.model("subCategory", subcategorySchema);