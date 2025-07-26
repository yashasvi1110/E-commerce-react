import React from 'react'
import Hero from './home/Hero'
import Featured from './home/Featured'
import Service from './home/Service'
import Banner from './home/Banner'
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
