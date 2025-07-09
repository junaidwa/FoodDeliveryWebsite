import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaBars, FaTimes, FaUtensils, FaUser, FaSearch, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCog, FaLock, FaTruck, FaShoppingBag, FaUsers } from 'react-icons/fa';

const Navbar = ({ cartItems = [], user: propUser, setUser: parentSetUser }) => {
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const userDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parentSetUser) {
        parentSetUser(parsedUser);
      }
    }
  }, [propUser, parentSetUser]);
  
  // Reset state when location changes to prevent duplicate navbar issues
  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
    setShowUserDropdown(false);
  }, [location.pathname]);
  
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    if (parentSetUser) {
      parentSetUser(null);
    }
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // Check hardcoded admin password (adminpass as defined in Login.jsx)
    if (adminPassword === 'adminpass') {
      // Store admin info in localStorage
      const adminUser = {
        name: 'Admin',
        email: 'admin@example.com',
        user_type: 'admin',
        user_id: 'admin-1'
      };
      
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      // Update user state
      setUser(adminUser);
      if (parentSetUser) {
        parentSetUser(adminUser);
      }
      
      // Close modal and navigate to admin page
      setShowAdminModal(false);
      setAdminPassword('');
      navigate('/admin/dashboard');
    } else {
      setAdminError('Invalid admin password');
      setTimeout(() => setAdminError(''), 3000);
    }
  };

  // Get user role
  const userType = user?.user_type || '';
  const isAdmin = userType === 'admin';
  const isCustomer = userType === 'customer' || (!isAdmin && user);

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
          {/* Always visible links */}
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
          
          {/* Admin Links */}
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" className={`hover:text-primary transition font-medium ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>
                <motion.span 
                  whileHover={{ y: -2 }}
                  className="relative inline-block"
                >
                  <FaUserCog className="inline-block mr-1" />
                  Admin
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
              
              <Link to="/admin/orders" className={`hover:text-primary transition font-medium ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>
                <motion.span 
                  whileHover={{ y: -2 }}
                  className="relative inline-block"
                >
                  <FaShoppingBag className="inline-block mr-1" />
                  Orders
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
              
              <Link to="/admin/customers" className={`hover:text-primary transition font-medium ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>
                <motion.span 
                  whileHover={{ y: -2 }}
                  className="relative inline-block"
                >
                  <FaUsers className="inline-block mr-1" />
                  Customers
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            </>
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
                className="absolute top-16 left-0 right-0 bg-white shadow-lg rounded-b-lg p-4 z-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search for food..."
                    className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <FaSearch className="absolute left-3 top-4 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-3 top-2 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition"
                  >
                    Search
                  </button>
                </form>
                
                {searchResults.length > 0 && (
                  <div className="mt-4 max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer flex justify-between items-center"
                        onClick={() => handleSearchItemClick(result.id)}
                      >
                        <div>
                          <h4 className="font-medium">{result.name}</h4>
                          <p className="text-sm text-gray-500">{result.category}</p>
                        </div>
                        <p className="font-medium text-primary">${result.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Menu & Auth Buttons */}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <motion.div
                whileHover={{ y: -2 }}
                className={`flex items-center cursor-pointer ${
                  scrolled ? 'text-gray-700' : 'text-white'
                } hover:text-primary transition font-medium`}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <FaUser className="mr-1" />
                <span className="max-w-[100px] truncate">{user.username || user.name}</span>
              </motion.div>
              
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <FaUser className="inline-block mr-2" />
                    My Profile
                  </Link>
                  
                  {isCustomer && (
                    <Link 
                      to="/cart" 
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <FaShoppingCart className="inline-block mr-2" />
                      View Cart
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="inline-block mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`flex items-center hover:text-primary transition font-medium ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  className="relative inline-block"
                >
                  <FaSignInAlt className="mr-1" />
                  Login
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
              <Link
                to="/signup"
                className={`flex items-center hover:text-primary transition font-medium ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  className="relative inline-block"
                >
                  <FaUserPlus className="mr-1" />
                  Sign Up
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            </div>
          )}

          {/* Cart Icon - Only show for customers */}
          {(isCustomer || !user) && (
            <Link to="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isCartShaking ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className={`p-2 rounded-full ${
                  scrolled 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-primary'
                }`}
              >
                <FaShoppingCart />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </motion.div>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4 z-20">
          {(isCustomer || !user) && (
            <Link to="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isCartShaking ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className={`p-2 rounded-full ${
                  scrolled 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-primary'
                }`}
              >
                <FaShoppingCart />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </motion.div>
            </Link>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${scrolled ? 'text-gray-700' : 'text-white'} focus:outline-none`}
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-white shadow-lg z-10 mt-16 overflow-hidden"
            >
              <div className="container mx-auto py-6 px-6 flex flex-col space-y-4">
                <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/menu" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Menu
                </Link>
                <Link to="/contact" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                
                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      <FaUserCog className="inline-block mr-2" />
                      Admin
                    </Link>
                    
                    <Link to="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      <FaShoppingBag className="inline-block mr-2" />
                      Orders
                    </Link>
                    
                    <Link to="/admin/customers" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      <FaUsers className="inline-block mr-2" />
                      Customers
                    </Link>
                  </>
                )}
                
                {/* User Profile and Auth */}
                {user ? (
                  <>
                    <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      <FaUser className="inline-block mr-2" />
                      My Profile
                    </Link>
                    {isCustomer && (
                      <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                        <FaShoppingCart className="inline-block mr-2" />
                        View Cart
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-left"
                    >
                      <FaSignOutAlt className="inline-block mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      <FaSignInAlt className="inline-block mr-2" />
                      Login
                    </Link>
                    <Link to="/signup" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      <FaUserPlus className="inline-block mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;