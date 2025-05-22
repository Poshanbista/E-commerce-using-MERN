import React, { useState } from 'react'
import { DisplayPriceInRs } from '../utils/DisplayPriceInRs'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddAddresses from '../component/AddAddresses'
import { useSelector } from 'react-redux'
import { AxiosToastError } from '../utils/AxiosToastError'
import { Axios } from '../utils/axios'
import { summaryApi } from '../common/summary.api'
import toast from 'react-hot-toast'
import {  useNavigate } from 'react-router-dom'


const CheckOutPage = () => {

    const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder} = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.addresses.addressList)
    const [selectedAddress, setSelectedAddress] = useState(0)
    const cartItemList = useSelector(state => state.cartItem.cart)
    const navigate = useNavigate()


    const handleCashOnDelivery = async () => {
        try {
            const response = await Axios({
                ...summaryApi.cashOnDelivery,
                data: {
                    list_items: cartItemList,
                    addressId: addressList[selectedAddress]?._id,
                    SubTotalAmt: totalPrice,
                    totalAmt: totalPrice
                }
            })

            const {data:responseData} = response
            if(responseData.success){
                toast.success(responseData.message)
                if(fetchCartItem){
                    fetchCartItem()
                }
                if(fetchOrder){
                    fetchOrder()
                }
                navigate('/success',{
                    state:{
                        text:"Order"
                    }
                })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }


    return (
        <section className='bg-blue-50'>
            <div className='container mx-auto p-4 flex flex-col lg:flex-row gap-6 justify-between'>
                <div className='w-full lg:flex-2'>
                    {/**address */}
                    <h3 className='text-lg font-semibold'>Choose your address</h3>
                    <div className='bg-white p-2 grid gap-5'>
                        {
                            addressList.map((address, index) => {
                                return (
                                    <label htmlFor={"address" + index} className={!address.status && 'hidden'}>
                                        <div className='border rounded p-3 flex gap-4 hover:bg-blue-100'>
                                            <div>
                                                <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectedAddress(e.target.value)} name='address' />
                                            </div>
                                            <div>
                                                <p>{address.state}</p>
                                                <p>{address.city}</p>
                                                <p>{address.address}</p>
                                                <p>{address.mobile}</p>
                                            </div>
                                        </div>
                                    </label>
                                )
                            })
                        }
                    </div>



                    <div onClick={() => setOpenAddress(true)} className='h-20 bg-blue-100 border border-dashed flex justify-center items-center cursor-pointer'>
                        Add address
                    </div>
                </div>
                <div className='w-full max-w-md lg:flex-1'>
                    <div className='w-full max-w-md bg-white py-4 px-2'>
                        {/** summary */}
                        <h3 className='text-lg font-semibold'>Summary</h3>
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
                            <div className='w-full  flex flex-col py-7'>
                                <button onClick={handleCashOnDelivery} className='bg-green-600 py-2 px-4 hover:bg-green-800 text-white font-semibold'>Cash On Delivery</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                openAddress && (
                    <AddAddresses close={() => setOpenAddress(false)} />
                )
            }
        </section>
    )
}

export default CheckOutPage
