import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderHistory from './OrderHistory';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'orders'
    
    const [addressForm, setAddressForm] = useState({
        addressType: 'home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        isDefault: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchUserAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/user/addresses`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const addressesData = await response.json();
                setAddresses(addressesData);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleAddressChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/user/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addressForm)
            });

            if (response.ok) {
                setShowAddAddress(false);
                setAddressForm({
                    addressType: 'home',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    country: '',
                    zipCode: '',
                    isDefault: false
                });
                fetchUserAddresses();
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleEditAddress = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/user/addresses/${editingAddress.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addressForm)
            });

            if (response.ok) {
                setEditingAddress(null);
                setAddressForm({
                    addressType: 'home',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    country: '',
                    zipCode: '',
                    isDefault: false
                });
                fetchUserAddresses();
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/user/addresses/${addressId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    fetchUserAddresses();
                }
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    const startEditAddress = (address) => {
        setEditingAddress(address);
        setAddressForm({
            addressType: address.address_type || 'home',
            addressLine1: address.address_line1 || '',
            addressLine2: address.address_line2 || '',
            city: address.city || '',
            state: address.state || '',
            country: address.country || '',
            zipCode: address.zip_code || '',
            isDefault: address.is_default || false
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Please log in to view your profile.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', name: 'Personal Information', icon: '👤' },
        { id: 'addresses', name: 'Saved Addresses', icon: '📍' },
        { id: 'orders', name: 'Order History', icon: '📦' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-[#81c408] text-[#81c408]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="px-6 py-6">
                        {/* Personal Information Tab */}
                        {activeTab === 'profile' && (
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.first_name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.last_name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <p className="mt-1 text-sm text-gray-900">{user?.phone}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Saved Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
                                    <button
                                        onClick={() => setShowAddAddress(true)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-[#81c408] rounded-md hover:bg-green-600"
                                    >
                                        Add New Address
                                    </button>
                                </div>

                                {/* Address List */}
                                <div className="space-y-4">
                                    {addresses.map((address) => (
                                        <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#81c408] text-white">
                                                            {address.address_type}
                                                        </span>
                                                        {address.is_default && (
                                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-900">{address.address_line1}</p>
                                                    {address.address_line2 && (
                                                        <p className="text-sm text-gray-900">{address.address_line2}</p>
                                                    )}
                                                    <p className="text-sm text-gray-900">
                                                        {address.city}, {address.state} {address.zip_code}
                                                    </p>
                                                    <p className="text-sm text-gray-900">{address.country}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => startEditAddress(address)}
                                                        className="text-sm text-[#81c408] hover:text-green-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                        className="text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add/Edit Address Form */}
                                {(showAddAddress || editingAddress) && (
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                                        </h3>
                                        <form onSubmit={editingAddress ? handleEditAddress : handleAddAddress}>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Address Type</label>
                                                    <select
                                                        name="addressType"
                                                        value={addressForm.addressType}
                                                        onChange={handleAddressChange}
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
                                                        value={addressForm.addressLine1}
                                                        onChange={handleAddressChange}
                                                        required
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                                                    <input
                                                        type="text"
                                                        name="addressLine2"
                                                        value={addressForm.addressLine2}
                                                        onChange={handleAddressChange}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={addressForm.city}
                                                        onChange={handleAddressChange}
                                                        required
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">State/Province</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={addressForm.state}
                                                        onChange={handleAddressChange}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        value={addressForm.country}
                                                        onChange={handleAddressChange}
                                                        required
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        value={addressForm.zipCode}
                                                        onChange={handleAddressChange}
                                                        required
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#81c408] focus:border-[#81c408] sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="isDefault"
                                                        checked={addressForm.isDefault}
                                                        onChange={handleAddressChange}
                                                        className="h-4 w-4 text-[#81c408] focus:ring-[#81c408] border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                                                </label>
                                            </div>
                                            <div className="mt-6 flex space-x-3">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 text-sm font-medium text-white bg-[#81c408] rounded-md hover:bg-green-600"
                                                >
                                                    {editingAddress ? 'Update Address' : 'Add Address'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowAddAddress(false);
                                                        setEditingAddress(null);
                                                        setAddressForm({
                                                            addressType: 'home',
                                                            addressLine1: '',
                                                            addressLine2: '',
                                                            city: '',
                                                            state: '',
                                                            country: '',
                                                            zipCode: '',
                                                            isDefault: false
                                                        });
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order History Tab */}
                        {activeTab === 'orders' && (
                            <OrderHistory />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 
