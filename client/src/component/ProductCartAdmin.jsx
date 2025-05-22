import React, { useState } from 'react'
import EditAdminProduct from './EditAdminProduct'
import { IoMdCloseCircle } from "react-icons/io";
import { AxiosToastError } from '../utils/AxiosToastError';
import { Axios } from '../utils/axios';
import { summaryApi } from '../common/summary.api';
import toast from 'react-hot-toast';
import { DisplayPriceInRs } from '../utils/DisplayPriceInRs';
import { PriceWithDiscount } from '../utils/PriceWithDiscount';

const ProductCartAdmin = ({ data, fetchProductData }) => {
    const [editOpen, setEditOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const handleDeleteCancel = () => {
        setOpenDelete(false)
    }

    const handleDelete = async () => {
        try {
            const response = await Axios({
                ...summaryApi.deleteProduct,
                data: {
                    _id: data._id
                }
            })

            const {data:responseData}  = response

            if(responseData.success){
                toast.success(responseData.message)
                if(fetchProductData){
                    fetchProductData()
                }
                setOpenDelete(false)
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className='w-39 h-65  bg-slate-100 p-2 shadow-2xl grid  max-w-50  rounded'>
            <div>
                <img
                    src={data.image[0]}
                    alt={data.name}
                    className='w-full h-full  object-scale-down scale-100'
                />
            </div>
            <p className='text-base font-semibold line-clamp-2 '>{data.name}  {data.ram}, {data.ssd}, {data.processor}</p>
            <p className='text-slate-500'>{DisplayPriceInRs(PriceWithDiscount(data.price,data.discount))}</p>
            <div className='grid grid-cols-2 gap-4 py-4'>
                <button onClick={() => setEditOpen(true)} className='border px-1 py-1 text-sm rounded border-green-500 bg-green-300 hover:bg-green-500 '>Edit</button>
                <button onClick={() => setOpenDelete(true)} className='border px-1 py-1 text-sm rounded border-red-500 bg-red-400 hover:bg-red-500'>Delete</button>
            </div>

            {
                editOpen && (
                    <EditAdminProduct fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
                )
            }
            {
                openDelete && (
                    <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/90 flex p-4 items-center justify-center '>
                        <div className='bg-white max-w-3xl w-120 rounded p-4 mb-80'>
                            <div className='flex justify-between items-center gap-3'>
                                <h1 className='font-bold'>Permanent Delete</h1>
                                <button onClick={()=>{setOpenDelete(false)}} className='hover:bg-red-400'>
                                    <IoMdCloseCircle size={30} />
                                </button>
                            </div>
                            <p className='my-4'>Are you sure Permanent Delete</p>
                            <div className='w-fit ml-auto flex items-center gap-4'>
                                <button onClick={handleDeleteCancel} className='px-5 py-1 border rounded hover:bg-red-600 hover:text-white'>Cancel</button>
                                <button onClick={handleDelete} className='px-5 py-1 border rounded hover:bg-green-600 hover:text-white'>Confirm</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>

    )
}

export default ProductCartAdmin
