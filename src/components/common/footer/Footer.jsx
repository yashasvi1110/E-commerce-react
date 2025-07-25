import React from 'react'

const Footer = () => {
    return (
        <footer className='mt-20 px-4 py-10 bg-[#45595b] rounded-t-3xl shadow-lg'>
            <div className='max-w-5xl mx-auto flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-8'>
                {/* Brand & Newsletter */}
                <div className='flex flex-col gap-4 items-center md:items-start'>
                    <h1 className='text-3xl font-extrabold text-[#81c408] mb-1'>Fruitables</h1>
                    <p className='text-md text-orange-300 mb-2'>Fresh products</p>
                    <form className='flex w-full max-w-xs mt-2'>
                        <input className='flex-1 rounded-l-full px-4 py-2 outline-none text-gray-700' type="email" placeholder='Your Email'/>
                        <button className='bg-[#81c408] text-white font-bold px-5 py-2 rounded-r-full hover:bg-green-600 transition active:scale-95' type="submit">Subscribe</button>
                    </form>
                    <div className='flex gap-2 mt-4'>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-twitter'></i></a>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-facebook-f'></i></a>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-youtube'></i></a>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-linkedin-in'></i></a>
                    </div>
                </div>
                {/* Shop Info & Account */}
                <div className='flex flex-row gap-8 justify-center md:flex-col md:gap-4'>
                    <div>
                        <h3 className='text-lg font-bold text-white mb-2'>Shop Info</h3>
                        <ul className='text-gray-200 text-sm space-y-1'>
                            <li>About Us</li>
                            <li>Contact Us</li>
                            <li>Privacy Policy</li>
                            <li>Terms & Condition</li>
                            <li>Return Policy</li>
                            <li>FAQs & Help</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-bold text-white mb-2'>Account</h3>
                        <ul className='text-gray-200 text-sm space-y-1'>
                            <li>My Account</li>
                            <li>Shop details</li>
                            <li>Shopping Cart</li>
                            <li>Wishlist</li>
                            <li>Order History</li>
                            <li>International Orders</li>
                        </ul>
                    </div>
                </div>
                {/* Contact */}
                <div className='flex flex-col gap-2 items-center md:items-start'>
                    <h3 className='text-lg font-bold text-white mb-2'>Contact</h3>
                    <p className='text-gray-200 text-sm'>Address: 1429 Netus Rd, NY 48247</p>
                    <p className='text-gray-200 text-sm'>Email: Example@gmail.com</p>
                    <p className='text-gray-200 text-sm'>Phone: +0123 4567 8910</p>
                    <p className='text-gray-200 text-sm'>Payment Accepted</p>
                    <img className='mt-2 w-28' src="../img/payment.png" alt="Payment methods" />
                </div>
            </div>
            <hr className='w-11/12 mx-auto my-6 border-gray-400'/>
            <div className='text-center text-xs text-gray-300'>
                <span className='font-bold text-orange-300'>&copy;Vegetables Ecommerce, </span>All Rights Reserved by Rodi Shammout
            </div>
        </footer>
    )
}

export default Footer
