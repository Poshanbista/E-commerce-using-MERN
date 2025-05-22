import React, { useEffect, useState } from 'react'
import { summaryApi } from '../common/summary.api.js'
import { Axios } from '../utils/axios.js'
import { AxiosToastError } from '../utils/AxiosToastError.js'
import ProductCartAdmin from '../component/ProductCartAdmin.jsx'


const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPageCount, setTotalPageCount] = useState(1)


  const fetchProductData = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getProduct,
        data: {
          page: page,
          limit: 10
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        // console.log("product page: ", responseData)
        setProductData(responseData.data)
        setTotalPageCount(responseData.totalNoPage)
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  const handleNextButton = () => {
    if (page !== totalPageCount) {
      setPage(preve => preve + 1)
    }
  }
  const handlePreviousButton = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }


  return (
    <section>
      <div className='p-2 shadow-md top-0 bg-white flex items-center justify-between gap-4'>
        <h2 className='font-semibold '>Product</h2>
      </div>

      <div className='p-4 bg-blue-50'>
        <div className='grid grid-cols-5 gap-1'>
          {
            productData.map((p, index) => {
              return (
                <ProductCartAdmin data={p} fetchProductData={fetchProductData} />
              )
            })
          }
        </div>
        <div className='flex justify-between my-2'>
          <button onClick={handlePreviousButton} className='border border-amber-300 px-4 py-1 hover:bg-amber-300'>Previous</button>
          <button>{page}/{totalPageCount}</button>
          <button onClick={handleNextButton} className='border border-amber-300 px-4 py-1 hover:bg-amber-300'>Next</button>
        </div>
      </div>
    </section>

  )
}

export default ProductAdmin
