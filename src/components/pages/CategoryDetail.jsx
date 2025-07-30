import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/Data';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/CartSlice';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Get category name and products
  const getCategoryName = (id) => {
    switch(id) {
      case 'fruits': return 'Fresh Fruits';
      case 'vegetables': return 'Fresh Vegetables';
      case 'bestseller': return 'Best Sellers';
      case 'lightning': return 'Lightning Deals';
      default: return 'Products';
    }
  };

  const getCategoryProducts = () => {
    if (categoryId === 'bestseller') {
      return products.filter(p => p.category === 'fruits' && p.tag && p.tag.toLowerCase().includes('bestseller'));
    }
    if (categoryId === 'lightning') {
      return products.filter(p => p.isLightningDeal === true);
    }
    return products.filter(p => p.category === categoryId);
  };

  const categoryProducts = getCategoryProducts();

  // Get subcategories for filtering
  const getSubcategories = () => {
    if (categoryId === 'bestseller' || categoryId === 'lightning') return [];
    
    const subcategories = [...new Set(categoryProducts.map(p => p.subcategory))];
    return subcategories.map(sub => ({
      id: sub,
      name: sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }));
  };

  const subcategories = getSubcategories();

  // Filter products by subcategory
  const filteredProducts = selectedSubcategory 
    ? categoryProducts.filter(p => p.subcategory === selectedSubcategory)
    : categoryProducts;

  const ProductCard = ({ product }) => {
    const cartItem = cartItems.find(item => item.id === product.id);
    
    return (
      <div className="bg-white rounded-xl shadow-md flex flex-col items-center px-3 py-3 relative group overflow-hidden">
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
        <h1 className="text-2xl font-bold text-gray-800">{getCategoryName(categoryId)}</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Subcategory Filters */}
      {subcategories.length > 0 && (
        <div className="flex gap-3 mb-4 flex-wrap">
          <button
            className={`px-4 py-2 rounded-full font-semibold text-sm border-2 transition-all duration-150 ${
              !selectedSubcategory 
                ? 'bg-orange-400 text-white border-orange-400' 
                : 'bg-white text-orange-400 border-orange-400'
            }`}
            onClick={() => setSelectedSubcategory(null)}
          >
            All
          </button>
          {subcategories.map(sub => (
            <button
              key={sub.id}
              className={`px-4 py-2 rounded-full font-semibold text-sm border-2 transition-all duration-150 ${
                selectedSubcategory === sub.id 
                  ? 'bg-orange-400 text-white border-orange-400' 
                  : 'bg-white text-orange-400 border-orange-400'
              }`}
              onClick={() => setSelectedSubcategory(sub.id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Products Count */}
              <div className="text-gray-600 mb-3">
        {filteredProducts.length} products found
        {selectedSubcategory && ` in ${subcategories.find(s => s.id === selectedSubcategory)?.name}`}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <i className="fa fa-search text-4xl mb-4"></i>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetail; 