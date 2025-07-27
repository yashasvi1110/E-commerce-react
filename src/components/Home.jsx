import React from 'react'
import Hero from './home/Hero'
// Removed unused imports
import Fact from './home/Fact'
import Testimonial from './testimonial/Testimonial'
import CategorySelector from './common/CategorySelector'

const Home = () => {
    return (
        <>
            <Hero />
            <CategorySelector />
            <Fact />
            <Testimonial />
        </>
    )
}

export default Home
