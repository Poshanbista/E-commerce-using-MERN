import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: Array,
        default: []
    },
    ram:{
        type:String,
        required:true
    },
    ssd:{
        type:String,
        required:true
    },
    processor:{
        type:String,
        required:true
    },
    unit: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    }
},
    {
        timestamps: true
    })

//create a text index
productSchema.index({
    name: "text",
    description: "text"
}, {
    name: 10,
    description: 5
})

export const product = new mongoose.model("product", productSchema);