import React, { useState } from 'react';

function ProductCard({ imageUrl, title, price, originalPrice }) {
  const [isHovered, setIsHovered] = useState(false);
  const truncatedTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;
  const imageSrc = Array.isArray(imageUrl) ? imageUrl[0]?.url : imageUrl;

  return (
    <div 
      className={`relative bg-white p-2 md:p-3 rounded-lg border border-gray-200 transition-all duration-300 ${
        isHovered ? 'shadow-lg md:transform md:scale-[1.02]' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square rounded-lg">
        <img
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'md:scale-105' : 'scale-100'
          }`}
          src={imageSrc}
          alt={title}
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {originalPrice && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-2 md:mt-3">
        <h3 className="text-xs md:text-sm text-gray-800 font-medium h-10 md:h-12 overflow-hidden leading-tight">
          {truncatedTitle}
        </h3>
        
        <div className="mt-1 md:mt-2 flex flex-wrap items-baseline gap-1 md:gap-2">
          <span className="text-base md:text-lg font-bold text-gray-900">₹{price}</span>
          {originalPrice && (
            <span className="text-xs md:text-sm text-gray-500 line-through">₹{originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;