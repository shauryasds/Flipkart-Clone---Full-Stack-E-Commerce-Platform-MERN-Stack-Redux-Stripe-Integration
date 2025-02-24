import React, { useState } from 'react';
import { createProduct } from '../slice/ProductSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Base64Encode } from '../utils/Base64';

const ProductForm = () => {
  const dispatch= useDispatch();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    
    Stock: '',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const base64Promises = files.map(file => Base64Encode(file));

    Promise.all(base64Promises).then((base64Images) => {
      setProductData((prev) => ({
            ...prev,
            images: base64Images, // Store the array of Base64 encoded images
        }));
    });

  };
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const id = toast.loading("Please wait...");
      dispatch(createProduct(productData)).then((data) => {
        if (data?.payload?.success) {
          toast.update(id, {
            render: `${data?.payload?.success}`, type: "success", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
          console.log("product created sucessFully");
        }
        else {
          toast.update(id, {
            render: `${data?.payload?.error}`, type: "error", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
          console.log("product creation Fialed");
  
        }
      })
        
    };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          description
          </label>
          <textarea
            type="text"
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Stock">
            Stock
          </label>
          <input
            type="number"
            name="Stock"
            value={productData.Stock}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
 />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
            Images
          </label>
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            multiple
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;