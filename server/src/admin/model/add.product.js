import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: Array,
        default: []
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "category",
        required: true
    },
    ram: {
        type: String,
        default: ""
    },
    ssd: {
        type: String,
        default: ""
    },
    processor: {
        type: String,
        default: ""
    },
    screenSize: {
        type: String,
        default: ""
    },
    battery: {
        type: String,
        default: ""
    },
    dpi: {
        type: String,
        default: ""
    },
    connectivity: {
        type: String,
        default: ""
    },
    brand: {
        type: String,
        default: ""
    },
    sensorType: {
        type: String,
        default: ""
    },
    resolution: {
        type: String,
        default: ""
    },
    refreshRate: {
        type: String,
        default: ""
    },
    panelType: {
        type: String,
        default: ""
    },
    responseTime: {
        type: String,
        default: ""
    },
    layoutSize: {
        type: String,
        default: ""
    },
    switchType: {
        type: String,
        default: ""
    },
    backlight: {
        type: String,
        default: ""
    },
    driverSize: {
        type: String,
        default: ""
    },
    frequencyResponse: {
        type: String,
        default: ""
    },
    noiseCancellation: {
        type: String,
        default: ""
    },
    mic: {
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