import React from 'react'
import { bsetseller } from '../../data/Data'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/CartSlice';

const Bestseller = () => {
    const dispatch = useDispatch();
    return (
        <div id="bestseller-section" className='mt-10 container mx-auto'>
            <div className='flex flex-col mb-6 mx-2 md:mx-8'>
                <h1 className='text-2xl font-bold mb-4 text-center' style={{color: '#45595b'}}>Bestseller Products</h1>
                <p className='text-sm text-center mb-4 text-gray-500'>Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.</p>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2 md:px-8'>
                {bsetseller.map((val) => (
                    <div key={val.id} className='bg-white rounded-xl shadow p-2 flex flex-col items-center min-h-[270px]'>
                        <div className='w-full h-28 flex items-center justify-center overflow-hidden rounded-lg'>
                            <img src={val.img} alt={val.name} className='object-cover w-full h-full'/>
                        </div>
                        <span className='mt-2 text-xs font-semibold text-yellow-500'>Bestseller</span>
                        <h3 className='text-base font-bold mt-1 mb-1 text-center'>{val.name}</h3>
                        <ul className='flex my-1 justify-center'>
                            {[...Array(4)].map((_, i) => (
                                <li key={i} style={{color: '#81c408'}}>{val.star}</li>
                            ))}
                            <li style={{color: '#45595b'}}>{val.star}</li>
                        </ul>
                        <p className='text-xs text-gray-500 text-center mb-2'>${val.price} / Kg</p>
                        <div className='flex items-center justify-between w-full mt-auto'>
                            <button
                                onClick={() => dispatch(addToCart(val))}
                                className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center w-full justify-center active:scale-95 transition-transform duration-100'
                            >
                                <i className='fa fa-shopping-bag mr-1'></i> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Bestseller
