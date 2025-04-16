'use client'
import { API_URL } from "@/app/utils/apiUrl"
import axios from "axios"
import { useEffect, useState } from "react"



export const useRestaurants =()=>{
    const [restaurants,setRestaurants] = useState(null)
    
        const fetchRestaurants=async()=>{
            try {
                const {data}  = await axios.get(`${API_URL}/user/restaurants`)
                
                setRestaurants(data)
            } catch (error) {
                console.log(error)
            }
        }
    
        useEffect(()=>{
          fetchRestaurants()
        },[])

    return{
        
        restaurants

    }


}

