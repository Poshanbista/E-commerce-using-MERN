import React, { useState } from 'react'
import logo from "../assets/logo.jpg"
import Search from './Search'
import { useNavigate } from 'react-router-dom'
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import UserMenu from './userMenu';
import { DisplayPriceInRs } from '../utils/DisplayPriceInRs';
import DisplayCartItem from './DisplayCartItem';
import { useGlobalContext } from '../provider/GlobalProvider'

const Header = () => {

  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const [openCartSection, setOpenCartSection] = useState(false)
  const { totalPrice, totalQty } = useGlobalContext()

  const redirectToLoginPage = () => {
    navigate("/login")
  }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

  // Show cart only if user is logged in AND role is "USER"
  const showCartButton = user?._id && user?.role === "USER";

  return (
    <header className='h-20 shadow-md sticky z-40 top-0 bg-white'>
      <div className='container mx-auto flex items-center h-full px-2 justify-between'>
        {/* Logo */}
        <div className='h-full'>
          <div className='h-full'>
            <img
              src={logo}
              width={70}
              height={50}
              alt='logo'
              className='cursor-pointer'
              onClick={() => {
                if (user?._id) {
                  navigate("/homepage")
                } else {
                  navigate("/")
                }
              }}
            />
          </div>
        </div>

        {/* Search */}
        <div>
          <Search />
        </div>

        {/* Login and My Cart */}
        <div>
          <div className='flex items-center gap-9'>
            {
              user?._id ? (
                <div className='relative'>
                  <div
                    onClick={() => setOpenUserMenu(prev => !prev)}
                    className='flex items-center select-none gap-2 cursor-pointer'
                  >
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
                <button
                  onClick={redirectToLoginPage}
                  className='cursor-pointer'
                >
                  Login
                </button>
              )
            }

            {/* Show cart only if role is USER */}
            {showCartButton && (
              <button
                onClick={() => setOpenCartSection(true)}
                className='flex items-center hover:bg-green-700 bg-green-900 gap-2 px-3 py-2 rounded text-white cursor-pointer'
              >
                <div>
                  <FaShoppingCart size={30} />
                </div>

                <div className='font-semibold'>
                  {
                    cartItem.length > 0 ? (
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
            )}
          </div>
        </div>
      </div>

      {
        openCartSection && (
          <DisplayCartItem close={() => setOpenCartSection(false)} />
        )
      }
    </header>
  )
}

export default Header
