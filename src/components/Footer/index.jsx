'use client'
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-[#fff5f5] text-redish ">

    <footer className="w-full max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-6">
        
        {/* Logo */}
        <div className="">
          <img src="/assets/Logo.png" alt="Dine Reserve Logo" className="h-30 mx-auto" />
        </div>

        {/* Quick Links */}
        <div className=" text-center">
          <h3 className="font-bold mb-2">Quick Links</h3>
          <ul className="space-y-1">
  <li>
    <Link href="/restaurants" className="hover:underline">
      Restaurants
    </Link>
  </li>
  <li>
    <Link href="/services" className="hover:underline">
      Services
    </Link>
  </li>
  <li>
    <Link href="/about" className="hover:underline">
      About Us
    </Link>
  </li>
 
  <li>
    <Link href="/contact" className="hover:underline">
      Contact
    </Link>
  </li>
</ul>
        </div>

        {/* Contact Info */}
        <div className=" text-center">
          <h3 className="font-bold mb-2">Contact Us</h3>
          <p>Email: support@dinereserve.com</p>
          <p>Phone: +(092) 456-789</p>
        </div>

        {/* Social Icons */}
        <div className=" text-center">
          <h3 className="font-bold mb-2">Follow Us</h3>
          <div className="flex justify-center space-x-4 text-xl">
            <a href="#" className="hover:text-[#a00]"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#a00]"><FaInstagram /></a>
            <a href="#" className="hover:text-[#a00]"><FaTwitter /></a>
            <a href="#" className="hover:text-[#a00]"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      
    </footer>
    <div className="bg-[#6b0000] text-white text-center py-2">
        © 2024 Dine Reserve. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
