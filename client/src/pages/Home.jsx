import React, { useEffect, useState } from 'react'
import ProductCartUser from '../component/ProductCartUser'
import { AxiosToastError } from '../utils/AxiosToastError'
import { Axios } from '../utils/axios'
import { summaryApi } from '../common/summary.api'


const Home = () => {
  const [productDataHome, setProductDataHome] = useState([])

  const fetchProductDataHome = async () => {
    try {
      const response = await Axios({
        ...summaryApi.home
      })

      const { data: responseData } = response
      if (responseData.success) {
        setProductDataHome(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error);
    }
  }
  useEffect(() => {
    fetchProductDataHome()
  }, [])



  return (
    <section>
      <div className='container mx-auto my-4 px-4'>
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded animate-pulse`}>
          <img
          />

        </div>
      </div>
      <div className='p-4 bg-blue-50'>
        <div className='grid m-0 grid-cols-5 gap-3'>
          {
            productDataHome.map((pro, index) => {
              return (
                <ProductCartUser data={pro} />
              )
            })
          }
        </div>
      </div>
    </section>
  )
}

export default Home
