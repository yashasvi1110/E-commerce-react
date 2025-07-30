import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/Data';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/CartSlice';

const FeaturedProductsDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [sortBy, setSortBy] = useState('rating');

  // Get all featured products
  const getFeaturedProducts = () => {
    return products.filter(p => 
      p.tag && (p.tag.toLowerCase().includes('bestseller') || 
                p.tag.toLowerCase().includes('special') || 
                p.rating >= 4.5)
    );
  };

  const featuredProducts = getFeaturedProducts();

  // Sort products
  const getSortedProducts = () => {
    const sorted = [...featuredProducts];
    switch(sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts();

  const ProductCard = ({ product }) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    
    return (
      <div className="bg-white rounded-xl shadow-md flex flex-col items-center px-3 py-3 relative group overflow-hidden">
        {/* Featured badge */}
        <span className="absolute top-2 left-2 bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
          FEATURED
        </span>
        
        {/* Tag badge */}
        {product.tag && (
          <span className="absolute top-2 right-2 bg-orange-100 text-orange-500 text-xs font-bold px-2 py-1 rounded-full z-10 shadow truncate max-w-[70px]">
            {product.tag}
          </span>
        )}
        
        {/* Product image */}
        <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-lg mb-2 relative">
          <img 
            className="object-cover w-full h-full rounded-lg" 
            src={product.img} 
            alt={product.name} 
          />
          
          {/* Quantity controls or ADD button */}
          {cartItem ? (
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
          ) : (
            <button
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 text-pink-500 font-bold px-6 py-1 rounded-xl shadow active:scale-95 transition-transform duration-100 group-hover:bg-pink-50"
              onClick={() => dispatch(addToCart(product))}
            >
              ADD
            </button>
          )}
        </div>
        
        {/* Price, MRP, Save */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-green-700 font-bold text-base">₹{product.price}</span>
          <span className="text-gray-400 line-through text-sm">₹{product.mrp}</span>
        </div>
        <div className="text-xs text-green-700 font-bold mb-1">SAVE ₹{product.save}</div>
        
        {/* Unit */}
        <div className="text-xs text-gray-500 mb-1 truncate w-full text-center">{product.unit}</div>
        
        {/* Description */}
        <div className="text-xs text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 mb-1 truncate w-full text-center">
          {product.description}
        </div>
        
        {/* Name */}
        <div className="text-sm font-semibold text-gray-800 mb-1 text-center truncate w-full">
          {product.name}
        </div>
        
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
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-3">
      {/* Header with Back Button */}
              <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fa fa-arrow-left text-lg"></i>
            <span className="font-semibold">Back to Home</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <h1 className="text-2xl font-bold text-gray-800">Featured Products</h1>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Sort Options */}
              <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          {sortedProducts.length} featured products found
        </div>
        <div className="flex gap-2">
          <label className="text-sm font-semibold text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <i className="fa fa-star text-4xl mb-4"></i>
          <p>No featured products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsDetail; 