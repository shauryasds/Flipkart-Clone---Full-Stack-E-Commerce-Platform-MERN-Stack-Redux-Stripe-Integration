import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { Base64Encode } from '../utils/Base64';
import { useDispatch } from "react-redux"
import { register } from '../slice/UserSlice';
import { toast } from 'react-toastify';
const Signup = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null,
  });

  const [base64Avatar, setBase64Avatar] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {

    const file = e.target.files[0];

    if (file) {

      try {
        const base64String = await Base64Encode(file);
        setFormData((prevData) => ({
          ...prevData,
          avatar: base64String,
        }));
        setBase64Avatar(base64String);
      } catch (error) {
        console.error('Error encoding file to Base64:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = toast.loading("Please wait...")
    dispatch(register(formData)).then((data) => {
      if (data?.payload?.error) {
        toast.update(id, {
          render: `${data?.payload?.error}`, autoClose: 8000, closeOnClick: true
          , type: "Error", isLoading: false
        });
      }
      else {

        toast.update(id, {
          render: `${data?.payload?.success}`, type: "success", closeOnClick: true
          , autoClose: 5000, isLoading: false
        });
       
      }
    })
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>

        {/* Avatar Preview */}
        {base64Avatar && ( // Render the image preview if it exists
          <div className="mb-4">
            <img src={base64Avatar} alt="Avatar Preview" className="w-32 h-32 object-cover rounded-md mx-auto" />
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="avatar">Avatar</label>
            <div className="flex items-center mt-1">
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Hide the default file input
              />
              <label htmlFor="avatar" className="flex items-center cursor-pointer px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <FaUpload className="mr-2" /> {/* Upload icon */}
                Upload Avatar
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;