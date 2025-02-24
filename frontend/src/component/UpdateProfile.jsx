import React, { useState } from 'react';
import { Base64Encode } from '../utils/Base64';
import  { updateProfile } from '../slice/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function UpdateProfile() {
  const dispatch=useDispatch();
  const {user}=useSelector(state => state.userSlice)
  const [formData,setFormData]=useState({
    name:user?.name  ,
    email:user?.email,
    avatar: ""
  })
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        Base64Encode(file).then((data)=>{
            setFormData(prev=>(
                {
                    ...prev,
                    avatar:data
                }
            ))
        });
    }
  };
 

  function handleSubmit(e) {
    e.preventDefault();
    const id = toast.loading("Please wait...");
    dispatch(updateProfile(formData)).then((data) => {
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
      <h2 className="text-xl font-semibold mb-2">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev=>({...prev,
              name:e.target.value}))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev=>({...prev,
              email:e.target.value}))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Avatar</label>
          <input
            type="file"
            accept="image/*"
            value={formData.avatar}
            onChange={handleAvatarChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {formData.avatar && (
            <img src={formData.avatar} alt="Avatar Preview" className="mt-2 w-24 h-24 rounded-full" />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;