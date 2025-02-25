import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrder, cancelOrder, myOrders } from '../slice/OrderSlice';
import { format } from 'date-fns';
import { Truck, CheckCircle, XCircle, Clock, CreditCard, MapPin } from 'react-feather';

const OrderList = ({ orders, showStatusControl = true, showCancel = false, showStatus = true }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userSlice);

  const statusStyles = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrder({ id: orderId, status: newStatus })).then(d=>console.log(d,"updated order"));
  };

  const handleCancel = (orderId) => {
    dispatch(cancelOrder(orderId)).then(d=>(console.log(d)));
    dispatch(myOrders()).then(d=>console.log(d,"updated order"));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy - hh:mm a');
  };

  if (!orders.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">📦</div>
        <p className="text-gray-600">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order._id} className="bg-white rounded-lg shadow-sm border transition-all hover:shadow-md">
          {/* Order Header */}
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">Order #{order._id.substring(0, 8)}</h3>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm ${statusStyles[order.orderStatus]}`}>
                {order.orderStatus}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                {order.paymentInfo.status}
              </div>
            </div>
          </div>

          {/* Order Body */}
          <div className="p-4 grid gap-4 md:grid-cols-2">
            {/* Order Items */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-gray-500" />
                Items
              </h4>
              {order.orderItems.map(item => (
                <div key={item._id} className="flex items-center py-2 border-b last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  Shipping Details
                </h4>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                  <p>{order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
                  <p className="mt-2">📱 {order.shippingInfo.phoneNo}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                  Payment Summary
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Items Total:</span>
                    <span>₹{order.itemsPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{order.shippingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.taxPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total:</span>
                    <span>₹{order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Footer */}
          { user?.role==="admin" &&(<div className="p-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {showStatusControl && (
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            )}

{showCancel && order.orderStatus === 'Processing' && order.orderStatus !== "Cancelled" && (
  <button
    onClick={() => handleCancel(order._id)}
    className="text-red-600 hover:text-red-800 flex items-center text-sm"
  >
    <XCircle className="w-4 h-4 mr-1" />
    Cancel Order
  </button>
)}
            
          </div>)}
        </div>
      ))}
    </div>
  );
};

export default OrderList;