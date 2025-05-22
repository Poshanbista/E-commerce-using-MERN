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


export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
    const dispatch = useDispatch()
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

   const  handleLogout = ()=>{
        localStorage.clear()
        dispatch(handleAddItemCart([]))
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
            console.log(error)
        }
    }

    useEffect(() => {
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
            notDiscountTotalPrice

        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
