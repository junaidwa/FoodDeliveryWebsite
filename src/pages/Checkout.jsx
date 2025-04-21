import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Checkout = ({ cartItems }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: ''
  });
  
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08; // 8%
  const tax = subtotal * taxRate;
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const total = subtotal + tax + deliveryFee;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user edits the field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Zip code validation (simple 5-digit check)
    if (formData.zipCode && !/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit zip code';
    }
    
    // Payment method specific validations
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Please use MM/YY format';
      }
      
      if (!formData.cardCVV.trim()) {
        newErrors.cardCVV = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCVV)) {
        newErrors.cardCVV = 'CVV should be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate order processing
      setTimeout(() => {
        setOrderPlaced(true);
        
        // After successful order placement, redirect to the confirmation page
        setTimeout(() => {
          navigate('/order-confirmation', { 
            state: { 
              orderNumber: Math.floor(100000 + Math.random() * 900000),
              orderTotal: total.toFixed(2),
              orderItems: cartItems 
            }
          });
        }, 2000);
      }, 1500);
    }
  };
  
  if (orderPlaced) {
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
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some items to your cart before proceeding to checkout.</p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition duration-300"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">Delivery Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium text-gray-700">First Name*</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block mb-1 font-medium text-gray-700">Last Name*</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email Address*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="address" className="block mb-1 font-medium text-gray-700">Delivery Address*</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="col-span-1">
                    <label htmlFor="city" className="block mb-1 font-medium text-gray-700">City*</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div className="col-span-1">
                    <label htmlFor="zipCode" className="block mb-1 font-medium text-gray-700">Zip Code*</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="country" className="block mb-1 font-medium text-gray-700">Country*</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 mt-10">Payment Method</h2>
                
                <div className="mb-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === 'credit-card' 
                        ? 'border-primary bg-primary-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <FaCreditCard className="text-gray-700 mr-3" />
                      <span>Credit Card</span>
                    </label>
                    
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === 'paypal' 
                        ? 'border-primary bg-primary-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <FaPaypal className="text-blue-600 mr-3" />
                      <span>PayPal</span>
                    </label>
                    
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === 'apple-pay' 
                        ? 'border-primary bg-primary-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="apple-pay"
                        checked={formData.paymentMethod === 'apple-pay'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <FaApplePay className="text-gray-900 mr-3" />
                      <span>Apple Pay</span>
                    </label>
                    
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === 'google-pay' 
                        ? 'border-primary bg-primary-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="google-pay"
                        checked={formData.paymentMethod === 'google-pay'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <FaGooglePay className="text-gray-800 mr-3" />
                      <span>Google Pay</span>
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'credit-card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block mb-1 font-medium text-gray-700">Card Number*</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block mb-1 font-medium text-gray-700">Name on Card*</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                          errors.cardName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block mb-1 font-medium text-gray-700">Expiry Date*</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                            errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="cardCVV" className="block mb-1 font-medium text-gray-700">CVV*</label>
                        <input
                          type="text"
                          id="cardCVV"
                          name="cardCVV"
                          placeholder="123"
                          value={formData.cardCVV}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                            errors.cardCVV ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardCVV && <p className="text-red-500 text-sm mt-1">{errors.cardCVV}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-gray-200">Order Summary</h2>
                
                <div className="max-h-60 overflow-y-auto mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex py-3 border-b border-gray-100">
                      <div className="w-16 h-16 rounded overflow-hidden mr-4">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="block w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
                >
                  Place Order
                </button>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>By placing your order, you agree to our</p>
                  <div className="mt-1">
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>
                    {' & '}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </div>
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