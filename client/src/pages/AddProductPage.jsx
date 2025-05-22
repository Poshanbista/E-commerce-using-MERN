import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/uploadImage.js"
import ViewImage from '../component/ViewImage.jsx';
import { MdDelete } from "react-icons/md";
import { Axios } from '../utils/axios.js';
import { summaryApi } from '../common/summary.api.js';
import { AxiosToastError } from '../utils/AxiosToastError.js'
import toast from 'react-hot-toast';

const AddProductPage = () => {
    const [data, setData] = useState({
        name: "",
        image: [],
        ram: "",
        ssd: "",
        processor: "",
        unit: "",
        stock: "",
        price: "",
        discount: "",
        description: "",
    })

    const [viewImageURL, setViewImageURl] = useState("")


    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const response = await uploadImage(file)
        const { data: imageResponse } = response
        const imageUrl = imageResponse?.data?.url

        setData((preve) => {
            return {
                ...preve,
                image: [...preve.image, imageUrl]
            }
        })
    }

    const handleDeleteImage = async (index) => {
        data.image.splice(index, 1),
            setData((preve) => {
                return {
                    ...preve
                }
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...summaryApi.addProduct,
                data: data
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                setData({
                    name: "",
                    image: [],
                    unit: "",
                    ram: "",
                    ssd: "",
                    processor: "",
                    stock: "",
                    price: "",
                    discount: "",
                    description: "",
                })
            }


        } catch (error) {
            AxiosToastError(error)
        }

        console.log("data", data)
    }


    return (
        <section>
            <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between'>
                <h2 className='font-semibold '>Add Product</h2>
            </div>
            <div className='grid p-3'>
                <form className='grid gap-3' onSubmit={handleSubmit}>

                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            id='name'
                            placeholder='enter product name'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='ram'>RAM</label>
                        <input
                            type='text'
                            id='ram'
                            placeholder='enter RAM'
                            name='ram'
                            value={data.ram}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='ssd'>SSD</label>
                        <input
                            type='text'
                            id='ssd'
                            placeholder='enter SSD'
                            name='ssd'
                            value={data.ssd}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='processor'>Processor/Gen</label>
                        <input
                            type='text'
                            id='processor'
                            placeholder='enter product name'
                            name='processor'
                            value={data.processor}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>      

                    <div>
                        <p>Image</p>
                        <div>
                            <label htmlFor='productImage' className=' h-24 border rounded flex justify-center items-center cursor-pointer'>
                                <div className='text-center flex justify-center items-center flex-col'>

                                    <FaCloudUploadAlt size={35} />
                                    <p>upload image</p>

                                </div>
                                <input
                                    type='file'
                                    id='productImage'
                                    className='hidden'
                                    accept='image/*'
                                    onChange={handleUploadImage}
                                />
                            </label>
                            {/** display upload image */}
                            <div className='my-2 flex flex-wrap gap-5'>
                                {
                                    data.image.map((img, index) => {
                                        return (
                                            <div key={img + index} className='h-20 w-20 min-w-20 bg-blue-50 border relative group'>
                                                <img
                                                    src={img}
                                                    alt={img}
                                                    className='w-full h-full object-scale-down cursor-pointer'
                                                    onClick={() => setViewImageURl(img)}
                                                />
                                                <div onClick={() => handleDeleteImage(index)} className='cursor-pointer absolute bottom-1 right-0 p-0 bg-amber-600 hover:bg-green-800 hidden group-hover:block '>
                                                    <MdDelete />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='unit'>Unit</label>
                        <input
                            type='text'
                            id='unit'
                            placeholder='enter unit'
                            name='unit'
                            value={data.unit}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='stock'>No. of Stock</label>
                        <input
                            type='number'
                            id='stock'
                            placeholder='enter product name'
                            name='stock'
                            value={data.stock}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='price'>Price</label>
                        <input
                            type='number'
                            id='price'
                            placeholder='enter price of product'
                            name='price'
                            value={data.price}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='discount'>Discount</label>
                        <input
                            type='number'
                            id='discount'
                            placeholder='enter discount rate'
                            name='discount'
                            value={data.discount}
                            onChange={handleChange}
                            required
                            className='border p-1.5 rounded hover:border-amber-400  bg-blue-100'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='description'>Description</label>
                        <textarea
                            type='text'
                            id='description'
                            placeholder='enter product description'
                            name='description'
                            value={data.description}
                            onChange={handleChange}
                            required
                            multiple
                            rows={3}
                            className='border p-1.5 rounded hover:border-amber-400 resize-none bg-blue-100'
                        />
                    </div>

                    <button className='bg-green-800 hover:bg-yellow-500 py-2 rounded font-semibold cursor-pointer'>
                        Add Product
                    </button>

                </form>
            </div>
            {
                viewImageURL && (
                    <ViewImage url={viewImageURL} close={() => setViewImageURl("")} />
                )
            }
        </section>
    )
}

export default AddProductPage
