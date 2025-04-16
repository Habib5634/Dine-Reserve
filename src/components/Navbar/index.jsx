'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import AuthModel from "./AuthModal";
import AuthComponent from "./AuthComponent";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "@/app/Store/ReduxSlice/modalSlice";
import { FaChevronDown, FaClock, FaUser } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/app/Store/Actions/userAction";
import { clearAuth } from "@/app/Store/ReduxSlice/userSlice";
import toast from "react-hot-toast";
import { MdOutlineDashboard } from "react-icons/md";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const showModal = useSelector((state) => state.modal.showModal);
  const dispatch = useDispatch();
  const router = useRouter()
  const { isAuthenticated, userData } = useSelector((state) => state.userData)
  const handleShowModal = () => {
    console.log("clicked")
    dispatch(openModal());
  };
  useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch])
  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const handleLogout = () => {
    // dispatch(openModal());
    localStorage.removeItem('token')
    dispatch(clearAuth());
    toast.success("Logout Successfully")
    router.push('/');
  };
  console.log(userData)
  const goToReservations = () => {
    router.push('/my-reservations');
  };
  const goToDashboard = () => {
    router.push('/dashboard');
  };
  const goToProfile = () => {
    router.push('/profile');
  };
  return (
    <nav className="bg-[#f8f5f0] p-4 sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <img src="/assets/Logo.png" alt="" className="h-20 w-auto" />

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-redish font-medium">
          <Link href="/" className="hover:text-gray">Home</Link>
          <Link href="/services" className="hover:text-gray">Services</Link>
          <Link href="/restaurants" className="hover:text-gray">Explore Restaurants</Link>
          <Link href="/about" className="hover:text-gray">About Us</Link>
          <Link href="/contact" className="hover:text-gray">Contact Us</Link>
        </div>

        {/* Register Button */}
        <div className="hidden md:flex  items-center gap-6">
          {isAuthenticated ?
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-redish flex items-center justify-center text-white">
                  <FaUser />
                </div>

              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuVariants}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={goToProfile}
                    >
                      <FaUser className="mr-3" />
                      My Profile
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={goToReservations}
                    >
                      <FaClock className="mr-3" />
                      My Reservations
                    </motion.div>
                    {userData?.userType !== "customer" &&
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={goToDashboard}
                      >
                        <MdOutlineDashboard className="mr-3" />
                        My Dashboard
                      </motion.div>
                    }
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            :
            <button onClick={handleShowModal} className="bg-[#f4a261] text-white px-4 py-2 rounded-md hover:bg-[#e76f51]">Register</button>
          }
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {menuOpen ? (
            <FiX size={28} className="text-redish" onClick={() => setMenuOpen(false)} />
          ) : (
            <FiMenu size={28} className="text-redish" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-[#f8f5f0] p-4 space-y-4 text-center text-redish font-medium"
        >
          <Link href="/" className="block hover:text-gray" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/services" className="block hover:text-gray" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/restaurants" className="block hover:text-gray" onClick={() => setMenuOpen(false)}>Explore Restaurants</Link>
          <Link href="/about" className="block hover:text-gray" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link href="/contact" className="block hover:text-gray" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          {isAuthenticated ?
            <Link href="/my-reservations" className="block hover:text-gray" onClick={() => setMenuOpen(false)}>My Reservations</Link>
            :
            <button className="bg-[#f4a261] text-white px-4 py-2 rounded-md hover:bg-[#e76f51] w-full" onClick={handleShowModal}>Register</button>
          }
        </motion.div>
      )}

      {showModal && <AuthModel onClose={handleCloseModal}>
        <AuthComponent />
      </AuthModel>}
    </nav>
  );
};

export default Navbar;
