'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React, { Suspense } from 'react'
import RestaurantDetail from './RestaurantDetail'

const RestaurantDetailPage = () => {
  return (
    <Suspense fallback={""}>

    <div className='relative'>
    <Navbar />
    <RestaurantDetail/>
    <Footer />
</div>
    </Suspense>
  )
}

export default RestaurantDetailPage
