import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/Data';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/CartSlice';

const CategorySlider = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  // Get products for each category
  const getCategoryProducts = (categoryId, limit = 6) => {
    if (categoryId === 'bestseller') {
      return products.filter(p => p.category === 'fruits' && p.tag && p.tag.toLowerCase().includes('bestseller')).slice(0, limit);
    }
    if (categoryId === 'lightning') {
      return products.filter(p => p.isLightningDeal === true).slice(0, limit);
    }
    return products.filter(p => p.category === categoryId).slice(0, limit);
  };

  // Get bestseller products by category
  const getBestsellerProducts = (category, limit = 6) => {
    return products.filter(p => 
      p.category === category && 
      p.tag && 
      p.tag.toLowerCase().includes('bestseller')
    ).slice(0, limit);
  };

  // Get lightning deals by category
  const getLightningDeals = (category, limit = 6) => {
    return products.filter(p => 
      p.category === category && 
      p.isLightningDeal === true
    ).slice(0, limit);
  };

  // Get frequently bought together products by category
  const getFrequentlyBoughtTogether = (category, limit = 6) => {
    return products.filter(p => 
      p.category === category && 
      ((p.tag && p.tag.toLowerCase().includes('buy again')) || p.rating >= 4.5)
    ).slice(0, limit);
  };

  // Category sections to display
  const categorySections = [
    { id: 'fruits', name: 'Fresh Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥬' }
  ];

  const handleViewAll = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const ProductCard = ({ product }) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    
    return (
      <div className="bg-white rounded-xl shadow-md flex flex-col items-center px-3 py-3 relative group overflow-hidden min-w-[160px]">
        {/* Tag badge */}
        {product.tag && (
          <span className="absolute top-2 left-2 bg-orange-100 text-orange-500 text-xs font-bold px-2 py-1 rounded-full z-10 shadow truncate max-w-[70px]">
            {product.tag}
          </span>
        )}
        
        {/* Lightning deal badge */}
        {product.isLightningDeal && (
          <span className="absolute top-2 right-2 bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded-full z-10 shadow">
            ⚡ DEAL
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
      {/* Regular Category Sections */}
      {categorySections.map((section) => {
        const sectionProducts = getCategoryProducts(section.id);
        
        return (
          <div key={section.id} className="mb-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-bold text-gray-800">{section.name}</h2>
              </div>
              <button
                onClick={() => handleViewAll(section.id)}
                className="px-4 py-2 bg-orange-400 text-white font-semibold rounded-full shadow hover:bg-orange-500 transition-colors duration-200"
              >
                View All
              </button>
            </div>
            
            {/* Horizontal Scrolling Products */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {sectionProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Best Sellers Section - Split by Fruits and Vegetables */}
      <div className="mb-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <h2 className="text-xl font-bold text-gray-800">Best Sellers</h2>
          </div>
          <button
            onClick={() => handleViewAll('bestseller')}
            className="px-4 py-2 bg-orange-400 text-white font-semibold rounded-full shadow hover:bg-orange-500 transition-colors duration-200"
          >
            View All
          </button>
        </div>
        
        {/* Fruits Best Sellers */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🍎 Fruits</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {getBestsellerProducts('fruits').map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        {/* Vegetables Best Sellers */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🥬 Vegetables</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {getBestsellerProducts('vegetables').map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Lightning Deals Section - Split by Fruits and Vegetables */}
      <div className="mb-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-gray-800">Lightning Deals</h2>
          </div>
          <button
            onClick={() => handleViewAll('lightning')}
            className="px-4 py-2 bg-orange-400 text-white font-semibold rounded-full shadow hover:bg-orange-500 transition-colors duration-200"
          >
            View All
          </button>
        </div>
        
        {/* Fruits Lightning Deals */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🍎 Fruits</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {getLightningDeals('fruits').map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        {/* Vegetables Lightning Deals */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🥬 Vegetables</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {getLightningDeals('vegetables').map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Section - Split by Fruits and Vegetables */}
      <div className="mb-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="text-xl font-bold text-gray-800">Frequently Bought Together</h2>
          </div>
          <button
            onClick={() => handleViewAll('frequently-bought')}
            className="px-4 py-2 bg-orange-400 text-white font-semibold rounded-full shadow hover:bg-orange-500 transition-colors duration-200"
          >
            View All
          </button>
        </div>
        
        {/* Fruits Frequently Bought Together */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🍎 Fruits</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {getFrequentlyBoughtTogether('fruits').map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        {/* Vegetables Frequently Bought Together */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🥬 Vegetables</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {getFrequentlyBoughtTogether('vegetables').map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySlider; 