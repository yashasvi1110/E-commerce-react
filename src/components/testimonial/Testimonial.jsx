import React, { useState, useEffect } from 'react'
import { testimonial } from '../../data/Data'

const Testimonial = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonial.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonial.length);
        setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonial.length) % testimonial.length);
        setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    };



    return (
        <div className='mt-10 mx-4 sm:mx-20'>
            <p className='text-center font-semibold text-xl lg:text-2xl' style={{color: '#81c408'}}>Our Testimonial</p>
            <h1 className='text-center font-bold text-3xl mt-2 md:text-4xl lg:text-5xl' style={{color: '#45595b'}}>Our Client Saying!</h1>
            
            {/* Testimonial Slider */}
            <div className='relative mt-10 max-w-4xl mx-auto'>
                {/* Slider Container */}
                <div className='overflow-hidden rounded-lg' style={{backgroundColor: '#f4f6f8'}}>
                    <div 
                        className='flex transition-transform duration-500 ease-in-out'
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {testimonial.map((val, index) => (
                            <div key={val.id} className='w-full flex-shrink-0 px-6 py-8'>
                                <div className='text-center'>
                                    {/* Quote Icon */}
                                    <div className='flex justify-center mb-4'>
                                        <span className='text-4xl' style={{color: '#ffb524'}}>{val.icon}</span>
                                    </div>
                                    
                                    {/* Testimonial Text */}
                                    <p className='text-lg md:text-xl mb-6' style={{color: '#45595b'}}>
                                        "{val.desc}"
                                    </p>
                                    
                                    {/* Divider */}
                                    <hr className='w-20 mx-auto h-1 mb-6' style={{backgroundColor: '#ffb524'}}/>
                                    
                                    {/* Customer Info */}
                                    <div className='flex items-center justify-center'>
                                        <img 
                                            className='rounded-full w-16 h-16 md:w-20 md:h-20 object-cover mr-4' 
                                            src={val.img} 
                                            alt={val.name} 
                                        />
                                        <div className='text-left'>
                                            <h3 className='text-lg font-semibold' style={{color: '#45595b'}}>{val.name}</h3>
                                            <p className='text-sm mb-2' style={{color: '#45595b'}}>{val.prof}</p>
                                            <div className='flex'>
                                                <span style={{color: '#81c408'}}>{val.star}</span>
                                                <span style={{color: '#81c408'}}>{val.star}</span>
                                                <span style={{color: '#81c408'}}>{val.star}</span>
                                                <span style={{color: '#81c408'}}>{val.star}</span>
                                                <span style={{color: '#45595b'}}>{val.star}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors duration-200'
                    style={{color: '#81c408'}}
                >
                    <i className='fa fa-chevron-left text-xl'></i>
                </button>
                
                <button
                    onClick={nextSlide}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors duration-200'
                    style={{color: '#81c408'}}
                >
                    <i className='fa fa-chevron-right text-xl'></i>
                </button>

                                {/* Dots Indicator */}
                <div className='flex justify-center mt-6 space-x-2'>
                    {testimonial.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentSlide 
                                    ? 'bg-orange-400 scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>


            </div>
        </div>
    )
}

export default Testimonial
