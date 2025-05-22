import React, { useEffect, useState } from 'react'
import AddCategory from '../component/AddCategory'
import { Axios } from '../utils/axios'
import { summaryApi } from '../common/summary.api'
import EditCategory from '../component/EditCategory'
import { AxiosToastError } from '../utils/AxiosToastError'
import ConfirmBox from '../component/ConfirmBox'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'


const Category = () => {

  const [openAddCategory, setOpenAddCategory] = useState(false)
  const [categoryData, setCategoryData] = useState([])

  const [openEdit, setOpenEdit] = useState(false)

  const [editData, setEditData] = useState({
    name: ""
  })

  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState({
    _id: ""
  })


   const fetchCategory = async () => {
      try {
        const response = await Axios({
          ...summaryApi.get_category
        })
        const { data: responseData } = response
  
        if (responseData.success) {
          setCategoryData(responseData.data)
        }
      }
      catch (error) {
       
      }
    }

  useEffect(()=>{
    fetchCategory()
  },[])  


  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...summaryApi.delete_category,
        data: deleteCategory
      })

      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        fetchCategory()
        setOpenConfirmBoxDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section>
      <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between'>
        <h2 className='font-semibold '>Category</h2>
        <button onClick={() =>
          setOpenAddCategory(true)
        } className=' text-sm border border-amber-700 rounded p-0.5 hover:bg-amber-400 hover:text-red-500
        '>Add Category</button>
      </div>

      <div className="p-4" key={Category._id}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left w-[75%]">Category Name</th>
              <th className="border border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((category, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{category.name}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(category)
                  }}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => {
                    setOpenConfirmBoxDelete(true)
                    setDeleteCategory(category)
                  }}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {
        openAddCategory && (
          <AddCategory fetchData={fetchCategory} close={() => setOpenAddCategory(false)} />
        )
      }

      {
        openEdit && (
          <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
        )
      }
      {
        openConfirmBoxDelete && (
          <ConfirmBox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory} />
        )
      }

    </section>
  )
}

export default Category
