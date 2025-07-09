import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaShoppingBag, FaUserCog, FaFilter, FaSearch, FaCalendarAlt, FaUser, FaStore, FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { orderAPI } from '../lib/api';
import { toast } from 'react-toastify';

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
    if (!status) return 'Unknown';
    
    // Convert snake_case to Title Case
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get the current user from localStorage
    const currentUserData = localStorage.getItem('user');
    
    if (!currentUserData) {
      // If no user is logged in, redirect to login page
      navigate('/login');
      return;
    }
    
    const currentUser = JSON.parse(currentUserData);
    
    if (currentUser.user_type !== 'admin') {
      // If user is not an admin, redirect to home page
      navigate('/');
      return;
    }
  }, [navigate]);
  
  // Load all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const allOrders = await orderAPI.getAllOrders();
        console.log("Fetched orders:", allOrders); // Debug
        
        // Check each order for items
        allOrders.forEach(order => {
          console.log(`Order #${order.order_id} has ${order.items ? order.items.length : 0} items`);
          
          if (order.items && order.items.length > 0) {
            console.log('Sample item from order:', order.items[0]);
            console.log('Item properties:', Object.keys(order.items[0]));
          } else {
            console.log('No items found for this order');
          }
        });
        
        // Check for any rendering issues
        const ordersWithNoItems = allOrders.filter(o => !o.items || o.items.length === 0);
        if (ordersWithNoItems.length > 0) {
          console.warn(`${ordersWithNoItems.length} orders have no items:`, ordersWithNoItems.map(o => o.order_id));
        }
        
        setOrders(allOrders);
        setFilteredOrders(allOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters when search term, status filter, or date filter changes
  useEffect(() => {
    // Apply filters
    let result = orders;

    // Filter by search term (customer name, order ID, email)
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.order_id?.toString().includes(lowercaseSearch) ||
        order.username?.toLowerCase().includes(lowercaseSearch) ||
        order.email?.toLowerCase().includes(lowercaseSearch) ||
        order.phone?.includes(lowercaseSearch)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.order_status === statusFilter);
    }

    // Filter by date
    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter(order => new Date(order.order_date) >= today);
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(order => new Date(order.order_date) >= oneWeekAgo);
    } else if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      result = result.filter(order => new Date(order.order_date) >= oneMonthAgo);
    } else if (dateFilter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of the selected day
      result = result.filter(order => {
        const orderDate = new Date(order.order_date);
        return orderDate >= start && orderDate <= end;
      });
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, dateFilter, startDate, endDate, orders]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order.order_id === orderId) {
          return {
            ...order, 
            order_status: newStatus
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Navigate to order detail page
  const goToOrderDetail = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
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
                Manage Orders
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                View and process customer orders
              </motion.p>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
              >
                <FaChevronLeft className="mr-2" /> Back to Admin
              </Link>
              
              <Link
                to="/admin/users"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
              >
                <FaUserCog className="mr-2" /> Manage Users
              </Link>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders by ID, customer, or email..."
                  className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="custom">Custom Date Range</option>
                  </select>
                </div>
                {dateFilter === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Order Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <FaShoppingBag className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.order_status === 'pending').length}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <FaShoppingBag className="text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Delivered</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.order_status === 'delivered').length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <FaShoppingBag className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.order_status === 'cancelled').length}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <FaShoppingBag className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <FaShoppingBag className="mx-auto mb-6 text-gray-300" size={80} />
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">No Orders Found</h2>
              <p className="text-gray-500 mb-8">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                  ? 'No orders match your search or filter criteria.'
                  : 'There are no orders in the system yet.'}
              </p>
              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.order_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="cursor-pointer" onClick={() => goToOrderDetail(order.order_id)}>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold mr-3 text-primary hover:underline">Order #{order.order_id}</h3>
                          <OrderStatusBadge status={order.order_status} />
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(order.order_date)}</span>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 flex items-center">
                        <p className="font-semibold mr-4">Total: ${parseFloat(order.total_amount).toFixed(2)}</p>
                        <button 
                          onClick={() => goToOrderDetail(order.order_id)} 
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-start">
                        <FaUser className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500">Customer</p>
                          <p className="font-medium">{order.username || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.email || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaStore className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500">Restaurant</p>
                          <p className="font-medium">{order.restaurant_name || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500">Delivery Address</p>
                          <p className="font-medium">{order.delivery_address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium mr-2">Update Status:</span>
                        <button
                          onClick={() => handleUpdateStatus(order.order_id, 'pending')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.order_status === 'pending' 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.order_id, 'processing')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.order_status === 'processing' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          Processing
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.order_id, 'out_for_delivery')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.order_status === 'out_for_delivery' 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          }`}
                        >
                          Out for Delivery
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.order_id, 'delivered')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.order_status === 'delivered' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          Delivered
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.order_id, 'cancelled')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.order_status === 'cancelled' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          Cancelled
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Order Items ({order.items?.length || 0})</h4>
                      <button 
                        onClick={() => goToOrderDetail(order.order_id)}
                        className="text-primary text-sm hover:underline"
                      >
                        View All Details
                      </button>
                    </div>
                    
                    {!order.items || order.items.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No items found for this order</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.order_item_id || `item-${Math.random()}`} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                                {item.image_url ? (
                                  <img 
                                    src={item.image_url} 
                                    alt={item.name || 'Food item'} 
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <FaShoppingBag className="text-gray-500 text-xs" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{item.name || `Item #${item.item_id || 'Unknown'}`}</p>
                                <p className="text-xs text-gray-500">{item.category || 'Food Item'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${parseFloat(item.price || 0).toFixed(2)} x {item.quantity || 1}</p>
                              <p className="font-semibold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-center text-gray-500 text-sm mt-2">
                            + {order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders; 