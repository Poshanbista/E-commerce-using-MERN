import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    mobile: "",
    last_login_data: "",
    status: "",
    address_details:[],
    shopping_cart:[],
    orderHistory:[],
    role:""
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
            state._id = action.payload?._id
            state.name = action.payload?.name
            state.email = action.payload?.email
            state.avatar = action.payload?.avatar
            state.mobile = action.payload?.mobile
            state.last_login_data = action.payload?.last_login_data
            state.status = action.payload?.status
            state.address_details = action.payload?.address_details
            state.shopping_cart = action.payload?.shopping_cart
            state.orderHistory = action.payload?.orderHistory
            state.role = action.payload?.role
        },
        // logout : (state, action)=>{
        //     state._id = ""
        //     state.name = ""
        //     state.email = ""
        //     state.avatar = ""
        //     state.mobile = ""
        //     state.last_login_data = ""
        //     state.status = ""
        //     state.address_details = []
        //     state.shopping_cart = []
        //     state.orderHistory = []
        //     state.role = ""
        // }
        logout: () => initialValue 
    }
})

export const { setUserDetails, logout } = userSlice.actions

export default userSlice.reducer
