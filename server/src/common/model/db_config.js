import mongoose from "mongoose";

export const db_config = () =>{
    mongoose
    .connect('mongodb://127.0.0.1:27017/Smart_Bazaar')
    .then(()=>console.log("mongodb connected"))
    .catch((err)=>console.error(err));
};

