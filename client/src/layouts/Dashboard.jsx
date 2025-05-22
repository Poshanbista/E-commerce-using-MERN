import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserMenu from '../component/userMenu'

const Dashboard = () => {
    const user = useSelector(state => state.user)
    return (
        <section className='bg-white '>
            <div className='container mx-auto p-3 grid lg:grid-cols-[200px_auto]'>
                <div className='sticky top-0 h-screen overflow-y-auto border-r pr-2 z-10 bg-white'>
                    <UserMenu/>
                </div>

                <div className='bg-white min-h-[70vh]'>
                    <Outlet />
                </div>
            </div>
        </section>
    )
}




export default Dashboard
