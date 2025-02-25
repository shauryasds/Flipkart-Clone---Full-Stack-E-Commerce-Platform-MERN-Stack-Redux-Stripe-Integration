import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../slice/ProductSlice';
import ProductList from '../component/ProductList';
import OrderList from '../component/OrderList';
import ProductForm from '../component/ProductForm';
import { getAllOrders } from '../slice/OrderSlice';
import { FiPlus, FiBox, FiShoppingBag } from 'react-icons/fi';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, loading: loadingProducts } = useSelector((state) => state.productSlice);
  const { orders, loading: loadingOrders, error: orderError } = useSelector((state) => state.orderSlice);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [handleOpen, setHandleOpen] = useState({
    Products: false,
    Orders: false,
    AddNewProducts: false,
  });

  const handleClick = (section) => {
    setHandleOpen((prev) => ({
      Products: section === 'Products',
      Orders: section === 'Orders',
      AddNewProducts: section === 'AddNewProducts',
    }));
  };

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllOrders({ page: 1 }));
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600">Admin Panel</h2>
        </div>
        <nav className="mt-8">
          <a
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
            onClick={() => handleClick('AddNewProducts')}
          >
            <FiPlus className="w-5 h-5" />
            <span className="ml-3">Add New Products</span>
          </a>
          <a
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
            onClick={() => handleClick('Products')}
          >
            <FiBox className="w-5 h-5" />
            <span className="ml-3">Products</span>
          </a>
          <a
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 transition-colors"
            onClick={() => handleClick('Orders')}
          >
            <FiShoppingBag className="w-5 h-5" />
            <span className="ml-3">Orders</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        {handleOpen.AddNewProducts && (
          <button
            className="mb-6 flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all"
            onClick={() => setShowProductForm(true)}
          >
            <FiPlus className="mr-2" />
            Add New Product
          </button>
        )}

        {showProductForm && <ProductForm onClose={() => setShowProductForm(false)} />}

        {/* Stats Boxes */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <p className="text-3xl font-bold mt-2">{(products || []).length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Orders</h3>
            <p className="text-3xl font-bold mt-2">{(orders || []).length}</p>
          </div>
        </div>

        {/* Product Section */}
        {handleOpen.Products && (
          <section className="mb-8 bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            {loadingProducts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <ProductList products={products} />
            )}
          </section>
        )}

        {/* Orders Section */}
        {handleOpen.Orders && (
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            {/* {orderError && <p className="text-red-500 mb-2">{orderError}</p>} */}
            {!orders ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <OrderList 
                orders={orders} 
                showStatusControl={true}
                showCancel={false}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;