import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaExclamationCircle, FaSignInAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FoodCard = ({ 
  id, name, price, image, category, description, isVegetarian, addToCart,
  product_id, item_id, restaurant_id
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState(null);

  // Make sure we have a valid ID to use
  const productId = product_id || item_id || id;
  
  // Check if user is logged in on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  // Handle adding to cart with proper API structure
  const handleAddToCart = () => {
    const product = {
      item_id: productId,
      name,
      price,
      image: !imageError ? image : null,
      category,
      description,
      restaurant_id
    };
    
    addToCart(product);
  };

  // Handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Determine if user is a customer
  const isCustomer = user && (user.user_type === 'customer' || !user.user_type);

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-lg food-card relative"
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-52 overflow-hidden">
        {!imageError ? (
          <motion.img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FaExclamationCircle className="text-gray-400 text-4xl" />
          </div>
        )}
        <motion.button
          className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full"
          onClick={() => setIsLiked(!isLiked)}
          whileTap={{ scale: 0.9 }}
        >
          <FaHeart className={`text-xl ${isLiked ? 'text-primary' : 'text-gray-400'}`} />
        </motion.button>
        {isVegetarian && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Veg
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4">
          <div className="text-sm font-semibold bg-primary rounded-full inline-block px-3 py-1">
            {category}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 font-poppins">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl text-primary font-bold">${parseFloat(price).toFixed(2)}</span>
          
          {isCustomer ? (
            <motion.button
              className="bg-primary text-white px-4 py-2 rounded-full flex items-center text-sm font-medium hover:bg-primary-dark shadow-md"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </motion.button>
          ) : !user ? (
            <Link to="/login">
              <motion.button
                className="bg-secondary text-white px-4 py-2 rounded-full flex items-center text-sm font-medium hover:bg-opacity-90 shadow-md"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignInAlt className="mr-2" />
                Login to Order
              </motion.button>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Shine effect on hover */}
      <motion.div 
        className="absolute -left-20 -top-20 w-20 h-80 bg-white opacity-20 rotate-12 transform-gpu"
        initial={{ left: -80 }}
        whileHover={{ left: 250 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default FoodCard; 