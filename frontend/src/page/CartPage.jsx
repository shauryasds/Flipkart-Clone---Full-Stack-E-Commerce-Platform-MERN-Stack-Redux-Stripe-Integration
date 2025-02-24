import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    fetchCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    resetCartStatus
} from '../slice/CartSlice';
import { toast } from 'react-toastify';
const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cartSlice);
    const { status } = useSelector(state => state.cartSlice);
    const { error } = useSelector(state => state.cartSlice);

    useEffect(() => {
        const id = toast.loading("Loading your cart...");
        const promise = dispatch(fetchCart())
            .then((result) => {
                if(result?.payload?.success){
                    toast.update(id, {
                    render: "Cart loaded successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000
                })
            }
                else{
                    toast.update(id, {
                        render: error?.message || "Failed to load cart",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000
                    });
                    if (error.status === 401) navigate('/login');
                }
            })
            

        return () => {
            dispatch(resetCartStatus());
        };
    }, [dispatch, navigate]);

    const handleQuantityChange = (productId, options, newQuantity) => {
        if (newQuantity >= 1) {
            const id = toast.loading("Updating quantity...");
            dispatch(updateItemQuantity({ productId, quantity: newQuantity, options }))
                .unwrap()
                .then((result) => {
                    console.log(result)
                    toast.update(id, {
                        render: result.message || "Quantity updated successfully",
                        type: "success",
                        isLoading: false,
                        autoClose: 5000
                    });
                })
                .catch((error) => {
                    console.log(error)
                    toast.update(id, {
                        render: error.message || "Failed to update quantity",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000
                    });
                });
        }
    };

    const handleRemoveItem = (productId, options) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            const id = toast.loading("Removing item...");
            dispatch(removeItemFromCart({ productId, options }))
                .unwrap()
                .then((result) => {
                    toast.update(id, {
                        render: result.message || "Item removed successfully",
                        type: "success",
                        isLoading: false,
                        autoClose: 5000
                    });
                })
                .catch((error) => {
                    toast.update(id, {
                        render: error.message || "Failed to remove item",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000
                    });
                });
        }
    };


    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            const id = toast.loading("Clearing cart...");
            dispatch(clearCart())
                .unwrap()
                .then((result) => {
                    toast.update(id, {
                        render: result.message || "Cart cleared successfully",
                        type: "success",
                        isLoading: false,
                        autoClose: 5000
                    });
                })
                .catch((error) => {
                    toast.update(id, {
                        render: error.message || "Failed to clear cart",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000
                    });
                });
        }
    };
    if (status === 'loading') return <>loading</>;
    if (status === 'failed') return <div className="w-[100vw] p-24 bg-gray-100 text-center">
        <div className='text-xl mb-4 text-red-600 text-center'>{error}</div>
        <div onClick={()=>{
            dispatch(resetCartStatus());
        
        }} className='block w-full border border-gray-600 text-gray-600 text-center py-3 rounded mt-4 hover:bg-gray-50 transition-colors'>
            Refresh

        </div>
        </div>;

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-8'>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className='text-center'>
                    <p className='text-xl mb-4'>Your cart is empty</p>
                    <Link
                        to='/'
                        className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors'
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Cart Items */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-lg shadow-md p-6'>
                            {cartItems.map((item) => (
                                <div
                                    key={`${item.product._id}-${JSON.stringify(item.options)}`}
                                    className='flex flex-col sm:flex-row items-center border-b py-4'
                                >
                                    <img
                                        src={item.product.images[0]?.url}
                                        alt={item.product.name}
                                        className='w-24 h-24 object-cover rounded mr-4'
                                        loading='lazy'
                                    />
                                    <div className='flex-1 w-full sm:w-auto'>
                                        <Link
                                            to={`/product/${item.product._id}`}
                                            className='text-lg font-semibold hover:text-blue-600 transition-colors'
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p className='text-gray-600'>${item.price.toFixed(2)}</p>
                                        {item.options && Object.keys(item.options).length > 0 && (
                                            <div className='mt-1 text-sm text-gray-500'>
                                                {Object.entries(item.options).map(([key, value]) => (
                                                    <div key={key}>{`${key}: ${value}`}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex items-center mt-4 sm:mt-0'>
                                        <div className='flex items-center border rounded'>
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.options, item.quantity - 1)}
                                                className='px-3 py-1 hover:bg-gray-100 disabled:opacity-50'
                                                disabled={status === 'loading'}
                                            >
                                                -
                                            </button>
                                            <span className='px-4'>{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.options, item.quantity + 1)}
                                                className='px-3 py-1 hover:bg-gray-100 disabled:opacity-50'
                                                disabled={status === 'loading'}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.product._id, item.options)}
                                            className='ml-4 text-red-600 hover:text-red-700 disabled:opacity-50'
                                            disabled={status === 'loading'}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className='mt-4'>
                                <button
                                    onClick={handleClearCart}
                                    className='text-red-600 hover:text-red-700 disabled:opacity-50'
                                    disabled={status === 'loading'}
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className='bg-white rounded-lg shadow-md p-6 h-fit'>
                        <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
                        <div className='space-y-4'>
                            <div className='flex justify-between'>
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc +( item.quantity), 0)} items)</span>
                                <span>${cartItems.reduce((acc, item) => acc +( item.quantity*item?.price), 0)}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Shipping</span>
                                <span className='text-green-600'>FREE</span>
                            </div>
                            <div className='flex justify-between font-bold text-lg'>
                                <span>Total</span>
                                <span>${cartItems.reduce((acc, item) => acc +( item.quantity*item?.price), 0)}</span>
                            </div>
                        </div>
                        <Link
                            to='/checkout'
                            className='block w-full bg-green-600 text-white text-center py-3 rounded mt-6 hover:bg-green-700 transition-colors disabled:opacity-50'
                            disabled={status === 'loading'}
                        >
                            Proceed to Checkout
                        </Link>
                        <Link
                            to='/'
                            className='block w-full border border-blue-600 text-blue-600 text-center py-3 rounded mt-4 hover:bg-blue-50 transition-colors'
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;