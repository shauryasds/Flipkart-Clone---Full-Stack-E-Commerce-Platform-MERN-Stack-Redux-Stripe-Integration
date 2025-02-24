import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Star } from 'react-feather'; // Added Star import
import ProductCard from '../component/ProductCard';
import { getCategoryWiseProducts } from '../slice/ProductSlice';
import { Link } from 'react-router-dom';


function CategoryPage() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { categoryProducts, categoryProductsCount, loading } = useSelector((state) => state.productSlice);
  const [page, setPage] = useState(1);
  
  // Add filters state
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    ratings: '',
    sort: '',
    inStock: false
  });

  // Add filter handlers
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingFilter = (rating) => {
    setFilters(prev => ({
      ...prev,
      ratings: prev.ratings === rating.toString() ? '' : rating.toString()
    }));
  };

  useEffect(() => {
    setPage(1);
  }, [category, filters]); // Add filters to dependency

  useEffect(() => {
    dispatch(getCategoryWiseProducts({ 
      keyword: category, 
      page,
      ...filters // Pass filters to API call
    }));
  }, [dispatch, category, page, filters]);

  const handleViewMore = () => {
    setPage((prev) => prev + 1);
  };
if(!categoryProducts)return <Loader></Loader>
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {category.charAt(0).toUpperCase() + category.slice(1)} Products
      </h1>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                className="w-full p-2 border rounded-md"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                className="w-full p-2 border rounded-md"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`p-2 rounded-md flex items-center ${
                    filters.ratings === rating.toString() 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {rating}+
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              name="sort"
              className="w-full p-2 border rounded-md"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="">Default</option>
              <option value="price,asc">Price: Low to High</option>
              <option value="price,desc">Price: High to Low</option>
              <option value="ratings,desc">Top Rated</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              id="inStock"
              className="h-4 w-4 text-blue-600"
              checked={filters.inStock}
              onChange={handleFilterChange}
            />
            <label htmlFor="inStock" className="text-sm text-gray-700">
              Show In Stock Only
            </label>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryProducts.map((product) => (
          <Link 
          to={`/product/${product._id}`}>
          <ProductCard
            key={product._id}
            imageUrl={product.images[0]?.url}
            title={product.name}
            price={product.price}
            rating={product.ratings}
            inStock={product.stock > 0}
          />
          </Link>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-8 text-gray-600">
          Loading products...
        </div>
      )}

      {/* View More Button */}
      {!loading && categoryProducts.length < categoryProductsCount && (
        <div className="text-center mt-8">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={handleViewMore}
          >
            View More Products
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;