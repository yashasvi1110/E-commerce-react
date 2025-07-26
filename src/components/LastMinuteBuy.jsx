import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartSlice';
import productsData from '../data/products.json';

const LastMinuteBuy = ({ category = 'fruits', title }) => {
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    // Filter products by category
    const filteredProducts = productsData.products.filter(product => product.category === category);

    // Scroll handlers
    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = current.offsetWidth * 0.8; // Scroll by 80% of container width
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const handleAddToCart = (product) => {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1
        };
        dispatch(addToCart(cartItem));
    };

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-lg font-bold text-gray-800">{title || (category === 'fruits' ? '🍎 Last Minute Fruits' : '🥕 Last Minute Vegetables')}</h3>
                <div className="flex space-x-1">
                    <button onClick={() => scroll('left')} aria-label="Scroll left" className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} aria-label="Scroll right" className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
            <div
                ref={scrollRef}
                className="flex overflow-x-auto no-scrollbar space-x-3 pb-2"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 w-1/3 max-w-[140px] min-w-[110px] bg-white rounded-lg border border-gray-100 shadow-sm p-2 mx-1 flex flex-col items-center card-hover"
                        style={{ 
                            boxSizing: 'border-box',
                            minHeight: '180px',
                            maxHeight: '180px'
                        }}
                    >
                        <div className="w-16 h-16 flex items-center justify-center mb-2">
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div 
                            className="text-xs font-semibold text-gray-800 text-center line-clamp-2 mb-1 w-full" 
                            style={{ 
                                minHeight: '32px',
                                maxHeight: '32px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {product.name}
                        </div>
                        <div className="text-xs text-gray-500 mb-1 text-center w-full">{product.unit}</div>
                        <div className="flex items-center justify-center space-x-1 mb-2 w-full">
                            <span className="font-bold text-green-600 text-xs">₹{product.price}</span>
                            {product.mrp > product.price && (
                                <span className="text-[10px] text-gray-400 line-through">₹{product.mrp}</span>
                            )}
                        </div>
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold py-1.5 px-2 rounded transition-all duration-200 mt-auto"
                            style={{
                                minHeight: '28px',
                                maxHeight: '28px'
                            }}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LastMinuteBuy; 