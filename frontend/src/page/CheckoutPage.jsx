import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, checkPaymentStatus } from '../slice/OrderSlice';
import { clearCart, fetchCart, resetCartStatus } from '../slice/CartSlice';
import { toast } from 'react-toastify';

function CheckoutPage() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cartSlice);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
    phone: ''
  });
  const [checkInterval, setCheckInterval] = useState(null);

  // Fetch cart items on component mount
  useEffect(() => {
    const id = toast.loading("Loading your Order...");
    const promise = dispatch(fetchCart())
      .unwrap()
      .then((result) => {
        toast.update(id, {
          render: result.message || "Order loaded successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000
        });
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message || "Failed to load Order",
          type: "error",
          isLoading: false,
          autoClose: 5000
        });
      });

    return () => {
      dispatch(resetCartStatus());
    };
  }, [dispatch]);

  // Handle input changes for shipping information
  const handleChange = e => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating an order
  const handleSubmit = async e => {
    e.preventDefault();

    const orderData = {
      shippingInfo: {
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: shippingInfo.country,
        pinCode: shippingInfo.postalCode,
        phoneNo: shippingInfo.phone
      },
      orderItems: cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity
      })),
      itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };

    try {
      const orderResponse = await dispatch(createOrder(orderData)).unwrap();
      console.log(orderResponse)
      dispatch(clearCart());
      localStorage.setItem('pendingOrder', orderResponse.order._id);
      window.open(orderResponse.paymentUrl, '_blank');
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error(error.message || 'Checkout failed. Please try again.');
    }
  };

  // Check payment status for the pending order
  useEffect(() => {
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      const interval = setInterval(() => {
        dispatch(checkPaymentStatus(pendingOrder))
          .unwrap()
          .then(({ status }) => {
            if (status === 'paid') {
              clearInterval(interval);
              localStorage.removeItem('pendingOrder');
              toast.success('Payment successful!');
              // Optionally fetch updated order or redirect
            } else if (status === 'failed') {
              clearInterval(interval);
              localStorage.removeItem('pendingOrder');
              toast.error('Payment failed. Please try again.');
            }
          })
          .catch(error => {
            console.error('Payment check error:', error);
            clearInterval(interval);
            localStorage.removeItem('pendingOrder');
          });
      }, 5000); // Check every 5 seconds
      setCheckInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="shipping-info">
          <h3 className="text-xl font-semibold mb-2">Shipping Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={shippingInfo.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={shippingInfo.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={shippingInfo.postalCode}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingInfo.state}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingInfo.country}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={shippingInfo.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="order-summary">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          {cartItems?.map(item => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.name}</span>
              <span>
                {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}
              </span>
            </div>
          ))}
          <div className="font-bold">
            Total: ₹{cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;