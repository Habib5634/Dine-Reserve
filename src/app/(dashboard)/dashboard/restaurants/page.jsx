'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEye, FiEdit2, FiTrash2, FiX, FiChevronUp, FiPlus, FiChevronDown, } from 'react-icons/fi';
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';
import RestaurantEditForm from './EditeRestaurantModel';
import { IoIosCloseCircle } from 'react-icons/io';
import AddTableModal from './AddTableModel';

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [unassignedManagers, setUnassignedManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'main course',
    isVegetarian: false,
    isAvailable: true
  });

  // Form state
  const [addFormData, setAddFormData] = useState({
    name: '',
    description: '',
    location: '',
    images: [],
    cuisineType: [],
    managerId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },

  });

  const [imageLink, setImageLink] = useState(''); // Temporary image link input
  // Add these states to your main component
  const [addTableModalOpen, setAddTableModalOpen] = useState(false);
  const [selectedRestaurantForTable, setSelectedRestaurantForTable] = useState(null);
  // Add this handler function
  const handleOpenAddTableModal = (restaurant) => {
    setSelectedRestaurantForTable(restaurant);
    setAddTableModalOpen(true);
  };

  const handleAddTable = async (restaurantId, tableData) => {
    try {
      // Convert capacity to number
      tableData.capacity = Number(tableData.capacity);
      tableData.pricePerHour = Number(tableData.pricePerHour);

      const response = await axios.post(
        `${API_URL}/rest/${restaurantId}/tables`,
        tableData,
        getAuthHeaders()
      );

      // Update the restaurants list with the new table count
      setRestaurants(restaurants.map(r =>
        r._id === restaurantId
          ? { ...r, tablesCount: (r.tablesCount || 0) + 1 }
          : r
      ));

      return response.data;
    } catch (error) {
      console.error('Error adding table:', error);
      throw error;
    }
  };
  const addImageLink = () => {
    if (imageLink.trim()) {
      setAddFormData({
        ...addFormData,
        images: [...addFormData.images, imageLink],
      });
      setImageLink('');
    }
  };
  const removeImage = (indexToRemove) => {
    setAddFormData({
      ...addFormData,
      images: addFormData.images.filter((_, index) => index !== indexToRemove),
    });
  };
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${API_URL}/rest/`, getAuthHeaders());
      setRestaurants(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  // Fetch restaurants
  useEffect(() => {
  
    fetchRestaurants();
  }, []);

  // Handle view button click
  const handleView = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setViewModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);

    setEditModalOpen(true);
  };

  // Handle delete button click
  const handleDelete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDeleteModalOpen(true);
  };



  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/rest/${selectedRestaurant._id}`, getAuthHeaders());
      setRestaurants(restaurants.filter(r => r._id !== selectedRestaurant._id));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting restaurant:', err);
    }
  };



  // Fetch unassigned managers when modal opens
  useEffect(() => {
    if (showAddModal) {
      fetchUnassignedManagers();
    }
  }, [showAddModal]);

  const fetchUnassignedManagers = async () => {
    setLoadingManagers(true);
    try {
      const response = await axios.get(`${API_URL}/rest/managers/unassigned`, getAuthHeaders());
      setUnassignedManagers(response.data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    } finally {
      setLoadingManagers(false);
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNestedInputChange = (parent, e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
  };





  const handleAddMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price) {
      setMenuItems([...menuItems, newMenuItem]);
      setNewMenuItem({
        name: '',
        description: '',
        price: 0,
        category: 'main course',
        isVegetarian: false,
        isAvailable: true
      });
      setShowMenuForm(false);
    }
  };

  const handleRemoveMenuItem = (index) => {
    const updatedItems = [...menuItems];
    updatedItems.splice(index, 1);
    setMenuItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...addFormData,
        menuItems
      };

      const response = await axios.post(`${API_URL}/rest/`, payload, getAuthHeaders());
      console.log('Restaurant created:', response.data);
      // Reset form and close modal
      fetchRestaurants();
      setAddFormData({
        name: '',
        description: '',
        location: '',
        cuisineType: [],
        images: [],
        managerId: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        contact: {
          phone: '',
          email: '',
          website: ''
        },

      });
      setMenuItems([]);
      setShowAddModal(false);
      // You might want to refresh the restaurant list here
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };
  if (loading) return <div className="flex justify-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <FiPlus className="mr-2" />
          Add Restaurant
        </button>
      </div>

      {/* Restaurants Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tables</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{restaurant.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{restaurant.location}</div>
                </td>
              
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">
                      {restaurant.tablesCount || 0} tables
                    </span>
                    <button
                      onClick={() => handleOpenAddTableModal(restaurant)}
                      className="text-green-600 hover:text-green-800"
                      title="Add Table"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{restaurant.manager?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${restaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {restaurant.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(restaurant)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">{selectedRestaurant.name}</h2>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
                  <p className="text-gray-600 mb-4">{selectedRestaurant.description}</p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {selectedRestaurant.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Cuisine:</span> {selectedRestaurant.cuisineType.join(', ')}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedRestaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedRestaurant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">
                    {selectedRestaurant.address.street}<br />
                    {selectedRestaurant.address.city}, {selectedRestaurant.address.state} {selectedRestaurant.address.zipCode}<br />
                    {selectedRestaurant.address.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {selectedRestaurant.contact.phone}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {selectedRestaurant.contact.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Website:</span> {selectedRestaurant.contact.website}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Menu Items ({selectedRestaurant.menu.length})</h3>
                  <div className="space-y-2">
                    {selectedRestaurant.menu.map(item => (
                      <div key={item._id} className="border-b pb-2">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-sm">${item.price} • {item.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {/* // In your main component where you have the edit modal: */}
      {editModalOpen && selectedRestaurant && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold"> Edite Restaurant</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <RestaurantEditForm
              restaurant={selectedRestaurant}
              fetchRestaurants={fetchRestaurants}
              onClose={() => setEditModalOpen(false)}
              onUpdate={(updatedRestaurant) => {
                setRestaurants(restaurants.map(r =>
                  r._id === updatedRestaurant._id ? updatedRestaurant : r
                ));
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
              <button onClick={() => setDeleteModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{selectedRestaurant.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add Restaurant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Add New Restaurant</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={addFormData.name}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                      <input
                        type="text"
                        name="location"
                        value={addFormData.location}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                      <textarea
                        name="description"
                        value={addFormData.description}
                        onChange={handleAddInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manager*</label>
                      <select
                        name="managerId"
                        value={addFormData.managerId}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={loadingManagers}
                      >
                        <option value="">Select Manager</option>
                        {unassignedManagers.map(manager => (
                          <option key={manager._id} value={manager._id}>
                            {manager.name} ({manager.email})
                          </option>
                        ))}
                      </select>
                      {loadingManagers && <p className="text-sm text-gray-500 mt-1">Loading managers...</p>}
                      {unassignedManagers.length === 0 && !loadingManagers && (
                        <p className="text-sm text-red-500 mt-1">No available managers. Please create a manager account first.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        name="street"
                        value={addFormData.address.street}
                        onChange={(e) => handleAddNestedInputChange('address', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={addFormData.address.city}
                        onChange={(e) => handleAddNestedInputChange('address', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={addFormData.address.state}
                        onChange={(e) => handleAddNestedInputChange('address', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={addFormData.address.zipCode}
                        onChange={(e) => handleAddNestedInputChange('address', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={addFormData.address.country}
                        onChange={(e) => handleAddNestedInputChange('address', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={addFormData.contact.phone}
                        onChange={(e) => handleAddNestedInputChange('contact', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={addFormData.contact.email}
                        onChange={(e) => handleAddNestedInputChange('contact', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={addFormData.contact.website}
                        onChange={(e) => handleAddNestedInputChange('contact', e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>



                {/* Menu Items */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Menu Items</h3>
                    <button
                      type="button"
                      onClick={() => setShowMenuForm(!showMenuForm)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      {showMenuForm ? (
                        <>
                          <FiChevronUp className="mr-1" /> Hide Form
                        </>
                      ) : (
                        <>
                          <FiPlus className="mr-1" /> Add Menu Item
                        </>
                      )}
                    </button>
                  </div>

                  {showMenuForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                          <input
                            type="text"
                            value={newMenuItem.name}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newMenuItem.price}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={newMenuItem.category}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="appetizer">Appetizer</option>
                            <option value="main course">Main Course</option>
                            <option value="dessert">Dessert</option>
                            <option value="beverage">Beverage</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isVegetarian"
                            checked={newMenuItem.isVegetarian}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, isVegetarian: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isVegetarian" className="ml-2 block text-sm text-gray-700">
                            Vegetarian
                          </label>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={newMenuItem.description}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddMenuItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Add to Menu
                        </button>
                      </div>
                    </div>
                  )}

                  {menuItems.length > 0 ? (
                    <div className="space-y-2">
                      {menuItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">${item.price} • {item.category}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMenuItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No menu items added yet</p>
                  )}
                </div>


                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Links</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageLink}
                      onChange={(e) => setImageLink(e.target.value)}
                      placeholder="Enter image link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addImageLink}
                      className="bg-blue text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center my-6 gap-4">
                    {addFormData.images.map((link, index) => (
                      <div className=' h-20 w-20 relative'>
                        <img src={link} alt="images" className='h-full w-full object-cover' />
                        <IoIosCloseCircle size={24} onClick={() => removeImage(index)} className='text-red absolute -top-2 -right-2 cursor-pointer' />

                      </div>
                    ))}
                  </div>
                </div>



              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* // Add this to your main component's return statement */}
      {addTableModalOpen && selectedRestaurantForTable && (
        <AddTableModal
          isOpen={addTableModalOpen}
          onClose={() => setAddTableModalOpen(false)}
          restaurant={selectedRestaurantForTable}
          onAddTable={handleAddTable}
        />
      )}
    </div>
  );
};

export default RestaurantPage;