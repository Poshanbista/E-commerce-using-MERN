import React, { useEffect, useState } from 'react'
import logo from "../assets/logo.jpg"
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { VscTriangleDown } from "react-icons/vsc";
import { VscTriangleUp } from "react-icons/vsc";
import UserMenu from './userMenu';
import { DisplayPriceInRs } from '../utils/DisplayPriceInRs';
import DisplayCartItem from './DisplayCartItem';
import {useGlobalContext} from '../provider/GlobalProvider'
const Header = () => {

  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  // const [totalPrice, setTotalPrice] = useState(0)
  // const [totalQty, setTotalQty] = useState(0)
  const [openCartSection, setOpenCartSection] = useState(false)
  const {totalPrice,totalQty} = useGlobalContext() 


  const redirectToLoginPage = () => {
    navigate("/login")
  }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

  // // total item and total price
  // useEffect(() => {
  //   const qty = cartItem.reduce((preve, curr) => {
  //     return preve + curr.quantity
  //   }, 0)
  //   setTotalQty(qty)

  //   const tprice = cartItem.reduce((preve, curr) => {
  //     const priceAfterDiscount = PriceWithDiscount(curr?.productId?.price,
  //       curr?.productId?.discount)

  //     return preve + (priceAfterDiscount * curr.quantity)
  //   }, 0)
  //   setTotalPrice(tprice)


  // }, [cartItem])

  return (
    <header className='h-20 shadow-md sticky z-40 top-0 bg-white'>
      <div className='container mx-auto flex items-center h-full px-2 justify-between '>
        {/** logo */}
        <div className='h-full'>
          <div className='h-full '>
            <img
              src={logo}
              width={70}
              height={50}
              alt='logo'
            />
          </div>
        </div>

        {/**Search */}
        <div>
          <Search />
        </div>

        {/** login and my cart */}
        <div className=''>
          <div className='flex items-center gap-9 '>
            {
              user?._id ? (
                <div className='relative'>
                  <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex items-center select-none gap-2 cursor-pointer'>
                    <p>Account</p>
                    {
                      openUserMenu ? (
                        <VscTriangleUp size={15} />
                      ) : (
                        <VscTriangleDown size={15} />
                      )
                    }
                  </div>
                  {
                    openUserMenu && (
                      <div className='absolute right-0 top-10'>
                        <div className='bg-white rounded p-4 min-w-50 lg:shadow-lg'>
                          <UserMenu close={handleCloseUserMenu} />
                        </div>
                      </div>
                    )
                  }

                </div>
              ) : (
                <button onClick={redirectToLoginPage} className='cursor-pointer'>Login</button>
              )
            }
            <button onClick={()=>setOpenCartSection(true)} className='flex items-center hover:bg-green-700 bg-green-900 gap-2 px-3 py-2 rounded text-white'>
              <div /*className='animate-bounce'*/>
                <FaShoppingCart size={30} />
              </div>

              <div className='font-semibold'>
                {
                  cartItem[0] ? (
                    <div>
                      <p>{totalQty} items</p>
                      <p>{DisplayPriceInRs(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My cart</p>
                  )
                }
              </div>

            </button>
          </div>
        </div>
      </div >
      {
        openCartSection &&(
          <DisplayCartItem close={()=>setOpenCartSection(false)}/>
        )
      }
    </header >
  )
}

export default Header
