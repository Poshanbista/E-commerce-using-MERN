import mongoose from "mongoose";


const userRecentViewSchema = new mongoose.Schema({
    userId: 
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
    productId:
        {
            type: mongoose.Schema.ObjectId,
            ref: 'product'
        },
    ram: String,
    ssd: String,
    processor: String,
    viewAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

export const userrecentview = mongoose.model("userrecentview",userRecentViewSchema)
