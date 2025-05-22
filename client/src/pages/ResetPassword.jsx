import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { summaryApi } from '../common/summary.api'
import toast from 'react-hot-toast'
import { AxiosToastError } from '../utils/AxiosToastError'
import { Axios } from '../utils/axios'

const ResetPassword = () => {

    const location = useLocation()
    const navigate = useNavigate()


    const [data, setData] = useState({
        email: "",
        newpassword: "",
        confirmpassword: ""
    })

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

    useEffect(() => {
        if (!(location?.state?.data?.message)) {
            navigate("/")
        }

        if (location?.state?.email) {
            setData((preve) => {
                return {
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(data.newpassword !== data.confirmpassword){
            toast.error("new password and confirm password must same")
            return
        }

        try {
            const response = await Axios({
                ...summaryApi.reset_password,
                data: data
            })

            toast.success(response.data.message);
            console.log("Response:", response.data);
            navigate("/login")
            setData({
                email: "",
                newpassword: "",
                confirmpassword: ""
            })

        }

        catch (error) {
            AxiosToastError(error)
        }
    };

    console.log("data reset password", data)

    return (
        <section className='w-full container mx-auto px-7'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-3'>
                <p className='font-bold text-lg mb-2'>Reset Password</p>

                <form className='grid gap-3' onSubmit={handleSubmit} >
                    <div className='grid gap-1'>
                        <label htmlFor='newpassword'>New Password :</label>
                        <input
                            type='password'
                            id='newpassword'
                            className='bg-blue-50 p-2 border rounded '
                            name='newpassword'
                            value={data.newpassword}
                            onChange={handleChange}
                            placeholder='new password'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='confirmpassword'>confirm Password :</label>
                        <input
                            type='password'
                            id='confirmpassword'
                            className='bg-blue-50 p-2 border rounded '
                            name='confirmpassword'
                            value={data.confirmpassword}
                            onChange={handleChange}
                            placeholder='confirm password'
                        />
                    </div>
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-yellow-500" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-3 `}>Change Password</button>

                </form>

            </div>
        </section>
    )
}

export default ResetPassword
