import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen">
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
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We'd love to hear from you! Reach out with any questions, suggestions, or feedback.
          </motion.p>
        </div>
      </section>
      
      {/* Contact Info Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6 font-poppins">Send Us a Message</h2>
              
              {submitted ? (
                <motion.div 
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <strong className="font-bold">Thank you!</strong>
                  <span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon.</span>
                </motion.div>
              ) : null}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Order Inquiry"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center w-full hover:bg-primary-dark transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" /> Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6 font-poppins">Contact Information</h2>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex items-start bg-white p-6 rounded-xl shadow-md"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Our Location</h3>
                    <p className="text-gray-600">123 Food Street, Delicious City, 12345</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start bg-white p-6 rounded-xl shadow-md"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <FaPhoneAlt size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (123) 456-7890</p>
                    <p className="text-gray-600">+1 (987) 654-3210</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start bg-white p-6 rounded-xl shadow-md"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <FaEnvelope size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email Us</h3>
                    <p className="text-gray-600">info@tastybites.com</p>
                    <p className="text-gray-600">support@tastybites.com</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start bg-white p-6 rounded-xl shadow-md"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <FaClock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Hours of Operation</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 10:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 11:00 PM</p>
                    <p className="text-gray-600">Sunday: 10:00 AM - 9:00 PM</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-8 font-poppins text-center">Find Us on the Map</h2>
          
          <div className="rounded-xl overflow-hidden shadow-lg h-96">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.6711324159075!2d3.3771274000000004!3d6.517193499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d73a658782b%3A0x7a1de11d89cccc84!2sEko%20Hotels%20%26%20Suites!5e0!3m2!1sen!2sng!4v1658769843754!5m2!1sen!2sng" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="TastyBites Location"
            ></iframe>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact; 