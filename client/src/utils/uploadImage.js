
import { Axios } from "./axios";
import { summaryApi } from "../common/summary.api";

const uploadImage = async (image) => {

    const formData = new FormData();

    formData.append("image", image);

    const response = await Axios({
        ...summaryApi.uploadImage,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response;
};

export default uploadImage;