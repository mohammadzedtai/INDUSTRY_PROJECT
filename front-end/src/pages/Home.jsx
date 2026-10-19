import React from 'react'
import HeroSlider from '../components/HeroSlider'
import Services from '../components/Services'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'

function Home() {
    return (
        <div>
            <HeroSlider />
            <Services />
            <Categories />
            <FeaturedProducts />
        </div>
    )
}

export default Home
