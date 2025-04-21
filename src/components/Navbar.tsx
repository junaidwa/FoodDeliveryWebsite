import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

interface NavbarProps {
  cartItems: any[];
}

const Navbar = ({ cartItems }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartShaking, setIsCartShaking] = useState(false);
  const [prevCartLength, setPrevCartLength] = useState(0);
  
  useEffect(() => {
    // Trigger cart shake animation when items are added
    if (cartItems.length > prevCartLength) {
      setIsCartShaking(true);
      const timer = setTimeout(() => setIsCartShaking(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCartLength(cartItems.length);
  }, [cartItems.length, prevCartLength]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-primary font-poppins">
            TastyBites<span className="text-secondary">.</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-primary transition font-medium">
            Home
          </Link>
          <Link to="/menu" className="text-gray-700 hover:text-primary transition font-medium">
            Menu
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary transition font-medium">
            Contact
          </Link>
          <Link to="/admin/add-product" className="text-gray-700 hover:text-primary transition font-medium">
            Admin
          </Link>
          <Link 
            to="/cart" 
            className={`text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-full flex items-center 
                      ${isCartShaking ? 'cart-shake' : ''}`}
          >
            <FaShoppingCart className="mr-2" />
            <span>Cart ({totalItems})</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link 
            to="/cart" 
            className={`text-white bg-primary p-2 rounded-full mr-4 ${isCartShaking ? 'cart-shake' : ''}`}
          >
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-2 py-4 px-6 absolute w-full">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary py-2 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className="text-gray-700 hover:text-primary py-2 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary py-2 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/admin/add-product" 
              className="text-gray-700 hover:text-primary py-2 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 