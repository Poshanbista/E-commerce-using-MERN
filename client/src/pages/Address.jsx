import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddress from '../component/EditAddress';
import { Axios } from '../utils/axios';
import { summaryApi } from '../common/summary.api';
import toast from 'react-hot-toast';
import { AxiosToastError } from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';


const Address = () => {

  const addressLists = useSelector(state => state.addresses.addressList)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...summaryApi.deleteAddress,
        data: {
          _id: id
        }
      })

      if(response.data.success){
        toast.success("Address remove")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div>
      <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between'>
        <h2 className='font-semibold '>addresses</h2>
      </div>
      <div className='bg-blue-50 p-2 grid gap-5'>
        {
          addressLists.map((address, index) => {
            return (
              <div className={`border rounded p-3 flex gap-4 ${!address.status && 'hidden'}`}>
                <div className='w-full'>
                  <p>{address.state}</p>
                  <p>{address.city}</p>
                  <p>{address.address}</p>
                  <p>{address.mobile}</p>
                </div>
                <div className='grid gap-7'>
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(address)
                  }} className='p-1 bg-green-500 rounded hover:bg-green-700 cursor-pointer'>
                    <MdEdit size={20} />
                  </button>
                  <button onClick={()=>
                    handleDisableAddress(address._id)
                  } className='p-1 bg-red-500 rounded hover:bg-red-800 hover:text-white cursor-pointer'>
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>

      {
        openEdit && (
          <EditAddress data={editData} close={() => setOpenEdit(false)} />
        )
      }
    </div>
  )
}

export default Address
