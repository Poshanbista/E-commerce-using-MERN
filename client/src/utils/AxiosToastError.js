export const AxiosToastError = (error) => {
  if (error.response) {
    // The server responded with a status other than 2xx
    const status = error.response.status;
    const message = error.response.data.message || 'An error occurred';
    toast.error(`${status}: ${message}`);
  } else if (error.request) {
    // The request was made but no response was received
    toast.error("No response from the server");
  } else {
    // Something else happened
    toast.error("An error occurred while setting up the request");
  }
};



// import toast from "react-hot-toast"

// export const AxiosToastError = (error)=>{
//     toast.error(
//         error?.response?.data?.message || dskfjds
//     )
// }


