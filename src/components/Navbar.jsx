import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaBars, FaTimes, FaUtensils, FaUser, FaSearch, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCog, FaLock } from 'react-icons/fa';

const Navbar = ({ cartItems = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartShaking, setIsCartShaking] = useState(false);
  const [prevCartLength, setPrevCartLength] = useState(0);
  const [scrolled, setScrolled] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
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
    // Set scrolled to true by default, and then handle scrolling
    setScrolled(true);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled && window.scrollY > 10) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    // In a real app, this would be an API call to search products
    // For demo, let's simulate a search using hardcoded data
    const mockProducts = [
      { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 12.99 },
      { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 14.99 },
      { id: 3, name: 'Chicken Burger', category: 'Burger', price: 9.99 },
      { id: 4, name: 'Veggie Burger', category: 'Burger', price: 8.99 },
      { id: 5, name: 'Caesar Salad', category: 'Salad', price: 8.99 },
      { id: 6, name: 'Greek Salad', category: 'Salad', price: 9.99 },
      { id: 7, name: 'Chocolate Brownie', category: 'Dessert', price: 5.99 },
      { id: 8, name: 'Cheesecake', category: 'Dessert', price: 6.99 }
    ];
    
    // Filter products based on search query
    const filteredProducts = mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filteredProducts);
  };
  
  const handleSearchItemClick = (productId) => {
    setSearchOpen(false);
    setSearchResults([]);
    setSearchQuery('');
    // In a real app, navigate to product detail page
    navigate('/menu');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // Check hardcoded admin password (adminpass as defined in Login.jsx)
    if (adminPassword === 'adminpass') {
      // Store admin info in localStorage
      localStorage.setItem('user', JSON.stringify({
        name: 'Admin',
        email: 'junaidwattoo33@gmail.com',
        isAdmin: true
      }));
      
      // Update user state
      setUser({
        name: 'Admin',
        email: 'junaidwattoo33@gmail.com',
        isAdmin: true
      });
      
      // Close modal and navigate to admin page
      setShowAdminModal(false);
      setAdminPassword('');
      navigate('/admin/add-product');
    } else {
      setAdminError('Invalid admin password');
      setTimeout(() => setAdminError(''), 3000);
    }
  };

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
          
          {/* Admin Button */}
          <motion.button
            whileHover={{ y: -2 }}
            className={`transition font-medium ${scrolled ? 'text-gray-700' : 'text-white'} hover:text-primary relative inline-block`}
            onClick={() => setShowAdminModal(true)}
          >
            <span className="flex items-center">
              <FaUserCog className="mr-1" />
              Admin
            </span>
            <motion.span
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          {user && user.isAdmin && (
            <Link to="/admin/add-product" className={`hover:text-primary transition font-medium ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}>
              <motion.span 
                whileHover={{ y: -2 }}
                className="relative inline-block"
              >
                Admin Panel
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </Link>
          )}

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
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="flex items-center border-b-2 border-primary pb-2">
                      <FaSearch className="text-primary mr-2" />
                      <input 
                        type="text" 
                        placeholder="Search for food..." 
                        className="w-full outline-none"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="ml-2 px-4 py-1 bg-primary text-white rounded hover:bg-primary-dark transition"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                  
                  {searchResults.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto">
                      <h3 className="font-medium text-gray-700 mb-2">Search Results:</h3>
                      <ul className="divide-y divide-gray-200">
                        {searchResults.map((product) => (
                          <li 
                            key={product.id} 
                            className="py-2 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSearchItemClick(product.id)}
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.category}</p>
                              </div>
                              <p className="font-medium">${product.price.toFixed(2)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {searchQuery && searchResults.length === 0 && (
                    <div className="mt-4 text-center py-3 bg-gray-50 rounded">
                      <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center ${scrolled ? 'text-gray-700' : 'text-white'} hover:text-primary`}
                >
                  <FaUser className="mr-1" />
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                </motion.div>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`flex items-center ${scrolled ? 'text-gray-700' : 'text-white'} hover:text-primary`}
              >
                <FaSignOutAlt className="mr-1" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center ${scrolled ? 'text-gray-700' : 'text-white'} hover:text-primary`}
                >
                  <FaSignInAlt className="mr-1" />
                  <span className="font-medium">Login</span>
                </motion.div>
              </Link>
              
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${scrolled ? 'bg-primary' : 'bg-white'} ${scrolled ? 'text-white' : 'text-primary'} px-4 py-1 rounded-full flex items-center`}
                >
                  <FaUserPlus className="mr-1" />
                  <span className="font-medium">Sign Up</span>
                </motion.div>
              </Link>
            </div>
          )}

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
              
              {/* Mobile Admin Button */}
              <button 
                className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowAdminModal(true);
                }}
              >
                Admin
              </button>
              
              {user && user.isAdmin && (
                <Link 
                  to="/admin/add-product" 
                  className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="text-white text-2xl font-semibold py-2 hover:text-yellow-300 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
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
      
      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdminModal(false)}
          >
            <motion.div 
              className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserCog className="text-primary text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
                <p className="text-gray-600 mt-1">Enter admin password to continue</p>
              </div>
              
              {adminError && (
                <motion.div 
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {adminError}</span>
                </motion.div>
              )}
              
              <form onSubmit={handleAdminLogin}>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="adminPassword">
                    Admin Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <motion.button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAdminModal(false)}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;