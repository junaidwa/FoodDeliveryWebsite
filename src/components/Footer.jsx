import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <FaUtensils className="text-primary text-2xl mr-2" />
              <h2 className="text-2xl font-bold font-poppins">
                TastyBites<span className="text-secondary">.</span>
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              Delivering the finest culinary experiences to your doorstep. 
              Fast, fresh, and flavorful - that's our promise.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebookF />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaYoutube />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 font-poppins relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Menu</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Cart</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">About Us</span>
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 font-poppins relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaPhoneAlt className="text-primary mr-3 mt-1" />
                <div>
                  <p className="text-gray-400">Phone:</p>
                  <p className="font-medium">(123) 456-7890</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-primary mr-3 mt-1" />
                <div>
                  <p className="text-gray-400">Email:</p>
                  <p className="font-medium">info@tastybites.com</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-primary mr-3 mt-1" />
                <div>
                  <p className="text-gray-400">Address:</p>
                  <p className="font-medium">123 Food Street, Delicious City, 12345</p>
                </div>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 font-poppins relative inline-block">
              Opening Hours
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Monday - Friday</span>
                <span>9:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Saturday</span>
                <span>10:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Sunday</span>
                <span>10:00 AM - 9:00 PM</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <motion.button 
                  className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-r-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} TastyBites. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 