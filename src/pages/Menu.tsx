import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import FoodCard from '../components/FoodCard';
import foodData from '../data/foodData';

interface MenuProps {
  addToCart: (item: any) => void;
}

const Menu = ({ addToCart }: MenuProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('All');
  const [filteredFood, setFilteredFood] = useState(foodData);
  
  // Get unique categories
  const categories = ['All', ...new Set(foodData.map(item => item.category))];

  // Filter food items
  useEffect(() => {
    let result = foodData;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Filter by diet
    if (dietFilter === 'Veg') {
      result = result.filter(item => item.isVegetarian);
    } else if (dietFilter === 'Non-Veg') {
      result = result.filter(item => !item.isVegetarian);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredFood(result);
  }, [selectedCategory, dietFilter, searchTerm]);

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center font-poppins">
          Our <span className="text-primary">Menu</span>
        </h1>
        
        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search for dishes..."
                className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto py-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Diet Filter */}
          <div className="flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-full ${
                dietFilter === 'All'
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setDietFilter('All')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                dietFilter === 'Veg'
                  ? 'bg-green-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setDietFilter('Veg')}
            >
              Vegetarian
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                dietFilter === 'Non-Veg'
                  ? 'bg-red-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setDietFilter('Non-Veg')}
            >
              Non-Vegetarian
            </button>
          </div>
        </div>
        
        {/* Menu Items */}
        <AnimatePresence>
          {filteredFood.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredFood.map((item) => (
                <FoodCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  category={item.category}
                  description={item.description}
                  isVegetarian={item.isVegetarian}
                  addToCart={addToCart}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu; 