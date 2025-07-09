import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaSignOutAlt, FaShoppingBag, FaAddressCard, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { orderAPI } from '../lib/api';

// Helper component for order status
const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    
    // Convert snake_case to Title Case
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // If no user is logged in, redirect to login page
      navigate('/login');
    }
    
    setLoading(false);
  }, [navigate]);
  
  // Fetch recent orders when user is available
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user || !user.user_id) return;
      
      try {
        setOrdersLoading(true);
        console.log('Fetching orders for user ID:', user.user_id);
        const userOrders = await orderAPI.getUserOrders(user.user_id);
        console.log('Received user orders:', userOrders);
        
        // Sort by date (newest first) and take the 2 most recent
        const sorted = Array.isArray(userOrders) 
          ? userOrders
            .sort((a, b) => new Date(b.order_date || 0) - new Date(a.order_date || 0))
            .slice(0, 2)
          : [];
        
        setRecentOrders(sorted);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    
    if (user) {
      fetchRecentOrders();
    }
  }, [user]);
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition duration-300"
          >
            <FaUser className="mr-2" /> Sign In
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <motion.h1
              className="text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Profile
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Manage your account and view your orders
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Info Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-primary py-6 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto">
                  <FaUser className="text-primary text-3xl" />
                </div>
                <h2 className="text-xl font-semibold text-white mt-4">{user.username}</h2>
                {user.user_type && user.user_type !== 'customer' && (
                  <span className="inline-block bg-yellow-400 text-xs px-2 py-1 rounded-full text-gray-800 mt-2">
                    {user.user_type}
                  </span>
                )}
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaEnvelope className="text-primary mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaPhone className="text-primary mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaCalendarAlt className="text-primary mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {user.created_at ? formatDate(user.created_at) : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Dashboard Content */}
            <motion.div
              className="col-span-1 md:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/menu" className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3">
                      <FaShoppingBag className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order Food</p>
                      <p className="text-sm text-gray-500">Browse our delicious menu</p>
                    </div>
                  </Link>
                  
                  <Link to="/address" className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3">
                      <FaAddressCard className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Manage Addresses</p>
                      <p className="text-sm text-gray-500">Add or edit delivery addresses</p>
                    </div>
                  </Link>
                  
                  <Link to="/orders" className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3">
                      <FaShoppingBag className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order History</p>
                      <p className="text-sm text-gray-500">View your past orders</p>
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                  <Link to="/orders" className="text-primary hover:text-primary-dark flex items-center text-sm">
                    View All <FaArrowRight className="ml-1" />
                  </Link>
                </div>
                
                {ordersLoading ? (
                  <div className="py-8 text-center">
                    <div className="w-10 h-10 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading orders...</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-600">No orders yet</p>
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <Link
                      to="/menu"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
                    >
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.order_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Order #{order.order_id}</h4>
                          <OrderStatusBadge status={order.order_status} />
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          <FaCalendarAlt className="inline mr-1" /> {formatDate(order.order_date)}
                        </p>
                        <p className="text-sm mb-2">
                          <span className="font-medium">Total:</span> ${parseFloat(order.total_amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </p>
                        <Link 
                          to={`/orders`} 
                          state={{ highlightOrderId: order.order_id }}
                          className="text-sm text-primary hover:text-primary-dark flex items-center"
                        >
                          View Details <FaArrowRight className="ml-1" size={12} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 