import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import AddProduct from './components/Admin/AddProduct';
import ManageProducts from './components/Admin/ManageProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import Checkout from './pages/Checkout';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-inter text-gray-800">
        <Navbar cartItems={cartItems} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/menu" element={<Menu addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
            
            {/* Admin Routes */}
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/manage-products" element={<ManageProducts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 