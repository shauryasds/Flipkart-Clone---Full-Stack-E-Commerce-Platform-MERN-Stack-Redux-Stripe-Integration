import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchProducts } from '../slice/ProductSlice';
import { Link } from 'react-router-dom';

function Search({ query, setSearchTerm }) {
  const dispatch = useDispatch();
  const { searchProducts } = useSelector(state => state.productSlice);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        await dispatch(getSearchProducts({ keyword: query })).unwrap();
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [dispatch, query]);

  return (
    <div className='w-full max-h-52 flex flex-col bg-white absolute z-10 shadow-lg rounded-md overflow-y-auto'>
      {loading ? (
        <div className="p-2 text-gray-500 text-sm">Searching products...</div>
      ) : error ? (
        <div className="p-2 text-red-500 text-sm">{error}</div>
      ) : searchProducts?.length > 0 ? (
        searchProducts.map((product, index) => (
          <Link 
            to={`/product/${product._id}`} 
            onClick={() => setSearchTerm("")} 
            className='w-full p-2 hover:bg-gray-100 text-sm text-gray-700' 
            key={product._id} // Better to use product ID instead of index
          >
            {product.name}
          </Link>
        ))
      ) : (
        <div className="p-2 text-gray-500 text-sm">No products found</div>
      )}

      {/* View Top Products Link - Only shown when results are available */}
      {!loading && !error && searchProducts?.length > 0 && (
        <Link
          to="/category/all"
          onClick={() => setSearchTerm("")}
          className="w-full p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm text-center mt-auto"
        >
          View Top Products →
        </Link>
      )}
    </div>
  );
}

export default Search;
