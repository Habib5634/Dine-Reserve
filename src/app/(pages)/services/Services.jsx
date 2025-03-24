import React from 'react'

const Services = () => {
  const data = [
    {
      id: 1,
      title: "Online Table Reservations",
      description:
        "Experience the ease of planning your dining adventures with our online table reservation service. Whether it’s a casual dinner or a celebratory feast, our platform enables you to secure your spot at your favorite restaurant within moments. Say goodbye to long queues and last-minute disappointments—reserve your table effortlessly with just a few clicks, anytime and anywhere.",
      image: "/assets/services-img1.jpg",
      reverse: false,
    },
    {
      id: 2,
      title: "Real-Time Availability",
      description:
        "Never miss out on the perfect dining opportunity with our real-time availability updates. Get instant insights into the seating status of top-rated restaurants, helping you make informed decisions on the go. Whether it’s a spontaneous outing or a meticulously planned event, our system keeps you updated to ensure a hassle-free experience.",
      image: "/assets/services-img2.jpg",
      reverse: true,
    },
    {
      id: 3,
      title: "Exclusive Restaurant Profiles",
      description:
        "Dive into a world of culinary delights with our curated restaurant profiles. Each profile offers detailed information, including images, menus, reviews, and special features, helping you explore and choose the perfect dining spot that suits your taste and mood. Discover new favorites and revisit old classics with ease.",
      image: "/assets/services-img3.jpg",
      reverse: false,
    },
    {
      id: 4,
      title: "Special Offers and Discounts",
      description:
        "Savor the joy of dining while saving with our exclusive offers and discounts. From seasonal promotions to member-exclusive deals, our platform ensures you enjoy premium dining experiences at unbeatable prices. Turn every meal into a delightful bargain with our specially curated discounts..",
      image: "/assets/services-img4.jpg",
      reverse: true,
    },
    {
      id: 5,
      title: "Personalized Notifications",
      description:
        "Stay on top of your dining plans with personalized notifications designed just for you. Receive timely updates about your reservations, reminders for upcoming events, and tailored recommendations based on your preferences. We ensure that every dining experience is memorable and seamlessly organized.",
      image: "/assets/services-img5.jpg",
      reverse: false,
    },
    {
      id: 6,
      title: "Event Reservations",
      description:
        "Hosting an event has never been easier! Our event reservation service allows you to book tables for special occasions, including birthdays, anniversaries, corporate meetings, and more. Collaborate with restaurant staff to customize your event and create lasting memories with your loved ones.",
      image: "/assets/services-img6.jpg",
      reverse: true,
    },
    {
      id: 7,
      title: "Dining Rewards",
      description:
        "Make every reservation more rewarding with our loyalty program. Earn points for every booking and redeem them for exciting perks, discounts, or exclusive dining experiences. Our dining rewards are designed to celebrate your loyalty, ensuring every meal feels like a special treat.",
      image: "/assets/services-img7.jpg",
      reverse: false,
    },
  ]
  return (
    <div className='w-full max-w-6xl mx-auto py-10 px-6'>
      <h1 className='text-4xl font-bold text-redish text-center'>Our Services</h1>
      <p className='text-lg text-redish text-center mb-10'>Discover how Dine Reserve enhances your dining experience with unparalleled services.</p>

      {data.map((feature, index) => (
        <div key={feature.id} className="grid md:grid-cols-2 gap-6 items-center mt-6">
          {/* Image */}
          <div className={`${feature.reverse ? "md:order-2" : "md:order-1"}`}>
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Text Content */}
          <div className={`${feature.reverse ? "md:order-1" : "md:order-2"}`}>
            <h2 className="text-2xl font-bold text-redish mb-4">
              {feature.title}
            </h2>
            <p className="text-redish tracking-wider leading-9">{feature.description}</p>
          </div>
        </div>
      ))}

    </div>
  )
}

export default Services
