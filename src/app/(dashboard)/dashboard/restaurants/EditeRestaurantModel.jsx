'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';


const RestaurantEditForm = ({ 
  restaurant, 
  onClose, 
  
  fetchRestaurants
}) => {
  // Initialize form data with the restaurant prop
  const [formData, setFormData] = useState({
    name: restaurant.name || '',
    description: restaurant.description || '',
    location: restaurant.location || '',
    cuisineType: restaurant.cuisineType || [],
    isActive: restaurant.isActive !== undefined ? restaurant.isActive : true,
    address: {
      street: restaurant.address?.street || '',
      city: restaurant.address?.city || '',
      state: restaurant.address?.state || '',
      zipCode: restaurant.address?.zipCode || '',
      country: restaurant.address?.country || ''
    },
    contact: {
      phone: restaurant.contact?.phone || '',
      email: restaurant.contact?.email || '',
      website: restaurant.contact?.website || ''
    },
    openingHours: restaurant.openingHours || {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 // State for image URLs
 const [imageLinks, setImageLinks] = useState(restaurant.images || []);
 const [newImageLink, setNewImageLink] = useState('');
  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle nested object changes (address, contact)
  const handleNestedChange = (parent, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value
      }
    }));
  };

  // Add new image link
  const addImageLink = () => {
    if (newImageLink.trim() && !imageLinks.includes(newImageLink)) {
      setImageLinks([...imageLinks, newImageLink]);
      setNewImageLink('');
      // Update form data with new images array
      setFormData(prev => ({ ...prev, images: [...imageLinks, newImageLink] }));
    }
  };

  // Remove image link
  const removeImageLink = (index) => {
    const updatedLinks = imageLinks.filter((_, i) => i !== index);
    setImageLinks(updatedLinks);
    // Update form data with removed images array
    setFormData(prev => ({ ...prev, images: updatedLinks }));
  };

  // Handle cuisine type changes
  const handleCuisineChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      cuisineType: value.split(',').map(item => item.trim())
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${API_URL}/rest/update/${restaurant._id}`,
        formData,
        getAuthHeaders()
      );
      // onUpdate(response.data);
      fetchRestaurants()
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error updating restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 ">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cuisine Types (comma separated)</label>
            <input
              type="text"
              value={formData.cuisineType.join(', ')}
              onChange={handleCuisineChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active</label>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Address</h3>
          
          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={(e) => handleNestedChange('address', e)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.address.city}
              onChange={(e) => handleNestedChange('address', e)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.address.state}
              onChange={(e) => handleNestedChange('address', e)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.address.zipCode}
              onChange={(e) => handleNestedChange('address', e)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.address.country}
              onChange={(e) => handleNestedChange('address', e)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.contact.phone}
              onChange={(e) => handleNestedChange('contact', e)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.contact.email}
              onChange={(e) => handleNestedChange('contact', e)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Website</label>
            <input
              type="url"
              name="website"
              value={formData.contact.website}
              onChange={(e) => handleNestedChange('contact', e)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
{/* Image Links Section */}
<div className="space-y-4">
        <h3 className="text-lg font-medium">Restaurant Images</h3>
        
        {/* Add Image Link Input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageLink}
            onChange={(e) => setNewImageLink(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="button"
            onClick={addImageLink}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Link
          </button>
        </div>

        {/* Image Preview Grid */}
        {imageLinks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {imageLinks.map((link, index) => (
              <div key={index} className="relative group">
                <img
                  src={link}
                  alt={`Restaurant image ${index + 1}`}
                  className="w-full h-32 z-0 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImageLink(index)}
                  className="absolute top-1 right-1 z-20 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default RestaurantEditForm;