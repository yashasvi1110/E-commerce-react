import React, { useState } from 'react';
import { categories, products } from '../../data/Data';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/CartSlice';

const CategorySelector = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const dispatch = useDispatch();

  // Filter products by selected category and subcategory
  const filteredProducts = products.filter(p =>
    (!selectedCategory || p.category === selectedCategory) &&
    (!selectedSubcategory || p.subcategory === selectedSubcategory)
  );

  return (
    <div className="my-8 flex flex-col items-center">
      {/* Main Categories */}
      <div className="flex gap-4 mb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`px-6 py-2 rounded-full font-bold text-base shadow border-2 transition-all duration-150 ${selectedCategory === cat.id ? 'bg-[#81c408] text-white border-[#81c408]' : 'bg-white text-[#81c408] border-[#81c408]'}`}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedSubcategory(null);
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {/* Subcategories */}
      {selectedCategory && (
        <div className="flex gap-3 mb-4 flex-wrap justify-center">
          {categories.find(cat => cat.id === selectedCategory).subcategories.map(sub => (
            <button
              key={sub.id}
              className={`px-4 py-1 rounded-full font-semibold text-sm border-2 transition-all duration-150 ${selectedSubcategory === sub.id ? 'bg-orange-400 text-white border-orange-400' : 'bg-white text-orange-400 border-orange-400'}`}
              onClick={() => setSelectedSubcategory(sub.id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}
      {/* Filtered Products - Horizontal Scroll */}
      {selectedCategory && selectedSubcategory && (
        <div className="overflow-x-auto pb-2">
          <div className="flex flex-nowrap gap-4">
            {filteredProducts.length === 0 && (
              <div className="text-center text-gray-400">No products found.</div>
            )}
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow flex flex-col justify-between items-center min-w-[220px] max-w-[220px] h-[410px] px-3 py-2 relative group overflow-hidden"
              >
                {/* Tag badge */}
                {product.tag && (
                  <span className="absolute top-2 left-2 bg-orange-100 text-orange-500 text-xs font-bold px-3 py-1 rounded-full z-10 shadow truncate max-w-[80px]">{product.tag}</span>
                )}
                {/* Product image */}
                <div className="w-full h-28 flex items-center justify-center overflow-hidden rounded-lg mb-2 relative">
                  <img className="object-cover w-full h-full rounded-lg" src={product.img} alt={product.name} />
                  <button
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 text-pink-500 font-bold px-8 py-1 rounded-xl shadow active:scale-95 transition-transform duration-100 group-hover:bg-pink-50"
                    onClick={() => dispatch(addToCart(product))}
                  >
                    ADD
                  </button>
                </div>
                {/* Price, MRP, Save */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-700 font-bold text-lg">₹{product.price}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">daily</span>
                  <span className="text-gray-400 line-through text-sm ml-1">₹{product.mrp}</span>
                </div>
                <div className="text-xs text-green-700 font-bold mb-1">SAVE ₹{product.save}</div>
                {/* Unit */}
                <div className="text-xs text-gray-500 mb-1 truncate w-full text-center">{product.unit}</div>
                {/* Description */}
                <div className="text-xs text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 mb-1 truncate w-full text-center">{product.description}</div>
                {/* Name */}
                <div className="text-sm font-semibold text-gray-800 mb-1 text-center truncate w-full">{product.name}</div>
                {/* Rating and delivery */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto w-full justify-center">
                  <span className="flex items-center gap-1 text-green-700 font-bold"><i className="fa fa-star text-green-500"></i> {product.rating} <span className="font-normal text-gray-400">({product.ratingCount})</span></span>
                  <span className="mx-1">|</span>
                  <span>{product.deliveryTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector; 