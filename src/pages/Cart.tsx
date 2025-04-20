import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const Cart = ({ cartItems, setCartItems }: CartProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome20') {
      setDiscount(20);
      setPromoError('');
    } else if (promoCode.toLowerCase() === 'tasty10') {
      setDiscount(10);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setDiscount(0);
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  // Delivery fee
  const deliveryFee = subtotal > 30 ? 0 : 5;
  
  // Calculate discount amount
  const discountAmount = (subtotal * discount) / 100;
  
  // Calculate total
  const total = subtotal + deliveryFee - discountAmount;

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center font-poppins">
          Your <span className="text-primary">Cart</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingBag className="mx-auto mb-6 text-gray-300" size={80} />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/menu"
              className="bg-primary text-white px-6 py-3 rounded-full inline-flex items-center btn"
            >
              <FaArrowLeft className="mr-2" /> Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                </div>
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      className="flex items-center py-6 px-6 border-b hover:bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md mr-6"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          className="text-gray-500 hover:text-primary p-1"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <FaMinus size={14} />
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button
                          className="text-gray-500 hover:text-primary p-1"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                      <div className="w-20 text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button
                        className="ml-6 text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="p-6">
                  <Link
                    to="/menu"
                    className="text-primary font-medium inline-flex items-center hover:underline"
                  >
                    <FaArrowLeft className="mr-2" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        {deliveryFee === 0 ? (
                          <span className="text-green-500">Free</span>
                        ) : (
                          `$${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        Including VAT
                      </p>
                    </div>

                    {/* Promo Code */}
                    <div className="mt-6">
                      <label htmlFor="promo" className="block text-gray-700 mb-2">
                        Promo Code
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="promo"
                          placeholder="Enter promo code"
                          className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark transition"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-red-500 text-sm mt-1">{promoError}</p>
                      )}
                      {discount > 0 && (
                        <p className="text-green-500 text-sm mt-1">
                          Promo code applied successfully!
                        </p>
                      )}
                    </div>

                    <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition mt-6">
                      Proceed to Checkout
                    </button>
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

export default Cart;