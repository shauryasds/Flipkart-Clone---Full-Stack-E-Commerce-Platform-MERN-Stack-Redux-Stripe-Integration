import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UpdateProfile from '../component/UpdateProfile';
import OrderList from '../component/OrderList';
import UpdatePassword from '../component/UpdatePassword';
import { myOrders } from '../slice/OrderSlice';
import { FaUserEdit, FaLock, FaHistory } from 'react-icons/fa';
import { Loader } from 'react-feather';

function UserProfile() {
  const dispatch = useDispatch();
  const { userOrders, loading, error } = useSelector((state) => state.orderSlice);
  const [activeTab, setActiveTab] = useState(''); 

  useEffect(() => {
    if (activeTab === 'orders') {
      dispatch(myOrders());
    }
  }, [dispatch, activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">User  Profile</h1>
      
      {/* Navigation Tabs */}
      <div className="flex-col md:flex-row justify-center items-center w-full space-y-4 sm:space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`flex-1 p-4 m-4 rounded-lg ${activeTab === 'profile' ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 transition duration-200`}
        >
          <FaUserEdit className="inline mr-2" />
          Update Profile
        </button>
        <button 
          onClick={() => setActiveTab('password')} 
          className={`flex-1 p-4 m-4 rounded-lg ${activeTab === 'password' ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 transition duration-200`}
        >
          <FaLock className="inline mr-2" />
          Update Password
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`flex-1 p-4  m-4 rounded-lg ${activeTab === 'orders' ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 transition duration-200`}
        >
          <FaHistory className="inline mr-2" />
          Order History
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'profile' && (
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <UpdateProfile />
        </div>
      )}
      {activeTab === 'password' && (
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <UpdatePassword />
        </div>
      )}
      {activeTab === 'orders' && (
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <OrderList 
              orders={userOrders} 
              showCancel={true} 
              showStatus={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;