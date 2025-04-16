'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RestaurantEditForm from '../restaurants/EditeRestaurantModel';
import { FiX } from 'react-icons/fi';
import { API_URL } from '@/app/utils/apiUrl';

const RestaurantDetail = ({ restaurant,handleFetchRestaurant }) => {
  const router = useRouter();
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [editModalOpen,setEditModalOpen] = useState(false)
  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentTable, setCurrentTable] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVegetarian: false,
    isAvailable: true
  });

  // Menu handlers
  const handleAddMenu = () => {
    setCurrentMenu(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isVegetarian: false,
      isAvailable: true
    });
    setMenuModalOpen(true);
  };

  const handleEditMenu = (menuItem) => {
    setCurrentMenu(menuItem);
    setFormData({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      isVegetarian: menuItem.isVegetarian,
      isAvailable: menuItem.isAvailable
    });
    setMenuModalOpen(true);
  };

  const handleDeleteMenu = async (menuId) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        const response = await fetch(`${API_URL}/rest/${restaurant._id}/menu/${menuId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          handleFetchRestaurant()
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = currentMenu ? 'POST' : 'POST';
      const url = currentMenu 
        ? `${API_URL}/rest/${restaurant._id}/menu/`
        : `${API_URL}/rest/${restaurant._id}/menu/`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMenuModalOpen(false);
        handleFetchRestaurant()
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  // Table handlers (similar pattern as menu handlers)
  const handleAddTable = () => {
    setCurrentTable(null);
    setFormData({
      tableNumber: '',
      capacity: 2,
      pricePerHour: 20,
      isAvailable: true
    });
    setTableModalOpen(true);
  };

  const handleEditTable = (table) => {
    setCurrentTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      pricePerHour: table.pricePerHour,
      isAvailable: table.isAvailable
    });
    setTableModalOpen(true);
  };

  const handleDeleteTable = async (tableId) => {
    if (confirm('Are you sure you want to delete this table?')) {
      try {
        const response = await fetch(`${API_URL}/rest/tables/${tableId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          handleFetchRestaurant()
        }
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  const handleTableSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = currentTable ? 'PUT' : 'POST';
      const url = currentTable 
        ? `${API_URL}/rest/tables/${currentTable._id}`
        : `${API_URL}/rest/${restaurant?._id}/tables`;

      const payload = currentTable 
        ? formData 
        : { ...formData, restaurant: restaurant._id };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setTableModalOpen(false);
        handleFetchRestaurant()
      }
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-2 gap-2">
            {restaurant?.images?.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`Restaurant ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2">
        <div className='flex justify-between items-center gap-4'>

          <h1 className="text-3xl font-bold mb-2">{restaurant?.name}</h1>
          <h1 onClick={()=>setEditModalOpen(true)} className=" font-bold mb-2 text-blue-500 cursor-pointer hover:text-blue-600">Edit</h1>
        </div>
          <p className="text-gray-600 mb-4">{restaurant?.description}</p>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p className="text-gray-700">
              <span className="font-medium">Phone:</span> {restaurant?.contact?.phone}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {restaurant?.contact?.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Website:</span> {restaurant?.contact?.website}
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Address</h2>
            <p className="text-gray-700">{restaurant?.address?.street}</p>
            <p className="text-gray-700">
              {restaurant?.address?.city}, {restaurant?.address?.state} {restaurant?.address?.zipCode}
            </p>
            <p className="text-gray-700">{restaurant?.address?.country}</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Menu</h2>
          <button
            onClick={handleAddMenu}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Menu Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Vegetarian</th>
                <th className="py-3 px-4 text-left">Available</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurant?.menu?.map((item) => (
                <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{item?.name}</td>
                  <td className="py-3 px-4">{item?.description}</td>
                  <td className="py-3 px-4">${item?.price?.toFixed(2)}</td>
                  <td className="py-3 px-4 capitalize">{item?.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${item?.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item?.isVegetarian ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${item?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {item?.isAvailable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEditMenu(item)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tables Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tables</h2>
          <button
            onClick={handleAddTable}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Table
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurant?.tables?.map((table) => (
            <div key={table._id} className="border rounded-lg p-4 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Table #{table?.tableNumber}</h3>
              <p className="text-gray-600 mb-1">Capacity: {table?.capacity} people</p>
              <p className="text-gray-600 mb-1">Price: ${table?.pricePerHour}/hour</p>
              <p className="mb-3">
                Status: 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${table?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {table?.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTable(table)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTable(table._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {restaurant?.reviews?.length > 0 ? (
          <div className="space-y-4">
            {restaurant?.reviews?.map((review) => (
              <div key={review._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{review?.user?.name}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < review?.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review?.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review?.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>

      {/* Menu Modal */}
      <Modal isOpen={menuModalOpen} onClose={() => setMenuModalOpen(false)} title={currentMenu ? 'Edit Menu Item' : 'Add Menu Item'}>
        <form onSubmit={handleMenuSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData?.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData?.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData?.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData?.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="appetizer">Appetizer</option>
                <option value="main course">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={formData?.isVegetarian}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Vegetarian</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Available</span>
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setMenuModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {currentMenu ? 'Update' : 'Add'} Menu Item
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Table Modal */}
      <Modal isOpen={tableModalOpen} onClose={() => setTableModalOpen(false)} title={currentTable ? 'Edit Table' : 'Add Table'}>
        <form onSubmit={handleTableSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Table Number</label>
              <input
                type="text"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                min="1"
                max="20"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Price Per Hour ($)</label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                min="0"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Available</span>
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {currentTable ? 'Update' : 'Add'} Table
              </button>
            </div>
          </div>
        </form>
      </Modal>


      {editModalOpen && restaurant && (
      
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold"> Edite Restaurant</h2>
                    <button onClick={() => setEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  <RestaurantEditForm
                    restaurant={restaurant}
                    fetchRestaurants={handleFetchRestaurant}
                    onClose={() => setEditModalOpen(false)}
                   
                  />
                </div>
              </div>
            )}
      
    </div>
  );
};

export default RestaurantDetail;

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};