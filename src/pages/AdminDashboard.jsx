import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaUtensils, FaPlus, FaEdit, FaTrash, FaEnvelope, FaCheck, FaReply, FaShoppingBag, FaUserFriends } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { restaurantAPI, productAPI } from '../lib/api';
import ImageUploadPlaceholder from '../components/ImageUploadPlaceholder';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState({
    restaurants: false,
    products: false,
    contacts: false,
  });
  const [error, setError] = useState({
    restaurants: null,
    products: null,
    contacts: null,
  });

  // Restaurant form state
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    cuisine_type: '',
    address: '',
    contact_phone: '',
    image: null,
  });

  // Product form state
  const [productForm, setProductForm] = useState({
    restaurant_id: '',
    name: '',
    category: '',
    price: '',
    is_available: true,
    image: null,
  });

  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const owner_id = user.user_id;

  // Fetch restaurants
  const fetchRestaurants = async () => {
    setLoading({ ...loading, restaurants: true });
    setError({ ...error, restaurants: null });
    
    try {
      const data = await restaurantAPI.getAll();
      setRestaurants(data);
    } catch (err) {
      setError({ ...error, restaurants: err.message || 'Failed to fetch restaurants' });
    } finally {
      setLoading({ ...loading, restaurants: false });
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading({ ...loading, products: true });
    setError({ ...error, products: null });
    
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError({ ...error, products: err.message || 'Failed to fetch products' });
    } finally {
      setLoading({ ...loading, products: false });
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    setLoading({ ...loading, contacts: true });
    setError({ ...error, contacts: null });
    
    try {
      const response = await fetch('http://localhost:3000/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError({ ...error, contacts: err.message || 'Failed to fetch contact messages' });
    } finally {
      setLoading({ ...loading, contacts: false });
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact status');
      }
      
      // Update the local state
      setContacts(contacts.map(contact => 
        contact.contact_id === contactId 
          ? { ...contact, status: newStatus } 
          : contact
      ));
    } catch (err) {
      console.error('Error updating contact status:', err);
      setError({ ...error, contacts: err.message });
    }
  };

  // Fetch data on mount and tab change
  useEffect(() => {
    if (activeTab === 'restaurants') {
      fetchRestaurants();
    } else if (activeTab === 'products') {
      fetchProducts();
      // If restaurants haven't been loaded yet, load them for the dropdown
      if (restaurants.length === 0) {
        fetchRestaurants();
      }
    } else if (activeTab === 'contacts') {
      fetchContacts();
    }
  }, [activeTab]);

  // Handle restaurant form input changes
  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantForm({
      ...restaurantForm,
      [name]: value,
    });
  };

  // Handle restaurant image selection
  const handleRestaurantImageSelect = (imageData) => {
    setRestaurantForm({
      ...restaurantForm,
      image: imageData,
    });
  };

  // Handle product form input changes
  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle product image selection
  const handleProductImageSelect = (imageData) => {
    setProductForm({
      ...productForm,
      image: imageData,
    });
  };

  // Add or update restaurant
  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading({ ...loading, restaurants: true });
      
      const restaurantData = {
        ...restaurantForm,
        owner_id: owner_id,
      };
      
      // Remove image data for backend request since it's not implemented yet
      delete restaurantData.image;
      
      if (editingRestaurantId) {
        // Update existing restaurant
        await restaurantAPI.update(editingRestaurantId, restaurantData);
      } else {
        // Add new restaurant
        await restaurantAPI.create(restaurantData);
      }
      
      // Reset form and state
      setRestaurantForm({
        name: '',
        cuisine_type: '',
        address: '',
        contact_phone: '',
        image: null,
      });
      setIsAddingRestaurant(false);
      setEditingRestaurantId(null);
      
      // Refresh restaurant list
      fetchRestaurants();
    } catch (err) {
      setError({ ...error, restaurants: err.message || 'Failed to save restaurant' });
    } finally {
      setLoading({ ...loading, restaurants: false });
    }
  };

  // Add or update product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading({ ...loading, products: true });
      
      // Format price as a number
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
      };
      
      // Remove image data for backend request since it's not implemented yet
      delete productData.image;
      
      if (editingProductId) {
        // Update existing product
        await productAPI.update(editingProductId, productData);
      } else {
        // Add new product
        await productAPI.create(productData);
      }
      
      // Reset form and state
      setProductForm({
        restaurant_id: '',
        name: '',
        category: '',
        price: '',
        is_available: true,
        image: null,
      });
      setIsAddingProduct(false);
      setEditingProductId(null);
      
      // Refresh product list
      fetchProducts();
    } catch (err) {
      setError({ ...error, products: err.message || 'Failed to save product' });
    } finally {
      setLoading({ ...loading, products: false });
    }
  };

  // Set up restaurant for editing
  const editRestaurant = (restaurant) => {
    setRestaurantForm({
      name: restaurant.name,
      cuisine_type: restaurant.cuisine_type || '',
      address: restaurant.address || '',
      contact_phone: restaurant.contact_phone || '',
      image: restaurant.image || null,
    });
    setEditingRestaurantId(restaurant.restaurant_id);
    setIsAddingRestaurant(true);
  };

  // Set up product for editing
  const editProduct = (product) => {
    setProductForm({
      restaurant_id: product.restaurant_id,
      name: product.name,
      category: product.category || '',
      price: product.price.toString(),
      is_available: product.is_available,
      image: product.image || null,
    });
    setEditingProductId(product.item_id);
    setIsAddingProduct(true);
  };

  // Delete restaurant
  const deleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant? This will also delete all products associated with it.')) {
      try {
        setLoading({ ...loading, restaurants: true });
        await restaurantAPI.delete(id);
        fetchRestaurants();
      } catch (err) {
        setError({ ...error, restaurants: err.message || 'Failed to delete restaurant' });
      } finally {
        setLoading({ ...loading, restaurants: false });
      }
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading({ ...loading, products: true });
        await productAPI.delete(id);
        fetchProducts();
      } catch (err) {
        setError({ ...error, products: err.message || 'Failed to delete product' });
      } finally {
        setLoading({ ...loading, products: false });
      }
    }
  };

  // Get restaurant name by ID
  const getRestaurantName = (id) => {
    const restaurant = restaurants.find(r => r.restaurant_id === id);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Manage your restaurant, menu items, and customer communications
          </motion.p>
          
          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/admin/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <FaShoppingBag className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Orders</h3>
                  <p className="text-gray-500 text-sm">View and manage customer orders</p>
                </div>
              </div>
            </Link>
            
            <Link to="/admin/customers" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <FaUserFriends className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Customers</h3>
                  <p className="text-gray-500 text-sm">View customer details and orders</p>
                </div>
              </div>
            </Link>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('restaurants')}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <FaStore className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Restaurants</h3>
                  <p className="text-gray-500 text-sm">Manage your restaurants</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('products')}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <FaUtensils className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Menu Items</h3>
                  <p className="text-gray-500 text-sm">Manage your food items</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'restaurants' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('restaurants')}
            >
              <FaStore className="inline mr-2" />
              Restaurants
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'products' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('products')}
            >
              <FaUtensils className="inline mr-2" />
              Menu Items
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'contacts' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('contacts')}
            >
              <FaEnvelope className="inline mr-2" />
              Contact Messages
            </button>
          </div>
          
          {/* Restaurants Tab Content */}
          {activeTab === 'restaurants' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-primary">
                <h2 className="text-2xl font-bold text-white">Restaurant Management</h2>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Restaurant Management</h3>
                  <button
                    onClick={() => {
                      setIsAddingRestaurant(!isAddingRestaurant);
                      setEditingRestaurantId(null);
                      setRestaurantForm({
                        name: '',
                        cuisine_type: '',
                        address: '',
                        contact_phone: '',
                        image: null,
                      });
                    }}
                    className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    {isAddingRestaurant ? 'Cancel' : 'Add Restaurant'}
                  </button>
                </div>
                
                {error.restaurants && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error.restaurants}</span>
                  </div>
                )}
                
                {/* Restaurant Form */}
                {isAddingRestaurant && (
                  <div className="bg-gray-50 p-6 mb-6 rounded-md">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingRestaurantId ? 'Edit Restaurant' : 'Add New Restaurant'}
                    </h3>
                    
                    <form onSubmit={handleRestaurantSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                            Restaurant Name *
                          </label>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={restaurantForm.name}
                            onChange={handleRestaurantInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cuisine_type">
                            Cuisine Type
                          </label>
                          <input
                            id="cuisine_type"
                            type="text"
                            name="cuisine_type"
                            value={restaurantForm.cuisine_type}
                            onChange={handleRestaurantInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
                            Address
                          </label>
                          <input
                            id="address"
                            type="text"
                            name="address"
                            value={restaurantForm.address}
                            onChange={handleRestaurantInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="contact_phone">
                            Contact Phone
                          </label>
                          <input
                            id="contact_phone"
                            type="text"
                            name="contact_phone"
                            value={restaurantForm.contact_phone}
                            onChange={handleRestaurantInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        
                        {/* Restaurant Image Upload Placeholder */}
                        <div className="col-span-1 md:col-span-2">
                          <ImageUploadPlaceholder 
                            label="Restaurant Image"
                            onImageSelect={handleRestaurantImageSelect}
                            imageUrl={restaurantForm.image?.url || null}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsAddingRestaurant(false)}
                          className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center"
                          disabled={loading.restaurants}
                        >
                          {loading.restaurants ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : null}
                          {editingRestaurantId ? 'Update Restaurant' : 'Add Restaurant'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Restaurant List */}
                <div className="overflow-x-auto">
                  {loading.restaurants && !isAddingRestaurant ? (
                    <div className="flex justify-center py-6">
                      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : restaurants.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No restaurants found. Add your first restaurant!
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cuisine Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {restaurants.map((restaurant) => (
                          <tr key={restaurant.restaurant_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{restaurant.cuisine_type || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{restaurant.address || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{restaurant.contact_phone || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => editRestaurant(restaurant)}
                                className="text-primary hover:text-primary-dark mr-3"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteRestaurant(restaurant.restaurant_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Products Tab Content */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-primary">
                <h2 className="text-2xl font-bold text-white">Product Management</h2>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Product Management</h3>
                  <button
                    onClick={() => {
                      setIsAddingProduct(!isAddingProduct);
                      setEditingProductId(null);
                      setProductForm({
                        restaurant_id: restaurants.length > 0 ? restaurants[0].restaurant_id : '',
                        name: '',
                        category: '',
                        price: '',
                        is_available: true,
                        image: null,
                      });
                    }}
                    className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center"
                    disabled={restaurants.length === 0}
                  >
                    <FaPlus className="mr-2" />
                    {isAddingProduct ? 'Cancel' : 'Add Product'}
                  </button>
                </div>
                
                {error.products && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error.products}</span>
                  </div>
                )}
                
                {restaurants.length === 0 && !loading.restaurants && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6">
                    <strong className="font-bold">Notice:</strong>
                    <span className="block sm:inline"> You need to add a restaurant before you can add products.</span>
                  </div>
                )}
                
                {/* Product Form */}
                {isAddingProduct && (
                  <div className="bg-gray-50 p-6 mb-6 rounded-md">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProductId ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    
                    <form onSubmit={handleProductSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="restaurant_id">
                            Restaurant *
                          </label>
                          <select
                            id="restaurant_id"
                            name="restaurant_id"
                            value={productForm.restaurant_id}
                            onChange={handleProductInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                          >
                            <option value="">Select Restaurant</option>
                            {restaurants.map((restaurant) => (
                              <option key={restaurant.restaurant_id} value={restaurant.restaurant_id}>
                                {restaurant.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                            Product Name *
                          </label>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={productForm.name}
                            onChange={handleProductInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                            Category
                          </label>
                          <input
                            id="category"
                            type="text"
                            name="category"
                            value={productForm.category}
                            onChange={handleProductInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">
                            Price *
                          </label>
                          <input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            name="price"
                            value={productForm.price}
                            onChange={handleProductInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                          />
                        </div>
                        
                        <div className="mb-4 flex items-center">
                          <input
                            id="is_available"
                            type="checkbox"
                            name="is_available"
                            checked={productForm.is_available}
                            onChange={handleProductInputChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
                            Available for Order
                          </label>
                        </div>
                        
                        {/* Product Image Upload Placeholder */}
                        <div className="col-span-1 md:col-span-2">
                          <ImageUploadPlaceholder 
                            label="Product Image"
                            onImageSelect={handleProductImageSelect}
                            imageUrl={productForm.image?.url || null}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsAddingProduct(false)}
                          className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center"
                          disabled={loading.products}
                        >
                          {loading.products ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : null}
                          {editingProductId ? 'Update Product' : 'Add Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Product List */}
                <div className="overflow-x-auto">
                  {loading.products && !isAddingProduct ? (
                    <div className="flex justify-center py-6">
                      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No products found. Add your first product!
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Restaurant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Available
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.item_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{getRestaurantName(product.restaurant_id)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{product.category || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${parseFloat(product.price).toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                product.is_available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.is_available ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => editProduct(product)}
                                className="text-primary hover:text-primary-dark mr-3"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.item_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Contacts Tab Content */}
          {activeTab === 'contacts' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Contact Messages</h2>
                <button 
                  className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition-colors"
                  onClick={fetchContacts}
                >
                  Refresh
                </button>
              </div>
              
              {error.contacts && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error.contacts}
                </div>
              )}
              
              {loading.contacts ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading contact messages...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">No contact messages available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <motion.div 
                      key={contact.contact_id}
                      className={`bg-white rounded-lg shadow-md p-4 ${
                        contact.status === 'unread' ? 'border-l-4 border-blue-500' : 
                        contact.status === 'read' ? 'border-l-4 border-yellow-500' :
                        'border-l-4 border-green-500'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{contact.subject || 'No Subject'}</h3>
                          <p className="text-sm text-gray-600">
                            From: {contact.name} ({contact.email})
                            {contact.phone && ` • ${contact.phone}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(contact.created_at)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {contact.status === 'unread' && (
                            <button
                              onClick={() => updateContactStatus(contact.contact_id, 'read')}
                              className="text-blue-500 hover:text-blue-700"
                              title="Mark as Read"
                            >
                              <FaCheck />
                            </button>
                          )}
                          {contact.status !== 'responded' && (
                            <button
                              onClick={() => updateContactStatus(contact.contact_id, 'responded')}
                              className="text-green-500 hover:text-green-700"
                              title="Mark as Responded"
                            >
                              <FaReply />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="whitespace-pre-line">{contact.message}</p>
                      </div>
                      <div className="mt-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          contact.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                          contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 