import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartSlice';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';

const Subscribe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
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

  // Handle email submission
  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }
    setCurrentStep(2);
    setMessage('');
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep(3);
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentStep(4);
  };

  // Handle quantity selection
  const handleNextToFrequency = () => {
    if (!selectedProduct || quantity < 1) {
      setMessage('Please select a product and quantity');
      return;
    }
    setCurrentStep(5);
  };

  // Handle frequency selection and redirect to checkout
  const handleFrequencyAndCheckout = () => {
    // Add product to cart
    dispatch(addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      img: selectedProduct.img,
      quantity: quantity
    }));
    // Store subscription info in sessionStorage
    sessionStorage.setItem('subscriptionInfo', JSON.stringify({
      email,
      category: selectedCategory,
      product: selectedProduct,
      quantity,
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
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep >= step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && (
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

        {/* Step 2: Category Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Choose Category</h2>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => handleCategorySelect('fruits')}
                className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-green-500 hover:shadow transition duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🍎</div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Fresh Fruits</h3>
                  <p className="text-xs text-gray-600">Get fresh fruits delivered</p>
                </div>
              </div>
              <div
                onClick={() => handleCategorySelect('vegetables')}
                className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-green-500 hover:shadow transition duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🥕</div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Fresh Vegetables</h3>
                  <p className="text-xs text-gray-600">Get fresh vegetables delivered</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Product Selection */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Select Product</h2>
            <div className="grid grid-cols-2 gap-2">
              {getProductsByCategory(selectedCategory).map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-green-500 hover:shadow transition duration-200 flex flex-col items-center min-h-[140px]"
                  style={{ minHeight: 140 }}
                >
                  <div className="w-full flex justify-center items-center mb-2" style={{height: '64px'}}>
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      style={{objectFit: 'cover', width: 64, height: 64}}
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800 mb-1 truncate w-full text-center">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-1 w-full text-center">{product.unit}</p>
                  <p className="text-xs font-bold text-green-600 w-full text-center">₹{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Quantity Selection */}
        {currentStep === 4 && selectedProduct && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Select Quantity</h2>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{selectedProduct.name}</h3>
                  <p className="text-xs text-gray-600">{selectedProduct.unit}</p>
                  <p className="text-sm font-bold text-green-600">₹{selectedProduct.price}</p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Quantity per delivery
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 text-sm"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleNextToFrequency}
              className="w-full bg-green-500 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-green-600 transition duration-200"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 5: Frequency Selection and Checkout */}
        {currentStep === 5 && selectedProduct && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Select Delivery Frequency</h2>
            {/* Show product and quantity summary */}
            <div className="mb-3 text-xs text-gray-700 text-center">
              <span className="font-semibold">Product:</span> {selectedProduct.name} &nbsp;|&nbsp; <span className="font-semibold">Quantity:</span> {quantity}
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
