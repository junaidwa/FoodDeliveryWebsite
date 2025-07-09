import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft, FaUtensils } from 'react-icons/fa';
import { cartAPI } from '../lib/api';

const Cart = ({ cartItems: propCartItems, setCartItems }) => {
  const [cartItems, setLocalCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const deliveryFee = 2.99;
  const taxRate = 0.08; // 8% tax
  
  // Load cart items when component mounts or prop changes
  useEffect(() => {
    if (propCartItems && propCartItems.length) {
      setLocalCartItems(propCartItems);
    } else {
      // Fallback to get from API if props are empty
      const userCart = cartAPI.getCart();
      setLocalCartItems(userCart.items || []);
      // Update parent component's state
      if (setCartItems) {
        setCartItems(userCart.items || []);
      }
    }
  }, [propCartItems, setCartItems]);
  
  useEffect(() => {
    // Calculate subtotal whenever cart items change
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setSubTotal(total);
  }, [cartItems]);
  
  const calculateTax = () => {
    return subTotal * taxRate;
  };
  
  const calculateTotal = () => {
    return subTotal + calculateTax() + (cartItems.length > 0 ? deliveryFee : 0);
  };
  
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      // Update in UI
      const updatedItems = cartItems.map(item => 
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      setLocalCartItems(updatedItems);
      
      // Update in API
      const updatedCart = cartAPI.updateCartItem(productId, newQuantity);
      
      // Update parent component's state
      if (setCartItems) {
        setCartItems(updatedCart.items || []);
      }
    }
  };
  
  const handleRemoveItem = (productId) => {
    // Update in UI
    const updatedItems = cartItems.filter(item => item.product_id !== productId);
    setLocalCartItems(updatedItems);
    
    // Update in API
    const updatedCart = cartAPI.removeFromCart(productId);
    
    // Update parent component's state
    if (setCartItems) {
      setCartItems(updatedCart.items || []);
    }
  };
  
  const handleClearCart = () => {
    // Update in UI
    setLocalCartItems([]);
    
    // Update in API
    const emptyCart = cartAPI.clearCart();
    
    // Update parent component's state
    if (setCartItems) {
      setCartItems(emptyCart.items || []);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingBag className="mx-auto mb-6 text-gray-300" size={80} />
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition duration-300 inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4">Item</th>
                      <th className="text-center py-4">Quantity</th>
                      <th className="text-right py-4">Price</th>
                      <th className="text-right py-4">Total</th>
                      <th className="text-right py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {cartItems.map(item => (
                        <motion.tr
                          key={item.product_id}
                          className="border-b border-gray-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="py-4">
                            <div className="flex items-center">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-16 h-16 object-cover rounded mr-4"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                                  <FaUtensils className="text-gray-400" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.category || 'Food Item'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                              >
                                <FaMinus className="text-gray-700" size={12} />
                              </button>
                              <span className="mx-3 w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                              >
                                <FaPlus className="text-gray-700" size={12} />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 text-right">${parseFloat(item.price).toFixed(2)}</td>
                          <td className="py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleRemoveItem(item.product_id)}
                              className="p-2 text-red-500 hover:text-red-700 transition"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between">
                <Link
                  to="/menu"
                  className="text-primary hover:text-primary-dark transition flex items-center"
                >
                  ← Continue Shopping
                </Link>
                
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 transition flex items-center"
                >
                  <FaTrash className="mr-2" /> Clear Cart
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-gray-200">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  {cartItems.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  className="block text-center w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>Secure Checkout</p>
                  <p>We accept all major credit cards</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 