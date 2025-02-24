import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../slice/UserSlice'
import productSlice from '../slice/ProductSlice'
import orderSlice from '../slice/OrderSlice'
import cartSlice from '../slice/CartSlice'
export const store = configureStore({
  reducer: {
    userSlice,
    productSlice,
    orderSlice,
    cartSlice,
  },
})