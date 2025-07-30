import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/Data';

const CategorySelector = () => {
  const navigate = useNavigate();

  return (
    <div className="my-1 w-full flex flex-col items-center max-w-6xl mx-auto">
      {/* Main Categories */}
      <div className="grid grid-cols-4 gap-1 mb-1 w-full max-w-md mx-auto">
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 ${cat.type === 'special' ? 'relative' : ''}`}
            onClick={() => {
              // Handle special navigation categories
              if (cat.id === 'bestseller') {
                navigate('/category/bestseller');
                return;
              }
              
              if (cat.id === 'lightning') {
                // Navigate to lightning deals page
                navigate('/lightning-deals');
                return;
              }
              
              // Navigate to category detail page for regular categories
              navigate(`/category/${cat.id}`);
            }}
          >
            <div className={`w-14 h-14 rounded-2xl p-1.5 mb-0.5 shadow-lg transition-all duration-200 relative ${
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
              cat.id === 'lightning' ? 'text-red-600' :
              cat.id === 'bestseller' ? 'text-orange-600' :
              'text-gray-700'
            }`}>
              {cat.name}
            </span>

          </div>
        ))}
      </div>






    </div>
  );
};

export default CategorySelector; 