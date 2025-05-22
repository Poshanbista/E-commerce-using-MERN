import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        default:""
    }
},
{
    timestamps:true
})

export const category = mongoose.model("category", categorySchema);