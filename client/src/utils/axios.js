import axios from "axios";
import { baseURL } from "../common/summary.api";


 export const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true,
})
