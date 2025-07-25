import React from 'react'
import { fact } from '../../data/Data'

const Fact = () => {
    return (
        <div className='mt-10 mx-2 p-4 text-center rounded-lg grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto' style={{backgroundColor: '#f4f6f8'}}>
            {fact.map((val) => {
                return (
                    <div className='py-4 rounded-lg bg-white flex flex-col items-center' key={val.id}>
                        <span className='text-3xl mb-2' style={{color: '#ffb524'}}>{val.icon}</span>
                        <h1 className='text-base uppercase font-semibold mb-1' style={{color: '#81c408'}}>{val.name}</h1>
                        <p className='text-lg font-semibold' style={{color: '#45595b'}}>{val.num}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Fact
