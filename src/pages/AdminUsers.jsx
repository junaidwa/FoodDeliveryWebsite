import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCog, FaChevronLeft, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaTrash, FaUserShield } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
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
    
    // Get all users from localStorage
    const usersData = localStorage.getItem('users');
    
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
    
    setLoading(false);
  }, [navigate]);
  
  const handlePromoteToAdmin = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isAdmin: true };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };
  
  const handleDeleteUser = (userId) => {
    const filteredUsers = users.filter(user => user.id !== userId);
    setUsers(filteredUsers);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    setConfirmDelete(null);
  };
  
  const getFilteredUsers = () => {
    return users.filter(user => {
      const searchText = filterText.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        (user.phone && user.phone.toLowerCase().includes(searchText))
      );
    });
  };
  
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
                Manage Users
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                View and manage all registered users
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
          
          {/* Search Filter */}
          <div className="mb-6">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search users by name, email, or phone..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Users List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {users.length === 0 ? (
              <div className="text-center py-16">
                <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                <p className="text-gray-500">There are no registered users yet.</p>
              </div>
            ) : getFilteredUsers().length === 0 ? (
              <div className="text-center py-16">
                <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matching Users</h3>
                <p className="text-gray-500">No users match your search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredUsers().map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-light rounded-full flex items-center justify-center">
                              <FaUser className="text-primary" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaPhone className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {user.phone || 'Not provided'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isAdmin ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Admin
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {confirmDelete === user.id ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-red-600 text-xs mr-2">Delete?</span>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-3">
                              {!user.isAdmin && (
                                <button
                                  onClick={() => handlePromoteToAdmin(user.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Promote to Admin"
                                >
                                  <FaUserShield size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmDelete(user.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete User"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 