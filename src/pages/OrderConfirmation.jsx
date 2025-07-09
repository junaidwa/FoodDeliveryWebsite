import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaShoppingBag, FaArrowLeft, FaHome, FaReceipt } from 'react-icons/fa';
import { orderAPI } from '../lib/api';

const OrderConfirmation = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      // Get order ID from location state (passed during navigation)
      const orderId = location.state?.orderId;
      
      if (!orderId) {
        // If no order ID, redirect to home
        navigate('/');
        return;
      }
      
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user.user_id) {
          navigate('/login');
          return;
        }
        
        // Fetch orders for the user
        const userOrders = await orderAPI.getUserOrders(user.user_id);
        
        // Find this specific order
        const currentOrder = userOrders.find(o => o.order_id === orderId);
        
        if (currentOrder) {
          setOrder(currentOrder);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location.state, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If no order found after loading
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <FaShoppingBag className="text-gray-300 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            >
              <FaHome className="inline-block mr-2" /> Go Home
            </Link>
            <Link 
              to="/profile"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              <FaReceipt className="inline-block mr-2" /> View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-green-50 p-8 text-center border-b border-gray-200">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
            >
              <FaCheckCircle className="text-green-500 text-4xl" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. Your order has been received and is being processed.
            </p>
            <p className="text-sm font-semibold text-gray-500 mt-2">
              Order #{order.order_id}
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.order_item_id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${(order.total_amount * 0.92).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span>${(order.total_amount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Total</span>
                    <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Delivery Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="mb-2">
                  <span className="font-medium">Address: </span> 
                  {order.delivery_address}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Payment Method: </span> 
                  Cash on Delivery
                </p>
                <p>
                  <span className="font-medium">Status: </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {order.order_status || 'Pending'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Link
                to="/"
                className="text-primary hover:text-primary-dark transition flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
              
              <Link
                to="/profile"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                View All Orders
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 