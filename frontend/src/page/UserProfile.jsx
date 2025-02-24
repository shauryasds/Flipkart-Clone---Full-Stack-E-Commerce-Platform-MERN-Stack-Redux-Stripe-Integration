import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UpdateProfile from '../component/UpdateProfile';
import OrderList from '../component/OrderList';
import UpdatePassword from '../component/UpdatePassword';
import { myOrders } from '../slice/OrderSlice';

function UserProfile() {
  const dispatch = useDispatch();
  const { userOrders, loading, error } = useSelector((state) => state.orderSlice);
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    if (showOrders) {
      dispatch(myOrders())}
  }, [dispatch, showOrders]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
      
      <div className="space-y-4">
        {/* Profile Update Section */}
        <button 
          onClick={() => setShowProfile(!showProfile)} 
          className="w-full text-left bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Update Profile
        </button>
        {showProfile && (
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <UpdateProfile />
          </div>
        )}

        {/* Password Update Section */}
        <button 
          onClick={() => setShowPassword(!showPassword)} 
          className="w-full text-left bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Update Password
        </button>
        {showPassword && (
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <UpdatePassword />
          </div>
        )}

        {/* Order History Section */}
        <button 
          onClick={() => setShowOrders(!showOrders)} 
          className="w-full text-left bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Order History
        </button>
        {showOrders && (
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            {loading ? (
              <div>Loading</div>
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
    </div>
  );
}

export default UserProfile;