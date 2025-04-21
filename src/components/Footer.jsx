import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUtensils, FaCheckCircle, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Validate email (must be gmail for this task)
    if (!email.trim() || !email.toLowerCase().endsWith('@gmail.com')) {
      alert('Please enter a valid Gmail address.');
      return;
    }
    
    // Show success message
    setShowSubscribeSuccess(true);
    
    // Clear email field
    setEmail('');
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSubscribeSuccess(false);
    }, 5000);
  };
  
  // Function to scroll smoothly to a section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative">
      {/* Subscribe Success Message */}
      <AnimatePresence>
        {showSubscribeSuccess && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You for Subscribing!</h3>
                <p className="text-gray-600 mb-4">
                  You've successfully joined our newsletter. We'll keep you updated with the latest news and offers.
                </p>
                <motion.button
                  className="px-4 py-2 bg-primary text-white rounded-md font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSubscribeSuccess(false)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
                <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('menu')} className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Menu</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('cart')} className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Cart</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">Contact</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-primary transition-colors inline-block">
                  <span className="border-b border-transparent hover:border-primary">About Us</span>
                </button>
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
            <div className="text-white">
              <p className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-primary" />
                UET Taxila, Pakistan
              </p>
              <p className="flex items-center gap-2 mb-2">
                <FaPhone className="text-primary" />
                +923107035192
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                junaidwattoo33@gmail.com
              </p>
            </div>
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
              <form onSubmit={handleSubscribe}>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your Gmail address" 
                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <motion.button 
                    type="submit"
                    className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-r-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} TastyBites. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <button onClick={() => scrollToSection('terms')} className="hover:text-primary transition-colors">Terms of Service</button>
            <button onClick={() => scrollToSection('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-primary transition-colors">FAQ</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 