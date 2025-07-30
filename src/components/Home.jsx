import React from 'react'
import Hero from './home/Hero'
import Fact from './home/Fact'
import Testimonial from './testimonial/Testimonial'
import CategorySelector from './common/CategorySelector'
import CategorySlider from './common/CategorySlider'
import FeaturedProducts from './common/FeaturedProducts'

const Home = () => {
    return (
        <>
            <Hero />
            <CategorySelector />
            <FeaturedProducts />
            <CategorySlider />
            <Fact />
            <Testimonial />
        </>
    )
}

export default Home
