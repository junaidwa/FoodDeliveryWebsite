import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const FoodCard = ({ 
  id, name, price, image, category, description, isVegetarian, addToCart 
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-lg food-card relative"
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-52 overflow-hidden">
        <motion.img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
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
          <span className="text-2xl text-primary font-bold">${price.toFixed(2)}</span>
          <motion.button
            className="bg-primary text-white px-4 py-2 rounded-full flex items-center text-sm font-medium hover:bg-primary-dark shadow-md"
            onClick={() => addToCart({ id, name, price, image })}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </motion.button>
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