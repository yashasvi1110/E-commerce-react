import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/Data';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/CartSlice';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  // Get featured products (products with special tags or high ratings)
  const getFeaturedProducts = () => {
    return products
      .filter(p => p.tag && (p.tag.toLowerCase().includes('bestseller') || p.tag.toLowerCase().includes('special') || p.rating >= 4.5))
      .slice(0, 8); // Show 8 featured products
  };

  const featuredProducts = getFeaturedProducts();

  const handleViewAll = () => {
    navigate('/featured-products');
  };

  const ProductCard = ({ product }) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    
    return (
      <div className="bg-white rounded-xl shadow-md flex flex-col items-center px-3 py-3 relative group overflow-hidden min-w-[160px]">
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
        <div className="w-full h-20 flex items-center justify-center overflow-hidden rounded-lg mb-2 relative">
          <img 
            className="object-cover w-full h-full rounded-lg" 
            src={product.img} 
            alt={product.name} 
          />
          
          {/* Quantity controls or ADD button */}
          {cartItem ? (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 rounded-xl shadow flex items-center px-1 py-0.5">
              <button
                className="text-pink-500 font-bold px-1 py-0.5 rounded-full hover:bg-pink-50 active:scale-95 transition-transform duration-100"
                onClick={() => dispatch(removeFromCart(product))}
              >
                <i className="fa fa-minus text-xs"></i>
              </button>
              <span className="text-pink-500 font-bold px-1 text-xs">{cartItem.quantity}</span>
              <button
                className="text-pink-500 font-bold px-1 py-0.5 rounded-full hover:bg-pink-50 active:scale-95 transition-transform duration-100"
                onClick={() => dispatch(addToCart(product))}
              >
                <i className="fa fa-plus text-xs"></i>
              </button>
            </div>
          ) : (
            <button
              className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 text-pink-500 font-bold px-4 py-0.5 rounded-xl shadow active:scale-95 transition-transform duration-100 group-hover:bg-pink-50 text-xs"
              onClick={() => dispatch(addToCart(product))}
            >
              ADD
            </button>
          )}
        </div>
        
        {/* Price, MRP, Save */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-green-700 font-bold text-sm">₹{product.price}</span>
          <span className="text-gray-400 line-through text-xs">₹{product.mrp}</span>
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
        <div className="flex items-center gap-1 text-xs text-gray-500 w-full justify-center">
          <span className="flex items-center gap-1 text-green-700 font-bold">
            <i className="fa fa-star text-green-500"></i> {product.rating}
          </span>
          <span className="mx-1">|</span>
          <span>{product.deliveryTime}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
        </div>
        <button
          onClick={handleViewAll}
          className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-full shadow hover:bg-purple-600 transition-colors duration-200"
        >
          View All
        </button>
      </div>
      
      {/* Horizontal Scrolling Products */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts; 