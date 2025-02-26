import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { Link } from 'react-router-dom';

export default function Slideshow({ slideImages }) {
  return (
    <div className="w-full "> 
      <Slide 
        autoplay={true} 
        arrows={true} 
        infinite={true} 
        duration={3000} 
        transitionDuration={500}
      >
        {slideImages.map((slideImage, index) => (
          <div key={index} className="relative w-full h-full">
            <Link to="/category/all" className="block">
            <img
              src={slideImage.url}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            </Link>
          </div>
        ))}
      </Slide>
    </div>
  );
}
