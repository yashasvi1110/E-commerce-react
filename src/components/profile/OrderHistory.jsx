import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart, clearCart } from '../../redux/CartSlice';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        // Load orders from localStorage (in a real app, this would be from an API)
        const loadOrders = () => {
            try {
                const savedOrders = localStorage.getItem('orderHistory');
                if (savedOrders) {
                    setOrders(JSON.parse(savedOrders));
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            }
            setLoading(false);
        };

        loadOrders();
    }, []);

    const handleReorder = (order) => {
        if (order.items && order.items.length > 0) {
            // Clear current cart
            dispatch(clearCart());
            
            // Add all items from the order to cart
            order.items.forEach(item => {
                dispatch(addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    img: item.img,
                    quantity: item.quantity
                }));
            });
            
            // Navigate to cart
            navigate('/cart');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-4">Start shopping to see your order history here.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
                <span className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="space-y-4">
                {orders.map((order, index) => (
                    <div key={order.orderId || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Order #{order.orderId || `ORD-${Date.now() + index}`}</h3>
                                    <p className="text-sm text-gray-500">{formatDate(order.placedAt || new Date())}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status || 'Processing'}
                                    </span>
                                    <span className="font-semibold text-gray-800">₹{order.orderTotal || '0.00'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4">
                            <div className="space-y-3">
                                {order.items?.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center space-x-3">
                                        <img 
                                            src={item.img} 
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-800">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Subscription Info */}
                            {order.subscriptionInfo && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span className="text-sm font-medium text-green-800">Subscription Order</span>
                                    </div>
                                    <p className="text-xs text-green-700 mt-1">
                                        Products: {order.subscriptionInfo.products?.length > 0 ? order.subscriptionInfo.products.map(p => p.name).join(', ') : 'N/A'} | Total Items: {order.subscriptionInfo.products?.reduce((total, p) => total + p.quantity, 0) || 'N/A'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Actions */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder === order ? null : order)}
                                        className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                                    >
                                        {selectedOrder === order ? 'Hide Details' : 'View Details'}
                                    </button>
                                    <button
                                        onClick={() => handleReorder(order)}
                                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200"
                                    >
                                        Reorder
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {selectedOrder === order && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span className="font-medium">{order.paymentMethod || 'Not specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Address:</span>
                                        <span className="font-medium">{order.deliveryAddress || 'Not specified'}</span>
                                    </div>
                                    {order.estimatedDelivery && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Estimated Delivery:</span>
                                            <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory; 