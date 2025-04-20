import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

interface FoodCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  isVegetarian: boolean;
  addToCart: (item: any) => void;
}

const FoodCard = ({ 
  id, name, price, image, category, description, isVegetarian, addToCart 
}: FoodCardProps) => {
  
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-md food-card relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        {isVegetarian && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            Veg
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 font-poppins">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-primary font-bold">${price.toFixed(2)}</span>
          <motion.button
            className="bg-primary text-white px-3 py-2 rounded-full flex items-center text-sm"
            onClick={() => addToCart({ id, name, price, image })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShoppingCart className="mr-1" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard; 