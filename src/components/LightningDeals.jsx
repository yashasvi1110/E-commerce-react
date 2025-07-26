import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartSlice';
import { products } from '../data/Data';

const LightningDeals = () => {
  const [lightningProducts, setLightningProducts] = useState([]);
  const [timers, setTimers] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    // Filter products that are lightning deals
    const deals = products.filter(product => product.isLightningDeal);
    setLightningProducts(deals);

    // Initialize timers
    const initialTimers = {};
    deals.forEach(product => {
      initialTimers[product.id] = calculateTimeLeft(product.dealEndTime);
    });
    setTimers(initialTimers);

    // Update timers every second
    const interval = setInterval(() => {
      const updatedTimers = {};
      deals.forEach(product => {
        updatedTimers[product.id] = calculateTimeLeft(product.dealEndTime);
      });
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateTimeLeft = (endTime) => {
    const difference = new Date(endTime) - new Date();
    
    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    }
    
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  };

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-bolt text-yellow-300 text-2xl"></i>
            <h1 className="text-3xl font-bold">Lightning Deals</h1>
            <i className="fas fa-fire text-yellow-300 text-2xl"></i>
          </div>
          <p className="text-red-100">Limited time offers - Grab them before they're gone!</p>
        </div>

        {/* Lightning Deals Grid */}
        {lightningProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
            {lightningProducts.map(product => {
              const timer = timers[product.id] || { hours: 0, minutes: 0, seconds: 0, expired: true };
              
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg flex flex-col items-center px-2 py-2 relative group overflow-hidden border-2 border-red-200"
                >
                  {/* Lightning Deal Badge */}
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow flex items-center gap-1">
                    <i className="fas fa-bolt text-yellow-300"></i>
                    <span>DEAL</span>
                  </div>

                  {/* Timer Badge */}
                  <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
                    {!timer.expired ? (
                      <span className="flex items-center gap-1">
                        <i className="fas fa-clock text-red-400"></i>
                        {formatTime(timer.hours)}:{formatTime(timer.minutes)}:{formatTime(timer.seconds)}
                      </span>
                    ) : (
                      <span className="text-gray-400">EXPIRED</span>
                    )}
                  </div>
                  
                  {/* Product image */}
                  <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-lg mb-1 relative mt-6">
                    <img className="object-cover w-full h-full rounded-lg" src={product.img} alt={product.name} />
                    <button
                      className={`absolute bottom-2 left-1/2 -translate-x-1/2 border-2 font-bold px-6 py-1 rounded-xl shadow active:scale-95 transition-transform duration-100 ${
                        timer.expired 
                          ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-white border-red-400 text-red-500 group-hover:bg-red-50'
                      }`}
                      onClick={() => !timer.expired && dispatch(addToCart(product))}
                      disabled={timer.expired}
                    >
                      {timer.expired ? 'EXPIRED' : 'ADD'}
                    </button>
                  </div>
                  
                  {/* Price section with original price */}
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-red-600 font-bold text-base">₹{product.price}</span>
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-1.5 py-0.5 rounded-full">DEAL</span>
                    <span className="text-gray-400 line-through text-sm ml-1">₹{product.originalPrice || product.mrp}</span>
                  </div>
                  <div className="text-xs text-red-600 font-bold mb-0.5">SAVE ₹{product.save}</div>
                  
                  {/* Unit */}
                  <div className="text-xs text-gray-500 mb-0.5 truncate w-full text-center">{product.unit}</div>
                  
                  {/* Description */}
                  <div className="text-xs text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 mb-0.5 truncate w-full text-center">{product.description}</div>
                  
                  {/* Name */}
                  <div className="text-sm font-semibold text-gray-800 mb-0.5 text-center truncate w-full">{product.name}</div>
                  
                  {/* Rating and delivery */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 w-full justify-center">
                    <span className="flex items-center gap-1 text-green-700 font-bold">
                      <i className="fa fa-star text-green-500"></i> {product.rating} 
                      <span className="font-normal text-gray-400">({product.ratingCount})</span>
                    </span>
                    <span className="mx-1">|</span>
                    <span>{product.deliveryTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <i className="fas fa-bolt text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Lightning Deals Available</h3>
            <p className="text-gray-500">Check back later for amazing limited-time offers!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LightningDeals; 