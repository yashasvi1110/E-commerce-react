import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Billing = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated || !user) {

            
            navigate('/login');
            return;
        }
        
        // Pre-fill form with user data
        setFormData(prev => ({
            ...prev,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || ''
        }));
    }, [navigate, isAuthenticated, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        }
        
        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address is required';
        }
        
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }
        
        if (!formData.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            
            // Save billing information
            const response = await fetch(`${apiUrl}/api/user/billing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    billingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        addressLine1: formData.addressLine1,
                        addressLine2: formData.addressLine2,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country
                    }
                }),
            });
            
            if (response.ok) {
                // Redirect to home page after successful billing setup
                navigate('/');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to save billing information');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-[#81c408] mb-2">Welcome to Fruitables!</h1>
                        <p className="text-gray-600">Please complete your billing information to get started</p>
                        <p className="text-sm text-gray-500 mt-2">Payment details can be added later during checkout</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.firstName ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.lastName ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.phone ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.addressLine1 ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.city ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.state ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408] ${
                                            errors.zipCode ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#81c408] focus:border-[#81c408]"
                                    >
                                        <option value="India">India</option>
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information Notice */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-blue-800">Payment Information</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Payment details are not required at this time. You can choose your preferred payment method during checkout, including:
                                    </p>
                                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                                        <li>• Cash on Delivery</li>
                                        <li>• UPI Payment</li>
                                        <li>• Credit/Debit Cards</li>
                                        <li>• Digital Wallets</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#81c408]"
                            >
                                Skip for Now
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-[#81c408] text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#81c408] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Complete Setup'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Billing; 