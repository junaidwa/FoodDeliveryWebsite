import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaArrowLeft, FaShoppingBag, FaMoneyBill, FaHome, FaUser, FaPhone, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { cartAPI, orderAPI } from '../lib/api';
import { toast } from 'react-toastify';

const Checkout = ({ cartItems: propCartItems }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    instructions: ''
  });
  
  const navigate = useNavigate();
  
  // Calculate pricing
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subTotal * taxRate;
  const total = subTotal + taxAmount + deliveryFee;

  // Load cart items and user data
  useEffect(() => {
    if (propCartItems && propCartItems.length) {
      setCartItems(propCartItems);
    } else {
      const userCart = cartAPI.getCart();
      setCartItems(userCart.items || []);
    }
    
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Pre-fill form with user data if available
      setShippingAddress(prev => ({
        ...prev,
        fullName: parsedUser.username || '',
        phone: parsedUser.phone || '',
      }));
    }
  }, [propCartItems]);
  
  // Handle input changes for shipping address
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value
    });
  };
  
  // Handle order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!validateForm()) {
      return;
    }
    
    // Make sure we have items in the cart
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Add items before checkout.');
      return;
    }
    
    // Make sure we have a logged in user
    if (!user || !user.user_id) {
      toast.error('You must be logged in to place an order.');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a formatted delivery address
      const formattedAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipCode}${shippingAddress.instructions ? ` (${shippingAddress.instructions})` : ''}`;
      
      // Determine restaurant ID (assuming all items are from the same restaurant)
      const restaurant_id = cartItems[0]?.restaurant_id;
      
      // Prepare order data
      const orderData = {
        user_id: user.user_id,
        restaurant_id,
        items: cartItems.map(item => ({
          item_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        delivery_address: formattedAddress
      };
      
      console.log("Sending order data:", orderData);
      
      // Place the order
      const result = await orderAPI.createOrder(orderData);
      
      // Clear the cart
      cartAPI.clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Navigate to confirmation page
      navigate('/order-confirmation', { state: { orderId: result.order_id } });
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'zipCode'];
    let isValid = true;
    
    for (const field of requiredFields) {
      if (!shippingAddress[field]?.trim()) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        isValid = false;
        break;
      }
    }
    
    // Additional validation for phone
    if (isValid && !/^\+?[0-9]{10,15}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      isValid = false;
    }
    
    return isValid;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8"
        >
          <FaCheckCircle size={60} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Redirecting you to your order confirmation...</p>
          <div className="mt-4">
            <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto"></div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/cart')}
            className="text-primary hover:text-primary-dark transition flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Cart
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingBag className="mx-auto mb-6 text-gray-300" size={80} />
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some items to your cart before checking out</p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Shipping Information Form */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
                  <FaHome className="inline-block mr-2 text-primary" />
                  Shipping Information
                </h2>
                
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={shippingAddress.fullName}
                          onChange={handleInputChange}
                          className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={handleInputChange}
                          className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
                      Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="zipCode">
                        ZIP Code *
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="instructions">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={shippingAddress.instructions}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      rows="3"
                      placeholder="Special instructions for delivery (e.g., gate code, landmarks, etc.)"
                    ></textarea>
                  </div>
                </form>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
                  <FaCreditCard className="inline-block mr-2 text-primary" />
                  Payment Method
                </h2>
                
                <div className="mb-4">
                  <div className="flex items-center p-4 border border-primary rounded-md bg-primary bg-opacity-5">
                    <input
                      id="cash"
                      name="paymentMethod"
                      type="radio"
                      className="h-4 w-4 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <label htmlFor="cash" className="ml-3 flex items-center">
                      <FaMoneyBill className="text-primary mr-2" />
                      <span className="text-gray-800 font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 pl-7">
                    Pay with cash when your order is delivered.
                  </p>
                </div>
                
                <div className="mt-8 text-sm text-gray-500">
                  <p className="text-center">
                    Currently, we only accept Cash on Delivery. More payment options coming soon!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-gray-200">Order Summary</h2>
                
                <div className="max-h-64 overflow-y-auto mb-4">
                  {cartItems.map(item => (
                    <div key={item.product_id || item.item_id} className="flex justify-between items-start py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FaShoppingBag />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                  className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center ${
                    loading || cartItems.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark'
                  } transition duration-300`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" /> Place Order
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>By placing your order, you agree to our terms and conditions</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout; 