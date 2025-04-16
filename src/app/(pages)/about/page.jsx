import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import About from './About'
import TeamSection from './Team'
import FAQSection from './Faqs'
import RestaurantGallery from './RestaurantGallery'

const AboutPage = () => {
    return (
        <div className='relative'>
            <Navbar />
            <About/>
            <TeamSection/>
            <RestaurantGallery/>
            <FAQSection/>
            <Footer />
        </div>
    )
}

export default AboutPage
