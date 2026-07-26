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
    category: {
        type: String,
        default: ""
    },
    viewAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

export const userrecentview = mongoose.model("userrecentview",userRecentViewSchema)
