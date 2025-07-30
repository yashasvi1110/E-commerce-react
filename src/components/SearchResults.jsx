import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartSlice';
import { products } from '../data/Data';

const SearchResults = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Get search term from URL query parameters
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    setSearchTerm(query);

    if (query.trim()) {
      // Common misspellings map
      const spellingsMap = {
        'patato': 'potato',
        'tamoto': 'tomato',
        'bannana': 'banana',
        'aple': 'apple',
        'oragne': 'orange'
      };
      
      // Check if query is a common misspelling
      const correctedQuery = spellingsMap[query.toLowerCase()] || query;
      
      // Filter products based on search term (name, description, category, subcategory)
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(correctedQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(correctedQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(correctedQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(correctedQuery.toLowerCase()) ||
        product.tag.toLowerCase().includes(correctedQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [location.search]);

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Search Results</h1>
          
          {/* Search Bar */}
          <form className="flex items-center bg-white border-2 border-orange-400 rounded-full shadow-sm mb-3 px-2 py-1 max-w-md" onSubmit={handleNewSearch}>
            <input
              className="flex-1 bg-transparent border-none outline-none pl-2 py-2 text-sm text-gray-700 placeholder-gray-400 rounded-full"
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-[#81c408] text-white font-bold rounded-full text-sm shadow active:scale-95 transition-transform duration-100"
              type="submit"
            >
              Search
            </button>
          </form>

          {/* Results Count */}
          {searchTerm && (
            <p className="text-gray-600">
              {filteredProducts.length > 0 
                ? `Found ${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${searchTerm}"`
                : `No results found for "${searchTerm}"`
              }
            </p>
          )}
        </div>

        {/* Search Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map(product => (
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
                  <button
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 text-pink-500 font-bold px-6 py-1 rounded-xl shadow active:scale-95 transition-transform duration-100 group-hover:bg-pink-50"
                    onClick={() => dispatch(addToCart(product))}
                  >
                    ADD
                  </button>
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
        ) : searchTerm && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <i className="fas fa-search text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try searching with different keywords or browse our categories</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-[#81c408] text-white font-bold rounded-full shadow hover:bg-green-600 transition"
            >
              Back to Home
            </button>
          </div>
        )}

        {!searchTerm && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <i className="fas fa-search text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Start searching</h3>
            <p className="text-gray-500">Enter a product name or keyword to find what you're looking for</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 