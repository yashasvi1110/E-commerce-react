import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux';

const Header = () => {
    const [bar, setBar] = useState(false);
    const totalItems = useSelector(state => state.cart.totalItems);
    return (
        <div>
            <div className='md:container md:mx-auto flex items-center justify-between m-6 sticky z-10 relative'>
                {/* Home icon on the left */}
                <Link to='/' className='flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white shadow mr-2'>
                    <i className='fa fa-home text-2xl text-[#81c408]'></i>
                </Link>
                {/* Centered logo */}
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 main-text text-3xl sm:text-4xl font-extrabold text-center'>
                    <Link to='/'>Fruitables</Link>
                </div>
                {/* Hamburger menu icon on the right */}
                <i className='fa fa-bars xl:hidden bars py-1 px-4 text-xl hover:cursor-pointer ml-auto' onClick={()=> setBar(!bar)}></i>
            </div>
            {/* Mobile navigation menu overlay */}
            {bar && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex flex-col">
                    <div className="bg-white w-10/12 max-w-xs h-full shadow-lg p-6 flex flex-col gap-4 animate-slideInLeft">
                        <button className="self-end mb-4 text-2xl text-gray-500" onClick={()=> setBar(false)}>
                            <i className="fa fa-times"></i>
                        </button>
                        <Link to='/' className='text-lg font-semibold text-[#81c408] mb-2' onClick={()=> setBar(false)}><i className="fa fa-home mr-2"></i>Home</Link>
                        {/* <Link to='/shop' className='text-lg font-semibold text-gray-700 mb-2' onClick={()=> setBar(false)}><i className="fa fa-shopping-bag mr-2"></i>Shop</Link> */}
                        <Link to='/shop-detail' className='text-lg font-semibold text-gray-700 mb-2' onClick={()=> setBar(false)}><i className="fa fa-info-circle mr-2"></i>Shop Detail</Link>
                        <Link to='/cart' className='text-lg font-semibold text-gray-700 mb-2 flex items-center' onClick={()=> setBar(false)}>
                            <i className="fa fa-shopping-bag mr-2"></i>Cart
                            {totalItems > 0 && <span className='ml-2 bg-[#81c408] text-white rounded-full px-2 py-0.5 text-xs'>{totalItems}</span>}
                        </Link>
                        <Link to='/checkout' className='text-lg font-semibold text-gray-700 mb-2' onClick={()=> setBar(false)}><i className="fa fa-credit-card mr-2"></i>Checkout</Link>
                        <Link to='/testimonial' className='text-lg font-semibold text-gray-700 mb-2' onClick={()=> setBar(false)}><i className="fa fa-comment mr-2"></i>Testimonial</Link>
                        <Link to='/contact' className='text-lg font-semibold text-gray-700 mb-2' onClick={()=> setBar(false)}><i className="fa fa-envelope mr-2"></i>Contact</Link>
                        <Link to='/admin/inventory' className='text-lg font-semibold text-gray-700 mb-2' onClick={()=> setBar(false)}><i className="fa fa-boxes mr-2"></i>Inventory</Link>
                        <Link to='/profile' className='text-lg font-semibold text-gray-700 mb-2' onClick={()=> setBar(false)}><i className="fa fa-user mr-2"></i>Profile</Link>
                    </div>
                    {/* Click outside to close */}
                    <div className="flex-1" onClick={()=> setBar(false)}></div>
                </div>
            )}
        </div>
    )
}

export default Header
