import React, { useState } from 'react'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router-dom'
import { AxiosToastError } from '../utils/AxiosToastError'
import { summaryApi } from '../common/summary.api'
import { Axios } from '../utils/axios.js'


const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    })

    const [loading, setLoading] = useState(false);

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

        if (data.password !== data.confirmpassword) {
            toast.error("Password and confirm password must be same")
            return;
        }
        if (loading) return;

        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.register,
                data: data
            })

            toast.success(response.data.message);
            console.log("Response:", response.data);
            setData({
                name: "",
                email: "",
                password: "",
                confirmpassword: ""
            })
            navigate("/login");
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
                <p className='text-center font-bold'>Welcome to Smart Bazaar</p>

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit} >
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name :</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className='bg-blue-50 p-2 border rounded '
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                    </div>

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

                    <div className='grid gap-1'>
                        <label htmlFor='confirmpassword'>Confirm Password :</label>
                        <input
                            type='password'
                            id='confirmpassword'
                            className='bg-blue-50 p-2 border rounded w-full outline-none'
                            name='confirmpassword'
                            value={data.confirmpassword}
                            onChange={handleChange}
                            placeholder='Enter your confirm Password'
                        />
                    </div>

                    <button disabled={!validValue || loading} className={` ${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-3 `}>
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <p>
                    Already have account ? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
                </p>

            </div>
        </section>
    )
}

export default Register
