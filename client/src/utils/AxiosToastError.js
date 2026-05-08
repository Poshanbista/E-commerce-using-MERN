import toast from "react-hot-toast";

export const AxiosToastError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data.message || 'An error occurred';
    toast.error(`${message}`);
  } else if (error.request) {
    toast.error("No response from the server");
  } else {
    // Something else happened
    // toast.error("An error occurred while setting up the request");
  }
};


