import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../slice/ProductSlice';
import ProductList from '../component/ProductList';
import OrderList from '../component/OrderList';
import ProductForm from '../component/ProductForm';
import { getAllOrders } from '../slice/OrderSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, loading: loadingProducts } = useSelector((state) => state.productSlice);
  const { orders, loading: loadingOrders, error: orderError } = useSelector((state) => state.orderSlice);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllOrders({ page: 1 }));
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <button
        className="mb-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={() => setShowProductForm(true)}
      >
        Add New Product
      </button>

      {showProductForm && <ProductForm onClose={() => setShowProductForm(false)} />}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        {loadingProducts ? (
          <div>loading</div>
        ) : (
          <ProductList products={products} />
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        {orderError && <p className="text-red-500 mb-2">{orderError}</p>}
        {loadingOrders ? (
          <div>loading</div>
          ) : (
          <OrderList 
            orders={orders} 
            showStatusControl={true}
            showCancel={false}
          />
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;