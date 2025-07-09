import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBill, FaExclamationCircle } from 'react-icons/fa';
import { orderAPI } from '../lib/api';

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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user.user_id) {
          navigate('/login');
          return;
        }
        
        // Fetch orders for the user
        const userOrders = await orderAPI.getUserOrders(user.user_id);
        
        // Sort orders by date (newest first)
        const sortedOrders = userOrders.sort((a, b) => {
          return new Date(b.order_date) - new Date(a.order_date);
        });
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate]);
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">My Orders</h1>
            <p className="text-gray-600">View and track your order history</p>
          </div>
          <Link
            to="/profile"
            className="text-primary hover:text-primary-dark transition flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Profile
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <FaShoppingBag className="mx-auto mb-6 text-gray-300" size={80} />
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">No Orders Yet</h2>
            <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold mr-3">Order #{order.order_id}</h3>
                        <OrderStatusBadge status={order.order_status} />
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatDate(order.order_date)}</span>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <p className="font-semibold">Total: ${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Delivery Address</p>
                        <p className="font-medium">{order.delivery_address}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaMoneyBill className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Payment Method</p>
                        <p className="font-medium">Cash on Delivery</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.payment_status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment_status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50">
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items?.map(item => (
                      <div key={item.order_item_id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                            <FaShoppingBag className="text-gray-500 text-xs" />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 