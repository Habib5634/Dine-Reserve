'use client'
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { useRestaurants } from "./useRestaurants";

const Featured = () => {
    // const restaurants = [
    //     { id: 1, name: "Alzar Cafe", image: "/assets/alzar-cafe/alzar1.jpg" ,rating:"4.5"},
    //     { id: 2, name: "Sapna Shenwari", image: "/assets/sapna-shenvari/sapna1.jpg",rating:"4.5" },
    //     { id: 3, name: "Soul String cafe", image: "/assets/soul-string/soul1.jpg" ,rating:"4.5"},
    //     { id: 4, name: "Dynasty Marriot", image: "/assets/dynasty/dynasty1.jpg" ,rating:"4.5"},
    //   ];
      

      const {restaurants} = useRestaurants()
      const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      };
  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-6 py-10  grid grid-cols-1 lg:grid-cols-2 items-center gap-8 ">
        <div className=' max-w-md mx-auto'>
            <h1 className='text-4xl font-bold text-redish'>Welcome to Dine Reserve</h1>
            <p className='tracking-wide text-lg leading-7 text-redish max-w-md'>Discover the ultimate convenience of reserving your dining experience with just a few clicks. From casual bistros to fine dining restaurants, explore a variety of options tailored to your taste. At Dine Reserve, we bring unforgettable culinary adventures right to your fingertips.</p>
        </div>
        <img src="/assets/Intro-Img.jpg" alt=""  className='h-full max-h-[500px] mx-auto rounded-2xl w-auto'/>

      </div>

      <div className="w-full max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Featured Restaurants</h2>
      <Slider {...settings}>
        {restaurants?.slice(0,5)?.map((restaurant) => (
          <div key={restaurant?._id} className="p-2">
            <div className="bg-white shadow-lg border border-yellow  rounded-lg overflow-hidden">
              <img
                src={restaurant?.images[0]}
                alt={restaurant?.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-redish">{restaurant?.name}</h3>
                <h3 className="  flex justify-center items-center "><span className="text-yellow"><FaStar/> </span>{restaurant?.averageRating || "4.5"} Rating</h3>
                <Link href={`/restaurants/${restaurant?._id}`}>
                  <button className=" py-2 px-6 text-white rounded-md  cursor-pointer bg-orange mt-3">View Profile</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
    </>
  )
}

export default Featured
