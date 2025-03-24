'use client'
import { restaurants } from '@/hooks/restaurantsData';
import Link from 'next/link';
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa6';

const AllRestaurants = () => {
    const [searchTerm, setSearchTerm] = useState("");

  
  
    const filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Discover Restaurants</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="p-2">
            <div className="bg-white shadow-lg border border-yellow-500 rounded-lg overflow-hidden">
              <img src={restaurant.image[0]} alt={restaurant.name} className="w-full h-60 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-red-600">{restaurant.name}</h3>
                <h3 className="flex justify-center items-center gap-1 text-yellow-500">
                  <FaStar /> {restaurant.rating} Rating
                </h3>
                <Link href={`/restaurants/${restaurant.id}`}>
                  <button className="py-2 px-6 text-white rounded-md bg-orange-500 mt-3">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No restaurants found.</p>
      )}
    </div>
  )
}

export default AllRestaurants
