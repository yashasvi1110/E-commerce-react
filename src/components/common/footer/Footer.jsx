import React from 'react'
import Subscribe from '../../subscribe';

const Footer = ({ hideSubscribe }) => {
    return (
        <footer className='mt-12 px-4 py-6 bg-[#45595b] rounded-t-3xl shadow-lg'>
            <div className='max-w-4xl mx-auto flex flex-col items-center gap-4'>
                {/* Brand & Newsletter */}
                <div className='flex flex-col items-center gap-3'>
                    <h1 className='text-2xl font-extrabold text-[#81c408]'>Fruitables</h1>
                    <p className='text-sm text-orange-300'>Fresh products</p>
                    {/* Advanced Subscribe Component */}
                    {!hideSubscribe && (
                        <div className="w-full max-w-lg">
                            <Subscribe />
                        </div>
                    )}
                    {/* Social Icons */}
                    <div className='flex gap-3 mt-2'>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-twitter'></i></a>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-facebook-f'></i></a>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-youtube'></i></a>
                        <a href="#" className='bg-white text-[#81c408] rounded-full p-2 shadow hover:bg-orange-400 hover:text-white transition'><i className='fab fa-linkedin-in'></i></a>
                    </div>
                </div>
                {/* Quick Links */}
                <div className='flex gap-6 text-gray-200 text-sm'>
                    <span className='hover:text-[#81c408] cursor-pointer'>About</span>
                    <span className='hover:text-[#81c408] cursor-pointer'>Contact</span>
                    <span className='hover:text-[#81c408] cursor-pointer'>Privacy</span>
                    <span className='hover:text-[#81c408] cursor-pointer'>Terms</span>
                </div>
                {/* Copyright */}
                <div className='text-center text-xs text-gray-300 border-t border-gray-500 pt-3 w-full'>
                    <span className='font-bold text-orange-300'>&copy;2024 Fruitables, </span>All Rights Reserved
                </div>
            </div>
        </footer>
    )
}

export default Footer
