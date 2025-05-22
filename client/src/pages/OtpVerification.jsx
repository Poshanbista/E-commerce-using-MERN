import React, { useEffect, useRef, useState } from 'react'
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AxiosToastError } from '../utils/AxiosToastError'
import { summaryApi } from '../common/summary.api'
import { Axios } from '../utils/axios.js'


const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])

    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log("location",location)

    useEffect(()=>{
        if(!location?.state?.email)
        {
            navigate('/forgot-password') 
        }
    },[])

    const validValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...summaryApi.Otp_verification,
                data: {
                   otp : data.join(""),
                   email : location?.state?.email
                }
            })

            toast.success(response.data.message);
            console.log("Response:", response.data);
            setData(["", "", "", "", "", ""])
            navigate("/reset-password", {
                state: {
                    data: response.data,
                    email: location?.state?.email
                }
            });
        }

        catch (error) {
            AxiosToastError(error)
        }
    };


    return (
        <section className='w-full container mx-auto px-7'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-3'>
                <p className='font-bold text-lg mb-2'>Enter OTP</p>

                <form className='grid gap-3' onSubmit={handleSubmit} >
                    <div className='grid gap-1'>
                        <label htmlFor='otp'>Provide OTP :</label>
                        <div className='flex items-center gap-2 justify-between mt-4'>
                            {
                                data.map((element, index) => {
                                    return (
                                        <input
                                        key={"otp"+index}
                                            type='text'
                                            id='otp'
                                            ref={(ref)=>{
                                                inputRef.current[index] = ref
                                                return ref
                                            }}
                                            value={data[index]}
                                            onChange={(e)=>{
                                                const value = e.target.value
                                                console.log("value",value)
                                                 
                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)
                                                
                                                if(value && index < 5)
                                                {
                                                    inputRef.current[index+1].focus()
                                                }
                                            }}
                                            maxLength={1}
                                            className='w-full max-w-16 bg-blue-50 p-2 border rounded text-center font-bold'
                                        />
                                    )
                                })
                            }
                        </div>

                    </div>
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-yellow-500" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-3 `}>Verify OTP</button>

                </form>

            </div>
        </section>
    )
}

export default OtpVerification

