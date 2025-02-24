import React from 'react';
import { logout } from '../slice/UserSlice';
import { toast } from 'react-toastify';
import {Link} from "react-router-dom"
import { useDispatch } from 'react-redux';
function UserTab() {
    const dispatch=useDispatch();
    const handleLogout=()=>{
        const id = toast.loading("Please wait...");
        dispatch(logout()).then((data) => {
          if (data?.payload?.success) {
            toast.update(id, {
              render: `${data?.payload?.success}`, type: "success", closeOnClick: true
              , autoClose: 5000, isLoading: false
            });
            
            console.log("logout sucessFull");
          }
          else {
            toast.update(id, {
              render: `${data?.payload?.error}`, type: "error", closeOnClick: true
              , autoClose: 5000, isLoading: false
            });
            console.log("logout Fialed");
    
          }
        })
      }
    return (
        <div className="absolute top-0 right-0 mt-6  bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition-transform duration-200 ease-in-out transform hover:scale-105">
            <div className="p-4 border-b border-gray-200">
                <Link  to="/userprofile" className="w-full text-left p-2 text-black cursor-pointerz hover:bg-green-100 rounded-md transition duration-200 ease-in-out">{'Profile'}</Link>
                
            </div>
            <div className="px-4 py-2 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 text-red-600 hover:bg-red-100 rounded-md transition duration-200 ease-in-out"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default UserTab;