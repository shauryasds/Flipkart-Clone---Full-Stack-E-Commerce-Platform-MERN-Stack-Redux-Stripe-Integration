// src/ProductList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAdminAllProducts } from '../slice/ProductSlice';
import UpdateProduct from './UpdatePrduct';
import { toast } from 'react-toastify';

const ProductList = () => {
  const dispatch = useDispatch();
  const { adminProducts} = useSelector((state) => state.productSlice);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');

  const totalPages =  Math.floor(adminProducts.length/10);

  useEffect(() => {
    dispatch(getAdminAllProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const tid = toast.loading("Please wait...");
    dispatch(deleteProduct(id)).then((data) => {
        if (data?.payload?.success) {
          toast.update(tid, {
            render: `${data?.payload?.success}`, type: "success", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
          console.log("product Deleted sucessFully");
        }
        else {
          toast.update(tid, {
            render: `${data?.payload?.error}`, type: "error", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
          console.log("product Deletion Fialed");
  
        }
      })
        
        
     
    
  };

  const handleSearch = (e) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  const handlePreviousPage = () => {
    setPage((old) => Math.max(old - 1, 0));
  };

  const handleNextPage = () => {
    setPage((old) => (old < totalPages ? old + 1 : old));
  };

 
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={handleSearch}
          className="p-2 border rounded w-full sm:w-64"
        />
        
      </div>

      {(
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adminProducts?.slice(page*10,(page+1)>totalPages?adminProducts.length:(page*10)+10).map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adminProducts?.length === 0 && (
            <div className="text-center text-gray-500 mt-4">No products found</div>
          )}

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next </button>
          </div>
        </>
      )}

      {selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          refresh={() => dispatch(getAdminAllProducts({ page, keyword }))}
        />
      )}
    </div>
  );
};

export default ProductList;