import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AddProduct from './components/Admin/AddProduct';
import ManageProducts from './components/Admin/ManageProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetail from './pages/AdminOrderDetail';
import AdminCustomers from './pages/AdminCustomers';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import { cartAPI } from './lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  // Check if user is logged in and has the required role
  const isAuthenticated = !!user;
  const hasRequiredRole = allowedRoles.length === 0 || (user && allowedRoles.includes(user.user_type));
  
  if (isAuthenticated && hasRequiredRole) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);
    
    // Load user-specific cart items
    const userCart = cartAPI.getCart();
    setCartItems(userCart.items || []);
  }, []);
  
  // Update cart when user changes
  useEffect(() => {
    if (user) {
      // Load user-specific cart
      const userCart = cartAPI.getCart();
      setCartItems(userCart.items || []);
    } else {
      // Clear cart if no user
      setCartItems([]);
    }
  }, [user?.user_id]);

  const addToCart = (item) => {
    console.log('Adding to cart:', item);
    
    // Check if user is logged in
    if (!user) {
      toast.info('Please log in to add items to your cart', {
        position: 'bottom-right',
        autoClose: 3000
      });
      return;
    }
    
    // Format the product to match our cartAPI structure
    const product = {
      item_id: item.item_id || item.product_id || item.id,
      name: item.name,
      price: parseFloat(item.price),
      restaurant_id: item.restaurant_id,
      category: item.category,
      description: item.description,
      image: item.image
    };
    
    try {
      // Use the cartAPI to add item to cart
      const updatedCart = cartAPI.addToCart(product);
      setCartItems(updatedCart.items || []);
      
      // Show success message
      toast.success(`${item.name} added to cart!`, {
        position: 'bottom-right',
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart', {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 font-inter text-gray-800">
            <Navbar cartItems={cartItems} user={user} setUser={setUser} />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home addToCart={addToCart} />} />
                <Route path="/menu" element={<Menu addToCart={addToCart} />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Customer Routes */}
                <Route path="/cart" element={<ProtectedRoute element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />} />
                <Route path="/checkout" element={<ProtectedRoute element={<Checkout cartItems={cartItems} />} allowedRoles={['customer']} />} />
                <Route path="/order-confirmation" element={<ProtectedRoute element={<OrderConfirmation />} />} />
                <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
                <Route path="/admin/add-product" element={<ProtectedRoute element={<AddProduct />} allowedRoles={['admin']} />} />
                <Route path="/admin/manage-products" element={<ProtectedRoute element={<ManageProducts />} allowedRoles={['admin']} />} />
                <Route path="/admin/users" element={<ProtectedRoute element={<AdminUsers />} allowedRoles={['admin']} />} />
                <Route path="/admin/orders" element={<ProtectedRoute element={<AdminOrders />} allowedRoles={['admin']} />} />
                <Route path="/admin/orders/:orderId" element={<ProtectedRoute element={<AdminOrderDetail />} allowedRoles={['admin']} />} />
                <Route path="/admin/customers" element={<ProtectedRoute element={<AdminCustomers />} allowedRoles={['admin']} />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 