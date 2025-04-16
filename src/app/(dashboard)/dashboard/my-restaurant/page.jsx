'use client'
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import RestaurantDetail from './RestaurantDetail'

const MyRestaurantPage = () => {
    const [restaurant,setRestaurant] = useState(null)

    const handleFetchRestaurant =async()=>{
        try {
            const {data} = await axios.get(`${API_URL}/rest/my-restaurant`,getAuthHeaders())
            console.log(data)
            setRestaurant(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        handleFetchRestaurant()
    },[])
  return (
    <div>
      <RestaurantDetail restaurant={restaurant} handleFetchRestaurant={handleFetchRestaurant}/>
    </div>
  )
}

export default MyRestaurantPage
