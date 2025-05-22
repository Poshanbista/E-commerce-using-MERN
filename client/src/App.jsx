import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './component/Header'
import Footer from './component/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { fetchUserDetails } from './utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from './redux/userSlice'
import { setCategory } from './redux/productSlice'
import { Axios } from './utils/axios'
import { summaryApi } from './common/summary.api'
import { AxiosToastError } from './utils/AxiosToastError'
import { handleAddItemCart } from './redux/cartProduct'
import GlobalProvider from './provider/GlobalProvider'

function App() {

  const dispatch = useDispatch()

  const fetchUser = async()=>{
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  // //fetch category from categorypage
  // const fetchCategory = async () => {
  //   try {
  //     const response = await Axios({
  //       ...summaryApi.get_category
  //     })
  //     const { data: responseData } = response

  //     if (responseData.success) {
  //       // console.log("responseData",responseData.data)
        
  //       dispatch(setCategory(responseData.data))

  //       // setCategoryData(responseData.data)
  //     }
  //   }
  //   catch (error) {
     
  //   }
  // }


  // // fetch sub Category
  // const fetchSubCategory = async() => {
  //     try {
  //       const response = await Axios({
  //         ...summaryApi.get_subCategory,
  //       })
  //       const { data: responseData } = response
  
  //       if (responseData.success){
  //         setSubCategoryData(responseData.data)
  //       }
  
  //     }catch (error) {
  //       AxiosToastError(error)
  //     }
  //   }

  // fetch cartItem 

  // const fetchCartItem = async()=>{
  //   try {
  //     const response = await Axios({
  //       ...summaryApi.getCartItem
  //     })

  //     const {data:responseData} = response

  //     if(responseData.success){
  //       dispatch(handleAddItemCart(responseData.data))
  //       console.log(responseData)
  //     }

  //   } catch (error) {
  //     AxiosToastError(error)
  //   }
  // }

  useEffect(()=>{
    fetchUser()
    // fetchCategory()
    // fetchSubCategory()
    // fetchCartItem()
  },[])

  return (
    <GlobalProvider>
      <Header />
      <main className='min-h-[70vh]'>
        <Outlet />
      </main>
      <Footer/>
      <Toaster/>
    </GlobalProvider>
  )
}

export default App;
