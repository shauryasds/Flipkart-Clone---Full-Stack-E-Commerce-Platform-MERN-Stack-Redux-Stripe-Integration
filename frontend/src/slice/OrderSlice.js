import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../summaryapi/index';

const initialState = {
  orders: [],
  selectedOrder: null,
  userOrders: [],
  ordersCount: 0,
  loading: false,
  error: null,
  paymentUrl: null,
};

export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api.getAllOrders.url}?page=${page}&limit=10`, {
        withCredentials: true,
      });
      console.log(response,"res")
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);



export const myOrders = createAsyncThunk(
  'order/myOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(api.myOrders.url, {
        withCredentials: true,
      });
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(api.createOrder.url, orderData, {
        withCredentials: true,
      });
      return response.data; // Contains both order and paymentUrl
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api.updateOrder.url}/${id}`, { status }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update order');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api.deleteOrder.url}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete order');
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  'order/checkPaymentStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api.checkPaymentStatus.url}/${orderId}`, {
        withCredentials: true,
      });
      return { orderId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check payment status');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${api.cancelOrder.url}/${orderId}/cancel`,  
        {}, 
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel order');
    }
  }
);

// In getSingleOrder thunk - keep as is (matches route)
export const getSingleOrder = createAsyncThunk(
  'order/getSingleOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${api.getSingleOrder.url}/${id}`,  // Correct path: /api/order/:id
        { withCredentials: true }
      );
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
  }
);

export const downloadInvoice = createAsyncThunk(
  'order/downloadInvoice',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api.downloadInvoice.url}/${orderId}`, {
        withCredentials: true,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to download invoice');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearPaymentUrl: (state) => {
      state.paymentUrl = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.ordersCount = action.payload.count;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload.order);
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        if (state.selectedOrder?._id === action.payload.order._id) {
          state.selectedOrder = action.payload.order;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload.order._id);
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId, status, orderStatus } = action.payload;
        const order = state.orders.find(o => o._id === orderId);
        if (order) {
          order.paymentInfo.status = status;
          order.orderStatus = orderStatus;
        }
        if (state.selectedOrder?._id === orderId) {
          state.selectedOrder.paymentInfo.status = status;
          state.selectedOrder.orderStatus = orderStatus;
        }
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearSelectedOrder, clearPaymentUrl } = orderSlice.actions;
export default orderSlice.reducer;