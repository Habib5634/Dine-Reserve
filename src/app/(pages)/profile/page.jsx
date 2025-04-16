'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { FiEdit, FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const ProfilePage = () => {
    const { userData } = useSelector((state) => state.userData)
    const [editMode, setEditMode] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        contact: userData?.contact || ''
    })
    // changes
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`${API_URL}/user/update`, formData, getAuthHeaders())
            toast.success(data.message)
            setEditMode(false)
            // You might want to update the userData in Redux store here
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords don't match")
            return
        }
        try {
            const { data } = await axios.post(`${API_URL}/user/updatePassword`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, getAuthHeaders())
            toast.success(data.message)
            setShowPasswordModal(false)
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password')
        }
    }



    return (
        <div className='relative'>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-redish to-redish p-6 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                                    <p className="text-blue-100 capitalize">{userData.userType}</p>
                                </div>
                                {/* <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white">
                  <img 
                    src={userData?.profileImage || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                                {!editMode && (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <FiEdit /> Edit Profile
                                    </button>
                                )}
                            </div>

                            {editMode ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiUser className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiPhone className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="contact"
                                                    value={formData.contact}
                                                    onChange={handleInputChange}
                                                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiMail className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={userData.email}
                                                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditMode(false)
                                                    setFormData({
                                                        name: userData.name,
                                                        contact: userData.contact
                                                    })
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FiUser className="text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="text-gray-800">{userData.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FiPhone className="text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Contact</p>
                                            <p className="text-gray-800">{userData.contact || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FiMail className="text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-800">{userData.email}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={() => setShowPasswordModal(true)}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <FiLock /> Change Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLock className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showOldPassword ? "text" : "password"}
                                                name="oldPassword"
                                                value={passwordData.oldPassword}
                                                onChange={handlePasswordChange}
                                                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showOldPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLock className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showNewPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiLock className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showConfirmPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPasswordModal(false)
                                                setPasswordData({
                                                    oldPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                })
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default ProfilePage