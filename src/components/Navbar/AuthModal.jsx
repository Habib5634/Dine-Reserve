'use client'
import React from 'react'
import { IoIosCloseCircle } from "react-icons/io";
const AuthModel = ({ children, onClose }) => {
    return (
        <>
            <div className="fixed top-0 left-0  h-screen flex justify-center w-screen  items-center z-50 ">
                <div onClick={onClose} className="absolute inset-0 z-0 bg-black/50 "></div>
                <div className='flex flex-col items-center justify-center md:mx-10 pt-16 pb-12 px-2 md:px-6 w-full max-w-[768px]  rounded-2xl bg-white relative'>
                    <IoIosCloseCircle onClick={onClose} className='top-4 absolute right-4 md:top-6 md:right-6 text-black text-2xl' />
                    {children}
                </div>
            </div>
        </>
    )
}

export default AuthModel