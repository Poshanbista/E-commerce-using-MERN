import React, { useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { Axios } from "../utils/axios.js"
import { summaryApi } from '../common/summary.api.js';
import toast from "react-hot-toast"
import { AxiosToastError } from "../utils/AxiosToastError.js"

const AddSubCategory = ({ close, fetchData }) => {

    const [subCategoryData, setSubCategoryData] = useState({
        name: "",
        category: []
    })

    const Category = useSelector(state => state.product.Category)

    console.log("all category in sub category page", Category)

    const handleChange = (e) => {
        const { name, value } = e.target

        setSubCategoryData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...summaryApi.add_subCategory,
                data: subCategoryData
            })

            const { data: responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                }
                fetchData()
            }
        }

        catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='fixed top-0 bottom-0 right-0 left-0 p-4 bg-neutral-900/60 flex items-center justify-center'>
            <div className='bg-white max-w-3xl w-150 rounded p-4 mb-20'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-bold'>Sub-Category</h2>
                    <button onClick={close} className='w-fit block ml-auto hover:bg-red-700'>
                        <IoMdCloseCircle size={30} />
                    </button>
                </div>

                <form className='my-3 grid gap-4' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Name :</label>
                        <input
                            type='text'
                            className='border rounded p-1 hover:border-amber-400 outline-none'
                            placeholder='Enter sub-category name'
                            value={subCategoryData.name}
                            name='name'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label>Select Category</label>
                        <div className='border rounded focus focus-within:border-yellow-400'>


                            {/**select Category */}
                            <select className='w-full p-2 '
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = Category.find(el => el._id == value)

                                    setSubCategoryData((preve) => {
                                        return {
                                            ...preve,
                                            category: [...preve.category, categoryDetails]
                                        }
                                    })
                                }}
                            >
                                <option value={""}>Select Category</option>

                                {
                                    Category.map((Category, index) => {
                                        return (
                                            <option value={Category?._id} key={Category._id + "subcategory"}>{Category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <button className={`px-4 py-1 border font-bold
                    ${subCategoryData.name && subCategoryData.category[0] ? "bg-amber-400" : "bg-slate-300"}
                    `}>
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddSubCategory
