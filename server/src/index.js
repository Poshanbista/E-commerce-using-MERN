import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { db_config } from "./common/model/db_config.js";
import bodyParser from "body-parser";
import userRoute from "./user/routes/user.routes.js";
import categoryRoute from "./admin/routes/category.routes.js";
import subCategoryRoute from "./admin/routes/subCategory.route.js";
import uploadImageRoute from "./admin/routes/uploadImgae.routes.js";
import productRoute from "./admin/routes/product.routes.js";
import recommendationRoute from "./admin/routes/recommendation.routes.js";
import cartRoute from "./admin/routes/cart.routes.js";
import addressRoute from "./user/routes/address.routes.js";
import orderRoute from "./user/routes/order.routes.js";


db_config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    credentials:true,
    origin : "http://localhost:5173"
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy:false
}));

app.get("/",(req,res)=>{
    res.json({message:"server is running at " +PORT})
})


app.use("/api",userRoute);
// app.use("/api/category",categoryRoute)
// app.use("/api/subCategory",subCategoryRoute)
app.use("/api/file",uploadImageRoute)
app.use("/api/product",productRoute)
app.use("/api/cart",cartRoute)
app.use("/api",recommendationRoute)
app.use("/api/address",addressRoute)
app.use("/api/order",orderRoute)

const PORT = process.env.PORT || 9000;

app.listen(PORT,()=>{
    console.log("server is running at",PORT);
});
