import { createSlice } from "@reduxjs/toolkit";








const initialState = {
    catIdtemp : '', 
    brandIdtemp : '',
    catActivetemp : [], 
    brandActivetemp : [],
    activate : {
        one : false, 
        two : false
    }
}


export const productsSlice =  createSlice({
    name : 'products', 
    initialState, 
    reducers : {
        setCatId : (state, action)=>{
            state.catIdtemp = action.payload;
        },
        setBrandId : (state, action)=>{
            state.brandIdtemp = action.payload;
        }, 
        setCatActivetemp : (state, action)=>{
            state.catActivetemp = action.payload;
        },
        setBrandActivetemp : (state, action)=>{
            state.brandActivetemp = action.payload;
        },
        setActivate : (state , action)=>{
            state.activate = action.payload;
        }
    }
}) 


export const ProductsReducer = productsSlice.reducer;
export const {setCatId, setBrandId, setCatActivetemp, setBrandActivetemp, setActivate} = productsSlice.actions;