import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import backendUrl from "../summaryapi/index";
import axios from 'axios';
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error:null,

}

export const register=createAsyncThunk(
  "auth/register",
  async (formData,{rejectWithValue})=>{
    try {
      const response = await axios.post(
        backendUrl.signup.url,
        formData,
        {
          withCredentials: true,
        }
        );
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    
    }
  }
);

export const login=createAsyncThunk(
  "auth/login",
  async(formData,{rejectWithValue})=>{
    try {
      const response = await axios.post(
        backendUrl.login.url,
        formData,
        {
          withCredentials: true,
        }
        );
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    
    }
  }
)
export const logout=createAsyncThunk(
  "auth/logout",
  async(_,{rejectWithValue})=>{
    try {
      const response = await axios.get(
        backendUrl.logout.url,
        {
          withCredentials: true,
        }
        );
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    
    }
  }
)
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(backendUrl.checkAuth.url, {
        withCredentials: true,
      });
      return response.data; // Return the data from the response
    } catch (e) {
      return rejectWithValue(e.response?.data || "Please login or signup");
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(backendUrl.forgotPassword.url,
        formData);
      return response.data; 
    } catch (e) {
      return rejectWithValue(e.response?.data || "Please login or signup");
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(backendUrl.resetPassword.url,
        formData);
      return response.data; 
    } catch (e) {
      return rejectWithValue(e.response?.data || "Please login or signup");
    }
  }
);
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(backendUrl.updatePassword.url,
        formData,{
          withCredentials: true,
        });
      return response.data; 
    } catch (e) {
      return rejectWithValue(e.response?.data || "Please login or signup");
    }
  }
);
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(backendUrl.updateProfile.url,
        formData,{
          withCredentials: true,
        });
      return response.data; 
    } catch (e) {
      return rejectWithValue(e.response?.data || "Please login or signup");
    }
  }
);
export const UserSlice=createSlice({
    name:"user",
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = false;
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(checkAuth.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        })
        .addCase(checkAuth.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(logout.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(logout.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(logout.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          
        })
        .addCase(forgotPassword.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          
        })
        .addCase(resetPassword.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
        })
        .addCase(resetPassword.rejected, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
          state.error = action.payload;
          
        })
      }

})
export default UserSlice.reducer;