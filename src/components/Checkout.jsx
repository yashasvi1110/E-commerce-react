import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LastMinuteBuy from './LastMinuteBuy';
import Subscribe from './subscribe';
import { addToCart, removeFromCart, clearCart } from '../redux/CartSlice';

const Checkout = () => {
    const items = useSelector(state => state.cart.items);
    const subtotal = useSelector(state => state.cart.subtotal);
    const total = useSelector(state => state.cart.total);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const orderSummaryRef = useRef(null);
    
    // API URL for backend calls
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    // Authentication state
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [form, setForm] = useState({
        firstName: '', lastName: '', address: '', city: '', country: '', zip: '', mobile: '', email: '', notes: '', upi: ''
    });
    
    const [newAddressForm, setNewAddressForm] = useState({
        addressType: 'home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        isDefault: false
    });

    const [placingOrder, setPlacingOrder] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    // Company address and distance calculation
    const companyAddress = {
        name: 'Bhutani Alphatum',
        address: 'Bhutani Alphatum, Sector 90, Noida, Uttar Pradesh 201305, India',
        coordinates: {
            lat: 28.6139, // Noida coordinates (approximate)
            lng: 77.2090
        }
    };
    
    const [deliveryDistance, setDeliveryDistance] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        return distance;
    };

    // Calculate delivery fee based on distance
    const calculateDeliveryFee = (distance) => {
        if (distance <= 5) {
            return 10;
        } else if (distance <= 10) {
            return 20;
        } else if (distance <= 15) {
            return 30;
        } else if (distance <= 20) {
            return 40;
        } else if (distance <= 25) {
            return 50;
        } else if (distance <= 30) {
            return 60;
        } else {
            return 75; // For distances above 30km
        }
    };

    // Get coordinates from address using Geocoding API
    const getCoordinatesFromAddress = async (address) => {
        try {
            // For demo purposes, we'll use a simple mapping of common areas
            // In a real app, you would use Google Maps Geocoding API or similar
            const addressLower = address.toLowerCase();
            
            // Mock coordinates for common areas in Noida/Delhi NCR
            const areaCoordinates = {
                'noida': { lat: 28.5355, lng: 77.3910 },
                'delhi': { lat: 28.7041, lng: 77.1025 },
                'gurgaon': { lat: 28.4595, lng: 77.0266 },
                'ghaziabad': { lat: 28.6692, lng: 77.4538 },
                'faridabad': { lat: 28.4089, lng: 77.3178 },
                'greater noida': { lat: 28.4744, lng: 77.5040 },
                'sector 90': { lat: 28.6139, lng: 77.2090 },
                'sector 62': { lat: 28.6274, lng: 77.3769 },
                'sector 63': { lat: 28.6289, lng: 77.3745 },
                'sector 64': { lat: 28.6304, lng: 77.3721 },
                'sector 65': { lat: 28.6319, lng: 77.3697 },
                'sector 66': { lat: 28.6334, lng: 77.3673 },
                'sector 67': { lat: 28.6349, lng: 77.3649 },
                'sector 68': { lat: 28.6364, lng: 77.3625 },
                'sector 69': { lat: 28.6379, lng: 77.3601 },
                'sector 70': { lat: 28.6394, lng: 77.3577 },
                'sector 71': { lat: 28.6409, lng: 77.3553 },
                'sector 72': { lat: 28.6424, lng: 77.3529 },
                'sector 73': { lat: 28.6439, lng: 77.3505 },
                'sector 74': { lat: 28.6454, lng: 77.3481 },
                'sector 75': { lat: 28.6469, lng: 77.3457 },
                'sector 76': { lat: 28.6484, lng: 77.3433 },
                'sector 77': { lat: 28.6499, lng: 77.3409 },
                'sector 78': { lat: 28.6514, lng: 77.3385 },
                'sector 79': { lat: 28.6529, lng: 77.3361 },
                'sector 80': { lat: 28.6544, lng: 77.3337 },
                'sector 81': { lat: 28.6559, lng: 77.3313 },
                'sector 82': { lat: 28.6574, lng: 77.3289 },
                'sector 83': { lat: 28.6589, lng: 77.3265 },
                'sector 84': { lat: 28.6604, lng: 77.3241 },
                'sector 85': { lat: 28.6619, lng: 77.3217 },
                'sector 86': { lat: 28.6634, lng: 77.3193 },
                'sector 87': { lat: 28.6649, lng: 77.3169 },
                'sector 88': { lat: 28.6664, lng: 77.3145 },
                'sector 89': { lat: 28.6679, lng: 77.3121 },
                'sector 90': { lat: 28.6694, lng: 77.3097 },
                'sector 91': { lat: 28.6709, lng: 77.3073 },
                'sector 92': { lat: 28.6724, lng: 77.3049 },
                'sector 93': { lat: 28.6739, lng: 77.3025 },
                'sector 94': { lat: 28.6754, lng: 77.3001 },
                'sector 95': { lat: 28.6769, lng: 77.2977 },
                'sector 96': { lat: 28.6784, lng: 77.2953 },
                'sector 97': { lat: 28.6799, lng: 77.2929 },
                'sector 98': { lat: 28.6814, lng: 77.2905 },
                'sector 99': { lat: 28.6829, lng: 77.2881 },
                'sector 100': { lat: 28.6844, lng: 77.2857 }
            };

            // Check for exact matches first
            for (const [area, coords] of Object.entries(areaCoordinates)) {
                if (addressLower.includes(area)) {
                    return coords;
                }
            }

            // If no exact match, return default Noida coordinates
            return { lat: 28.5355, lng: 77.3910 };
        } catch (error) {
            console.error('Error getting coordinates:', error);
            // Return default coordinates if geocoding fails
            return { lat: 28.5355, lng: 77.3910 };
        }
    };

    // Calculate delivery details when address changes
    const calculateDeliveryDetails = async (address, city) => {
        if (!address || !city) {
            setDeliveryDistance(null);
            setDeliveryFee(0);
            setEstimatedDeliveryTime('');
            return;
        }

        try {
            const deliveryCoords = await getCoordinatesFromAddress(`${address}, ${city}`);
            const distance = calculateDistance(
                companyAddress.coordinates.lat,
                companyAddress.coordinates.lng,
                deliveryCoords.lat,
                deliveryCoords.lng
            );
            
            const fee = calculateDeliveryFee(distance);
            const deliveryTime = Math.ceil(distance / 10) + 1; // Rough estimate: 10km/hour + 1 hour processing
            
            setDeliveryDistance(distance);
            setDeliveryFee(fee);
            setEstimatedDeliveryTime(`${deliveryTime} hour${deliveryTime > 1 ? 's' : ''}`);
        } catch (error) {
            console.error('Error calculating delivery details:', error);
            setDeliveryDistance(null);
            setDeliveryFee(0);
            setEstimatedDeliveryTime('');
        }
    };

    const checkAuthentication = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${apiUrl}/api/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setIsAuthenticated(true);
                    
                    // Pre-fill form with user data
                    setForm({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        address: '',
                        city: '',
                        country: '',
                        zip: '',
                        mobile: userData.phone || '',
                        email: userData.email || '',
                        notes: '',
                        upi: ''
                    });
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, [apiUrl]);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    // Auto-scroll to top if from subscription
    useEffect(() => {
        if (location.state && location.state.fromSubscription) {
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);

    // Calculate delivery details when address or city changes
    useEffect(() => {
        if (form.address && form.city) {
            calculateDeliveryDetails(form.address, form.city);
        }
    }, [form.address, form.city]);

    const fillFormWithAddress = useCallback((address) => {
        setForm({
            ...form,
            address: address.addressLine1,
            city: address.city,
            country: address.country,
            zip: address.zipCode
        });
    }, [form]);

    // Removed unused function - not needed for guest checkout

    // Removed duplicate function - now using useCallback version above

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);
        fillFormWithAddress(address);
    };

    const handleNewAddressChange = (e) => {
        setNewAddressForm({
            ...newAddressForm,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        });
    };

    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/user/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAddressForm)
            });

            if (response.ok) {
                const newAddress = await response.json();
                setUserAddresses([...userAddresses, newAddress]);
                setSelectedAddress(newAddress);
                fillFormWithAddress(newAddress);
                setShowNewAddressForm(false);
                setNewAddressForm({
                    addressType: 'home',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    country: '',
                    zipCode: '',
                    isDefault: false
                });
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        
        // Trigger delivery calculation for address and city changes
        if (e.target.name === 'address' || e.target.name === 'city') {
            const newForm = { ...form, [e.target.name]: e.target.value };
            if (newForm.address && newForm.city) {
                calculateDeliveryDetails(newForm.address, newForm.city);
            }
        }
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = async () => {
        console.log('🛒 Placing order...');
        
        // Require authentication for checkout
        if (!isAuthenticated) {
            alert('Please login or create an account to place an order.');
            navigate('/login');
            return;
        }

        if (paymentMethod === 'UPI' && !form.upi) {
            alert('Please enter your UPI ID for UPI payment.');
            return;
        }

        // Show loading state
        setPlacingOrder(true);
        
        // Simulate order processing delay
        setTimeout(() => {
            // Generate a fake order ID
            const fakeOrderId = 'ORD-' + Date.now();
            
            console.log('✅ Order placed successfully (simulated)');
            
            // Create order object
            const orderData = {
                orderId: fakeOrderId,
                placedAt: Date.now(),
                orderTotal: (total + (deliveryDistance !== null ? deliveryFee : 3)).toFixed(2),
                paymentMethod: paymentMethod,
                status: 'Processing',
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    img: item.img,
                    quantity: item.quantity
                })),
                deliveryAddress: `${form.address}, ${form.city}, ${form.country} ${form.zip}`,
                customerInfo: {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    mobile: form.mobile
                },
                notes: form.notes,
                upi: form.upi,
                deliveryDetails: {
                    distance: deliveryDistance,
                    fee: deliveryDistance !== null ? deliveryFee : 3,
                    estimatedTime: estimatedDeliveryTime,
                    fromAddress: companyAddress.address
                }
            };

            // Get subscription info if available
            const subscriptionInfo = sessionStorage.getItem('subscriptionInfo');
            if (subscriptionInfo) {
                orderData.subscriptionInfo = JSON.parse(subscriptionInfo);
            }

            // Save order to localStorage
            const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
            existingOrders.unshift(orderData); // Add new order at the beginning
            localStorage.setItem('orderHistory', JSON.stringify(existingOrders));
            
            // Clear the cart
            dispatch(clearCart());
            
            // Clear the form
            setForm({ 
                firstName: '', 
                lastName: '', 
                address: '', 
                city: '', 
                country: '', 
                zip: '', 
                mobile: '', 
                email: '', 
                notes: '', 
                upi: '' 
            });
            
            // Navigate to success page
            navigate('/order-success', { 
                state: { 
                    orderId: fakeOrderId, 
                    placedAt: Date.now(),
                    orderTotal: (total + (deliveryDistance !== null ? deliveryFee : 3)).toFixed(2),
                    paymentMethod: paymentMethod
                } 
            });
            
            setPlacingOrder(false);
        }, 2000); // 2 second delay to show loading
    };

    // Removed unused function

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81c408] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }



        return (
        <div>
            
            {/* Login Required Banner - show when not authenticated */}
            {!isAuthenticated && (
                <div className="mx-3 sm:mx-8 lg:mx-16 mt-16 lg:mt-20 mb-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 lg:p-4">
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            <span className="text-sm lg:text-base font-medium text-orange-800">
                                🔐 Login Required! Please sign in or create an account to place your order.
                            </span>
                        </div>
                        <div className="flex justify-center mt-3 space-x-3">
                            <button 
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => navigate('/signup')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Subscription Banner */}
            {location.state && location.state.fromSubscription && (
                <div className="mx-3 sm:mx-8 lg:mx-16 mt-16 lg:mt-20 mb-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 lg:p-4">
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-sm lg:text-base font-medium text-green-800">
                                Subscription Setup Complete! Please fill in your billing details below.
                            </span>
                    </div>
                </div>
            </div>
            )}
            
            <div className='mx-3 sm:mx-8 lg:mx-16'>
                <h2 className='text-xl sm:text-2xl font-semibold mb-4 mt-4 lg:mt-8 lg:text-3xl xl:text-5xl' style={{color: '#45595b'}}>Billing details</h2>
                
                {/* Saved Addresses Section - Mobile optimized */}
                {userAddresses.length > 0 && (
                    <div className="mb-6 lg:mb-8 p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4">Saved Addresses</h3>
                        <div className="grid grid-cols-1 gap-3 lg:gap-4 mb-3 lg:mb-4">
                            {userAddresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={`border rounded-lg p-3 lg:p-4 cursor-pointer transition-colors ${
                                        selectedAddress?.id === address.id
                                            ? 'border-[#81c408] bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleAddressSelection(address)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#81c408] text-white">
                                            {address.addressType}
                                        </span>
                                        {address.isDefault && (
                                            <span className="text-xs text-blue-600 font-medium">Default</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-900">{address.addressLine1}</p>
                                    {address.addressLine2 && (
                                        <p className="text-sm text-gray-900">{address.addressLine2}</p>
                                    )}
                                    <p className="text-sm text-gray-900">
                                        {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-sm text-gray-900">{address.country}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowNewAddressForm(true)}
                            className="text-sm text-[#81c408] hover:text-green-600"
                        >
                            + Add New Address
                        </button>
                    </div>
                )}

                {/* Add New Address Form - Mobile optimized */}
                {showNewAddressForm && (
                    <div className="mb-6 lg:mb-8 p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4">Add New Address</h3>
                        <form onSubmit={handleAddNewAddress} className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address Type</label>
                                <select
                                    name="addressType"
                                    value={newAddressForm.addressType}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={newAddressForm.addressLine1}
                                    onChange={handleNewAddressChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={newAddressForm.addressLine2}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddressForm.city}
                                    onChange={handleNewAddressChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State/Province</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={newAddressForm.state}
                                    onChange={handleNewAddressChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={newAddressForm.country}
                                    onChange={handleNewAddressChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={newAddressForm.zipCode}
                                    onChange={handleNewAddressChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                />
                            </div>
                            <div className="lg:col-span-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={newAddressForm.isDefault}
                                        onChange={handleNewAddressChange}
                                        className="h-4 w-4 text-[#81c408] focus:ring-[#81c408] border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                                </label>
                            </div>
                            <div className="lg:col-span-2 flex space-x-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#81c408] rounded-md hover:bg-green-600"
                                >
                                    Add Address
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewAddressForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className='lg:flex lg:justify-between lg:space-x-8'>
                    <form className='lg:w-1/2 lg:pr-4' action="#" style={{color: '#45595b'}} onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                                <label className="block text-sm font-medium mb-1">First Name<sup className='text-red-500'>*</sup></label>
                                <input name="firstName" value={form.firstName} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" required />
                        </div>
                        <div>
                                <label className="block text-sm font-medium mb-1">Last Name<sup className='text-red-500'>*</sup></label>
                                <input name="lastName" value={form.lastName} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" required />
                        </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-1">Address<sup className='text-red-500'>*</sup></label>
                                <input name="address" value={form.address} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" placeholder='House Number Street Name' required />
                        </div>
                        <div>
                                <label className="block text-sm font-medium mb-1">Town/City<sup className='text-red-500'>*</sup></label>
                                <input name="city" value={form.city} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" required />
                        </div>
                        <div>
                                <label className="block text-sm font-medium mb-1">Country<sup className='text-red-500'>*</sup></label>
                                <input name="country" value={form.country} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" required />
                        </div>
                        <div>
                                <label className="block text-sm font-medium mb-1">Postcode/Zip<sup className='text-red-500'>*</sup></label>
                                <input name="zip" value={form.zip} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" required />
                        </div>
                        <div>
                                <label className="block text-sm font-medium mb-1">Mobile<sup className='text-red-500'>*</sup></label>
                                <input name="mobile" value={form.mobile} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" required />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-1">Email Address<sup className='text-red-500'>*</sup></label>
                                <input name="email" value={form.email} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="email" required />
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-3">Payment Method<sup className='text-red-500'>*</sup></label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={handlePaymentChange} className="mr-2"/>
                                    <span className="text-sm">Cash on Delivery</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={handlePaymentChange} className="mr-2"/>
                                    <span className="text-sm">UPI Payment</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="paymentMethod" value="Paypal" checked={paymentMethod === 'Paypal'} onChange={handlePaymentChange} className="mr-2"/>
                                    <span className="text-sm">Paypal</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="paymentMethod" value="Direct Bank Transfer" checked={paymentMethod === 'Direct Bank Transfer'} onChange={handlePaymentChange} className="mr-2"/>
                                    <span className="text-sm">Direct Bank Transfer</span>
                                </label>
                            </div>
                            {paymentMethod === 'UPI' && (
                                <div className="mt-3">
                                    <label className="block text-sm font-medium mb-1">UPI ID<sup className='text-red-500'>*</sup></label>
                                    <input name="upi" value={form.upi} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' type="text" placeholder='Enter your UPI ID (e.g., name@upi)' required />
                                    <p className="text-xs text-gray-500 mt-1">Example: john.doe@okicici, 9876543210@paytm</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                            <textarea name="notes" value={form.notes} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-3 py-2 text-sm' rows="4" placeholder='Any special instructions...'></textarea>
                        </div>
                    </form>
                    
                    <div className="lg:w-1/2 lg:pl-4 mt-8 lg:mt-0">
                        {/* Last Minute Buy - Mobile Optimized */}
                        <div className="mb-4">
                            <LastMinuteBuy category="fruits" title="🍎 Quick Add Fruits" />
                        </div>
                        <div className="mb-4">
                            <LastMinuteBuy category="vegetables" title="🥕 Quick Add Vegetables" />
                        </div>
                        
                        {/* Order Summary - Mobile Optimized */}
                        <div ref={orderSummaryRef} className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="bg-white rounded-lg p-4 lg:p-6">
                                <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                                
                                {/* Mobile-friendly product list */}
                                <div className="space-y-3 mb-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <img 
                                                className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg" 
                                                src={item.img} 
                                                alt={item.name} 
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm lg:text-base truncate">{item.name}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <button
                                                        onClick={() => dispatch(removeFromCart({ id: item.id }))}
                                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold text-gray-700 focus:outline-none"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-base font-semibold w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(addToCart({ ...item }))}
                                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold text-gray-700 focus:outline-none"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600 text-sm lg:text-base">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-gray-500 text-xs">₹{item.price} each</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price breakdown - Mobile optimized */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm lg:text-base">
                                        <span className="text-gray-600">Subtotal ({items.length} items)</span>
                                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    {/* Delivery Information */}
                                    {deliveryDistance !== null && (
                                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                                <span className="text-sm font-medium text-blue-800">Delivery Details</span>
                                            </div>
                                            <div className="space-y-1 text-xs text-blue-700">
                                                <div className="flex justify-between">
                                                    <span>Distance:</span>
                                                    <span>{deliveryDistance.toFixed(1)} km</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>From:</span>
                                                    <span className="text-right">{companyAddress.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Est. Time:</span>
                                                    <span>{estimatedDeliveryTime}</span>
                                </div>
                            </div>
                        </div>
                                    )}
                                    
                                    <div className="flex justify-between text-sm lg:text-base">
                                        <span className="text-gray-600">Delivery Fee</span>
                                        <span className="text-green-600 font-semibold">
                                            {deliveryDistance !== null ? `₹${deliveryFee.toFixed(2)}` : '₹3.00'}
                                        </span>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-base lg:text-lg font-bold text-gray-800">
                                        <span>Total</span>
                                        <span>₹{(total + (deliveryDistance !== null ? deliveryFee : 3)).toFixed(2)}</span>
                                    </div>
                        </div>



                                {/* Place Order Button - Mobile optimized */}
                            <button 
                                onClick={handlePlaceOrder} 
                                disabled={placingOrder} 
                                    className={`w-full py-3 lg:py-4 px-4 rounded-lg font-semibold text-sm lg:text-base transition duration-200 ${
                                        placingOrder 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-orange-400 hover:bg-orange-500 text-white hover:scale-105'
                                    }`}
                                >
                                    {placingOrder ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Placing Order...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <span>Place Order</span>
                                        </div>
                                    )}
                            </button>
                            </div>
                        </div>

                        {/* Subscribe Section - Right after Order Summary */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-800">Subscribe for Regular Deliveries</h3>
                            <Subscribe />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;
