import { Router } from "express";
import { addSubCategory, deleteSubCategory, getSubCategory, getSubCategoryByCategory } from "../controller/subCategory.js";
import { auth } from "../../user/middleware/auth.js"


const subCategoryRoute = Router()

subCategoryRoute.post("/addSubCategory",auth,addSubCategory)
subCategoryRoute.get("/getSubCategory",getSubCategory)
subCategoryRoute.post("/getByCategory",getSubCategoryByCategory)
subCategoryRoute.delete("/deleteSubCategory",auth,deleteSubCategory)


export default subCategoryRoute