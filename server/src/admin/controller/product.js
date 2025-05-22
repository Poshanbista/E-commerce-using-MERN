import { StatusCodes } from "http-status-codes";
import { product } from "../model/add.product.js"


// upload a product
export const addProduct = async (req, res) => {
    try {
        const {
            name,
            image,
            unit,
            ram,
            ssd,
            processor,
            price,
            stock,
            discount,
            description,
        } = req.body;

        if (!name || !image || !unit || !ram || !ssd || !processor || !price || !stock || !discount || !description) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
        }

        const productExists = await product.findOne({ name })
        if (productExists) {
            return res.status(StatusCodes.CONFLICT).json({ message: "this product exists" })
        }

        const newProduct = new product({
            name,
            image,
            unit,
            ram,
            ssd,
            processor,
            price,
            stock,
            discount,
            description,
        })

        await newProduct.save()
        return res.status(StatusCodes.OK).json({ message: "Product add successfully", success: true, data: product })


    } catch (error) {
        console.log("Error in add product", error)
        console.log("Server error")
    }
}


// get product

export const getProduct = async (req, res) => {
    try {
        let { page, limit, search } = req.body

        if (!page) {
            page = 2
        }

        if (!limit) {
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data, totalCount] = await Promise.all([
            product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            product.countDocuments(query)
        ])

        return res.status(StatusCodes.OK).json({
            message: "product data",
            success: true,
            totalcount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data,
        })

    } catch (error) {
        console.log("error in getting products", error);
        console.log("server Error")
    }
}

// edit product

export const updateProductDetails = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "provide id" })
        }

        const updateProduct = await product.updateOne({ _id: _id }, {
            ...req.body
        })
        return res.status(StatusCodes.OK).json({
            message: "update successfully",
            success: true,
            data: updateProduct
        })

    } catch (error) {
        console.log("error in updating products", error);
        console.log("server Error")
    }
}


// delete product

export const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "provide id" })
        }

        const deleteProduct = await product.deleteOne({ _id: _id })

        res.status(StatusCodes.OK).json({
            message: "product deleted",
            success: true,
            data: deleteProduct
        })

    } catch (error) {
        console.log("error in deletating products", error);
        console.log("server Error")
    }
}


// get product in homepage

export const getProductHome = async (req, res) => {
    try {

       const getProduct = await product.find()

        res.status(StatusCodes.OK).json({
            message: "All Product",
            success: true,
            data: getProduct
        })

    } catch (error) {
        console.log("error in getting products", error);
        console.log("server Error")
    }
}


// get product details

export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body

        const foundProduct = await product.findOne({ _id: productId })

        return res.status(StatusCodes.OK).json({
            message: "product details",
            data: foundProduct,
            success: true
        })

    } catch (error) {
        console.log('error in getting product details', error)
        console.log("Server Error")
    }
}