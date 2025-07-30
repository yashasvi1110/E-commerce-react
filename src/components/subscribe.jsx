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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deliveryFrequency, setDeliveryFrequency] = useState('daily');
  const [message, setMessage] = useState('');

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [customDeliveryDates, setCustomDeliveryDates] = useState([]);
  const [scheduleMode, setScheduleMode] = useState('frequency'); // 'frequency' or 'custom'

  // Filter products by category
  const getProductsByCategory = (category) => {
    return productsData.products.filter(product => product.category === category);
  };

  // Delivery frequency options
  const frequencyOptions = [
    { value: 'daily', label: 'Daily', days: 1 },
    { value: 'every2days', label: 'Every 2 days', days: 2 },
    { value: 'every3days', label: 'Every 3 days', days: 3 },
    { value: 'every5days', label: 'Every 5 days', days: 5 },
    { value: 'weekly', label: 'Weekly', days: 7 }
  ];

  // Get selected frequency object
  const getSelectedFrequency = () => {
    return frequencyOptions.find(option => option.value === deliveryFrequency);
  };

  // Generate delivery dates based on frequency
  const generateDeliveryDates = () => {
    if (scheduleMode === 'custom') {
      return customDeliveryDates;
    }
    
    const frequency = getSelectedFrequency();
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start from today
    
    for (let i = 0; i < 30; i++) { // Generate next 30 delivery dates
      const date = new Date(today);
      date.setDate(today.getDate() + (i * frequency.days));
      dates.push(date);
    }
    
    return dates;
  };

  // Check if a date is a delivery date
  const isDeliveryDate = (date) => {
    const deliveryDates = generateDeliveryDates();
    return deliveryDates.some(deliveryDate => 
      deliveryDate.toDateString() === date.toDateString()
    );
  };

  // Handle custom date selection
  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Allow today and future dates (including next day)
    if (selectedDate < today) {
      return;
    }

    const dateString = date.toDateString();
    const isSelected = customDeliveryDates.some(d => d.toDateString() === dateString);
    
    if (isSelected) {
      // Remove date if already selected
      setCustomDeliveryDates(customDeliveryDates.filter(d => d.toDateString() !== dateString));
    } else {
      // Add date if not selected
      setCustomDeliveryDates([...customDeliveryDates, date].sort((a, b) => a - b));
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

    if (scheduleMode === 'custom' && customDeliveryDates.length === 0) {
      setMessage('Please select at least one delivery date');
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
      products: selectedProducts,
      frequency: deliveryFrequency,
      scheduleMode: scheduleMode,
      customDates: customDeliveryDates.map(date => date.toISOString())
    }));

    // Redirect to checkout
    navigate('/checkout', { state: { fromSubscription: true } });
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const calendar = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateForComparison = new Date(date);
      dateForComparison.setHours(0, 0, 0, 0);
      
      const isToday = dateForComparison.getTime() === today.getTime();
      const isPast = dateForComparison < today;
      const isDeliveryDay = isDeliveryDate(date);
      const isClickable = scheduleMode === 'custom' && !isPast;
      
      calendar.push(
        <div
          key={day}
          onClick={() => isClickable && handleDateClick(date)}
          className={`h-8 flex items-center justify-center text-xs font-medium rounded transition-colors ${
            isToday 
              ? 'bg-blue-500 text-white' 
              : isDeliveryDay 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : isPast 
                  ? 'text-gray-400' 
                  : isClickable
                    ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                    : 'text-gray-700'
          } ${isClickable ? 'cursor-pointer' : ''}`}
        >
          {day}
        </div>
      );
    }

    return calendar;
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
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep >= step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 2 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Product Selection with Sliding */}
        {currentStep === 1 && (
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
              onClick={() => setCurrentStep(2)}
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

        {/* Step 2: Frequency Selection and Calendar */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-base font-bold text-gray-800 mb-3">Select Delivery Schedule</h2>
            
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

            {/* Schedule Mode Selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Schedule Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleMode"
                    value="frequency"
                    checked={scheduleMode === 'frequency'}
                    onChange={(e) => {
                      setScheduleMode(e.target.value);
                      setCustomDeliveryDates([]);
                    }}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Regular Schedule</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
      <input
                    type="radio"
                    name="scheduleMode"
                    value="custom"
                    checked={scheduleMode === 'custom'}
                    onChange={(e) => {
                      setScheduleMode(e.target.value);
                      setDeliveryFrequency('daily');
                    }}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Custom Dates</span>
                </label>
              </div>
            </div>

            {/* Frequency Selection (only for regular schedule) */}
            {scheduleMode === 'frequency' && (
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
            )}

            {/* Custom Dates Summary */}
            {scheduleMode === 'custom' && customDeliveryDates.length > 0 && (
              <div className="mb-4 bg-blue-50 rounded-lg p-3">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">Selected Delivery Dates ({customDeliveryDates.length})</h5>
                <div className="flex flex-wrap gap-1">
                  {customDeliveryDates.map((date, index) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {formatDate(date)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Section */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                {scheduleMode === 'custom' ? 'Click today or future dates to select delivery days' : 'Delivery Schedule'}
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h5 className="text-sm font-semibold text-gray-800">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h5>
      <button
                    onClick={goToNextMonth}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
      >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
      </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-6 flex items-center justify-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Delivery Day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Delivery Info */}
            {scheduleMode === 'frequency' && (
              <div className="mb-4 bg-green-50 rounded-lg p-3">
                <h5 className="text-sm font-semibold text-gray-800 mb-1">Next Delivery</h5>
                <p className="text-xs text-gray-600">
                  Your first delivery will be on{' '}
                  <span className="font-semibold text-green-600">
                    {formatDate(generateDeliveryDates()[0])}
              </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Then every {getSelectedFrequency().days} day{getSelectedFrequency().days > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Custom Schedule Info */}
            {scheduleMode === 'custom' && (
              <div className="mb-4 bg-blue-50 rounded-lg p-3">
                <h5 className="text-sm font-semibold text-gray-800 mb-1">Custom Schedule</h5>
                <p className="text-xs text-gray-600">
                  Click on today or any future date to select it for delivery
                </p>
                {customDeliveryDates.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {customDeliveryDates.length} delivery date{customDeliveryDates.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}
            
                <button
              onClick={handleFrequencyAndCheckout}
              disabled={scheduleMode === 'custom' && customDeliveryDates.length === 0}
              className={`w-full py-2 px-4 rounded text-sm font-semibold transition duration-200 ${
                scheduleMode === 'custom' && customDeliveryDates.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
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
