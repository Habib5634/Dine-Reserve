'use client'
const HeroSection = () => {
    return (
      <section className="relative w-full h-screen overflow-hidden -mt-[112px] z-0">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/assets/herovideo.mp4" // Replace with the correct path to your video
          autoPlay
          loop
          muted
          playsInline
        />
        
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold">Welcome to Dine Reserve</h1>
          <p className="mt-4 text-lg md:text-xl">Discover and book the best restaurants around you.</p>
          <button className="mt-6 px-6 py-3 bg-[#f4a261] text-white rounded-md hover:bg-[#e76f51]">Explore Now</button>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  