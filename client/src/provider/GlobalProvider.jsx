import { createContext, useContext, useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { Axios } from "../utils/axios"
import { summaryApi } from "../common/summary.api"
import { useDispatch } from "react-redux"
import { handleAddItemCart } from "../redux/cartProduct"
import { AxiosToastError } from "../utils/AxiosToastError"
import { PriceWithDiscount } from '../utils/PriceWithDiscount';
import { handleAddAddress } from "../redux/addressSlice";
import { setOrder } from "../redux/orderSlice";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";


export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const user = useSelector(state => state?.user)

    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...summaryApi.getCartItem
            })

            const { data: responseData } = response

            if (responseData.success) {
                dispatch(handleAddItemCart(responseData.data))

            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const updateCartqty = async (id, qty) => {
        try {
            const response = await Axios({
                ...summaryApi.updateCartQty,
                data: {
                    _id: id,
                    quantity: qty
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                // toast.success(responseData.message)
                fetchCartItem()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const deleteCartItem = async (cartId) => {
        try {
            const response = await Axios({
                ...summaryApi.deleteCartItem,
                data: {
                    _id: cartId
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                // toast.success(responseData.message)
                fetchCartItem()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    // total item and total price
    useEffect(() => {
        const qty = cartItem.reduce((preve, curr) => {
            return preve + curr.quantity
        }, 0)
        setTotalQty(qty)

        const tprice = cartItem.reduce((preve, curr) => {
            const priceAfterDiscount = PriceWithDiscount(curr?.productId?.price,
                curr?.productId?.discount)

            return preve + (priceAfterDiscount * curr.quantity)
        }, 0)
        setTotalPrice(tprice)

        const notDiscountTotalPrice = cartItem.reduce((preve, curr) => {
            return preve + (curr?.productId?.price * curr.quantity)
        }, 0)

        setNotDiscountTotalPrice(notDiscountTotalPrice)

    }, [cartItem])

    const handleLogout = async () => {
        try {
            await Axios.get('/logout'); // ✅ ADDED logout API
        } catch (error) {
            AxiosToastError(error) // ✅ ADDED to catch logout error
        }

        localStorage.clear()
        dispatch(logout()) // ✅ UPDATED to reset user state
        dispatch(handleAddItemCart([]))
        navigate('/login') // ✅ ADDED navigation after logout
    }


    const fetchAddress =async() =>{
        try {
            const response = await Axios({
                ...summaryApi.getAddress
            })

            const {data:responseData} = response
            if(responseData.success){
                dispatch(handleAddAddress(responseData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const fetchOrder = async()=>{
        try {
            const response = await Axios({
                ...summaryApi.getOrderList
            })

            const {data:responseData} = response

            if(responseData.success){
                dispatch(setOrder(responseData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
         if (!user?._id) return;

        fetchCartItem();
        fetchAddress();
        fetchOrder();
    }, [user])

    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartqty,
            deleteCartItem,
            fetchAddress,
            fetchOrder,
            totalQty,
            totalPrice,
            notDiscountTotalPrice,
            handleLogout
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
