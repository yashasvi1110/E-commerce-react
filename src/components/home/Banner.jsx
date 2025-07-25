import React from 'react'

const Banner = () => {
    return (
        <div className='mt-10 py-8 px-2' style={{backgroundColor: '#ffb524'}}>
            <div className='flex flex-col items-center justify-center max-w-xl mx-auto'>
                <h1 className='text-2xl text-white font-bold text-center'>Fresh Exotic Fruits</h1>
                <h2 className='text-xl font-semibold my-2 text-center' style={{color: '#45595b'}}>in Our Store</h2>
                <p className='text-sm text-center mb-4' style={{color: '#45595b'}}>The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic words etc.</p>
                <div className='buy py-2 px-6 border-2 rounded-full w-fit font-semibold duration-300 mb-6 mx-auto text-sm' style={{color: '#45595b'}}><a href='#'>BUY</a></div>
                <div className='relative flex flex-col items-center'>
                    <div className='w-40 h-40'>
                        <img className='w-full h-full object-cover rounded-lg' src="../img/baner-1.png" alt="" />
                    </div>
                    <div className='absolute top-2 left-2 bg-white rounded-full w-16 h-16 flex flex-col justify-center items-center shadow'>
                        <span className='text-2xl font-bold' style={{color: '#45595b'}}>1</span>
                        <span className='text-base font-bold' style={{color: '#45595b'}}>50$</span>
                        <span className='text-xs font-semibold' style={{color: '#45595b'}}>Kg</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner
