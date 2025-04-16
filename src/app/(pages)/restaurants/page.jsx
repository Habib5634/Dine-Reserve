'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import AllRestaurants from './AllRestaurants'

const RestaurantsPage = () => {
  return (
    <div className='relative'>
    <Navbar />
    <AllRestaurants/>
    <Footer />
</div>
  )
}

export default RestaurantsPage
