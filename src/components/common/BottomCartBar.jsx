import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomCartBar = () => {
  const totalItems = useSelector(state => state.cart.totalItems);
  const subtotal = useSelector(state => state.cart.subtotal);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on cart and checkout pages
  if (totalItems === 0 || location.pathname === '/cart' || location.pathname === '/checkout') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] z-50 flex justify-center items-center rounded-2xl bg-[#81c408] shadow-lg py-3 px-4 border border-green-200">
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="bg-white text-[#81c408] rounded-full p-2 flex items-center justify-center shadow">
            <i className="fa fa-shopping-bag text-lg"></i>
          </span>
          <div className="flex flex-col items-start ml-2">
            <span className="text-base font-bold text-white">{totalItems} item{totalItems > 1 ? 's' : ''} in cart</span>
            <span className="text-xs text-white">Subtotal: <span className="font-bold text-orange-400">${subtotal.toFixed(2)}</span></span>
          </div>
        </div>
        <button
          className="ml-4 bg-orange-400 text-white font-bold px-6 py-2 rounded-full shadow text-base hover:bg-orange-500 transition"
          onClick={() => navigate('/cart')}
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
};

export default BottomCartBar; 