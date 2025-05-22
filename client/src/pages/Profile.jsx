import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserAlt } from "react-icons/fa";
import { Axios } from '../utils/axios';
import { summaryApi } from '../common/summary.api';
import { AxiosToastError } from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../redux/userSlice';
import { fetchUserDetails } from '../utils/fetchUserDetails';

const Profile = () => {

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setUserData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

     const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.update_user_details,
                data: userData
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError()
        } finally {
            setLoading(false)
        }
    }


    console.log("profile User", user)
    return (
        <div className='p-4'>
            <div className='w-10 h-10 flex items-center justify-center rounded-full overflow-hidden'>
                {
                    user.avatar ? (
                        <img
                            alt={user.name}
                            src={user.avatar}
                            className='w-full h-full'
                        />
                    ) : (
                        <FaUserAlt size={50} />
                    )
                }
            </div>
            <button className='text-sm px-3 border rounded-full mt-3 cursor-pointer
             border-amber-700 hover:bg-red-400'>Edit</button>

            <form className='my-1 grid ml-1' onSubmit={handleSubmit}>
                <div className='grid mt-2'>
                    <label>Name</label>
                    <input
                        type='text'
                        placeholder='enter your name'
                        className='p-2 border outline-none rounded hover:border-amber-500'
                        value={userData.name}
                        name='name'
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <div className='grid'>
                    <label>Email</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='enter your email'
                        className='p-2 border outline-none rounded hover:border-amber-500'
                        value={userData.email}
                        name='email'
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <div className='grid'>
                    <label>Mobile</label>
                    <input
                        type='text'
                        id='mobile'
                        placeholder='enter your mobile'
                        className='p-2 border outline-none rounded hover:border-amber-500'
                        value={userData.mobile}
                        name='mobile'
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <button className='border mt-5 px-2 font-semibold bg-amber-200 py-2 hover:bg-red-500 hover:text-white'>
                    {
                        loading ? "loading..." : "Submit"
                    }
                </button>

            </form>
        </div>
    )
}

export default Profile

