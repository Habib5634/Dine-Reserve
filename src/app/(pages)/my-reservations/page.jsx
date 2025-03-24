import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import MyReservations from './Reservations'

const ReservationPage = () => {
  return (
    <div className='relative'>
    <Navbar />
    <MyReservations/>
    <Footer />
</div>
  )
}

export default ReservationPage
