import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllProducts, deleteReview, addReview, getProductById } from '../slice/ProductSlice';
import ProductDetails from '../component/ProductDetails';
import SuggestedProducts from '../component/SuggestedProducts';
import Reviews from '../component/Review';
import ReviewForm from '../component/ReviewForm';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products ,loading, error } = useSelector((state) => state.productSlice);
  const { id: productId } = useParams();
const product=products.find(prod=>prod._id===productId);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        
        dispatch(getProductById(productId)).then((data) => {
          if (data?.payload?.success) {
          }
          else {
            toast.error("Fialed To Fetch try again");
    
          }
        });;
        
      } catch (e) {
        console.log(e);
      }
    };

    fetchProduct();
  }, [dispatch, productId]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const id = toast.loading("Working on it! Please wait...");
    
      dispatch(addReview({ productId, reviewData })).then((data) => {
        if (data?.payload?.success) {
          toast.update(id, {
            render: `Review Added sucessFully`, type: "success", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
        }
        else {
          toast.update(id, {
            render: `${data?.payload?.error}`, type: "error", closeOnClick: true
            , autoClose: 5000, isLoading: false
          });
          console.log("Fialed To Add Review");
  
        }
      });
           
      
    } catch (e) {
      console.log(e);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const id = toast.loading("Working on it! Please wait...");
    
     dispatch(deleteReview({ productId, reviewId })).then((data) => {
      if (data?.payload?.success) {
        toast.update(id, {
          render: `Review Deleted sucessFully`, type: "success", closeOnClick: true
          , autoClose: 5000, isLoading: false
        });
      }
      else {
        toast.update(id, {
          render: `${data?.payload?.error}`, type: "error", closeOnClick: true
          , autoClose: 5000, isLoading: false
        });
        console.log("Deletion Fialed");

      }
    });
      
    } catch (e) {
      console.log(e);
    }
  };

  
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {product ? (
          <div className="space-y-8">
            <ProductDetails product={product} />
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Reviews</h2>
              <div className="space-y-8">
                <ReviewForm onSubmit={handleReviewSubmit} />
                <Reviews reviews={product} onDelete={handleReviewDelete} />
              </div>
            </div>
            <SuggestedProducts currentProduct={product} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Product not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;