import React, { useEffect, useState } from 'react';
import SlideShow from '../component/SlideShow';
import ProductCard from '../component/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../slice/ProductSlice';
import { Link } from 'react-router-dom';

const Home = () => {
  const { products, productsCount, loading } = useSelector((state) => state.productSlice);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllProducts({ page }));
  }, [dispatch, page]);

  const handleViewMore = () => {
    setPage((prev) => prev + 1);
  };

 
  const slideImages = [
    {
      url: 'https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/b0b5b6d2e4fcbe1b.jpg?q=20',
    },
    {
      url: 'https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/d9290fb51138d286.png?q=20',
    },
    {
      url: 'https://rukminim1.flixcart.com/fk-p-flap/1620/270/image/04e14d58c474db75.jpg?q=20',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Slideshow */}
      <div className="mx-0 mb-4 shadow-sm overflow-hidden">
  
    <SlideShow slideImages={slideImages} />
  
</div>
  
      {/* Trending Deals Section */}
      <div className="px-4 mb-8">
        <div className="bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Trending Deals</h2>
            
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
            {products.slice(-7).map((product) => (
              <Link 
                to={`/product/${product._id}`}
                key={product._id}
                className="flex-shrink-0 w-48 border border-gray-100 rounded-sm hover:shadow-md transition-all duration-200"
              >
                <ProductCard
                  imageUrl={product.images[0]?.url}
                  title={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  showDiscountBadge
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
  
      {/* Main Products Grid */}
      <div className="px-4">
        <div className=" p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Latest Products</h2>
            <div className="text-sm text-gray-500">
              Showing {products.length} of {productsCount} products
            </div>
          </div>
          { products.length === 0 ? (
            <div className="text-center mt-8">
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Loading...
              </span>
            </div>
          ) :
          (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {products.map((product) => (
              <Link 
                to={`/product/${product._id}`} 
                key={product._id}
                className="group border border-transparent hover:border-blue-100 hover:shadow-sm rounded-sm transition-all duration-200"
              >
                <ProductCard
                  imageUrl={product.images[0]?.url}
                  title={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  showWishlist
                />
              </Link>
            ))}
          </div>)
  
          {/* View More Button */}
          {products.length < productsCount && (
            <div className="text-center mt-8">
              <button
                className="px-12 py-3 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 
                transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={handleViewMore}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'View More Products'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default Home;
