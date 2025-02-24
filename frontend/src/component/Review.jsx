import React from 'react';
import { useSelector } from 'react-redux';

const Reviews = ({ reviews, onDelete }) => {
  const {user}=useSelector(state=>state.userSlice)
  // console.log(reviews)
  reviews=reviews.reviews;
  // console.log(reviews)
  console.log(user,reviews)
  return (
    <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div 
            key={review._id} 
            className="border-b border-gray-100 pb-6 last:border-0 group hover:bg-gray-50 transition-colors rounded-lg p-3"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-lg">
                  {review?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{review.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                   
                  </div>
                </div>
                
                <p className="text-gray-600 text-base leading-relaxed mb-3">
                  {review.comment}
                </p>
                
                {user?._id === review?.user  && <button
                  onClick={() => onDelete(review._id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete Review
                </button>}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="mb-3 text-gray-400">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews;