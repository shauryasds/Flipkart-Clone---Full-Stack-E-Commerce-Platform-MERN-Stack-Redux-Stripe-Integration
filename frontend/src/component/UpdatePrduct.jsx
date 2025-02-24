// src/UpdateProduct.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../slice/ProductSlice';
import { toast } from 'react-toastify';
import { Base64Encode } from '../utils/Base64';

const UpdateProduct = ({ product, onClose, refresh }) => {
  // console.log(product,"product from update")
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    images: [], // Add images to the form data
  });
  const [imagePreview, setImagePreview] = useState([]); // To show image previews

  // Populate the form with the selected product's data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description:product.description,
        category: product.category,
        images: product.images || [], // Set existing images
      });
      setImagePreview(product.images.map(img => img.url)); // Set image previews
    }
  }, [product]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const base64Promises = files.map(file => Base64Encode(file));

    Promise.all(base64Promises).then((base64Images) => {
        setFormData((prev) => ({
            ...prev,
            images: base64Images, // Store the array of Base64 encoded images
        }));
    });
    // Create image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product || !product._id) {
      toast.error('Product ID is missing');
      return;
  }
  const updatedFormData = { ...formData };

  // Check if images are new (Base64 strings) or existing (objects)
  const hasNewImages = updatedFormData.images.some(
    (img) => typeof img === 'string' && img.startsWith('data:image/')
  );

  // Remove the images field if no new images are uploaded
  if (!hasNewImages) {
    delete updatedFormData.images;
  }
console.log(formData)
const id= product._id
   
      const tid = toast.loading("Please wait...");
      dispatch(updateProduct({ id, formData:updatedFormData })).then((data) => {
        if (data?.payload?.success) {
          toast.update(tid, {
            render: "sucessFull", type: "success", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
          console.log("sucessFull");
          onClose()
        }
        else {
          toast.update(tid, {
            render: `${data?.payload?.error}`, type: "error", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
          console.log("Fialed");
  
        }
      })
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Update Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded w-full p-2"
              style={{ whiteSpace: 'pre-wrap' }} 
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Images</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="border rounded w-full p-2"
            />
          </div>
          {imagePreview.length > 0 && (
            <div className="mb-4">
              <h3 className="text-gray-700">Image Previews:</h3>
              <div className="flex space-x-2">
                {imagePreview.map((img, index) => (
                  <img key={index} src={img} alt={`preview ${index}`} className="h-20 w-20 object-cover" />
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;