import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get order data from navigation state
    const orderData = location.state || {};
    const { orderId, placedAt, orderTotal, paymentMethod } = orderData;
    
    // Format the date
    const orderDate = placedAt ? new Date(placedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : new Date().toLocaleDateString();

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
                                <span className="font-medium text-gray-900">${orderTotal}</span>
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