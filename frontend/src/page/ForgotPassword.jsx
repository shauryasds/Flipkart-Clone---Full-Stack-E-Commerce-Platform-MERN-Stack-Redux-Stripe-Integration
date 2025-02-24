// src/page/ForgotPassword.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { forgotPassword } from '../slice/UserSlice'; // Assuming you have a forgotPassword action in your UserSlice
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = toast.loading("Sending reset email...");
    
    dispatch(forgotPassword({ email })).then((data) => {
      if (data?.payload?.success) {
        console.log(data)
        toast.update(id, {
          render: "Reset email sent successfully!",
          type: "success",
          closeOnClick: true,
          autoClose: 5000,
          isLoading: false,
        });
      } else {
        toast.update(id, {
          render: data?.payload?.error || "Failed to send reset email.",
          type: "error",
          closeOnClick: true,
          autoClose: 5000,
          isLoading: false,
        });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Forgot Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Remembered your password?
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;