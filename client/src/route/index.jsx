import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission";
import AddProductPage from "../pages/AddProductPage";
import ProductDisplayPage from "../component/ProductDisplayPage";
import HomePageAfterLogin from "../pages/HomePageAFterLogin"
import CheckOutPage from "../pages/CheckOutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import ManageOrderPage from "../pages/ManageOrderPage"




const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children: [
            {
                path:"",
                element:<Home/>
            },
            {
                path:"search",
                element:<SearchPage/>          
            },
            {
                path:"login",
                element:<Login/>
            },
            {
                path:"register",
                element:<Register/>
            },
            {
                path:"forgot-password",
                element:<ForgotPassword/>
            },
            {
                path:"verification-otp",
                element:<OtpVerification/>
            },
            {
                path:"reset-password",
                element:<ResetPassword/>
            },
            {
                path:"homepage",
                element:<HomePageAfterLogin/>
            },
            {
                path:"dashboard",
                element:<Dashboard/>,
                children:[
                    {
                        path:"profile",
                        element:<Profile/>
                    },
                    {
                        path:"myorders",
                        element:<MyOrders/>
                    },
                    {
                        path:"address",
                        element:<Address/>
                    },
                    {
                        path:"category",
                        element:<AdminPermission><Category/></AdminPermission>
                    },
                    {
                        path:"subcategory",
                        element:<AdminPermission><SubCategory/></AdminPermission>
                    },
                    {
                        path:"addproduct",
                        element:<AdminPermission><AddProductPage/></AdminPermission>
                    },
                    {
                        path:"product",
                        element:<AdminPermission><ProductAdmin/></AdminPermission>
                    },
                    {
                        path:"manageorders",
                        element:<AdminPermission><ManageOrderPage/></AdminPermission>
                    }
                ]
            },
            {
                path:"product/:product",
                element:<ProductDisplayPage/>
            },
            {
                path:"checkout",
                element:<CheckOutPage/>
            },
            {
                path:"success",
                element:<Success/>
            },
            {
                path:"cancel",
                element:<Cancel/>
            }

        ]
    }
   
])

export default router;