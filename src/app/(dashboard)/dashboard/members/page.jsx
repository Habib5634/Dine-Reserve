'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';

const UsersPage = () => {
    const [nutritionists, setNutritionists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedNutritionist, setSelectedNutritionist] = useState(null);

    // Form states
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
       
        userType:"",
     
    });

    const [addFormData, setAddFormData] = useState({
        name: '',
     
        email: '',
        password: '',
       
      
        userType:"",
        
    });

    // Fetch all nutritionists
    useEffect(() => {
        const fetchNutritionists = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/user/users`, getAuthHeaders());

              
                setNutritionists(data.users);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch nutritionists');
                setLoading(false);
            }
        };
        fetchNutritionists();
    }, []);

    // Handle delete confirmation
    const handleDeleteConfirmation = (nutritionist) => {
        setSelectedNutritionist(nutritionist);
        setShowDeleteModal(true);
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/user/${selectedNutritionist._id}`, getAuthHeaders());
            toast.success('user deleted successfully');
            setNutritionists(nutritionists.filter(n => n._id !== selectedNutritionist._id));
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    // Handle edit click
    const handleEditClick = (nutritionist) => {
        setSelectedNutritionist(nutritionist);
        setEditFormData({
            name: nutritionist.name,
            email: nutritionist.email,
            userType: nutritionist.userType || '',
        });
        setShowEditModal(true);
    };

    // Handle edit form change
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    // Handle edit submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `${API_URL}/user/update/${selectedNutritionist._id}`,
                editFormData, getAuthHeaders()
            );
            toast.success('user updated successfully');
            setNutritionists(nutritionists.map(n =>
                n._id === selectedNutritionist._id ? { ...n, ...editFormData } : n
            ));
            setShowEditModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update nutritionist');
        }
    };

    // Handle add form change
    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData({
            ...addFormData,
            [name]: value
        });
    };

    // Handle add submit
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_URL}/user/register`, {
                ...addFormData,
                // userType: 'nutritionist'
            });
            toast.success('User added successfully');
            setNutritionists([...nutritionists, data.user]);
            setAddFormData({
                name: '',
       
        email: '',
        password: '',
      
        userType:"",
            });
            setShowAddModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add user');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blueish text-white rounded hover:bg-blue-700"
                >
                    <FiPlus className="mr-2" />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blueish">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {nutritionists.map((nutritionist) => (
                            <tr key={nutritionist._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{nutritionist.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{nutritionist.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{nutritionist.userType || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(nutritionist)}
                                            className="text-blueish hover:text-blue-900"
                                            title="Edit"
                                        >
                                            <FiEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteConfirmation(nutritionist)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Nutritionist Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Add User</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleAddSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={addFormData.name}
                                            onChange={handleAddFormChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={addFormData.email}
                                            onChange={handleAddFormChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={addFormData.password}
                                            onChange={handleAddFormChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                   

                                   
                                    <div className="">
                                        <label className=" ">User Type</label>
                                        <select
                                            name="userType"
                                            className="w-full p-2 border rounded"
                                            value={addFormData.userType}
                                            onChange={handleAddFormChange}
                                        >
                                            <option value="" disabled selected>
                                                Select your UserType
                                            </option>
                                            <option value="admin">Admin</option>
                                            <option value="manager">manager</option>
                                            <option value="customer">Customer</option>
                                        </select>
                                    </div>

                                   
                                </div>
                                
                                
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blueish text-white rounded hover:bg-blue-700"
                                    >
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Nutritionist Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Edit User</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleEditFormChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                   
                                    <div>
                                        <label className="block text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editFormData.email}
                                            onChange={handleEditFormChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    

                                    
                                    <div className="">
                                        <label className=" ">User Type</label>
                                        <select
                                            name="userType"
                                            className="w-full p-2 border rounded"
                                            value={editFormData.userType}
                                            onChange={handleEditFormChange}
                                        >
                                            <option value="" disabled selected>
                                                Select your UserType
                                            </option>
                                            <option value="admin">Admin</option>
                                            <option value="manager">manager</option>
                                            <option value="customer">Customer</option>
                                        </select>
                                    </div>
                                   
                                   
                                    
                                    
                                    
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blueish text-white rounded hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>
                            <p className="mb-6">
                                Are you sure you want to delete {selectedNutritionist?.name}?
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;