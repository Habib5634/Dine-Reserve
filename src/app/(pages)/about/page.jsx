import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import About from './About'
import TeamSection from './Team'
import FAQSection from './Faqs'

const AboutPage = () => {
    return (
        <div className='relative'>
            <Navbar />
            <About/>
            <TeamSection/>
            <FAQSection/>
            <Footer />
        </div>
    )
}

export default AboutPage
