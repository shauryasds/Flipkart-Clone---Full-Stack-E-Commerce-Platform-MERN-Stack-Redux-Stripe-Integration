import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchProducts } from '../slice/ProductSlice';
import { Link } from 'react-router-dom';

function Search({ query, setSearchTerm }) {
  const dispatch = useDispatch();
  const { searchProducts } = useSelector(state => state.productSlice);

  useEffect(() => {
    dispatch(getSearchProducts({ keyword: query }));
  }, [dispatch, query]);

  return (
    <div className='w-full max-h-52 flex flex-col bg-white absolute z-10 shadow-lg rounded-md overflow-y-auto'>
      {searchProducts?.length > 0 ? (
        searchProducts.map((product, index) => (
          <Link 
            to={`/product/${product._id}`} 
            onClick={() => setSearchTerm("")} 
            className='w-full p-2 hover:bg-gray-100 text-sm text-gray-700' 
            key={index}
          >
            {product.name}
          </Link>
        ))
      ) : (
        <div className="p-2 text-gray-500 text-sm">No products found</div>
      )}
      
      {/* View Top Products Link */}
      <Link
        to="/category/all" // Update this route as needed
        onClick={() => setSearchTerm("")}
        className="w-full p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm text-center mt-auto"
      >
        View Top Products →
      </Link>
    </div>
  );
}

export default Search;