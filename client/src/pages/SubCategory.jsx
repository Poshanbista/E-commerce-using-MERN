import React, { useEffect, useState } from 'react'
import AddSubCategory from '../component/AddSubCategory'
import { AxiosToastError } from '../utils/AxiosToastError'
import { Axios } from '../utils/axios'
import { summaryApi } from '../common/summary.api'
import ConfirmBox from '../component/ConfirmBox'
import toast from 'react-hot-toast'

const SubCategory = () => {

  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [subCategoryData, setSubCategoryData] = useState([])
  const [categoryData, setCategoryData] = useState([])

  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })


  // fetch sub category
  const fetchSubCategory = async () => {
    try { console.log("Fetching updated sub-categories...");
      const response = await Axios({
        ...summaryApi.get_subCategory,
      })
      const { data: responseData } = response

      if (responseData.success) {
        setSubCategoryData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...summaryApi.delete_subCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenConfirmBoxDelete(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // fetch category
  const fetchCategory = async () => {
    try {
      const response = await Axios({
        ...summaryApi.get_category,
      })
      const { data: responseData } = response

      if (responseData.success) {
        setCategoryData(responseData.data)
      }
    }
    catch (error) {

    }
  }

  useEffect(() => {
    fetchSubCategory()
    fetchCategory()
  }, [])


  return (
    <section>
      <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between'>
        <h2 className='font-semibold '>Sub-Category</h2>
        <button onClick={() =>
          setOpenAddSubCategory(true)
        } className=' text-sm border border-amber-700 rounded p-0.5 hover:bg-amber-400 hover:text-red-500'
        >Add sub-Category</button>
      </div>


      <div className="p-4" key={SubCategory._id}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left w-[50%]">Sub-Category Name</th>
              <th className="border border-gray-300 p-2 text-left w-[30%]">Category Name</th>
              <th className="border border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategoryData.map((subCategory, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border font-semibold border-gray-300 p-2">{subCategory.name}</td>
                <td className='border font-semibold border-gray-300 p-2'>
                  {subCategory.category?.[0]?.name || 'N/A'}</td>
                <td className="border border-gray-300 p-2 text-center">

                  {/* <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(subCategory)
                  }}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                    Edit
                  </button> */}

                  <button onClick={() => {
                    setOpenConfirmBoxDelete(true)
                    setDeleteSubCategory(subCategory)
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
        openAddSubCategory && (
          <AddSubCategory close={() => setOpenAddSubCategory(false)} fetchData={fetchSubCategory} />
        )
      }

      {/** edit button */}
      {/* {
        openEdit && (
          <EditSubCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
        )
      } */}

      {/**delete button */}
      {
        openConfirmBoxDelete && (
          <ConfirmBox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDeleteSubCategory} />
        )
      }
    </section>
  )
}

export default SubCategory
