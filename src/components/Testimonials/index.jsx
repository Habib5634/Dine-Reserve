'use client'
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Asif Mehmood",
    review:
      "Dine Reserve made our anniversary unforgettable, seamless and stress-free!",
    rating: 5,
  },
  {
    name: "Qasim Khan",
    review:
      "A wonderful experience! The availability updates were accurate and so helpful.",
    rating: 4,
  },
  {
    name: "Fatima Bibi",
    review:
      "Dining out has never been easier! Also loved the food, it was extremely good.",
    rating: 5,
  },
  {
    name: "Asadullah",
    review:
      "User-friendly and reliable, Dine Reserve is a must-try, especially for foodies.",
    rating: 5,
  },
  {
    name: "Maryam Waseem",
    review:
      "I loved how quickly I could book a table—such a hassle-free experience!",
    rating: 5,
  },
  {
    name: "Mubashir Ishfaq",
    review: "From start to finish, everything was seamless—Dine Reserve is my go-to now!",
    rating: 4,
  },
  {
    name: "Sadullah Khan",
    review: "Everything from the interface to the restaurant’s variety exceeded expectations. Recommended!",
    rating: 5,
  },
  {
    name: "Saira Mohsin",
    review: "Easy to use and accurate availability updates—perfect for last-minute plans!",
    rating: 5,
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="text-center w-full max-w-6xl mx-auto px-6 py-10 ">
      <h2 className="text-3xl font-bold text-redish mb-2">Customer Reviews</h2>
      <p className="text-gray-600 mb-6">
        Discover what our satisfied customers have to say about their dining experiences with us.
      </p>

      {/* Testimonials Slider */}
      <div className="max-w-5xl mx-auto">
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4">
              <div className="border border-redish p-6 rounded-lg shadow-md bg-white">
                <p className="italic mb-3">"{testimonial.review}"</p>
                <h4 className="font-bold text-redish">- {testimonial.name}</h4>
                <div className="text-yellow-500">
                  {"★".repeat(testimonial.rating)}{" "}
                  {"☆".repeat(5 - testimonial.rating)}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Subscription Section */}
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold text-redish">Stay Updated with Dine Reserve</h2>
        <p className="text-gray-600 mb-4">
          Subscribe to get the latest updates, exclusive offers, and restaurant highlights directly in your inbox.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 rounded-l-md w-60"
          />
          <button className="bg-redish text-white px-4 py-2 rounded-r-md">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
