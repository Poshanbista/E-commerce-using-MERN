import React, { useEffect, useState } from 'react'
import ProductCartUser from '../component/ProductCartUser'
import { AxiosToastError } from '../utils/AxiosToastError'
import { Axios } from '../utils/axios'
import { summaryApi } from '../common/summary.api'


const Home = () => {
  const [productDataHome, setProductDataHome] = useState([])
  const [userId, setUserId] = useState()
  const [recommendedProducts, setRecommendedProducts] = useState([]);


  const fetchProductDataHome = async () => {
    try {
      const response = await Axios({
        ...summaryApi.home
      })

      const { data: responseData } = response
      if (responseData.success) {
        console.log("product page home: ", responseData)
        setProductDataHome(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error);
    }
  }

  const fetchRecommended = async (uid) => {
    try {
      const response = await Axios({
        ...summaryApi.recommended,
        data: { userId: uid },
      })

      const { data: responseData } = response
      if (responseData.success) {
        setRecommendedProducts(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleProductClick = async (productId, userId) => {
    console.log("UserId:", userId);
    console.log("ProductId:", productId);
    try {
      const response = await Axios({
        ...summaryApi.recent_view,
        data: { productId, userId },
        
      })
      console.log("product view stored successfully")

      fetchRecommended(userId);

    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchProductDataHome()
    const storedUserId = localStorage.getItem('userId')
     
    if (storedUserId) {
      setUserId(storedUserId)
      fetchRecommended(storedUserId)
    }
  }, [])

  return (
    <section>
      <div className='container mx-auto my-4 px-4'>
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded animate-pulse`}>
          <h2 className='text-center'>Welcome to Smart Bazaar</h2>
        </div>
      </div>

      {
        recommendedProducts.length > 0 && (
          <div className='p-4 bg-yellow-50'>
            <h2 className='text-lg font-semibold mb-2'>Recommended for you</h2>
            <div className='grid m-0 grid-cols-5 gap-3'>
              {
                recommendedProducts.map((pro) => (
                  <ProductCartUser
                    key={pro._id}
                    data={pro}
                    onClick={() => handleProductClick(pro._id, userId)}
                  />
                ))
              }
            </div>
          </div>
        )
      }
      
      <div className='p-4 bg-blue-50'>
        <h2 className='text-lg font-semibold mb-2'>All Products</h2>
        <div className='grid m-0 grid-cols-5 gap-3'>
          {
            productDataHome.map((pro, index) => {
              return (
                <ProductCartUser
                  key={pro._id}
                  data={pro}
                  onClick={() => handleProductClick(pro._id, userId)}
                />
              )
            })
          }
        </div>
      </div>

      
    </section>
  )
}

export default Home
