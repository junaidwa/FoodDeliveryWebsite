import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCog, FaChevronLeft, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaSearch, 
         FaShoppingBag, FaDollarSign, FaEye, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { userAPI } from '../lib/api';
import { toast } from 'react-toastify';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.user_type !== 'admin') {
      navigate('/');
      return;
    }
    
    // Fetch customers
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getAllCustomers();
        console.log('Fetched customers:', data);
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to load customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [navigate]);
  
  // Apply search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = customers.filter(customer => 
        customer.username?.toLowerCase().includes(lowercaseSearch) ||
        customer.email?.toLowerCase().includes(lowercaseSearch) ||
        customer.phone?.includes(lowercaseSearch)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };
  
  const viewCustomerDetails = async (customerId) => {
    try {
      setCustomerDetailsLoading(true);
      const customerData = await userAPI.getCustomerDetails(customerId);
      console.log('Customer details:', customerData);
      setSelectedCustomer(customerData);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to load customer details');
    } finally {
      setCustomerDetailsLoading(false);
    }
  };
  
  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <motion.h1
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Customer Management
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                View and manage customer details and order history
              </motion.p>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
              >
                <FaChevronLeft className="mr-2" /> Back to Dashboard
              </Link>
              
              <Link
                to="/admin/orders"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
              >
                <FaShoppingBag className="mr-2" /> Orders
              </Link>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <FaUser className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {customers.reduce((sum, customer) => sum + (customer.total_orders || 0), 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <FaShoppingBag className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0))}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <FaDollarSign className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Customers Table */}
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <FaUser className="mx-auto mb-6 text-gray-300" size={80} />
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">No Customers Found</h2>
              <p className="text-gray-500 mb-8">
                {searchTerm ? 'No customers match your search criteria.' : 'There are no customers registered yet.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <motion.tr
                        key={customer.user_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-light rounded-full flex items-center justify-center">
                              <FaUser className="text-primary" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {customer.user_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="flex items-center">
                              <FaEnvelope className="text-gray-400 mr-2" />
                              <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <FaPhone className="text-gray-400 mr-2" />
                              <span>{customer.phone || 'Not provided'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            {formatDate(customer.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <FaShoppingBag className="text-gray-400 mr-2" />
                            {customer.total_orders || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium flex items-center">
                            <FaDollarSign className="text-gray-400 mr-1" />
                            {formatCurrency(customer.total_spent || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => viewCustomerDetails(customer.user_id)}
                            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                          >
                            <FaEye className="mr-1" /> View Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Customer Details Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto m-4">
                {customerDetailsLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading customer details...</p>
                  </div>
                ) : (
                  <div>
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-primary-light rounded-full flex items-center justify-center">
                            <FaUser className="text-primary text-2xl" />
                          </div>
                          <div className="ml-4">
                            <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.username}</h2>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaEnvelope className="mr-1" /> {selectedCustomer.email}
                              <span className="mx-2">•</span>
                              <FaPhone className="mr-1" /> {selectedCustomer.phone || 'Not provided'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={closeCustomerDetails}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Customer Since</p>
                          <p className="text-lg font-semibold">{formatDate(selectedCustomer.created_at)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Total Orders</p>
                          <p className="text-lg font-semibold">{selectedCustomer.orders?.length || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Total Spent</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(
                              selectedCustomer.orders?.reduce(
                                (sum, order) => sum + parseFloat(order.total_amount || 0), 
                                0
                              ) || 0
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4">Order History</h3>
                      {selectedCustomer.orders?.length > 0 ? (
                        <div className="space-y-4">
                          {selectedCustomer.orders.map(order => (
                            <div key={order.order_id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-medium text-gray-800">Order #{order.order_id}</h4>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                      order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                      order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {order.order_status?.charAt(0).toUpperCase() + order.order_status?.slice(1)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {formatDate(order.order_date)} • {order.restaurant_name || 'Unknown Restaurant'}
                                  </p>
                                </div>
                                <div className="mt-2 md:mt-0">
                                  <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                                </div>
                              </div>
                              <div className="p-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Items:</h5>
                                <div className="space-y-2">
                                  {order.items?.map(item => (
                                    <div key={item.order_item_id} className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center mr-2">
                                          {item.image_url ? (
                                            <img 
                                              src={item.image_url} 
                                              alt={item.name} 
                                              className="w-8 h-8 rounded-md object-cover"
                                            />
                                          ) : (
                                            <FaShoppingBag className="text-gray-500 text-xs" />
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">{item.name}</p>
                                          <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-medium">{formatCurrency(item.price)} x {item.quantity}</p>
                                        <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <FaShoppingBag className="mx-auto mb-4 text-gray-300" size={40} />
                          <p className="text-gray-500">No orders found for this customer.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={closeCustomerDetails}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers; 