import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUtensils, FaLeaf, FaShippingFast, FaRegClock } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';

const Home = ({ addToCart }) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch featured food items
    const fetchFeaturedItems = async () => {
      try {
        // For now, using static data with better images
        const dummyFeaturedItems = [
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
            name: 'Chicken Burger',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Burger',
            description: 'Juicy chicken patty with lettuce, tomato, and special sauce',
            isVegetarian: false
          },
          {
            id: 3,
            name: 'Caesar Salad',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Salad',
            description: 'Fresh romaine lettuce, croutons, parmesan, and Caesar dressing',
            isVegetarian: true
          },
          {
            id: 4,
            name: 'Chocolate Brownie',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'Dessert',
            description: 'Rich chocolate brownie with vanilla ice cream',
            isVegetarian: true
          }
        ];

        // Simulating network delay
        setTimeout(() => {
          setFeaturedItems(dummyFeaturedItems);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching featured items:', error);
        setIsLoading(false);
      }
    };

    const fetchPopularCategories = () => {
      // This would be an API call in production
      const dummyCategories = [
        { 
          id: 1, 
          name: 'Pizza', 
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
          count: 12 
        },
        { 
          id: 2, 
          name: 'Burger', 
          image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
          count: 8 
        },
        { 
          id: 3, 
          name: 'Salad', 
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
          count: 10 
        },
        { 
          id: 4, 
          name: 'Dessert', 
          image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
          count: 15 
        }
      ];
      
      setPopularCategories(dummyCategories);
    };

    fetchFeaturedItems();
    fetchPopularCategories();
  }, []);

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
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <div 
            className="absolute min-w-full min-h-full object-cover bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')" 
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Delicious Food <span className="text-primary">Delivered</span> To Your Door
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-200 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              From our kitchen to your table in less than 30 minutes. Order now and experience the convenience of TastyBites.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link 
                to="/menu" 
                className="px-8 py-4 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary-dark transition-all transform hover:scale-105 inline-block hover:shadow-lg"
              >
                Order Now
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105 inline-block ml-4 hover:shadow-lg"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center items-start p-1">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            ></motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Featured Items Section with Parallax */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-poppins">
              <span className="text-primary">Featured</span> Dishes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our chef's special selection of delicious meals prepared with the freshest ingredients
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative h-24 w-24">
                <div className="absolute animate-ping h-full w-full rounded-full bg-primary opacity-75"></div>
                <div className="relative rounded-full h-24 w-24 bg-primary flex items-center justify-center">
                  <FaUtensils className="text-white text-xl" />
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredItems.map(item => (
                <motion.div key={item.id} variants={itemVariants}>
                  <FoodCard 
                    {...item}
                    addToCart={addToCart}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/menu"
              className="group relative inline-flex items-center justify-center px-8 py-3 bg-primary text-white overflow-hidden rounded-full transition-all duration-300"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="relative group-hover:text-primary font-medium text-lg">View Full Menu</span>
            </Link>
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary opacity-10 rounded-full"></div>
      </section>
      
      {/* Popular Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-poppins">
              Popular <span className="text-secondary">Categories</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Browse through our most popular food categories and find your favorites
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {popularCategories.map(category => (
              <Link key={category.id} to={`/menu?category=${category.name}`}>
                <motion.div 
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 h-40 sm:h-60 group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end items-center text-white p-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm md:text-base bg-primary px-3 py-1 rounded-full">{category.count} items</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 font-poppins">
              How <span className="text-secondary">It Works</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Getting your favorite food delivered is as easy as 1-2-3
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-1 bg-gray-700">
              <div className="absolute left-1/3 top-1/2 w-1/3 h-full bg-primary transform -translate-y-1/2"></div>
            </div>
            
            <motion.div 
              className="relative bg-gray-800 rounded-2xl p-8 text-center shadow-xl border-t-4 border-primary z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">1</div>
              <div className="text-5xl text-primary mb-4 flex justify-center">
                <FaUtensils />
              </div>
              <h3 className="text-xl font-semibold mb-4">Browse Menu</h3>
              <p className="text-gray-400">Explore our diverse range of delicious dishes, sorted by categories for easy navigation.</p>
            </motion.div>
            
            <motion.div 
              className="relative bg-gray-800 rounded-2xl p-8 text-center shadow-xl border-t-4 border-secondary z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-secondary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">2</div>
              <div className="text-5xl text-secondary mb-4 flex justify-center">
                <FaRegClock />
              </div>
              <h3 className="text-xl font-semibold mb-4">Place Your Order</h3>
              <p className="text-gray-400">Add your favorite items to the cart and place your order with secure payment options.</p>
            </motion.div>
            
            <motion.div 
              className="relative bg-gray-800 rounded-2xl p-8 text-center shadow-xl border-t-4 border-accent z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">3</div>
              <div className="text-5xl text-accent mb-4 flex justify-center">
                <FaShippingFast />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-400">Enjoy our fast delivery service! Get your delicious food delivered to your doorstep.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* App Download Section */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-10 lg:mb-0 relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://img.freepik.com/free-vector/food-delivery-abstract-concept-vector-illustration_335657-5061.jpg?w=826&t=st=1700673616~exp=1700674216~hmac=6af79e6b7ac43c9790da1e2a68f5de63eebea4f65a96c1b057ce8cc37f92f46f" 
                alt="Mobile App" 
                className="max-w-full rounded-2xl shadow-2xl z-10 relative"
              />
              <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-secondary opacity-20 rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 lg:pl-16"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6 font-poppins">
                Get the <span className="text-primary">TastyBites</span> App
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Download our mobile app for a faster, more personalized ordering experience. Enjoy exclusive app-only offers and rewards!
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  href="#" 
                  className="flex items-center bg-black text-white px-6 py-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.71 16.47C19.22 14.96 20 12.89 20 10.71 20 8.53 19.22 6.46 17.71 4.94 16.2 3.42 14.13 2.64 11.95 2.64 9.77 2.64 7.7 3.42 6.19 4.94 4.67 6.46 3.89 8.53 3.89 10.71 3.89 12.89 4.67 14.96 6.19 16.47 7.7 17.99 9.77 18.77 11.95 18.77 14.13 18.77 16.2 17.99 17.71 16.47M11.95 3.64C16.82 3.64 19 7.41 19 10.71 19 13.97 16.82 17.77 11.95 17.77 7.08 17.77 4.89 13.97 4.89 10.71 4.89 7.41 7.08 3.64 11.95 3.64M9.27 8.8C9.04 8.39 8.94 8.19 8.53 8.19 8.12 8.19 7.96 8.45 7.96 8.89V12.39C7.96 12.86 8.1 13.08 8.53 13.08 8.93 13.08 9.06 12.85 9.26 12.46L10.57 10.08C10.67 9.9 10.71 9.85 10.71 9.72 10.71 9.6 10.67 9.55 10.56 9.37L9.27 8.8M15.32 8.8C15.12 8.39 15.01 8.19 14.61 8.19 14.2 8.19 14.03 8.45 14.03 8.89V12.39C14.03 12.86 14.18 13.08 14.61 13.08 15.01 13.08 15.14 12.85 15.33 12.46L16.64 10.08C16.76 9.9 16.79 9.85 16.79 9.72 16.79 9.6 16.76 9.55 16.64 9.37L15.32 8.8Z" />
                  </svg>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-xl font-semibold font-poppins">Google Play</div>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="#" 
                  className="flex items-center bg-black text-white px-6 py-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97 14.32 22 13.9 21.18 12.37 21.18 10.84 21.18 10.37 21.95 9.1 22 7.79 22.05 6.8 20.68 5.96 19.47 4.25 17 2.94 12.45 4.7 9.39 5.57 7.87 7.13 6.91 8.82 6.88 10.1 6.86 11.32 7.75 12.11 7.75 12.89 7.75 14.37 6.68 15.92 6.84 16.57 6.87 18.39 7.1 19.56 8.82 19.47 9.83 18.4 12.16 18.71 19.5M13 3.5C13.73 2.67 14.94 2.04 15.94 2 16.07 3.17 15.6 4.35 14.9 5.19 14.21 6.04 13.07 6.7 11.95 6.61 11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-xl font-semibold font-poppins">App Store</div>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-poppins">
              What Our <span className="text-primary">Customers</span> Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Don't just take our word for it, see what our happy customers have to say about TastyBites
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "I ordered the Margherita pizza and it was absolutely delicious! The delivery was super fast and the food arrived hot. Will definitely order again!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Jessica Williams</h4>
                  <p className="text-gray-500 text-sm">Food Enthusiast</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -10 }}
            >
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The burger combo was fantastic! Juicy patty, fresh veggies, and the fries were perfectly crispy. Very reasonable prices too. Highly recommend!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Alex Johnson</h4>
                  <p className="text-gray-500 text-sm">Regular Customer</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "As someone with dietary restrictions, I appreciate how accommodating they are. The vegan options are amazing and full of flavor. Great customer service too!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Sophia Martinez</h4>
                  <p className="text-gray-500 text-sm">Satisfied Customer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;