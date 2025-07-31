import { useEffect, useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './component/Header'
import Footer from './component/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { fetchUserDetails } from './utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from './redux/userSlice'
import GlobalProvider from './provider/GlobalProvider'

function App() {

  const dispatch = useDispatch()

  const fetchUser = async()=>{
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  useEffect(()=>{
    fetchUser()
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
