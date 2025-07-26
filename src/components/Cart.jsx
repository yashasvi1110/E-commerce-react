import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearItem, clearCart } from '../redux/CartSlice';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const dispatch = useDispatch();
    const items = useSelector(state => state.cart.items);
    const subtotal = useSelector(state => state.cart.subtotal);
    const total = useSelector(state => state.cart.total);
    const navigate = useNavigate();
    
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const emptyCartMsg = (
        <div className="text-center py-16">
            <div className="mb-6">
                <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 5M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z"/>
                </svg>
            </div>
            <h4 className="text-2xl font-semibold text-gray-600 mb-4">Your Cart is Empty</h4>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
                onClick={() => navigate('/shop')}
                className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
                Start Shopping
            </button>
        </div>
    );

    const handleProceedToCheckout = async () => {
        setIsCheckingOut(true);
        
        // Simulate quick processing for better UX
        setTimeout(() => {
            navigate('/checkout');
        }, 800);
    };

    const handleContinueShopping = () => {
        navigate('/shop');
    };

    const getEstimatedDeliveryTime = () => {
        const fastestDelivery = Math.min(...items.map(item => parseInt(item.deliveryTime || '15')));
        return fastestDelivery + 10; // Add processing time
    };

    const getSavingsAmount = () => {
        return items.reduce((savings, item) => {
            const mrp = item.mrp || item.price * 1.3; // Assume 30% markup if no MRP
            return savings + ((mrp - item.price) * item.quantity);
        }, 0);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {emptyCartMsg}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => navigate('/')} 
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                          d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                            </h1>
                        </div>
                        <button 
                            onClick={() => dispatch(clearCart())} 
                            className="text-red-500 hover:text-red-700 font-medium flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            <span>Clear All</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="lg:flex lg:space-x-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="grid gap-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:border-orange-200 transition-all duration-200">
                                        <div className="flex-shrink-0">
                                            <img 
                                                className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                                                src={item.img} 
                                                alt={item.name} 
                                            />
                                        </div>
                                        
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                                            <p className="text-gray-500 text-sm mb-2">{item.unit || 'Per piece'}</p>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-1">
                                                    <button 
                                                        onClick={() => dispatch(removeFromCart(item))} 
                                                        className="bg-white hover:bg-gray-50 rounded-full p-2 shadow-sm transition-all duration-200"
                                                    >
                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                                        </svg>
                                                    </button>
                                                    <span className="px-3 py-1 font-semibold text-gray-800 min-w-[40px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => dispatch(addToCart(item))} 
                                                        className="bg-white hover:bg-gray-50 rounded-full p-2 shadow-sm transition-all duration-200"
                                                    >
                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => dispatch(clearItem(item))} 
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                                    </svg>
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-green-600">
                                                ₹{parseFloat(item.price * item.quantity).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500">₹{item.price} each</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Continue Shopping */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleContinueShopping}
                                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                    </div>

                    {/* Order Summary - Sticky */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                                
                                {/* Delivery Info */}
                                <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                        </svg>
                                        <span className="font-semibold text-green-800">Fast Delivery</span>
                                    </div>
                                    <p className="text-sm text-green-700">
                                        Get it in {getEstimatedDeliveryTime()} minutes
                                    </p>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({items.length} items)</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span className="text-green-600">₹3.00</span>
                                    </div>
                                    
                                    {getSavingsAmount() > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>You Save</span>
                                            <span>-₹{getSavingsAmount().toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    <hr className="border-gray-200" />
                                    
                                    <div className="flex justify-between text-lg font-bold text-gray-800">
                                        <span>Total</span>
                                        <span>₹{(total + 3).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button 
                                    onClick={handleProceedToCheckout}
                                    disabled={isCheckingOut}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                                        isCheckingOut 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-orange-400 hover:bg-orange-500 hover:scale-105 shadow-lg hover:shadow-xl'
                                    } text-white`}
                                >
                                    {isCheckingOut ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <span>Proceed to Checkout</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </div>
                                    )}
                                </button>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center mt-4 text-xs text-gray-500 space-x-2">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                    <span>Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}