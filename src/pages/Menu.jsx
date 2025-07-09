import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaUtensils } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import { productAPI } from '../lib/api';

const Menu = ({ addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch menu items from the backend API
    const fetchMenuItems = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch products from the API
        const products = await productAPI.getAll();
        
        // Map the API response to match our frontend structure
        const formattedProducts = products.map(product => ({
          id: product.item_id,
          product_id: product.item_id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.image || `https://via.placeholder.com/300x200/f2f2f2/cccccc?text=${encodeURIComponent(product.name)}`,
          category: product.category || 'Other',
          description: product.description || `Delicious ${product.name}`,
          isVegetarian: false, // Default value, add to your database if needed
          restaurant_id: product.restaurant_id,
          is_available: product.is_available
        }));

        console.log('Fetched products:', formattedProducts);
        
        // Filter out unavailable products
        const availableProducts = formattedProducts.filter(product => 
          product.is_available !== false
        );
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(availableProducts.map(item => item.category).filter(Boolean))];
        
        setMenuItems(availableProducts);
        setFilteredItems(availableProducts);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load menu items. Please try again later.');
        
        // Fallback to empty data
        setMenuItems([]);
        setFilteredItems([]);
        setCategories(['All']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Filter items based on category and search term
    let filtered = menuItems;
    
    // Apply category filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) || 
        item.description.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    }
    
    setFilteredItems(filtered);
  }, [activeCategory, searchTerm, menuItems]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 font-poppins"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Menu
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our wide range of delicious options, from savory mains to sweet desserts.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-md mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Menu Content Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          {/* Category Filter */}
          <div className="mb-12 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all 
                    ${activeCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'}`
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          {/* Menu Items */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative h-24 w-24">
                <div className="absolute animate-ping h-full w-full rounded-full bg-primary opacity-75"></div>
                <div className="relative rounded-full h-24 w-24 bg-primary flex items-center justify-center">
                  <FaUtensils className="text-white text-xl" />
                </div>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredItems.map(item => (
                <motion.div key={item.id} variants={itemVariants}>
                  <FoodCard
                    id={item.id}
                    product_id={item.product_id || item.id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    category={item.category}
                    description={item.description}
                    isVegetarian={item.isVegetarian}
                    item_id={item.item_id || item.id}
                    restaurant_id={item.restaurant_id}
                    addToCart={addToCart}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <FaUtensils className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">No items found</h3>
              <p className="text-gray-500">
                Try adjusting your search or category filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu; 