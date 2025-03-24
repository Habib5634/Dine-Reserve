import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="relative">

    <Navbar/>
    <HeroSection/>
    <Featured/>
    <Testimonials/>
    <Footer/>
    </div>
    </>
  );
}
