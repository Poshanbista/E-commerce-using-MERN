import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import { Axios } from '../utils/axios'
import { summaryApi } from '../common/summary.api'
import toast from 'react-hot-toast'
import { AxiosToastError } from '../utils/AxiosToastError'
import { logout } from '../redux/userSlice'
import { FaEdit } from "react-icons/fa";
import { isAdmin } from "../utils/isAdmin.js"


const UserMenu = ({ close }) => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...summaryApi.logout
            })
            console.log(response)
            if (response.data.success) {
                close()
                localStorage.clear();
                toast.success(response.data.message);
                dispatch(logout());
                navigate('/');
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleClose = () => {
        if (close) {
            close()
        }

    }

    return (
        <div className=' ' >
            <div className='font-semibold'>My Account</div>
            <div className='text-sm flex items-center gap-3'>
                <span>  {user.name || user.mobile}<span>{user.role === "ADMIN" ? "(Admin)" : ""}</span> </span>
                <Link onClick={handleClose} to={'/dashboard/profile'} className='hover:text-green-700'> <FaEdit size={15} /></Link></div>

            <Divider />

            <div className='text-sm grid gap-2' onClick={handleClose}>

                {/* {
                    isAdmin(user.role) && (
                        <Link to={"/dashboard/category"}
                            className='px-2 hover:bg-amber-200'>Category</Link>
                    )
                }

                {
                    isAdmin(user.role) && (
                        <Link to={"/dashboard/subcategory"}
                            className='px-2 hover:bg-amber-200'>Sub catagory</Link>
                    )
                } */}


                {
                    isAdmin(user.role) && (
                        <Link to={"/dashboard/addproduct"}
                            className='px-2 hover:bg-amber-200'>Add Product</Link>
                    )
                }

                {
                    isAdmin(user.role) && (
                        <Link to={"/dashboard/product"}
                            className='px-2 hover:bg-amber-200'>Product</Link>
                    )
                }

                <Link to={"/dashboard/myorders"}
                    className='px-2 hover:bg-amber-200'>My order</Link>

                <Link to={"/dashboard/address"}
                    className='px-2  hover:bg-amber-200'>Save Address</Link>

                <button onClick={handleLogout}
                    className=' hover:bg-amber-200 text-left px-2 cursor-pointer'>Logout</button>
            </div>
        </div>
    )
}

export default UserMenu
