import React, { useState, useEffect } from 'react'
import Back from './common/Back'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
    const items = useSelector(state => state.cart.items);
    const subtotal = useSelector(state => state.cart.subtotal);
    const total = useSelector(state => state.cart.total);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Authentication state
    const [user, setUser] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [form, setForm] = useState({
        firstName: '', lastName: '', company: '', address: '', city: '', country: '', zip: '', mobile: '', email: '', notes: '', upi: ''
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

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setIsAuthenticated(true);
                    fetchUserAddresses();
                    
                    // Pre-fill form with user data
                    setForm({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        company: '',
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
    };

    const fetchUserAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/user/addresses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const addressesData = await response.json();
                setUserAddresses(addressesData);
                
                // Set default address if available
                const defaultAddress = addressesData.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress);
                    fillFormWithAddress(defaultAddress);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fillFormWithAddress = (address) => {
        setForm({
            ...form,
            address: address.addressLine1,
            city: address.city,
            country: address.country,
            zip: address.zipCode
        });
    };

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
            const response = await fetch('http://localhost:5000/api/user/addresses', {
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
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = async () => {
        console.log('🛒 Placing order...');
        
        if (!isAuthenticated) {
            console.log('❌ Not authenticated, redirecting to login');
            navigate('/login');
            return;
        }

        if ((paymentMethod === 'Paypal' || paymentMethod === 'Direct Bank Transfer') && !form.upi) {
            alert('Please enter your UPI ID for the selected payment method.');
            return;
        }

        // Show loading state
        setPlacingOrder(true);
        
        // Simulate order processing delay
        setTimeout(() => {
            // Generate a fake order ID
            const fakeOrderId = 'ORD-' + Date.now();
            
            console.log('✅ Order placed successfully (simulated)');
            
            // Clear the cart
            dispatch({ type: 'cart/clearCart' });
            
            // Clear the form
            setForm({ 
                firstName: '', 
                lastName: '', 
                company: '', 
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
                    orderTotal: (total + 3).toFixed(2),
                    paymentMethod: paymentMethod
                } 
            });
            
            setPlacingOrder(false);
        }, 2000); // 2 second delay to show loading
    };

    const showUpi = paymentMethod === 'Paypal' || paymentMethod === 'Direct Bank Transfer';

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

    // Show authentication prompt if not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to Continue</h2>
                        <p className="text-gray-600 mb-6">Please sign in or create an account to complete your purchase.</p>
                        <div className="space-y-3">
                            <Link
                                to="/login"
                                className="w-full block px-4 py-2 bg-[#81c408] text-white rounded-md hover:bg-green-600 text-center"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="w-full block px-4 py-2 border border-[#81c408] text-[#81c408] rounded-md hover:bg-[#81c408] hover:text-white text-center"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Back title='Checkout'/>
            <div className='mx-5 sm:mx-16'>
                <h2 className='text-2xl font-semibold mb-6 mt-20 md:text-3xl lg:text-5xl' style={{color: '#45595b'}}>Billing details</h2>
                
                {/* Saved Addresses Section */}
                {userAddresses.length > 0 && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Addresses</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {userAddresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                        selectedAddress?.id === address.id
                                            ? 'border-[#81c408] bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleAddressSelection(address)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#81c408] text-white">
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

                {/* Add New Address Form */}
                {showNewAddressForm && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                        <form onSubmit={handleAddNewAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="md:col-span-2">
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
                            <div className="md:col-span-2 flex space-x-3">
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

                <div className='lg:flex lg:justify-between'>
                    <form className='lg:w-10/12 lg:mr-10' action="#" style={{color: '#45595b'}} onSubmit={e => e.preventDefault()}>
                        <div>
                            <label>First Name<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="firstName" value={form.firstName} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" required />
                        </div>
                        <div>
                            <label>Last Name<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="lastName" value={form.lastName} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" required />
                        </div>
                        <div>
                            <label>Company Name</label>
                            <input name="company" value={form.company} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" />
                        </div>
                        <div>
                            <label>Address<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="address" value={form.address} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" placeholder='House Number Street Name' required />
                        </div>
                        <div>
                            <label>Town/City<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="city" value={form.city} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" required />
                        </div>
                        <div>
                            <label>Country<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="country" value={form.country} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" required />
                        </div>
                        <div>
                            <label>Postcode/Zip<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="zip" value={form.zip} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" required />
                        </div>
                        <div>
                            <label>Mobile<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="mobile" value={form.mobile} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" required />
                        </div>
                        <div>
                            <label>Email Address<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <input name="email" value={form.email} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="email" required />
                        </div>
                        <div>
                            <label>Payment Method<sup className=' relative top-2 text-4xl'>*</sup></label>
                            <div className='my-2'>
                                <label><input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={handlePaymentChange}/> Cash on Delivery</label>
                            </div>
                            <div className='my-2'>
                                <label><input type="radio" name="paymentMethod" value="Paypal" checked={paymentMethod === 'Paypal'} onChange={handlePaymentChange}/> Paypal</label>
                            </div>
                            <div className='my-2'>
                                <label><input type="radio" name="paymentMethod" value="Direct Bank Transfer" checked={paymentMethod === 'Direct Bank Transfer'} onChange={handlePaymentChange}/> Direct Bank Transfer</label>
                            </div>
                            {showUpi && (
                                <div className='my-2'>
                                    <label>UPI ID:</label>
                                    <input name="upi" value={form.upi} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' type="text" placeholder='Paste your UPI ID here' required={showUpi} />
                                </div>
                            )}
                        </div>
                        <textarea name="notes" value={form.notes} onChange={handleChange} className='w-full border border-gray-300 outline-green-300 rounded-lg px-2 py-2 mt-2' cols="30" rows="10" placeholder='Order Notes (Optional)'></textarea>
                    </form>
                    
                    {/* Order Summary */}
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Products</th>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Price</th>
                                    <th scope="col" className="px-6 py-3">Quantity</th>
                                    <th scope="col" className="px-6 py-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <img className="img-cart rounded-full w-12 h-12 object-cover" src={item.img} alt={item.name} />
                                        </td>
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4">${item.price}</td>
                                        <td className="px-6 py-4">{item.quantity}</td>
                                        <td className="px-6 py-4">${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='flex justify-end pr-10 my-8' style={{color: '#45595b'}}>
                            <h3>Subtotal</h3>
                            <span className='ml-20'>${subtotal.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className='flex justify-center items-center my-20' style={{color: '#45595b'}}>
                            <h3>Shipping</h3>
                            <div className='ml-10 sm:ml-20'>
                                <div>
                                    <input type="checkbox" id='free' defaultChecked/>
                                    <label className='ml-2' htmlFor='free'>Standard Shipping: $3.00</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex justify-evenly my-16' style={{color: '#45595b'}}>
                            <h3 className='uppercase'>Total</h3>
                            <span>${(total + 3).toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className='px-4'>
                            <button 
                                onClick={handlePlaceOrder} 
                                disabled={placingOrder} 
                                className='order uppercase px-4 py-4 border border-orange-400 rounded-lg my-6 mx-auto text-center block w-full text-md font-semibold duration-500'
                            >
                                {placingOrder ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;
