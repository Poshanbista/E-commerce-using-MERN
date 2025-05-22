import React from 'react'
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form"
import { Axios } from '../utils/axios';
import { summaryApi } from '../common/summary.api';
import toast from 'react-hot-toast';
import { AxiosToastError } from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const AddAddresses = ({ close }) => {


    const { register, handleSubmit, reset } = useForm()
    const { fetchAddress } = useGlobalContext()


    const onSubmit = async (data) => {
        console.log("data", data)

        try {
            const response = await Axios({
                ...summaryApi.addAddress,
                data: {
                    state: data.state,
                    city: data.city,
                    address: data.address,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            } 
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-neutral-700/90 fixed top-0 left-0 right-0 bottom-0 z-50  h-screen overflow-auto'>
            <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
                <div className='flex justify-between items-center gap-4'>
                    <h2 className='font-semibold'>Add Address</h2>
                    <button onClick={close} className='hover:text-red-500'>
                        <IoClose size={25} />
                    </button>
                </div>

                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor='state'>State :</label>
                        <input
                            type='text'
                            id='state'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("state", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='city'>City :</label>
                        <input
                            type='text'
                            id='city'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("city", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='address'>Address :</label>
                        <input
                            type='text'
                            id='address'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("address", { required: true })}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='mobile'>Mobile No. :</label>
                        <input
                            type='text'
                            id='mobile'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("mobile", { required: true })}
                        />
                    </div>

                    <button type='submit' className='bg-green-600 w-full  py-2 font-semibold mt-4 hover:bg-green-800'>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default AddAddresses
