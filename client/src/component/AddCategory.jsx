import React, { useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import { Axios} from "../utils/axios"
import { summaryApi } from '../common/summary.api';
import toast from "react-hot-toast"
import  { AxiosToastError } from "../utils/AxiosToastError"

const AddCategory = ({ close, fetchData }) => {

    const [data, setData] = useState({
        name: ""
    })

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...summaryApi.add_category,
                data:data
            })

            const {data :responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                if(close)
                    close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='fixed top-0 bottom-0 right-0 left-0 p-4 bg-neutral-900/60 flex items-center justify-center'>
            <div className='bg-white max-w-3xl w-100 rounded p-4 mb-40'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-bold'>Category</h2>
                    <button onClick={close} className='w-fit block ml-auto hover:bg-red-700'>
                        <IoMdCloseCircle size={30} />
                    </button>
                </div>

                <form className='my-3 grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Name :</label>
                        <input
                            type='text'
                            className='border rounded p-1 hover:border-amber-400 outline-none'
                            placeholder='Enter category name'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                        />
                    </div>

                    <button
                        className={`
                            ${data.name ? "bg-yellow-400 hover:bg-amber-600" : "bg-slate-500 "}
                            py-2
                            font-semibold
                        `}
                    >Add Category
                    </button>
                    
                </form>
            </div>
        </section>
    )
}

export default AddCategory
