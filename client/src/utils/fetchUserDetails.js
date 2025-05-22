import { summaryApi } from "../common/summary.api"
import { Axios } from "./axios"

export const fetchUserDetails = async()=>{
    try {
        const response = await Axios({
            ...summaryApi.user_details
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}