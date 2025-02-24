// src/Login.js
import React, { useState } from 'react';
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from '../slice/UserSlice';
import { toast } from 'react-toastify';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  function handleChange(e) {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value

      }
    });


  }
  function handleSubmit(e) {
    e.preventDefault();
    const id = toast.loading("Please wait...");
    dispatch(login(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.update(id, {
          render: `${data?.payload?.success}`, type: "success", closeOnClick: true
          , autoClose: 5000, isLoading: false
        });
        navigate("/")
        console.log("login sucessFull");
      }
      else {
        toast.update(id, {
          render: `${data?.payload?.error}`, type: "error", closeOnClick: true
          , autoClose: 5000, isLoading: false
        });
        console.log("login Fialed");

      }
    })
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name='email'
              value={formData.email}
              required
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
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
  Forgot your password?
  <Link to="/forgot-password" className="text-blue-600 hover:underline">
    Reset it here
  </Link>
</p>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      
    </div>
  );
};

export default Login;