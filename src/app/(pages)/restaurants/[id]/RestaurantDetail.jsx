// app/restaurants/[id]/page.js
'use client'
import { FaStar, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { restaurants } from '@/hooks/restaurantsData';
import ReservationModal from '@/components/ReservationModal';
import { useState } from 'react';

export default function RestaurantDetail({  }) {
    const {id} = useParams()
  const restaurant = restaurants.find(r => r.id === Number(id));
  const [showModal, setShowModal] = useState(false);

  if (!restaurant) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6 text-center">
        <h2 className="text-2xl font-bold text-redish">Restaurant not found</h2>
        <Link href="/restaurants" className="text-orange hover:underline">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  // Custom arrow components
  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-2 top-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow transform -translate-y-1/2"
      >
        <FaChevronRight />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-2 top-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow transform -translate-y-1/2"
      >
        <FaChevronLeft />
      </button>
    );
  }

  // Slick slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: dots => (
      <div className="mt-4">
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-16 h-16">
        <Image
          src={restaurant.image[i]}
          alt={`Thumbnail ${i + 1}`}
          width={64}
          height={64}
          className="w-full h-full object-cover rounded"
        />
      </div>
    )
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/restaurants" 
          className="flex items-center text-orange hover:underline"
        >
          ← Back to Restaurants
        </Link>
      </div>

      {/* Restaurant Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Image Gallery with Slick Slider */}
        <div className="w-full md:w-1/2">
          <Slider {...sliderSettings} className="slick-gallery">
            {restaurant.image.map((img, index) => (
              <div key={index} className="relative h-96">
                <Image
                  src={img}
                  alt={`${restaurant.name} ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  priority={index === 0}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Restaurant Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-redish mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-yellow" />
            <span className="font-medium">{restaurant.rating} Rating</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-gray-500" />
            <span>{restaurant.location}</span>
          </div>
          <p className="text-gray-700 mb-6">{restaurant.about}</p>
          <button onClick={() => setShowModal(true)} className='py-2.5 px-6 rounded-md text-lg font-semibold text-white bg-redish '>Reverved Your Table</button>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-6 border-b pb-2">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurant.menu.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800">{item.dishName}</h3>
              <p className="text-gray-600 my-2">{item.description}</p>
              <p className="text-orange-500 font-bold">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for Slick overrides */}
      <style jsx global>{`
        .slick-gallery .slick-dots li {
          width: auto;
          height: auto;
          margin: 0;
        }
        .slick-gallery .slick-dots li button {
          width: auto;
          height: auto;
          padding: 0;
        }
        .slick-gallery .slick-dots li button:before {
          display: none;
        }
      `}</style>

{showModal && <ReservationModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </div>
  );
}