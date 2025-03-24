import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import RestaurantDetail from './RestaurantDetail'

const RestaurantDetailPage = () => {
  return (
    <div className='relative'>
    <Navbar />
    <RestaurantDetail/>
    <Footer />
</div>
  )
}

export default RestaurantDetailPage
