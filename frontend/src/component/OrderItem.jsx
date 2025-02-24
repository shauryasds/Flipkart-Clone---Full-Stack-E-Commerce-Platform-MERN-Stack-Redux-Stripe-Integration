import React from 'react';
import { format } from 'date-fns';

function OrderItem({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">Order #{order._id}</h3>
        <div className="flex flex-col items-end">
          <span className={`font-medium ${getStatusColor(order.paymentInfo.status)}`}>
            Payment: {order.paymentInfo.status.toUpperCase()}
          </span>
          <span className={`text-sm ${
            order.orderStatus === 'Delivered' ? 'text-green-600' :
            order.orderStatus === 'Cancelled' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            Status: {order.orderStatus}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-600">Order Date:</p>
          <p className="font-medium">{format(new Date(order.createdAt), 'PPP')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Amount:</p>
          <p className="font-medium">₹{order.totalPrice.toFixed(2)}</p>
        </div>
      </div>
      <div className="border-t pt-3">
        <h4 className="font-semibold mb-2">Items:</h4>
        <div className="space-y-2">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center">
              <div className="flex items-center">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                )}
                <span>{item.name}</span>
              </div>
              <div className="text-right">
                <p>{item.quantity} x ₹{item.price}</p>
                <p className="text-sm text-gray-600">₹{(item.quantity * item.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderItem;