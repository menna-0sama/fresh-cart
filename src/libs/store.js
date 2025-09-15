import { configureStore } from "@reduxjs/toolkit";
import { ProductsReducer } from "./slices/productsSlice";
import { wishlistSliceReducer } from "./slices/wishlistSlice";

export const store = configureStore({
    reducer : {
        products : ProductsReducer, 
        wishlist : wishlistSliceReducer
    }
})