import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaBars, FaTimes, FaUtensils, FaUser, FaSearch } from 'react-icons/fa';

const Navbar = ({ cartItems = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartShaking, setIsCartShaking] = useState(false);
  const [prevCartLength, setPrevCartLength] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  useEffect(() => {
    // Trigger cart shake animation when items are added
    if (cartItems.length > prevCartLength) {
      setIsCartShaking(true);
      const timer = setTimeout(() => setIsCartShaking(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCartLength(cartItems.length);
  }, [cartItems.length, prevCartLength]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav 
      className={`py-4 fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center z-20">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <FaUtensils className={`text-2xl mr-2 ${scrolled ? 'text-primary' : 'text-white'}`} />
          </motion.div>
          <h1 className={`text-2xl font-bold font-poppins transition-colors duration-300 ${
            scrolled ? 'text-primary' : 'text-white'
          }`}>
            TastyBites<span className="text-secondary">.</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`hover:text-primary transition font-medium ${
            scrolled ? 'text-gray-700' : 'text-white'
          }`}>
            <motion.span 
              whileHover={{ y: -2 }}
              className="relative inline-block"
            >
              Home
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
          </Link>
          <Link to="/menu" className={`hover:text-primary transition font-medium ${
            scrolled ? 'text-gray-700' : 'text-white'
          }`}>
            <motion.span 
              whileHover={{ y: -2 }}
              className="relative inline-block"
            >
              Menu
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
          </Link>
          <Link to="/contact" className={`hover:text-primary transition font-medium ${
            scrolled ? 'text-gray-700' : 'text-white'
          }`}>
            <motion.span 
              whileHover={{ y: -2 }}
              className="relative inline-block"
            >
              Contact
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
          </Link>
          <Link to="/admin/add-product" className={`hover:text-primary transition font-medium ${
            scrolled ? 'text-gray-700' : 'text-white'
          }`}>
            <motion.span 
              whileHover={{ y: -2 }}
              className="relative inline-block"
            >
              Admin
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
          </Link>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className={`${scrolled ? 'text-gray-700' : 'text-white'} hover:text-primary`}
          >
            <FaSearch />
          </motion.button>

          <AnimatePresence>
            {searchOpen && (
              <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(false)}
              >
                <motion.div 
                  className="bg-white p-6 rounded-lg w-full max-w-md"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center border-b-2 border-primary pb-2">
                    <FaSearch className="text-primary mr-2" />
                    <input 
                      type="text" 
                      placeholder="Search for food..." 
                      className="w-full outline-none"
                      autoFocus
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/cart" 
              className={`text-white bg-primary hover:bg-primary-dark px-5 py-2 rounded-full flex items-center 
                        ${isCartShaking ? 'cart-shake' : ''} shadow-md transition-all duration-300`}
            >
              <motion.div className="relative">
                <FaShoppingCart className="mr-2" />
                {totalItems > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 bg-white text-primary text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
              <span>Cart</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center z-20">
          <Link 
            to="/cart" 
            className={`text-white bg-primary p-2 rounded-full mr-4 relative ${isCartShaking ? 'cart-shake' : ''}`}
          >
            <FaShoppingCart />
            {totalItems > 0 && (
              <motion.span 
                className="absolute -top-1 -right-1 bg-white text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <motion.button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${scrolled ? 'text-gray-700' : 'text-white'} focus:outline-none z-50`}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? 
              <FaTimes size={24} className="text-white" /> : 
              <FaBars size={24} />
            }
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-primary fixed inset-0 z-40 flex flex-col justify-center items-center"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex flex-col space-y-6 text-center">
              <Link 
                to="/" 
                className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/menu" 
                className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/contact" 
                className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/admin/add-product" 
                className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <div className="pt-6">
                <button
                  className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition duration-300"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  <FaSearch className="inline mr-2" /> Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;