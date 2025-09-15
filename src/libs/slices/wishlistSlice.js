import { createSlice } from "@reduxjs/toolkit";


let initialState ={
    wishlistItems : []
}

export const wishlistSlice = createSlice({
    name : 'wishlist', 
    initialState, 
    reducers : {
        setWishlistItems : (state, action)=>{
            state.wishlistItems = action.payload;
        }
    }
})


export let {setWishlistItems} = wishlistSlice.actions;

export let wishlistSliceReducer = wishlistSlice.reducer;