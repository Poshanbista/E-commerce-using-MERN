import { Router } from "express";
import { addCategory, deleteCategory, getCategoryName, updateCategory } from "../controller/category.js";
import { auth } from "../../user/middleware/auth.js";



const categoryRoute = Router();

categoryRoute.post("/addCategory",auth,addCategory)
categoryRoute.get("/get",getCategoryName)  
categoryRoute.put("/updateCategory",auth,updateCategory)
categoryRoute.delete("/deleteCategory",auth,deleteCategory)

export default categoryRoute