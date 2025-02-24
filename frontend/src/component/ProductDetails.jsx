import React, { useEffect, useRef, useState } from 'react';
import { getProductById } from '../slice/ProductSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from '../slice/CartSlice';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate=useNavigate();
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [zoomStyle, setZoomStyle] = useState({});
    const imageRef = useRef(null);
    const [showZoom, setShowZoom] = useState(false);
    const containerRef = useRef(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { products, loading, error } = useSelector(state => state.productSlice);
    const product = products?.find((p) => p._id === productId);
    
    const averageRating = product?.reviews?.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

    const handleMouseMove = (e) => {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({
            backgroundPosition: `${x}% ${y}%`,
            backgroundImage: `url(${product.images[currentImageIndex].url})`,
        });
    };

    const handleAddToCart = () => {
        const tid = toast.loading("Adding your product...");
        dispatch(addItemToCart({ productId, quantity: 1 })).then((data) => {
                console.log( data.payload.success,"hi")
                if (data?.payload?.success){ 
                toast.update(tid, {
                    render:  "Product added successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000
                });
            }
                else{
                
                toast.update(tid, {
                    render: data?.payload?.error || "Failed to add product",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000
                });
            }
            })
            
        };
        
        // Add missing handleBuyNow function
        const handleBuyNow = () => {
            // Implement buy now logic
            const tid = toast.loading("Workiing your product...");
            dispatch(addItemToCart({ productId, quantity: 1 })).then((data) => {
                    console.log( data.payload.success,"hi")
                    if (data?.payload?.success){ 
                    toast.update(tid, {
                        render:  " successfull",
                        type: "success",
                        isLoading: false,
                        autoClose: 5000
                    });
                    navigate('/Checkout');
                }
                    else{
                    
                    toast.update(tid, {
                        render: data?.payload?.error || "Failed to add product",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000
                    });
                }
                })
    };

    useEffect(() => {
        if (productId) {
            dispatch(getProductById(productId));
        }
    }, [dispatch, productId]);

    if (loading) return <div>Loading...</div>
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            {product && (
                <>
                    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-md">
                        {/* Image Section */}
                        <div className="w-full md:w-1/2">
                            <div 
                                className="relative cursor-zoom-in"
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setShowZoom(true)}
                                onMouseLeave={() => setShowZoom(false)}
                            >
                                <img
                                    ref={imageRef}
                                    src={product.images[currentImageIndex].url}
                                    alt={product.name}
                                    className="w-full h-96 object-contain rounded-lg border"
                                />
                                
                                {showZoom && (
                                    <div 
                                        className="absolute hidden md:block top-0 left-[105%] w-full h-96 bg-white shadow-lg rounded-lg"
                                        style={{
                                            ...zoomStyle,
                                            backgroundSize: '200%',
                                            backgroundRepeat: 'no-repeat',
                                            transform: 'scale(1.5)',
                                            transformOrigin: '0 0',
                                        }}
                                    />
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`min-w-[80px] h-20 border-2 rounded-lg overflow-hidden ${
                                            currentImageIndex === index 
                                            ? 'border-blue-600' 
                                            : 'border-gray-200'
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="w-full md:w-1/2 pl-4">
                            <div className="space-y-4">
                                <h1 className="text-2xl font-semibold text-gray-800">
                                    {product.name}
                                </h1>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                                    )}
                                    {product.onSale && (
                                        <span className="text-green-600 font-medium">
                                            ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                                        </span>
                                    )}
                                </div>
                
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg 
                                                key={i} 
                                                className={`w-5 h-5 ${i < averageRating ? 'fill-current' : 'fill-gray-300'}`} 
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text -blue-600 text-sm font-medium">
                                        {product.reviews.length} Ratings & Reviews
                                    </span>
                                </div>
                
                                <div className="border-t pt-4">
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <span className="text-gray-600 w-24">Category</span>
                                            <span className="text-gray-900">{product.category}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-gray-600 w-24">Availability</span>
                                            <span className="text-green-600">In stock ({product.stock} items)</span>
                                        </div>
                                    </div>
                                </div>
                
                                <div className="flex gap-3 mt-6">
                                <button 
  onClick={handleAddToCart} 
  disabled={product.stock === 0}
  className={`flex-1 bg-blue-600 text-white py-3 px-6 rounded-sm font-medium transition-colors shadow-md flex items-center justify-center gap-2 border border-blue-700 ${
    product.stock === 0 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-blue-700'
  }`}
>
  <span>🛒</span>
  {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
</button>

<button 
  onClick={handleBuyNow} 
  disabled={product.stock === 0}
  className={`flex-1 bg-yellow-400 text-gray-900 py-3 px-6 rounded-sm font-medium transition-colors shadow-md flex items-center justify-center gap-2 border border-yellow-500 ${
    product.stock === 0 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-yellow-500'
  }`}
>
  <span>⚡</span>
  {product.stock === 0 ? 'UNAVAILABLE' : 'BUY NOW'}
</button>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    {/* Description Section */}
                    <div className="bg-white p-4 border rounded-md mt-4 mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
                        <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                            {showFullDescription ? product.description : `${product.description.slice(0, 250)}...`}
                        </div>
                        {product.description.length > 250 && (
                            <button 
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-2"
                            >
                                {showFullDescription ? 'Show Less' : 'Read More'}
                            </button>
                        )}
                        {product.description.length > 500 && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="ml-4 text-blue-600 text-sm font-medium hover:text-blue-700 mt-2"
                            >
                                View Full in Popup
                            </button>
                        )}
                    </div>
        
                    {/* Description Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-md max-w-2xl w-full p-6 mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Full Product Description</h2>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 text-2xl"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="whitespace-pre-wrap text-gray-600 text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
                                    {product.description}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default ProductDetails;