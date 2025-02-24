import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getCategoryWiseProducts } from '../slice/ProductSlice';

const SuggestedProducts = ({ currentProduct }) => {
  const dispatch = useDispatch();
  const { categoryProducts, loading } = useSelector((state) => state.productSlice);
  console.log(currentProduct)
  // Filter out current product and limit to 8 items
  const filteredProducts = categoryProducts?.filter(
    product => product._id !== currentProduct?._id
  ).slice(0, 8) || [];

  useEffect(() => {
    if (currentProduct?.category) {
      dispatch(getCategoryWiseProducts({ 
        keyword: currentProduct.category, 
        page: 1 
      }));
    }
  }, [dispatch, currentProduct?.category]); // Only trigger on category change

  if (loading) return <div className="text-center py-8">Loading suggestions...</div>;

  return (
    <div className="bg-white p-4 mt-8 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Similar Products
        </h2>
        <span className="text-sm text-blue-600">
          {filteredProducts.length} items
        </span>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link 
              to={`/product/${product._id}`}
              key={product._id}
              className="flex-shrink-0 w-48 hover:shadow-lg transition-shadow duration-200"
            >
              <ProductCard
                imageUrl={product.images[0]?.url}
                title={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
              />
            </Link>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            No similar products found
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="text-center mt-4">
          <Link
            to={`/category/${currentProduct.category}`}
            className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          >
            View All in {currentProduct.category}
          </Link>
        </div>
      )}
    </div>
  );
};

export default SuggestedProducts;