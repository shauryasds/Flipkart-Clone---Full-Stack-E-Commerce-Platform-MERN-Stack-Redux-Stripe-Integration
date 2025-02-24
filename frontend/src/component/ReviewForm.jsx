import React, { useState } from 'react';

const ReviewForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ comment, rating });
    setComment('');
    setRating(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          Write Your Review
        </h2>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Your Rating</label>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transform transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {rating === 0 ? 'Select rating' : 
                rating === 5 ? 'Excellent' :
                rating === 4 ? 'Very Good' :
                rating === 3 ? 'Average' :
                rating === 2 ? 'Poor' : 'Very Poor'}
            </span>
          </div>
        </div>
  
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      placeholder-gray-400 text-gray-700 transition-all resize-none"
            placeholder="Share detailed feedback about the product..."
            rows="4"
            required
          />
        </div>
  
        <button
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 py-4 px-6 rounded-md font-semibold hover:bg-yellow-500 
                   transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;