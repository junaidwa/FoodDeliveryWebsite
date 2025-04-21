import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaUtensils } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';

const Menu = ({ addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating API call to fetch menu items
    const fetchMenuItems = async () => {
      try {
        // In production this would be a real API call
        // const response = await fetch('/api/menu-items');
        // const data = await response.json();
        
        // Using static data for now
        const dummyMenuItems = [
          {
            id: 1,
            name: 'Margherita Pizza',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            isVegetarian: true
          },
          {
            id: 2,
            name: 'Pepperoni Pizza',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Pizza',
            description: 'Pizza topped with spicy pepperoni and extra cheese',
            isVegetarian: false
          },
          {
            id: 3,
            name: 'Chicken Burger',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Burger',
            description: 'Juicy chicken patty with lettuce, tomato, and special sauce',
            isVegetarian: false
          },
          {
            id: 4,
            name: 'Veggie Burger',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Burger',
            description: 'Plant-based patty with fresh vegetables and vegan mayo',
            isVegetarian: true
          },
          {
            id: 5,
            name: 'Caesar Salad',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Salad',
            description: 'Fresh romaine lettuce, croutons, parmesan, and Caesar dressing',
            isVegetarian: true
          },
          {
            id: 6,
            name: 'Greek Salad',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Salad',
            description: 'Tomatoes, cucumbers, olives, feta cheese, and olive oil dressing',
            isVegetarian: true
          },
          {
            id: 7,
            name: 'Chocolate Brownie',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Dessert',
            description: 'Rich chocolate brownie with vanilla ice cream',
            isVegetarian: true
          },
          {
            id: 8,
            name: 'Cheesecake',
            price: 6.99,
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Dessert',
            description: 'Creamy cheesecake with berry compote',
            isVegetarian: true
          }
        ];

        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(dummyMenuItems.map(item => item.category))];
        
        // Simulate loading delay
        setTimeout(() => {
          setMenuItems(dummyMenuItems);
          setFilteredItems(dummyMenuItems);
          setCategories(uniqueCategories);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching menu items:', error);
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
                    {...item}
                    addToCart={addToCart}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <FaFilter className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">
                Try changing your search term or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu; 