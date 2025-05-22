import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider';
import { summaryApi } from '../common/summary.api';
import { Axios } from '../utils/axios';
import toast from 'react-hot-toast';
import { AxiosToastError } from '../utils/AxiosToastError';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {

    const { fetchCartItem, updateCartqty, deleteCartItem } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemDetails] = useState()

    // handle Cart item
    const handleCartItem = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const response = await Axios({
                ...summaryApi.addCart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }


    // check this item is cart or not
    useEffect(() => {
        const checkItem = cartItem.find(item => item.productId._id === data._id)
        setIsAvailableCart(checkItem)

        const product = cartItem.find(item => item.productId._id === data._id)
        if (product) {
            setQty(product.quantity)
            setCartItemDetails(product)
        }

    }, [data, cartItem])

    const increaseQty = (e) => {
        e.preventDefault()
        e.stopPropagation()

        updateCartqty(cartItemDetails?._id, qty + 1)
        toast.success("Item added")

    }

    const decreaseQty = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
            toast.success("Item removed")
        } else {
            updateCartqty(cartItemDetails?._id, qty - 1)
            toast.success("Item decreased")
        }
    }



    return (
        <div>
            {
                isAvailableCart ? (
                    <div className='flex items-center gap-2 py-3'>
                        <button onClick={decreaseQty} className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded flex items-center justify-center text-lg">
                            <FaMinus />
                        </button>

                        <p className='text-black font-medium text-lg'>{qty}</p>

                        <button onClick={increaseQty} className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded flex items-center justify-center text-lg">
                            <FaPlus />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleCartItem} className='my-4 px-3 py-1 bg-green-600 hover:bg-green-800 hover:text-white rounded'>
                        Add Cart
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
