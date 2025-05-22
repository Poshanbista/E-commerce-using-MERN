
import { StatusCodes } from "http-status-codes";
import { subCategory } from "../model/add.subcategory.js";



//add sub category 
export async function addSubCategory(req, res) {
    try {
        const { name, category } = req.body

        if (!name && !category[0]) {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "name and category required" })
        }

        const subCategoryExists = await subCategory.findOne({ name })
        if (subCategoryExists) {
            return res.status(StatusCodes.CONFLICT).json({ message: "this subCategory already exists" })
        }

        const newSubCategory = new subCategory({
            name,
            category
        })

        await newSubCategory.save()

        return res.status(StatusCodes.OK).json({ message: "subCategory added", success: true })
    }

    catch (error) {
        console.log("Error in adding sub category", error)
        console.log("server Error")
    }

}

//get sub category
export async function getSubCategory(req, res) {
    try {
        const data = await subCategory.find().sort({ name: 1 }).populate('category')

        return res.status(StatusCodes.OK).json({ message: "sub Category Data", data: data, success: true })


    } catch (error) {
        console.log("Error in getting sub category", error)
        console.log("server Error")
    }
}

//delete sub category
export async function deleteSubCategory(req, res) {
    try {
        const { _id } = req.body

        const deleteSubCategory = await subCategory.findByIdAndDelete(_id)
        return res.status(StatusCodes.OK).json({ message: "Deleted Successfully", data: deleteSubCategory, success: true })


    } catch (error) {
        console.log("error in deletation", error)
        console.log("Server Error")
    }
}