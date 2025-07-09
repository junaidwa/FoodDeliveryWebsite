import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCog, FaChevronLeft, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaTrash, FaUserShield, FaCrown, FaShoppingBag, FaUserTag, FaTruckMoving, FaSearch, FaFilter, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { userAPI } from '../lib/api';
import { toast } from 'react-toastify';

// User Role Badge Component
const UserRoleBadge = ({ role }) => {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'customer':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserCog className="mr-1" />;
      case 'customer':
        return <FaUser className="mr-1" />;
      default:
        return <FaUser className="mr-1" />;
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(role)}`}>
      {getRoleIcon(role)}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
      setFilteredUsers(JSON.parse(usersData));
    }
    
    setLoading(false);
  }, [navigate]);
  
  // Apply filters when search term or role filter changes
  useEffect(() => {
    // Apply filters
    let result = users;

    // Filter by search term (name, email, phone)
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.username?.toLowerCase().includes(lowercaseSearch) ||
        user.email?.toLowerCase().includes(lowercaseSearch) ||
        user.phone?.includes(lowercaseSearch)
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      result = result.filter(user => user.user_type === roleFilter);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);
  
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
  
  const handleDeleteUser = async (userId) => {
    try {
      // Display confirmation dialog
      if (deleteConfirm !== userId) {
        // First click just shows confirmation
        setDeleteConfirm(userId);
        return;
      }

      // Confirm clicked, proceed with deletion
      setLoading(true);
      await userAPI.deleteUser(userId);
      
      // Update users list
      setUsers(users.filter(user => user.user_id !== userId));
      setDeleteConfirm(null);
      toast.success('User deleted successfully. All associated orders and messages have been removed.');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            Try Again
          </button>
        </div>
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
          
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Users List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                <p className="text-gray-500">
                  {searchTerm || roleFilter !== 'all' 
                    ? 'No users match your search or filter criteria.'
                    : 'There are no users in the system yet.'}
                </p>
                {(searchTerm || roleFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setRoleFilter('all');
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300"
                  >
                    Clear Filters
                  </button>
                )}
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
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.user_id}
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
                                {user.username}
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
                          <UserRoleBadge role={user.user_type} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {deleteConfirm === user.user_id ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-red-600 text-xs mr-2">Delete?</span>
                              <button
                                onClick={() => handleDeleteUser(user.user_id)}
                                className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-3">
                              {!user.isAdmin && (
                                <button
                                  onClick={() => handlePromoteToAdmin(user.user_id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Promote to Admin"
                                >
                                  <FaUserShield size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => setDeleteConfirm(user.user_id)}
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