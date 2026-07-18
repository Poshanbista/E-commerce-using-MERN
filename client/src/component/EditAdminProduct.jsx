import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/uploadImage.js"
import ViewImage from '../component/ViewImage.jsx';
import { MdDelete } from "react-icons/md";
import { Axios } from '../utils/axios.js';
import { summaryApi } from '../common/summary.api.js';
import { AxiosToastError } from '../utils/AxiosToastError.js'
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { categoryFields, categoryFieldNames } from '../utils/categoryFields.js';

const EditAdminProduct = ({ close, data: propsData, fetchProductData }) => {
  const allCategoryFieldNames = [
    "ram", "ssd", "processor", "screenSize", "battery",
    "dpi", "connectivity", "brand", "sensorType",
    "resolution", "refreshRate", "panelType", "responseTime",
    "layoutSize", "switchType", "backlight",
    "driverSize", "frequencyResponse", "noiseCancellation", "mic",
  ]

  const baseData = {
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    category: propsData.category?._id || propsData.category || "",
  }

  allCategoryFieldNames.forEach(f => {
    baseData[f] = propsData[f] || ""
  })

  const [data, setData] = useState(baseData)

  const [categoryList, setCategoryList] = useState([])
  const [categoryFieldsData, setCategoryFieldsData] = useState({})
  const [selectedCategoryName, setSelectedCategoryName] = useState("")
  const [viewImageURL, setViewImageURl] = useState("")

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
      fields.forEach(f => { initial[f.name] = data[f.name] || "" })
      setCategoryFieldsData(initial)
    }
  }, [data.category, categoryList])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((preve) => ({
      ...preve,
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

    const response = await uploadImage(file)
    const { data: imageResponse } = response
    const imageUrl = imageResponse?.data?.url

    setData((preve) => ({
      ...preve,
      image: [...preve.image, imageUrl]
    }))
  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => ({
      ...preve
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...data,
        ...categoryFieldsData,
      }

      const response = await Axios({
        ...summaryApi.updateProduct,
        data: payload
      })

      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        if (close) {
          close()
        }
        fetchProductData()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const currentFields = selectedCategoryName ? (categoryFields[selectedCategoryName] || []) : []

  return (
    <section className='fixed inset-0 z-50 bg-neutral-900/80 bg-opacity-70 flex items-center justify-center'>
      <div className='bg-white max-w-3xl w-full rounded p-4 overflow-y-auto h-full'>
        <section className=''>
          <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between'>
            <h2 className='font-semibold'>Edit Product</h2>
            <div onClick={close} className='cursor-pointer'>
              <IoClose size={30} />
            </div>
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
                  className='border p-1.5 rounded hover:border-amber-400 bg-blue-100'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='category'>Category</label>
                <select
                  id='category'
                  name='category'
                  value={data.category}
                  onChange={handleChange}
                  required
                  className='border p-1.5 rounded hover:border-amber-400 bg-blue-100'
                >
                  <option value="">Select category</option>
                  {categoryList.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {currentFields.length > 0 && (
                <div className='grid gap-2 p-2 bg-blue-50 rounded border border-blue-200'>
                  <p className='text-xs font-semibold text-blue-700 uppercase tracking-wide'>{selectedCategoryName} Specifications</p>
                  {currentFields.map(field => (
                    <div key={field.name} className='grid gap-1'>
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        type='text'
                        id={field.name}
                        placeholder={field.placeholder}
                        name={field.name}
                        value={categoryFieldsData[field.name] || ""}
                        onChange={handleCategoryFieldChange}
                        required
                        className='border p-1.5 rounded hover:border-amber-400 bg-white'
                      />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <p>Image</p>
                <div>
                  <label htmlFor='productImage' className='h-24 border rounded flex justify-center items-center cursor-pointer'>
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
                            <div onClick={() => handleDeleteImage(index)} className='cursor-pointer absolute bottom-1 right-0 p-0 bg-amber-600 hover:bg-green-800 hidden group-hover:block'>
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
                <label htmlFor='stock'>No. of Stock</label>
                <input
                  type='number'
                  id='stock'
                  placeholder='enter stock quantity'
                  name='stock'
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className='border p-1.5 rounded hover:border-amber-400 bg-blue-100'
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
                  className='border p-1.5 rounded hover:border-amber-400 bg-blue-100'
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
                  className='border p-1.5 rounded hover:border-amber-400 bg-blue-100'
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
                Update
              </button>

            </form>
          </div>
          {
            viewImageURL && (
              <ViewImage url={viewImageURL} close={() => setViewImageURl("")} />
            )
          }
        </section>
      </div>
    </section>
  )
}

export default EditAdminProduct
