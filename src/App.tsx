import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import AddProduct from './components/Admin/AddProduct';
import ManageProducts from './components/Admin/ManageProducts';

function App() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const addToCart = (item: any) => {
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar cartItems={cartItems} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/manage-products" element={<ManageProducts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 