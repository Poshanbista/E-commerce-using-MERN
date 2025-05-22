import React, { useState } from 'react'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router-dom'
import { AxiosToastError } from '../utils/AxiosToastError'
import { summaryApi } from '../common/summary.api'
import { Axios } from '../utils/axios.js'


const ForgotPassword = () => {
    const [data, setData] = useState({
        email: ""
    })

    const navigate = useNavigate()

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

        try {
            const response = await Axios({
                ...summaryApi.forgot_password,
                data: data
            })

            toast.success(response.data.message);
            console.log("Response:", response.data);
            navigate("/verification-otp",{
                state : data
            });
            setData({
                email: ""
            })
            
        }

        catch (error) {
            AxiosToastError(error)
        }
    };


    return (
        <section className='w-full container mx-auto px-7'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-3'>
                <p className='font-bold text-lg mb-2'>Forgot Password</p>

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
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-yellow-500" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-3 `}>Send OTP</button>

                </form>
                <p>
                    Already have account ? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
                </p>

            </div>
        </section>
    )
}

export default ForgotPassword

