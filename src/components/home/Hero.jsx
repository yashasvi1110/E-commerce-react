import React from 'react'
import Slider from "react-slick";

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const Hero = () => {
    return (
        <div className="bg-white py-6 px-2 md:px-0">
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center">
                <h4 className="text-base font-semibold text-yellow-500 mb-2 text-center">100% Organic Foods</h4>
                <h1 className="text-2xl font-bold text-center mb-4" style={{color: '#81c408'}}>Organic Veggies & Fruits Foods</h1>
                <form className="w-full flex items-center bg-white border-2 border-orange-400 rounded-full shadow-sm mb-4 px-2 py-1" onSubmit={e => e.preventDefault()}>
                    <input
                        className="flex-1 bg-transparent border-none outline-none pl-2 py-2 text-sm text-gray-700 placeholder-gray-400 rounded-full"
                        type="text"
                        placeholder="Search"
                    />
                    <button
                        className="ml-2 px-6 py-2 bg-[#81c408] text-white font-bold rounded-full text-sm shadow active:scale-95 transition-transform duration-100"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
                {/* Banner/slider removed as requested */}
            </div>
        </div>
    )
}

export default Hero
