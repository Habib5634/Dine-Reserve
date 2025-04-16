import { restaurants } from '@/hooks/restaurantsData'
import React from 'react'

const RestaurantGallery = () => {
  return (
    <div className="py-10 px-6 mx-auto max-w-6xl bg-white text-center">
    

    {/* Meet Our Team */}
    <h2 className="text-3xl md:text-4xl font-bold text-[#6b0000] mb-8">
    Our Restaurants Gallery
    </h2>
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {restaurants.map((restaurant) => (
          restaurant.image.map((img, index) => (
            <div 
              key={`${restaurant.id}-${index}`}
              className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image with right-click accessibility */}
              <img
                src={img}
                alt={`${restaurant.name} - Image ${index + 1}`}
                className="w-full h-64 object-cover"
                // onContextMenu={(e) => e.preventDefault()} // Preserve right-click for image URL
              />
              
              {/* Name slide-up effect */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg truncate">
                  {restaurant.name}
                </h3>
                <p className="text-white/80 text-sm">{restaurant?.location}</p>
              </div>
            </div>
          ))
        ))}
      </div>
    </div>
  )
}

export default RestaurantGallery
