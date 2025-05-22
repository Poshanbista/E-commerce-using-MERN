import React, { useState } from 'react'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router-dom'
import { AxiosToastError } from '../utils/AxiosToastError'
import { summaryApi } from '../common/summary.api'
import { Axios } from '../utils/axios.js'
import { fetchUserDetails } from '../utils/fetchUserDetails.js'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../redux/userSlice.js'


const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const validValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return;

        try {
            const response = await Axios({
                ...summaryApi.login,
                data: data
            })
            console.log("Response:", response.data);


            toast.success(response.data.message);
            console.log("Response:", response.data);
            localStorage.setItem("AccessToken", response.data.data.accessToken)
            localStorage.setItem("RefreshToken", response.data.data.refreshToken)
            localStorage.setItem("userId", response.data.data.userId);
            localStorage.setItem("testKey", "12345");
            console.log(localStorage.getItem("testKey"));

            const userDetails = await fetchUserDetails()
            dispatch(setUserDetails(userDetails.data))

            setData({
                email: "",
                password: ""
            })
            navigate("/homepage");
        }

        catch (error) {
            AxiosToastError(error)
        }
        finally {
            setLoading(false)
        }

    };


    return (
        <section className='w-full container mx-auto px-7'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-3'>
                <p className='text-center font-bold'>Login to Smart Bazaar</p>

                <form className='grid gap-3' onSubmit={handleSubmit} >
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded '
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='password'>Password :</label>
                        <input
                            type='password'
                            id='password'
                            className='bg-blue-50 p-2 border rounded w-full outline-none'
                            name='password'
                            value={data.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
                        />
                    </div>
                    <Link to={'/forgot-password'} className='font-semibold block ml-auto hover:text-red-200'>Forgot Password ?</Link>
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-yellow-500" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-3 `}>
                        {loading ? "logging..." : "Login"}
                    </button>

                </form>

                <p>
                    Don't have account ? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
                </p>

            </div>
        </section>
    )
}

export default Login
