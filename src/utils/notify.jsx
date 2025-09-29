import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

export const errorNotify = (message = "Something went wrong") =>
    toast.error(message, config);

export const infoNotify = (message = "") => toast.info(message, config);

export const successNotify = (message = "") => toast.success(message, config);

const NotifyContainer = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        ></ToastContainer>
    );
}

export default NotifyContainer;
