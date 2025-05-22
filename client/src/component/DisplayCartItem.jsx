import React from 'react'
import { IoClose } from 'react-icons/io5';
import { DisplayPriceInRs } from '../utils/DisplayPriceInRs';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useSelector } from 'react-redux';
import AddToCartButton from './AddToCartButton';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { PriceWithDiscount } from '../utils/PriceWithDiscount';
import emptyCart from "../assets/emptyCart.jpg"
import { Link, Navigate, useNavigate } from 'react-router-dom';

const DisplayCartItem = ({ close }) => {

    const { notDiscountTotalPrice, totalPrice,totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state=>state.user)
    const navigate = useNavigate()

       const redirectToCheckoutPage =()=>{
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
       }

    return (
        <section className='bg-neutral-900/60 fixed top-0 bottom-0 right-0 left-0'>
            <div className='bg-white w-full max-w-sm max-h-screen min-h-screen ml-auto'>
                <div className='flex items-center p-2 shadow-md gap-3 justify-between'>
                    <p className='font-semibold'>Cart</p>
                    <button onClick={close} className='cursor-pointer'>
                        <IoClose size={30} />
                    </button>
                </div>
                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4 '>
                    {/**display product */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between py-2 px-3 bg-blue-200 rounded-full'>
                                    <p>Your total saving</p>
                                    <p>{DisplayPriceInRs(notDiscountTotalPrice - totalPrice)}</p>
                                </div>
                                <div className='bg-white rounded p-2 grid gap-2 overflow-auto'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                return (
                                                    <div key={item?._id+"cartItemDisplay"} className='flex gap-5'>
                                                        <div className='w-20 h-20 min-h-20 min-w-20 border rounded'>
                                                            <img
                                                                src={item?.productId?.image[0]}
                                                                className='object-scale-down'
                                                            />
                                                        </div>
                                                        <div className='w-full '>
                                                            <p className='text-xs'>{item?.productId?.name} {item?.productId?.ram} GB RAM {item?.productId?.ssd} GB SSD {item?.productId?.processor}</p>
                                                            <p>{DisplayPriceInRs(PriceWithDiscount(item?.productId?.price, item?.productId?.discount))}</p>                                            </div>
                                                        <div>
                                                            <AddToCartButton data={item?.productId} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>

                                <div className='bg-white p-4'>
                                <h3 className='font-semibold'>Bill details</h3>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p>Items total</p>
                                    <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRs(notDiscountTotalPrice)}</span><span>{DisplayPriceInRs(totalPrice)}</span></p>
                                </div>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p>Total Quantity</p>
                                    <p className='flex items-center gap-2'>{totalQty} item</p>
                                </div>
                                <div className='flex gap-4 justify-between ml-1'>
                                    <p>Delivery Charge</p>
                                    <p className='flex items-center gap-2'>Free</p>
                                </div>
                                <div className='font-semibold flex items-center justify-between gap-4'>
                                    <p >Grand total</p>
                                    <p>{DisplayPriceInRs(totalPrice)}</p>
                                </div>
                            </div>
                            </>
                        ) : (
                            <div className='bg-white flex flex-col justify-center items-center'>
                                <img
                                    src={emptyCart}
                                    className='w-full h-full object-scale-down'
                                />
                                <Link onClick={close} to={"/homepage"} className='block bg-green-600 px-1 py-1 text-white'>Shop now</Link>
                            </div>
                        )
                    }

                </div>

                {
                    cartItem[0] && (
                        <div className='p-2'>
                            <div className='bg-green-600 text-neutral-100 p-2 static bottom-3 rounded flex items-center py-3 justify-between'>
                                <div>
                                    {DisplayPriceInRs(totalPrice)}
                                </div>
                                <button onClick={redirectToCheckoutPage} className='flex items-center gap-2'>
                                    Proceed
                                    <FaArrowAltCircleRight size={15} />
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default DisplayCartItem
