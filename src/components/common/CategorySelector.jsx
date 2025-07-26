import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, products } from '../../data/Data';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/CartSlice';

const CategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [cardsToShow, setCardsToShow] = useState(9); // 3 rows × 3 cards = 9 cards initially
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  // Filter products by selected category and subcategory
  const filteredProducts = products.filter(p =>
    (!selectedCategory || p.category === selectedCategory) &&
    (!selectedSubcategory || p.subcategory === selectedSubcategory)
  );

  return (
    <div className="my-2 w-full flex flex-col items-center max-w-6xl mx-auto">
      {/* Main Categories */}
      <div className="grid grid-cols-4 gap-1 mb-2 w-full max-w-md mx-auto">
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${selectedCategory === cat.id ? 'scale-105' : 'hover:scale-105'} ${cat.type === 'special' ? 'relative' : ''}`}
            onClick={() => {
              // Handle special navigation categories
              if (cat.id === 'bestseller') {
                // Scroll to bestseller section
                const bestsellerSection = document.getElementById('bestseller-section');
                if (bestsellerSection) {
                  bestsellerSection.scrollIntoView({ behavior: 'smooth' });
                }
                return;
              }
              
              if (cat.id === 'lightning') {
                // Navigate to lightning deals page
                navigate('/lightning-deals');
                return;
              }
              
              // Regular category selection
              setSelectedCategory(cat.id);
              setSelectedSubcategory(null);
              setCardsToShow(9); // Reset to initial 9 cards
            }}
          >
            <div className={`w-14 h-14 rounded-2xl p-1.5 mb-0.5 shadow-lg transition-all duration-200 relative ${
              selectedCategory === cat.id ? 'bg-[#81c408]' : 
              cat.id === 'lightning' ? 'bg-gradient-to-br from-red-500 to-orange-500' :
              cat.id === 'bestseller' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
              'bg-white'
            }`}>
              <img 
                src={cat.img} 
                alt={cat.name}
                className="w-full h-full object-cover rounded-xl"
              />
              {/* Special badges */}
              {cat.id === 'lightning' && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 rounded-full p-1">
                  <i className="fas fa-bolt text-xs"></i>
                </div>
              )}
              {cat.id === 'bestseller' && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-orange-600 rounded-full p-1">
                  <i className="fas fa-star text-xs"></i>
                </div>
              )}
            </div>
                         <span className={`text-xs font-semibold transition-all duration-200 text-center ${
              selectedCategory === cat.id ? 'text-[#81c408]' : 
              cat.id === 'lightning' ? 'text-red-600' :
              cat.id === 'bestseller' ? 'text-orange-600' :
              'text-gray-700'
            }`}>
              {cat.name}
            </span>

          </div>
        ))}
      </div>

      {/* Subcategories */}
      {selectedCategory && (
        <div className="flex gap-3 mb-4 flex-wrap justify-center">
          {categories.find(cat => cat.id === selectedCategory).subcategories.map(sub => (
            <button
              key={sub.id}
              className={`px-4 py-1 rounded-full font-semibold text-sm border-2 transition-all duration-150 ${selectedSubcategory === sub.id ? 'bg-orange-400 text-white border-orange-400' : 'bg-white text-orange-400 border-orange-400'}`}
              onClick={() => {
                setSelectedSubcategory(sub.id);
                setCardsToShow(9); // Reset to initial 9 cards
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Filtered Products - 3 columns grid */}
      {selectedCategory && selectedSubcategory && (
        <div className="w-full max-w-6xl px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400">No products found.</div>
          ) : (
            <>
              {/* Products Grid - 2 columns */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-4 mb-6">
                {filteredProducts.slice(0, cardsToShow).map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow flex flex-col items-center px-2 py-2 relative group overflow-hidden"
                  >
                    {/* Tag badge */}
                    {product.tag && (
                      <span className="absolute top-2 left-2 bg-orange-100 text-orange-500 text-xs font-bold px-3 py-1 rounded-full z-10 shadow truncate max-w-[80px]">{product.tag}</span>
                    )}
                    
                    {/* Product image */}
                    <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-lg mb-1 relative">
                      <img className="object-cover w-full h-full rounded-lg" src={product.img} alt={product.name} />
                      
                      {/* Quantity controls or ADD button */}
                      {(() => {
                        const cartItem = cartItems.find(item => item.id === product.id);
                        if (cartItem) {
                          return (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 rounded-xl shadow flex items-center px-2 py-1">
                              <button
                                className="text-pink-500 font-bold px-2 py-1 rounded-full hover:bg-pink-50 active:scale-95 transition-transform duration-100"
                                onClick={() => dispatch(removeFromCart(product))}
                              >
                                <i className="fa fa-minus text-xs"></i>
                              </button>
                              <span className="text-pink-500 font-bold px-2 text-sm">{cartItem.quantity}</span>
                              <button
                                className="text-pink-500 font-bold px-2 py-1 rounded-full hover:bg-pink-50 active:scale-95 transition-transform duration-100"
                                onClick={() => dispatch(addToCart(product))}
                              >
                                <i className="fa fa-plus text-xs"></i>
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <button
                              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 text-pink-500 font-bold px-8 py-1 rounded-xl shadow active:scale-95 transition-transform duration-100 group-hover:bg-pink-50"
                              onClick={() => dispatch(addToCart(product))}
                            >
                              ADD
                            </button>
                          );
                        }
                      })()}
                    </div>
                    
                    {/* Price, MRP, Save */}
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-green-700 font-bold text-base">₹{product.price}</span>
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">daily</span>
                      <span className="text-gray-400 line-through text-sm ml-1">₹{product.mrp}</span>
                    </div>
                    <div className="text-xs text-green-700 font-bold mb-0.5">SAVE ₹{product.save}</div>
                    
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
                ))}
              </div>

              {/* Add More Button */}
              {cardsToShow < filteredProducts.length && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setCardsToShow(cardsToShow + 9)} // Add 9 more cards (3 more rows)
                    className="px-8 py-2 bg-orange-400 text-white font-bold rounded-full shadow hover:bg-orange-500 transition"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelector; 