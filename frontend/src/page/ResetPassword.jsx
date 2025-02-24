// src/ResetPassword.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../slice/UserSlice';

const ResetPassword = () => {
    const { token } = useParams();
    const dispatch=useDispatch();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: "",
        token:token
    });
    
    function handleSubmit(e) {
        e.preventDefault();
        const id = toast.loading("Please wait...");
        dispatch(resetPassword(formData)).then((data) => {
            if (data?.payload?.success) {
                toast.update(id, {
                    render: `${data?.payload?.success}`, type: "success", closeOnClick: true
                    , autoClose: 5000, isLoading: false
                });
                console.log(data,"password update sucessFull");
            }
            else {
                toast.update(id, {
                    render: `${data?.payload?.error || "error"}`, type: "error", closeOnClick: true
                    , autoClose: 5000, isLoading: false
                });
                console.log(data,"password update Fialed");

            }
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            placeholder="New Password"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                confirmPassword: e.target.value
                            }))}
                            placeholder="Confirm Password"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Reset Password
                    </button>
                </form></div>
        </div>
    );
};

export default ResetPassword;