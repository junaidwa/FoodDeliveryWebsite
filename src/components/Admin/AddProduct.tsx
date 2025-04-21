import { useState, useEffect } from 'react';
import { FaPlus, FaUtensils, FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  'Pizza', 'Burgers', 'Sushi', 'Pasta', 'Bowls', 
  'Salads', 'Desserts', 'Drinks', 'Curry', 'Rice'
];

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    isVegetarian: false,
    image: null as File | null,
    imagePreview: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({
          ...product,
          image: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors({
          ...errors,
          image: '',
        });
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!product.name.trim()) {
      newErrors.name = 'Product name is required';
      valid = false;
    }
    
    if (!product.price.trim()) {
      newErrors.price = 'Price is required';
      valid = false;
    } else if (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
      valid = false;
    }
    
    if (!product.category) {
      newErrors.category = 'Category is required';
      valid = false;
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }
    
    if (!product.image) {
      newErrors.image = 'Product image is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, we would send this data to a backend API
      console.log('Product submitted:', {
        ...product,
        price: parseFloat(product.price),
      });
      
      setIsSubmitted(true);
      
      // Reset form after submission
      setProduct({
        name: '',
        price: '',
        category: '',
        description: '',
        isVegetarian: false,
        image: null,
        imagePreview: '',
      });
      
      // Scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // On component mount, ensure page is at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-poppins">
            <span className="text-primary">Admin:</span> Add Product
          </h1>
          <Link 
            to="/admin/manage-products"
            className="bg-secondary text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-secondary/90 transition"
          >
            <FaUtensils className="mr-2" /> Manage Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isSubmitted ? (
            <div className="p-8">
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-5 rounded-md mb-6">
                <h3 className="font-semibold text-lg mb-1">Product Added Successfully!</h3>
                <p>Your product has been added to the database.</p>
              </div>
              <motion.button
                onClick={() => setIsSubmitted(false)}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Another Product
              </motion.button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter product name"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      value={product.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 mb-2">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="price"
                      name="price"
                      placeholder="Enter product price"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary
                        ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      value={product.price}
                      onChange={handleChange}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary
                        ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                      value={product.category}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isVegetarian"
                        className="form-checkbox h-5 w-5 text-green-500 rounded focus:ring-2 focus:ring-green-500"
                        checked={product.isVegetarian}
                        onChange={handleCheckboxChange}
                      />
                      <span className="ml-2 text-gray-700">Vegetarian</span>
                    </label>
                  </div>
                </div>
                
                {/* Right Column */}
                <div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Enter product description"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary
                        ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                      value={product.description}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Product Image <span className="text-red-500">*</span>
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition
                        ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                      onClick={() => document.getElementById('image')?.click()}
                    >
                      {product.imagePreview ? (
                        <div>
                          <img 
                            src={product.imagePreview} 
                            alt="Product Preview" 
                            className="mx-auto h-48 object-contain mb-2" 
                          />
                          <p className="text-sm text-gray-500">Click to change image</p>
                        </div>
                      ) : (
                        <div className="py-8">
                          <FaImage className="mx-auto mb-2 text-gray-400" size={48} />
                          <p className="text-gray-500">Click to upload an image</p>
                          <p className="text-xs text-gray-400 mt-1">
                            (JPEG, PNG, WebP, etc.)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <motion.button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus className="mr-2" /> Add Product
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 