import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/uploadImage.js"
import ViewImage from '../component/ViewImage.jsx';
import { Axios } from '../utils/axios.js';
import { summaryApi } from '../common/summary.api.js';
import { AxiosToastError } from '../utils/AxiosToastError.js'
import toast from 'react-hot-toast';
import { FiMinus } from 'react-icons/fi';
import { categoryFields } from '../utils/categoryFields.js';

const AddProductPage = () => {
    const [data, setData] = useState({
        name: "",
        image: [],
        category: "",
        stock: "",
        price: "",
        discount: "",
        description: "",
    })

    const [categoryFieldsData, setCategoryFieldsData] = useState({})
    const [categoryList, setCategoryList] = useState([])
    const [selectedCategoryName, setSelectedCategoryName] = useState("")

    const [viewImageURL, setViewImageURl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await Axios({ ...summaryApi.get_category })
                const { data: resData } = response
                if (resData.success) {
                    setCategoryList(resData.data)
                }
            } catch (error) {
                AxiosToastError(error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        if (!data.category) {
            setSelectedCategoryName("")
            setCategoryFieldsData({})
            return
        }
        const selected = categoryList.find(cat => cat._id === data.category)
        if (selected) {
            setSelectedCategoryName(selected.name)
            const fields = categoryFields[selected.name] || []
            const initial = {}
            fields.forEach(f => { initial[f.name] = "" })
            setCategoryFieldsData(initial)
        }
    }, [data.category, categoryList])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCategoryFieldChange = (e) => {
        const { name, value } = e.target
        setCategoryFieldsData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const response = await uploadImage(file)
            const { data: imageResponse } = response
            const imageUrl = imageResponse?.data?.url

            setData(prev => ({
                ...prev,
                image: [...prev.image, imageUrl]
            }))
            toast.success("Image uploaded successfully!")
        } catch (error) {
            toast.error("Failed to upload image")
        }
    }

    const handleDeleteImage = async (index) => {
        const newImages = [...data.image]
        newImages.splice(index, 1)
        setData(prev => ({
            ...prev,
            image: newImages
        }))
        toast.success("Image removed")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload = {
                ...data,
                ...categoryFieldsData,
            }

            const response = await Axios({
                ...summaryApi.addProduct,
                data: payload
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                setData({
                    name: "",
                    image: [],
                    category: "",
                    stock: "",
                    price: "",
                    discount: "",
                    description: "",
                })
                setCategoryFieldsData({})
                setSelectedCategoryName("")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const currentFields = selectedCategoryName ? (categoryFields[selectedCategoryName] || []) : []

    return (
        <section className="max-w-4xl mx-auto p-4 md:p-6">
            <div className='p-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 mb-6 shadow-lg'>
                <h2 className='font-bold text-2xl text-white'>Add New Product</h2>
                <p className='text-blue-100'>Fill in the details below to add a new product</p>
            </div>

            <div className='bg-white rounded-xl shadow-md overflow-hidden p-6'>
                <form className='grid grid-cols-1 md:grid-cols-2 gap-6' onSubmit={handleSubmit}>
                    {/* Product Details Column */}
                    <div className='space-y-4 md:col-span-1'>
                        <div className='space-y-1'>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Product Name</label>
                            <input
                                type='text'
                                id='name'
                                placeholder='MacBook Pro 14"'
                                name='name'
                                value={data.name}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                            />
                        </div>

                        <div className='space-y-1'>
                            <label htmlFor='category' className='block text-sm font-medium text-gray-700'>Category</label>
                            <select
                                id='category'
                                name='category'
                                value={data.category}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white'
                            >
                                <option value="">Select category</option>
                                {categoryList.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {currentFields.length > 0 && (
                            <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                                <p className='text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wide'>{selectedCategoryName} Specifications</p>
                                <div className='space-y-3'>
                                    {currentFields.map(field => (
                                        <div key={field.name} className='space-y-1'>
                                            <label htmlFor={field.name} className='block text-sm font-medium text-gray-700'>{field.label}</label>
                                            <input
                                                type='text'
                                                id={field.name}
                                                placeholder={field.placeholder}
                                                name={field.name}
                                                value={categoryFieldsData[field.name] || ""}
                                                onChange={handleCategoryFieldChange}
                                                required
                                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white'
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!data.category && (
                            <div className='p-3 bg-gray-50 rounded-lg border border-gray-200 text-center'>
                                <p className='text-sm text-gray-500'>Select a category to see relevant fields</p>
                            </div>
                        )}

                        <div className='space-y-1'>
                            <label htmlFor='description' className='block text-sm font-medium text-gray-700'>Description</label>
                            <textarea
                                id='description'
                                placeholder='Detailed product description...'
                                name='description'
                                value={data.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                            />
                        </div>
                    </div>

                    {/* Inventory & Images Column */}
                    <div className='space-y-4 md:col-span-1'>
                        <div className='space-y-1'>
                            <label className='block text-sm font-medium text-gray-700'>Product Images</label>
                            <label htmlFor='productImage' className='h-32 border-2 border-dashed border-gray-300 rounded-xl flex justify-center items-center cursor-pointer hover:border-blue-500 transition group'>
                                <div className='text-center flex flex-col items-center'>
                                    <FaCloudUploadAlt size={28} className='text-gray-400 group-hover:text-blue-500 transition' />
                                    <p className='mt-2 text-sm text-gray-500'>Click to upload images</p>
                                    <p className='text-xs text-gray-400'>PNG, JPG, JPEG (max 5MB)</p>
                                </div>
                                <input
                                    type='file'
                                    id='productImage'
                                    className='hidden'
                                    accept='image/*'
                                    required
                                    onChange={handleUploadImage}
                                />
                            </label>

                            {data.image.length > 0 && (
                                <div className='mt-3'>
                                    <p className='text-sm font-medium text-gray-700 mb-2'>Uploaded Images ({data.image.length})</p>
                                    <div className='flex flex-wrap gap-3'>
                                        {data.image.map((img, index) => (
                                            <div key={img + index} className='relative group'>
                                                <div className='h-20 w-20 rounded-lg overflow-hidden border border-gray-200'>
                                                    <img
                                                        src={img}
                                                        alt={`Product ${index + 1}`}
                                                        className='w-full h-full object-cover cursor-pointer'
                                                        onClick={() => setViewImageURl(img)}
                                                    />
                                                </div>
                                                <button
                                                    type='button'
                                                    onClick={() => handleDeleteImage(index)}
                                                    className='absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600'
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                                <label htmlFor='stock' className='block text-sm font-medium text-gray-700'>Stock Quantity</label>
                                <input
                                    type='number'
                                    id='stock'
                                    placeholder='100'
                                    name='stock'
                                    value={data.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                                <label htmlFor='price' className='block text-sm font-medium text-gray-700'>Price (RS:)</label>
                                <div className='relative'>
                                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>RS</span>
                                    <input
                                        type='number'
                                        id='price'
                                        placeholder='1999.00'
                                        name='price'
                                        value={data.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className='w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                                    />
                                </div>
                            </div>

                            <div className='space-y-1'>
                                <label htmlFor='discount' className='block text-sm font-medium text-gray-700'>Discount (%)</label>
                                <div className='relative'>
                                    <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>%</span>
                                    <input
                                        type='number'
                                        id='discount'
                                        placeholder='10'
                                        name='discount'
                                        value={data.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className='w-full pr-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='md:col-span-2 pt-4'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                        >
                            {isSubmitting ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>

            {viewImageURL && (
                <ViewImage url={viewImageURL} close={() => setViewImageURl("")} />
            )}
        </section>
    )
}

export default AddProductPage
