import React from 'react'
import ContactUs from './Contact'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GoogleMap from './Map'

const ContactPage = () => {
  return (
    <div className='relative'>
    <Navbar />
    <ContactUs/>
    <GoogleMap/>
    <Footer />
</div>
  )
}

export default ContactPage
