import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartSlice';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';

const Subscribe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fruitsScrollRef = useRef(null);
  const vegetablesScrollRef = useRef(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deliveryFrequency, setDeliveryFrequency] = useState('daily');
  const [message, setMessage] = useState('');

  // Filter products by category
  const getProductsByCategory = (category) => {
    return productsData.products.filter(product => product.category === category);
  };

  // Delivery frequency options
  const frequencyOptions = [
    { value: 'daily', label: 'Daily', days: 1 },
    { value: 'every2days', label: 'Every 2 days', days: 2 },
    { value: 'every3days', label: 'Every 3 days', days: 3 },
    { value: 'weekly', label: 'Weekly', days: 7 }
  ];

  // Scroll handlers
  const scroll = (direction, ref) => {
    const { current } = ref;
    if (current) {
      const scrollAmount = current.offsetWidth * 0.8;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Handle email submission
  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }
    setCurrentStep(2);
    setMessage('');
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      // If product already exists, increase quantity
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id 
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ));
    } else {
      // Add new product
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove product if quantity is 0 or less
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    } else {
      // Update quantity
      setSelectedProducts(selectedProducts.map(p => 
        p.id === productId 
          ? { ...p, quantity: newQuantity }
          : p
      ));
    }
  };

  // Handle frequency selection and redirect to checkout
  const handleFrequencyAndCheckout = () => {
    if (selectedProducts.length === 0) {
      setMessage('Please select at least one product');
      return;
    }

    // Add all selected products to cart
    selectedProducts.forEach(product => {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: product.quantity
      }));
    });

    // Store subscription info in sessionStorage
    sessionStorage.setItem('subscriptionInfo', JSON.stringify({
      email,
      products: selectedProducts,
      frequency: deliveryFrequency
    }));

    // Redirect to checkout
    navigate('/checkout', { state: { fromSubscription: true } });
  };

  return (
    <div className="bg-gray-50 py-4 px-3">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold text-gray-800 mb-1">Subscribe to Fresh Groceries</h1>
          <p className="text-xs text-gray-600">Get fresh fruits and vegetables delivered regularly</p>
        </div>
        
        {/* Compact Progress Steps */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep >= step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Email Input */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Enter Your Email</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleEmailSubmit}
                className="w-full bg-green-500 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-green-600 transition duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Product Selection with Sliding */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Select Products</h2>
            
            {/* Fruits Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">🍎 Fresh Fruits</h3>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => scroll('left', fruitsScrollRef)} 
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => scroll('right', fruitsScrollRef)} 
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={fruitsScrollRef}
                className="flex overflow-x-auto no-scrollbar space-x-2 pb-2"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {getProductsByCategory('fruits').map((product) => {
                  const selectedProduct = selectedProducts.find(p => p.id === product.id);
                  return (
                    <div
                      key={product.id}
                      className="flex-shrink-0 w-1/3 max-w-[120px] min-w-[100px] bg-gray-50 rounded-lg border border-gray-200 p-2 cursor-pointer hover:border-green-500 transition duration-200"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="w-full flex justify-center items-center mb-2">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                      <h3 className="text-xs font-semibold text-gray-800 mb-1 truncate text-center">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-1 text-center">{product.unit}</p>
                      <p className="text-xs font-bold text-green-600 text-center">₹{product.price}</p>
                      {selectedProduct && (
                        <div className="mt-2 flex items-center justify-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product.id, selectedProduct.quantity - 1);
                            }}
                            className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-green-600">{selectedProduct.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product.id, selectedProduct.quantity + 1);
                            }}
                            className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vegetables Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">🥕 Fresh Vegetables</h3>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => scroll('left', vegetablesScrollRef)} 
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => scroll('right', vegetablesScrollRef)} 
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={vegetablesScrollRef}
                className="flex overflow-x-auto no-scrollbar space-x-2 pb-2"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {getProductsByCategory('vegetables').map((product) => {
                  const selectedProduct = selectedProducts.find(p => p.id === product.id);
                  return (
                    <div
                      key={product.id}
                      className="flex-shrink-0 w-1/3 max-w-[120px] min-w-[100px] bg-gray-50 rounded-lg border border-gray-200 p-2 cursor-pointer hover:border-green-500 transition duration-200"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="w-full flex justify-center items-center mb-2">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                      <h3 className="text-xs font-semibold text-gray-800 mb-1 truncate text-center">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-1 text-center">{product.unit}</p>
                      <p className="text-xs font-bold text-green-600 text-center">₹{product.price}</p>
                      {selectedProduct && (
                        <div className="mt-2 flex items-center justify-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product.id, selectedProduct.quantity - 1);
                            }}
                            className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-green-600">{selectedProduct.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product.id, selectedProduct.quantity + 1);
                            }}
                            className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Products Summary */}
            {selectedProducts.length > 0 && (
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Selected Products ({selectedProducts.length})</h4>
                <div className="space-y-1">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-700">{product.name}</span>
                      <span className="text-green-600 font-semibold">Qty: {product.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setCurrentStep(3)}
              disabled={selectedProducts.length === 0}
              className={`w-full py-2 px-4 rounded text-sm font-semibold transition duration-200 ${
                selectedProducts.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Frequency Selection and Checkout */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Select Delivery Frequency</h2>
            
            {/* Show selected products summary */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Your Subscription</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-700">{product.name}</span>
                    <span className="text-green-600 font-semibold">Qty: {product.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Delivery Frequency
              </label>
              <div className="space-y-2">
                {frequencyOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={deliveryFrequency === option.value}
                      onChange={(e) => setDeliveryFrequency(e.target.value)}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleFrequencyAndCheckout}
              className="w-full bg-green-500 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-green-600 transition duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {message && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded text-sm shadow-lg z-50">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
