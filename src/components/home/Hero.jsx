import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { products } from '../../data/Data'
import Slider from "react-slick";

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const Hero = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Debounce search to avoid too many searches while typing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                performLiveSearch(searchTerm);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const performLiveSearch = (query) => {
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
        
        // Filter products and get unique suggestions
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(correctedQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(correctedQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(correctedQuery.toLowerCase()) ||
            product.subcategory.toLowerCase().includes(correctedQuery.toLowerCase()) ||
            product.tag.toLowerCase().includes(correctedQuery.toLowerCase())
        );

        // Get unique product names and limit to 8 suggestions
        const uniqueNames = [...new Set(filtered.map(p => p.name))].slice(0, 8);
        setSuggestions(uniqueNames);
        setShowSuggestions(uniqueNames.length > 0);
        setSelectedIndex(-1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    handleSearch(e);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white py-6 px-2 md:px-0">
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center">
                {/* Search Container with Suggestions */}
                <div className="relative w-full" ref={searchRef}>
                    <form className="w-full flex items-center bg-white border-2 border-orange-400 rounded-full shadow-sm mb-4 px-2 py-1" onSubmit={handleSearch}>
                        <input
                            className="flex-1 bg-transparent border-none outline-none pl-2 py-2 text-sm text-gray-700 placeholder-gray-400 rounded-full"
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                        />
                        <button
                            className="ml-2 px-6 py-2 bg-[#81c408] text-white font-bold rounded-full text-sm shadow active:scale-95 transition-transform duration-100"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>

                    {/* Live Search Suggestions Dropdown */}
                    {showSuggestions && (
                        <div 
                            ref={suggestionsRef}
                            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
                            style={{ marginTop: '-16px' }}
                        >
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 ${
                                        selectedIndex === index ? 'bg-blue-50 border-l-4 border-[#81c408]' : ''
                                    }`}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <i className="fas fa-search text-gray-400 text-sm"></i>
                                    <span className="text-sm text-gray-700">{suggestion}</span>
                                    <i className="fas fa-arrow-up-right-from-square text-gray-300 text-xs ml-auto"></i>
                                </div>
                            ))}
                            
                            {/* Show all results option */}
                            <div
                                className="px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors duration-150 border-t border-gray-100"
                                onClick={() => handleSearch({ preventDefault: () => {} })}
                            >
                                <i className="fas fa-list text-gray-400 text-sm"></i>
                                <span className="text-sm text-gray-700 font-medium">
                                    See all results for "{searchTerm}"
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {/* Banner/slider removed as requested */}
            </div>
        </div>
    )
}

export default Hero
