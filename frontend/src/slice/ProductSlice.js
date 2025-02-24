import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from "../summaryapi/index";

const initialState = {
  products: [],
  productsCount: 0,
  categoryProducts:[],
  adminProducts:[],
  categoryProductsCount:0,
  searchProducts:[],
  loading: false,
  error: null,
};
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(api.createProduct.url, productData,{
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api.updateProduct.url}/${formData.id}`, formData.formData,{
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api.deleteProduct.url}/${id}`,{
        withCredentials:true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete product');
    }
  }
);

export const getAdminAllProducts = createAsyncThunk(
  "product/getAdminAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${api.getAdminAllProducts.url}`,{
          withCredentials:true
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Product access failed');
    }
  }
);
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async ({ page = 1, keyword = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${api.getAllProducts.url}?keyword=${keyword}&page=${page}&limit=10`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Product access failed');
    }
  }
);
export const getCategoryWiseProducts = createAsyncThunk(
  "product/getCategoryWiseProducts",
  async ({ page = 1, keyword = "", ...filters }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        keyword,
        page,
        limit: 10,
        ...filters
      }).toString();

      const response = await axios.get(
        `${api.categorywiseproducts.url}?${params}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Product access failed');
    }
  }
);
export const getSearchProducts = createAsyncThunk(
  "product/searchProducts",
  async ({ keyword = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${api.searchProducts.url}?keyword=${keyword}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Product access failed');
    }
  }
);
export const addReview = createAsyncThunk(
  'product/addReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api.addReview.url}`, {productId,...reviewData}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add review');
    }
  }
);
export const getProductById = createAsyncThunk("product/getProductById",async (productId,{rejectWithValue}) => {
    try {
      console.log(productId)
      const response = await axios.get(`${api.getProductById.url}/${productId}`);
      return response.data;
    } catch (error) {
      rejectWithValue (error.response?.data || 'Failed to fetch product');
    }
  })

export const deleteReview = createAsyncThunk(
  'product/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api.deleteReview.url}/${productId}/${reviewId}`, {
        withCredentials: true
      });
      return response.data; // Assuming the response contains the updated product
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete review');
    }
  }
);



export const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
extraReducers: (builder) => {
  builder
  
  .addCase(createProduct.fulfilled, (state, action) => {
    state.products.push(action.payload.product);
  })
  .addCase(updateProduct.fulfilled, (state, action) => {
    const index = state.adminProducts?.findIndex(product => product._id === action.payload.newproduct._id);
    if (index !== -1) {
      state.adminProducts[index] = action.payload.newproduct;
    }
  })
  .addCase(deleteProduct.fulfilled, (state, action) => {
    state.adminProducts = state.adminProducts.filter(product => product._id !== action.meta.arg);
  })
  .addCase(getAdminAllProducts.fulfilled, (state, action) => {
    state.adminProducts = action.payload.products;
  })
    .addCase(getAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getProductById.fulfilled, (state, action) => {
      const newProduct = action.payload.product; // Assuming action.payload.product is the correct structure
  
      // Check if the product already exists
      const pexist = state.products.some((p) => p._id === newProduct._id);
      
      if (pexist) {
          // Update the existing product
          const index = state.products.findIndex((p) => p._id === newProduct._id);
          if (index !== -1) {
              state.products[index] = newProduct; // Update the product at the found index
          }
      } else {
          // Add the new product to the array
          state.products.push(newProduct); // Use push for better performance
      }
  
      // Set total products count to 1 since we're fetching a single product
      state.productsCount = state.productsCount + 1; // or set to 1 if you want to track only the fetched product
      state.loading = false; // Set loading to false
  })
    .addCase(getAllProducts.fulfilled, (state, action) => {
      const currentPage = action.meta.arg.page;
      const newProducts = action.payload.products;

      // Replace products for first page, append for subsequent pages
      state.products = currentPage === 1 
        ? newProducts 
        : [...state.products, ...newProducts];
      
      // Set total products count from pagination data
      state.productsCount = action.payload.pagination.totalProducts;
      state.loading = false;
    })
    .addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch products';
    })

    .addCase(getCategoryWiseProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCategoryWiseProducts.fulfilled, (state, action) => {
      const currentPage = action.meta.arg.page;
      const newProducts = action.payload.products;

      // Replace products for first page, append for subsequent pages
      state.categoryProducts = currentPage === 1 
        ? newProducts 
        : [...state.categoryProducts, ...newProducts];
      
      // Set total products count from pagination data
      state.categoryProductsCount = action.payload.pagination.totalProducts;
      state.loading = false;
    })
    .addCase(getCategoryWiseProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch products';
    })
    .addCase(getSearchProducts.pending, (state) => {
      
    })
    .addCase(getSearchProducts.fulfilled, (state, action) => {
      state.searchProducts=action.payload.products;
    })
    .addCase(getSearchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch products';
    })
    .addCase(addReview.fulfilled, (state, action) => {
      const product = state.products.findIndex(prod => prod._id === action.meta.arg.productId);
      if (product!==-1) {
        state.products[product]=action.payload.product;
      }
      else{
        state.products=[...state.products,action.payload.product]
      }
    })
    .addCase(deleteReview.fulfilled, (state, action) => {
      
      const product = state.products.findIndex(prod => prod._id === action.meta.arg.productId);
      if (product !== -1) {
        console.log('For product:', action.meta.arg.productId);
        state.products[product].reviews = action.payload.product;
      }
    })

  }

})

export default ProductSlice.reducer;