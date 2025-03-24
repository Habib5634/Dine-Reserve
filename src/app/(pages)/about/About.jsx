import React from 'react'

const About = () => {
    const data = [
        {
            id: 1,
            title: "Our Mission ",
            description:
                "Our mission is to provide a seamless, hassle-free restaurant booking experience, offering diners the ability to easily discover and reserve tables at their favorite restaurants.",
            image: "/assets/mission-img.jpg",
            reverse: false,
        },
        {
            id: 2,
            title: "Our Vision",
            description:
                "Our vision is to revolutionize the dining experience, making it easier for people to discover, book, and enjoy meals at restaurants around the world.",
            image: "/assets/vision-img.jpg",
            reverse: true,
        },
    ]
    return (
        <div className='w-full max-w-6xl mx-auto py-10 px-6'>
            <h1 className='text-4xl font-bold text-redish text-center'>About Us</h1>
            <p className='text-lg text-redish text-center mb-10'>Learn more about Dine Reserve. We strive to make dining easier for everyone.</p>


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

export default About
