import React from 'react'
import { vegetables } from '../../data/Data'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/CartSlice';

const Vegetables = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    return (
        <div className='mt-10 container mx-auto'>
            <div className='flex flex-col mb-6 mx-2 md:mx-8'>
                {/* Remove or replace the headline */}
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2 md:px-8'>
                {vegetables.map((val) => (
                    <div key={val.id} className='bg-white rounded-xl shadow p-2 flex flex-col items-center min-h-[270px]'>
                        <div className='w-full h-28 flex items-center justify-center overflow-hidden rounded-lg'>
                            <img src={val.img} alt={val.name} className='object-cover w-full h-full'/>
                        </div>
                        <span className='mt-2 text-xs font-semibold text-green-600'>Vegetables</span>
                        <h3 className='text-base font-bold mt-1 mb-1 text-center'>{val.name}</h3>
                        <p className='text-xs text-gray-500 text-center mb-2'>{val.desc}</p>
                        <div className='flex items-center justify-between w-full mt-auto'>
                            <span className='text-sm font-bold text-green-700'>${val.price}</span>
                            {(() => {
                                const cartItem = cartItems.find(item => item.id === val.id);
                                return cartItem ? (
                                    // Quantity controls when item is in cart
                                    <div className="flex items-center gap-1">
                                        <button
                                            className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold active:scale-95 transition-transform duration-100"
                                            onClick={() => dispatch(removeFromCart(val))}
                                        >
                                            <i className="fa fa-minus text-xs"></i>
                                        </button>
                                        <span className="mx-2 text-sm font-bold text-green-700 min-w-[20px] text-center">
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold active:scale-95 transition-transform duration-100"
                                            onClick={() => dispatch(addToCart(val))}
                                        >
                                            <i className="fa fa-plus text-xs"></i>
                                        </button>
                                    </div>
                                ) : (
                                    // ADD button when item is not in cart
                                    <button
                                        onClick={() => dispatch(addToCart(val))}
                                        className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center ml-2 active:scale-95 transition-transform duration-100'
                                    >
                                        <i className='fa fa-shopping-bag mr-1'></i> Add
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Vegetables
