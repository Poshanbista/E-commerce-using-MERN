import { StatusCodes } from "http-status-codes";
import { category } from "../model/add.category.js";
import { subCategory } from "../model/add.subcategory.js";
import { product } from "../model/add.product.js";


//Add Category controller
export async function addCategory(req, res) {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "name required" })
        }

        const nameExists = await category.findOne({ name })
        if (nameExists) {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "category already exists" })
        }

        const newCategory = new category({
            name
        })

        await newCategory.save()

        res.status(StatusCodes.OK).json({ message: "new Category added", success: true })

    } catch (error) {
        console.log("Error in adding Category", error);
        console.log("Error in server");
    }
}

//get category controller
export async function getCategoryName(req, res) {
    try {
        const data = await category.find().sort({ name: 1 })
        if (!data) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "no data available" })
        }

        return res.status(StatusCodes.OK).json({ data: data, success: true })

    } catch (error) {
        console.log("Error in getting category", error);
        console.log("Error in server");
    }
}

//update category controller
export async function updateCategory(req, res) {
    try {
        const { _id, name } = req.body

        const nameExists = await category.findOne({ name })

        if (nameExists) {
            return res.status(StatusCodes.CONFLICT).json({ message: "category already exists" })
        }

        const update = await category.updateOne(
            { _id: _id },
            {
                name
            })

        return res.status(StatusCodes.OK).json({ message: "update successfully", success: true, data: update })
    }

    catch (error) {
        console.log("Error in update category", error)
        console.log("Server Error")
    }
}

// delete category controller
export async function deleteCategory(req, res) {
    try {
        const { _id } = req.body

        const checkSubCategory = await subCategory.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        const checkProduct = await product.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if (checkSubCategory > 0 && checkProduct > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "category used can't deleted" })
        }

        const deleteCategory = await category.deleteOne({ _id: _id })

        return res.status(StatusCodes.OK).json({ message: "deleted successfully", success: true, data: deleteCategory })



    } catch (error) {
        console.log("Error in delete", error)
        console.log("Server error")
    }

}