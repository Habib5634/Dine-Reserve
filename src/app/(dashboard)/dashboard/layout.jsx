'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdOutlineDashboard, MdRestaurant } from "react-icons/md";
import { SiSession } from "react-icons/si";
import { TbBrandBooking, TbTournament } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { FaBars, FaBell, FaGift } from 'react-icons/fa';
import { LuCircleDollarSign, LuClipboardList } from "react-icons/lu";
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import SidebarDropdown from '@/components/SidebarDropdown';
import { fetchUserData } from '@/app/Store/Actions/userAction';
import { FaUser } from 'react-icons/fa6';
import { FiGlobe } from 'react-icons/fi';
const DashboardLayout = ({ children, pageTitle }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const {userData} = useSelector((state)=>state.userData)
    const dispatch = useDispatch();
useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch])

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    const router = useRouter();

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     const user = JSON.parse(localStorage.getItem('user'));

    //     if (!token || user?.role !== 'admin') {
    //         router.push('/'); // Redirect to login if not authenticated or not an admin
    //     }
    // }, [router]);



    // Function to toggle profile dropdown
    const toggleProfile = () => {
        setProfileOpen(!isProfileOpen); // Close notifications dropdown if open
    };
    // Effect to handle screen resize
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                setSidebarOpen(false); // Close sidebar on small screens
            } else {
                setSidebarOpen(true); // Open sidebar on larger screens
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Initial check on component mount
        handleResize();

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        router.push('/')
    }
    return (
        <div className="flex min-h-screen bg-gray-100 ">
            {/* Sidebar */}
            <div
                className={` bg-blue  min-h-screen h-full text-white ${isSidebarOpen ? 'w-64' : 'w-16'} transition-width duration-300 relative`}
                style={{
                    position: (typeof window !== 'undefined' &&window.innerWidth < 768) ? 'absolute' : 'relative', // Absolute position on small screens
                    zIndex: 50, // Ensure sidebar is above other content
                    height: '100vh', // Full height
                    left: isSidebarOpen ? '0px' : '0px', // Hide sidebar when closed on small screens
                }}
            >
                <div className="p-4 flex justify-between items-center">
                <img
                        src="/assets/logo.png"
                        className={`my-4  h-20 w-auto ${isSidebarOpen ? "" : "opacity-0"}`}
                        alt=""
                    />
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        {isSidebarOpen ? (
                            <span className='h-10 w-10 bg-white rounded-full text-black flex justify-center items-center'>
                                <IoMdClose size={20} />
                            </span>
                        ) : (
                            <span className='h-10 w-10 bg-white rounded-full text-black flex justify-center items-center'>
                                <FaBars size={20} />
                            </span>
                        )}
                    </button>
                    
                </div>
                <nav className=''>
                    <ul>
                        {/* Users */}
                        <li className="p-4">
                            <Link
                                href="/dashboard"
                                className={`flex items-center ${pathname === '/dashboard' ? "text-gradiant font-bold" : ""}`}
                            >
                                <div className='flex items-center gap-2 leading-none'>
                                    <MdOutlineDashboard  size={20} />
                                    {isSidebarOpen && "Dashboard"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>

                        {/* GiftCards Dropdown */}
                        {/* <SidebarDropdown
                            isSidebarOpen={isSidebarOpen}
                            title="Gift Cards"
                            icon={<FaGift  size={20} />}
                            items={[
                                { label: "Add Cards", href: "/gift-cards/add-cards" },
                                { label: "All Cards", href: "/gift-cards/all-cards" },
                            ]}
                            dropdownId="cards"
                        /> */}

                        {/* Users */}
                        {userData?.userType === "admin"&&
                        <>
                        <li className="p-4">
                            <Link
                                href="/dashboard/members"
                                className={`flex items-center ${pathname === '/dashboard/members' ? "text-gradiant font-bold" : ""}`}
                            >
                                <div className='flex items-center gap-2 leading-none'>
                                    <LuClipboardList  size={20} />
                                    {isSidebarOpen && "Manage Users"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>
                        {/* Manage Reataurants */}
                        <li className="p-4">
                            <Link
                                href="/dashboard/restaurants"
                                className={`flex items-center ${pathname === '/dashboard/restaurants' ? "text-gradiant font-bold" : ""}`}
                                >
                                <div className='flex items-center gap-2 leading-none'>
                                    <MdRestaurant size={20} />
                                    {isSidebarOpen && "Manage Restaurants"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>
                                </>}
                        {/* My Restaurant */}
                        {userData?.userType === "manager"&&
                        <li className="p-4">
                            <Link
                                href="/dashboard/my-restaurant"
                                className={`flex items-center ${pathname === '/dashboard/my-restaurant' ? "text-gradiant font-bold" : ""}`}
                                >
                                <div className='flex items-center gap-2 leading-none'>
                                    <TbBrandBooking  size={20} />
                                    {isSidebarOpen && "My Restaurant"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>
                            }
                        {/* Reservations */}
                        <li className="p-4">
                            <Link
                                href="/dashboard/reservations"
                                className={`flex items-center ${pathname === '/dashboard/reservations' ? "text-gradiant font-bold" : ""}`}
                            >
                                <div className='flex items-center gap-2 leading-none'>
                                    <TbBrandBooking  size={20} />
                                    {isSidebarOpen && "All Reservations"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>
                        {/* Payments */}
                        <li className="p-4">
                            <Link
                                href="/dashboard/payments"
                                className={`flex items-center ${pathname === '/dashboard/payments' ? "text-gradiant font-bold" : ""}`}
                            >
                                <div className='flex items-center gap-2 leading-none'>
                                    <LuCircleDollarSign   size={20} />
                                    {isSidebarOpen && "Payments"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>
                        {/* Profile */}
                        <li className="p-4">
                            <Link
                                href="/dashboard/profile"
                                className={`flex items-center ${pathname === '/dashboard/profile' ? "text-gradiant font-bold" : ""}`}
                            >
                                <div className='flex items-center gap-2 leading-none'>
                                    <FaUser  size={20} />
                                    {isSidebarOpen && "Profile"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>
                        {/* Dine Reserve */}
                        <li className="p-4">
                            <Link
                                href="/"
                                className={`flex items-center ${pathname === '/' ? "text-gradiant font-bold" : ""}`}
                            >
                                <div className='flex items-center gap-2 leading-none'>
                                    <FiGlobe  size={20} />
                                    {isSidebarOpen && "Dine Reserve"} {/* Show text only when sidebar is open */}
                                </div>
                            </Link>
                        </li>

                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className={`${(typeof window !== 'undefined' && window.innerWidth < 768 && !isSidebarOpen) && 'pl-16'}  h-screen overflow-y-auto border-l border-white1 flex-1 overflow-x-hidden relative`}>
                <div className='h-20 border-b sticky top-0 z-20 bg-white  pl-10 pr-4 flex justify-between items-center'>
                    <div>
                    <h1 className='text-blue font-bold text-[18px] md:text-3xl capitalize'>{userData?.userType} Dashboard</h1>
                    <h1 className='text-black font-bold text-[16px]'>Welcome {userData?.name} </h1>

                    </div>
                    <div className='flex items-center gap-4'>
                        {/* Notifications Dropdown */}


                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button onClick={toggleProfile} className="flex items-center gap-1 focus:outline-none">
                                <img src="/assets/operation-manager-img.jpg" className='h-9 w-9 rounded-full' alt="" />
                                <h1 className='text-blueish font-semibold capitalize'>{userData?.name}</h1>
                            </button>
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg"
                                    >
                                        <div className="p-4">
                                            <Link href="/dashboard/profile" className="block text-sm text-white-700 hover:bg-white-100 p-2 rounded">
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-sm text-white-700 hover:bg-white-100 p-2 rounded text-left"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
                <div className='p-4'>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;