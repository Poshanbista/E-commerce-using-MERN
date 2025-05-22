import { Router } from "express";
import { addProduct, deleteProduct, getProduct, getProductDetails, getProductHome, updateProductDetails } from "../controller/product.js";
import { auth } from "../../user/middleware/auth.js";
import { storeRecentView } from "../controller/productFeatures.js";
import { getRecommendedProducts } from "../controller/recommedation.js";


const productRoute = Router()

productRoute.post("/addProduct",auth,addProduct)
productRoute.post("/getProduct",getProduct)
productRoute.post("/",getProductHome)

// edit product 
productRoute.put("/updataProduct",auth,updateProductDetails)

// delete product
productRoute.delete("/deleteProduct",auth,deleteProduct)

// get product details
productRoute.post("/getProductDetails",getProductDetails)

// recent view
productRoute.post("/recent_view",auth,storeRecentView)

//recommeded 
productRoute.post("/recommended",auth,getRecommendedProducts)

export default productRoute