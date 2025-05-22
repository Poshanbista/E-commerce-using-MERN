import { Router } from "express";
import { addSubCategory, deleteSubCategory, getSubCategory } from "../controller/subCategory.js";
import { auth } from "../../user/middleware/auth.js"


const subCategoryRoute = Router()

subCategoryRoute.post("/addSubCategory",auth,addSubCategory)
subCategoryRoute.get("/getSubCategory",getSubCategory)
subCategoryRoute.delete("/deleteSubCategory",auth,deleteSubCategory)


export default subCategoryRoute