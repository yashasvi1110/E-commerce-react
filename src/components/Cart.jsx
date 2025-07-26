import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart,  removeFromCart ,clearItem ,clearCart  } from '../redux/CartSlice';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const dispatch = useDispatch();
    const items = useSelector(state => state.cart.items);
    const subtotal = useSelector(state => state.cart.subtotal);
    const total = useSelector(state => state.cart.total);
    const navigate = useNavigate();

    const emptyCartMsg = (
        <h4 className="container mx-auto text-center py-4 text-2xl font-semibold" style={{color: '#45595b'}}>Your Cart is Empty</h4>
    );

    return (
        <>
        {/* Removed Back/banner section */}
        {items.length === 0 ? (
            emptyCartMsg
        ) : (
            <div className="mx-2 md:mx-10 lg:mx-24">
                <button onClick={() => dispatch(clearCart())} className="mb-6 text-right border border-red-500 rounded-lg px-6 py-3 duration-500 font-semibold text-gray-700 hover:bg-red-500 hover:text-white">Clear Cart</button>
                {/* Responsive grid for cart items */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
                    {items.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow p-2 flex flex-col items-center min-h-[180px]">
                            <div className="w-full h-20 flex items-center justify-center overflow-hidden rounded-lg mb-2">
                                <img className="object-cover w-full h-full rounded-lg" src={item.img} alt={item.name} />
                            </div>
                            <h3 className="text-base font-bold text-center mb-1">{item.name}</h3>
                            <span className="text-xs text-gray-500 mb-1">${item.price} x {item.quantity}</span>
                            <div className="flex items-center justify-center mb-2">
                                <button onClick={() => dispatch(removeFromCart(item))} className="bg-gray-100 rounded-full px-2 py-1 mx-1 text-sm"><i className="fa fa-minus"></i></button>
                                <span className="mx-2 text-sm font-semibold">{item.quantity}</span>
                                <button onClick={() => dispatch(addToCart(item))} className="bg-gray-100 rounded-full px-2 py-1 mx-1 text-sm"><i className="fa fa-plus"></i></button>
                            </div>
                            <span className="text-sm font-bold text-green-700 mb-2">${parseFloat(item.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => dispatch(clearItem(item))} className="bg-red-100 px-2 py-1 rounded-full text-xs text-red-600"><i className="fa fa-times"></i> Remove</button>
                        </div>
                    ))}
                </div>
                {/* Cart summary and checkout */}
                <div className="mt-8 bg-gray-100 p-6 rounded-lg w-full max-w-md mx-auto mb-4">
                    <h1 className="text-2xl font-bold mb-4 text-center" style={{color: '#45595b'}}>Cart Total</h1>
                    <div className="flex justify-between my-2">
                        <h2 className="text-lg font-semibold">Subtotal:</h2>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between my-2">
                        <h2 className="text-lg font-semibold">Shipping</h2>
                        <span>$3.00</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between my-2">
                        <h2 className="font-semibold text-lg">Total</h2>
                        <span>${(total + 3).toFixed(2)}</span>
                    </div>
                    <button onClick={() => navigate('/checkout')} className="w-full px-6 py-3 font-semibold mt-4 border border-orange-400 rounded-full uppercase duration-500 checkout bg-orange-400" style={{color: '#fff'}}>Proceed Checkout</button>
                </div>
            </div>
        )} 
        </>
  );
}