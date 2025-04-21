import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaShoppingBag, FaUserCog, FaFilter } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get the current user from localStorage
    const currentUserData = localStorage.getItem('user');
    
    if (!currentUserData) {
      // If no user is logged in, redirect to login page
      navigate('/login');
      return;
    }
    
    const currentUser = JSON.parse(currentUserData);
    
    if (!currentUser.isAdmin) {
      // If user is not an admin, redirect to home page
      navigate('/');
      return;
    }
    
    setLoading(false);
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <motion.h1
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Manage Orders
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                View and process customer orders
              </motion.p>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to="/admin/add-product"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
              >
                <FaChevronLeft className="mr-2" /> Back to Admin
              </Link>
              
              <Link
                to="/profile"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
              >
                <FaUserCog className="mr-2" /> My Profile
              </Link>
            </div>
          </div>
          
          {/* Order Display */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <div className="text-center py-16">
              <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
              <p className="text-gray-500 mb-6">There are no customer orders to display yet.</p>
              <div className="flex justify-center">
                <Link
                  to="/menu"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300 mr-4"
                >
                  <FaShoppingBag className="mr-2" /> Browse Menu
                </Link>
                <Link
                  to="/admin/users"
                  className="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition duration-300"
                >
                  <FaUserCog className="mr-2" /> Manage Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders; 