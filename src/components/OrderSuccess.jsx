import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/CartSlice';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get order data from navigation state
    const orderData = location.state || {};
    const { orderId, placedAt, orderTotal, paymentMethod } = orderData;

    // Subscription info (if any)
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    useEffect(() => {
        const sub = sessionStorage.getItem('subscriptionInfo');
        if (sub) {
            setSubscriptionInfo(JSON.parse(sub));
            sessionStorage.removeItem('subscriptionInfo');
        }
    }, []);
    
    // Cancellation state
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
    const [canCancel, setCanCancel] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [orderCancelled, setOrderCancelled] = useState(false);
    
    // Format the date
    const orderDate = placedAt ? new Date(placedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : new Date().toLocaleDateString();

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft > 0 && canCancel && !orderCancelled) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setCanCancel(false);
        }
    }, [timeLeft, canCancel, orderCancelled]);

    // Format time display (MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle order cancellation
    const handleCancelOrder = async () => {
        if (!canCancel || orderCancelled) return;
        
        setIsCancelling(true);
        
        // Simulate API call delay
        setTimeout(() => {
            setOrderCancelled(true);
            setCanCancel(false);
            setIsCancelling(false);
            dispatch(clearCart()); // Clear the cart
        }, 1500);
    };

    // Handle going back to shop after cancellation
    const handleBackToShop = () => {
        navigate('/shop');
    };

    if (orderCancelled) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    {/* Cancellation Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>

                    {/* Cancellation Message */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Cancelled Successfully</h1>
                    <p className="text-gray-600 mb-6">Your order has been cancelled and no charges will be made.</p>

                    {/* Cancelled Order Details */}
                    <div className="bg-red-50 rounded-lg p-4 mb-6 text-left border border-red-200">
                        <h3 className="font-semibold text-red-900 mb-3">Cancelled Order Details</h3>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-red-600">Order ID:</span>
                                <span className="font-medium text-red-900">{orderId || 'ORD-' + Date.now()}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-red-600">Cancelled At:</span>
                                <span className="font-medium text-red-900">{new Date().toLocaleTimeString()}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-red-600">Status:</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Cancelled
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleBackToShop}
                            className="w-full px-6 py-3 bg-[#81c408] text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
                        >
                            Continue Shopping
                        </button>
                        
                        <button
                            onClick={() => navigate('/')}
                            className="w-full px-6 py-3 bg-white text-[#81c408] font-semibold rounded-md border border-[#81c408] hover:bg-green-50 transition duration-200"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>

                {/* Subscription Delivery Message */}
                {subscriptionInfo && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-sm font-medium text-green-800">
                                Your subscription will be delivered every {(() => {
                                    switch(subscriptionInfo.frequency) {
                                        case 'daily': return 'day';
                                        case 'every2days': return '2 days';
                                        case 'every3days': return '3 days';
                                        case 'weekly': return 'week';
                                        default: return subscriptionInfo.frequency;
                                    }
                                })()}.
                            </span>
                        </div>
                        <p className="text-xs text-green-700">
                            Product: <b>{subscriptionInfo.product.name}</b> &nbsp;|&nbsp; Quantity: <b>{subscriptionInfo.quantity}</b>
                        </p>
                    </div>
                )}

                {/* Cancellation Timer */}
                {canCancel && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-4">
                        <div className="flex items-center justify-center mb-1">
                            <svg className="w-4 h-4 text-orange-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-xs font-medium text-orange-800">
                                Cancel within: <span className="font-bold text-base">{formatTime(timeLeft)}</span>
                            </span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-1 mb-1">
                            <div 
                                className="bg-orange-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(timeLeft / 60) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-orange-700 text-center">
                            You can cancel your order free of charge within 1 minute
                        </p>
                    </div>
                )}

                {/* Cancel Button */}
                {canCancel && (
                    <div className="mb-2">
                        <button
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            className={`w-full px-3 py-2 text-sm font-semibold rounded transition duration-200 ${
                                isCancelling 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
                            }`}
                        >
                            {isCancelling ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    <span className="text-xs">Cancelling...</span>
                                </div>
                            ) : (
                                'Cancel Order'
                            )}
                        </button>
                    </div>
                )}

                {/* Time Expired Message */}
                {!canCancel && !orderCancelled && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Cancellation Period Expired</span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Your order is being processed and can no longer be cancelled online
                        </p>
                    </div>
                )}

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-medium text-gray-900">{orderId || 'ORD-' + Date.now()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-medium text-gray-900">{orderDate}</span>
                        </div>
                        
                        {orderTotal && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-medium text-gray-900">₹{orderTotal}</span>
                            </div>
                        )}
                        
                        {paymentMethod && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium text-gray-900">{paymentMethod}</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Processing
                            </span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="text-left mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">What's Next?</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• You will receive an order confirmation email shortly</li>
                        <li>• Your order will be processed within 1-2 business days</li>
                        <li>• We'll send you tracking information once shipped</li>
                        {!canCancel && <li>• For cancellations, please contact customer support</li>}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full px-6 py-3 bg-[#81c408] text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Continue Shopping
                    </button>
                    
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full px-6 py-3 bg-white text-[#81c408] font-semibold rounded-md border border-[#81c408] hover:bg-green-50 transition duration-200"
                    >
                        View Profile
                    </button>
                </div>

                {/* Support Info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? Contact us at{' '}
                        <a href="mailto:support@fruitables.com" className="text-[#81c408] hover:underline">
                            support@fruitables.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;