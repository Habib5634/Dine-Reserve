import Navbar from '@/components/Navbar'
import React from 'react'
import Services from './Services'
import Footer from '@/components/Footer'

const ServicesPage = () => {
  return (
    <div className='relative'>
        <Navbar/>
        <Services/>
      <Footer/>
    </div>
  )
}

export default ServicesPage
