import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomCartBar = () => {
  const totalItems = useSelector(state => state.cart.totalItems);
  const subtotal = useSelector(state => state.cart.subtotal);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Hide on cart and checkout pages, or when no items
  const shouldHide = totalItems === 0 || 
                   location.pathname === '/cart' || 
                   location.pathname === '/checkout' ||
                   location.pathname === '/order-success';

  useEffect(() => {
    setIsVisible(!shouldHide);
    if (!shouldHide && totalItems > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [shouldHide, totalItems]);

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleQuickCheckout = () => {
    // Quick checkout - skip cart and go directly to checkout
    navigate('/checkout');
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop for expanded view */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-200"
          onClick={() => setShowQuickActions(false)}
        />
      )}
      
      {/* Main Cart Bar */}
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}>
        {/* Expanded Quick Actions */}
        {showQuickActions && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl p-4 w-80 border border-gray-200 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Quick Actions</h3>
              <button 
                onClick={() => setShowQuickActions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGoToCart}
                className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-6 h-6 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 5M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">View Cart</span>
              </button>
              
              <button
                onClick={handleQuickCheckout}
                className="flex flex-col items-center p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-6 h-6 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span className="text-sm font-medium text-orange-700">Quick Checkout</span>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Total: {totalItems} items</span>
                <span className="font-bold text-green-800">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Cart Button */}
        <div className={`bg-gradient-to-r from-[#81c408] to-green-500 rounded-2xl shadow-2xl p-4 transition-all duration-300 ${
          showQuickActions ? 'scale-105 shadow-3xl' : 'hover:scale-105'
        }`}>
          <div className="flex items-center justify-between w-full max-w-sm mx-auto">
            {/* Cart Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-white text-[#81c408] rounded-full p-3 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 5M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z"/>
                  </svg>
                </div>
                {/* Item count badge */}
                <div className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                  {totalItems}
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} added
                </span>
                <span className="text-sm text-green-100">
                  Subtotal: <span className="font-bold text-orange-200">₹{subtotal.toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions Toggle */}
              <button
                onClick={toggleQuickActions}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
              >
                <svg className={`w-5 h-5 text-white transition-transform duration-200 ${
                  showQuickActions ? 'rotate-180' : ''
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/>
                </svg>
              </button>
              
              {/* Primary Action Button */}
              <button
                className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-full shadow-lg text-sm transition-all duration-200 hover:scale-105"
                onClick={handleGoToCart}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default BottomCartBar; 