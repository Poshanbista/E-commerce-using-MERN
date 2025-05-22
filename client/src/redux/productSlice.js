import { createSlice } from "@reduxjs/toolkit"

const initialValue = {
    Category: [],
    subCategory: [],
    product: []
}

const productSlice = createSlice({
    name:'product',
    initialState : initialValue,
    reducers:{
        setCategory :(state,action)=>{
            state.Category = [...action.payload]
        }
    }
})

export const {setCategory} = productSlice.actions

export default productSlice.reducer