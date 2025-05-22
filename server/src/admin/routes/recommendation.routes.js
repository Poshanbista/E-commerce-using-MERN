import { Router } from "express";
import { getRecommendedProducts } from "../controller/recommedation.js";


const recommendationRoute = Router()

recommendationRoute.post("/recommended",getRecommendedProducts)


export default recommendationRoute