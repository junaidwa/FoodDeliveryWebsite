import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import foodData, { Food } from '../../data/foodData';

const ManageProducts = () => {
  const [products, setProducts] = useState<Food[]>(foodData);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Get unique categories for filter
  const categories = ['All', ...new Set(foodData.map(item => item.category))];

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // On component mount, ensure page is at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handler for deleting a product
  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    setConfirmDelete(null);
    
    // Scroll to top if needed
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handler for showing delete confirmation
  const showDeleteConfirm = (id: number) => {
    setConfirmDelete(id);
  };

  // Handler for canceling delete
  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleEdit = (id: number) => {
    // Scroll to top if needed
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold font-poppins">
            <span className="text-primary">Admin:</span> Manage Products
          </h1>
          <Link 
            to="/admin/add-product"
            className="bg-primary text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-primary-dark transition"
          >
            <FaPlus className="mr-2" /> Add New Product
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="w-full md:w-64">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <motion.tr 
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-16 w-16 object-cover rounded-md" 
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.isVegetarian && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                              Vegetarian
                            </span>
                          )}
                          <div className="text-sm text-gray-500 line-clamp-2 mt-1 max-w-md">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {confirmDelete === product.id ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-red-600 mr-2">Confirm?</span>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                              >
                                Yes
                              </button>
                              <button
                                onClick={cancelDelete}
                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                onClick={() => showDeleteConfirm(product.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FaTrash size={18} />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        No products found. Try adjusting your search or filter.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* Products Count */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts; 