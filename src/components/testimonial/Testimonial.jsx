import React from 'react'
import { testimonial } from '../../data/Data'

const Testimonial = () => {
    return (
        <div className='mt-10 mx-2 sm:mx-auto max-w-xl'>
            <p className='text-center font-semibold text-base text-green-700 mb-1'>Our Testimonial</p>
            <h1 className='text-center font-bold text-xl mt-1 mb-4' style={{color: '#45595b'}}>Our Client Saying!</h1>
            <div className='grid grid-cols-1 gap-4 mt-4'>
            {
                testimonial.map((val) => {
                    return (
                        <div key={val.id} className='rounded-lg bg-white shadow p-3 flex flex-col'>
                            <p className='text-sm mb-2' style={{color: '#45595b'}}>{val.desc}</p>
                            <hr className='w-10/12 m-auto h-0.5 my-2' style={{backgroundColor: '#ffb524'}}/>
                            <div className='flex items-center mt-2'>
                                <img className='rounded-lg w-14 h-14 object-cover' src={val.img} alt='' />
                                <div className='flex flex-col justify-center ml-4'>
                                    <h3 className='text-base font-semibold' style={{color: '#45595b'}}>{val.name}</h3>
                                    <p className='text-xs my-1' style={{color: '#45595b'}}>{val.prof}</p>
                                    <ul className='flex'>
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i} style={{color: '#81c408'}}>{val.star}</span>
                                        ))}
                                        <span style={{color: '#45595b'}}>{val.star}</span>
                                    </ul>
                                </div>
                                <span className='ml-auto flex items-center'>{val.icon}</span>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Testimonial
