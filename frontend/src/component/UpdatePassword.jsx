import React, { useState } from 'react';
import { updatePassword } from '../slice/UserSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

function UpdatePassword() {
  const dispatch=useDispatch();
  const[formData,setFormData]=useState({
    oldPassword:"",
    newPassword:"",
    confirmPassword:""
  });


  function handleSubmit(e) {
    e.preventDefault();
    const id = toast.loading("Please wait...");
    dispatch(updatePassword(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.update(id, {
          render: `${data?.payload?.success}`, type: "success", closeOnClick: true
          , autoClose: 5000, isLoading: false
        });
        console.log("sucessFull");
      }
      else {
        toast.update(id, {
          render: `${data?.payload?.error}`, type: "error", closeOnClick: true
          , autoClose: 5000, isLoading: false
        });
        console.log("Fialed");

      }
    })
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Update Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={formData.oldPassword}
            onChange={(e) => setFormData(prev=>({...prev,
              oldPassword:e.target.value}))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData(prev=>({...prev,
              newPassword:e.target.value}))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev=>({...prev,
              confirmPassword:e.target.value}))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default UpdatePassword;