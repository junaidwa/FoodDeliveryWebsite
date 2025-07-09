import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaShoppingBag, FaUser, FaStore, FaMapMarkerAlt, FaCalendarAlt, FaExclamationCircle, FaPrint, FaEnvelope } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { orderAPI } from '../lib/api';
import { toast } from 'react-toastify';

// Order Status Badge Component
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
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  
  // Fetch order data
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const allOrders = await orderAPI.getAllOrders();
        console.log('All orders:', allOrders);
        
        const selectedOrder = allOrders.find(o => o.order_id.toString() === orderId);
        console.log('Selected order:', selectedOrder);
        
        if (selectedOrder) {
          // Debug for order items
          console.log('Order items:', selectedOrder.items);
          console.log('Order items length:', selectedOrder.items?.length || 0);
          
          // Check if order items have required properties
          if (selectedOrder.items && selectedOrder.items.length > 0) {
            console.log('First item details:', selectedOrder.items[0]);
            console.log('First item ID:', selectedOrder.items[0].item_id);
            console.log('First item properties:', Object.keys(selectedOrder.items[0]));
          } else {
            console.log('No items found for this order');
          }
        }
        
        if (!selectedOrder) {
          setError('Order not found');
        } else {
          setOrder(selectedOrder);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

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

  const handleUpdateStatus = async (newStatus) => {
    try {
      setProcessing(true);
      await orderAPI.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrder({
        ...order,
        order_status: newStatus
      });
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setProcessing(false);
    }
  };

  const calculateSubtotal = () => {
    if (!order?.items || order.items.length === 0) return 0;
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const printOrder = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-8">{error || 'Order not found'}</p>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link
                  to="/admin/orders"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <FaChevronLeft />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">
                  Order #{order.order_id}
                </h1>
                <OrderStatusBadge status={order.order_status || 'pending'} />
              </div>
              <p className="text-sm text-gray-500">
                <FaCalendarAlt className="inline-block mr-1" />
                Placed on {formatDate(order.order_date)}
              </p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={printOrder}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                <FaPrint className="mr-2" /> Print
              </button>
              
              <button 
                onClick={() => {
                  // Implement email functionality in the future
                  toast.info('Email functionality will be implemented soon');
                }}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                <FaEnvelope className="mr-2" /> Email Receipt
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details and Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                  
                  {!order.items || order.items.length === 0 ? (
                    <div className="text-center py-8">
                      <FaShoppingBag className="mx-auto mb-4 text-gray-300" size={40} />
                      <p className="text-gray-500">No items found for this order.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Item</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Price</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Quantity</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.order_item_id || `item-${Math.random()}`} className="border-b border-gray-100">
                              <td className="py-4 px-2">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                                    {item.image_url ? (
                                      <img 
                                        src={item.image_url} 
                                        alt={item.name || `Item #${item.item_id || ''}`} 
                                        className="w-10 h-10 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <FaShoppingBag className="text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-800">{item.name || `Item #${item.item_id || 'Unknown'}`}</h3>
                                    <p className="text-sm text-gray-500">{item.category || 'Food Item'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-2 text-center">${parseFloat(item.price || 0).toFixed(2)}</td>
                              <td className="py-4 px-2 text-center">{item.quantity || 1}</td>
                              <td className="py-4 px-2 text-right font-medium">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status Update */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdateStatus('pending')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        order.order_status === 'pending'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      } transition-colors`}
                      disabled={processing}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('processing')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        order.order_status === 'processing'
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      } transition-colors`}
                      disabled={processing}
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('out_for_delivery')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        order.order_status === 'out_for_delivery'
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      } transition-colors`}
                      disabled={processing}
                    >
                      Out for Delivery
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('delivered')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        order.order_status === 'delivered'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      } transition-colors`}
                      disabled={processing}
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('cancelled')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        order.order_status === 'cancelled'
                          ? 'bg-red-500 text-white'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors`}
                      disabled={processing}
                    >
                      Cancelled
                    </button>
                  </div>
                  {processing && <p className="mt-2 text-sm text-gray-500">Processing...</p>}
                </div>
              </div>
            </div>
            
            {/* Order Summary and Customer Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaUser className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="font-medium">{order.username || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.email || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Delivery Address:</p>
                        <p className="whitespace-pre-line">{order.delivery_address || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaStore className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Restaurant:</p>
                        <p>{order.restaurant_name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>$3.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${(calculateSubtotal() * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${parseFloat(order.total_amount).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment Method: Cash on Delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Admin Notes</h2>
                  
                  <textarea
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add notes about this order (for admin reference only)"
                  ></textarea>
                  
                  <button className="mt-3 w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail; 