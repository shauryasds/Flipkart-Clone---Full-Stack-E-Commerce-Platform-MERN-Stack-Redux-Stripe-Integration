import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../summaryapi/index';

const initialState = {
  cartItems: [],
  cartTotal: 0,
  status: 'idle',
  error: null,
};

const createCartThunk = (name, config) => 
  createAsyncThunk(
    `cart/${name}`,
    async (data, { rejectWithValue }) => {
      try {
        const response = await axios({
          ...config,
          data,
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        return rejectWithValue({
          message: error.response?.data?.message || `Failed to ${name}`,
          originalData: data
        });
      }
    }
  );

export const fetchCart = createCartThunk('fetchCart', {
  method: api.getCart.method,
  url: api.getCart.url
});

export const addItemToCart = createCartThunk('addItemToCart', {
  method: api.addItemToCart.method,
  url: api.addItemToCart.url
});

export const updateItemQuantity = createCartThunk('updateItemQuantity', {
  method: api.updateItemQuantity.method,
  url: api.updateItemQuantity.url
});

export const removeItemFromCart = createCartThunk('removeItemFromCart', {
  method: api.removeItemFromCart.method,
  url: api.removeItemFromCart.url
});

export const clearCart = createCartThunk('clearCart', {
  method: api.clearCart.method,
  url: api.clearCart.url
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.status = 'loading';
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.status = 'failed';
      state.error = action.payload.error || "error occurred retry";
    };

    const handleFulfilled = (state, action) => {
      state.status = 'succeeded';
      state.cartItems = action.payload.cart?.items || [];
      state.cartTotal = action.payload.cartTotal || 0;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addItemToCart.pending, handlePending)
      .addCase(addItemToCart.fulfilled, handleFulfilled)
      .addCase(addItemToCart.rejected, handleRejected)
      .addCase(updateItemQuantity.pending, handlePending)
      .addCase(updateItemQuantity.fulfilled, handleFulfilled)
      .addCase(updateItemQuantity.rejected, handleRejected)
      .addCase(removeItemFromCart.pending, handlePending)
      .addCase(removeItemFromCart.fulfilled, handleFulfilled)
      .addCase(removeItemFromCart.rejected, handleRejected)
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.cartItems = [];
        state.cartTotal = 0;
      })
      .addCase(clearCart.rejected, handleRejected);
  },
});

export const { resetCartStatus } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotal = (state) => state.cart.cartTotal;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;