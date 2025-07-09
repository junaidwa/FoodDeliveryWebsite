const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'food_delivery_db',
};

// Create a connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to verify JWT token from cookie
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ==========================
// Auth Routes
// ==========================

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, address || null]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax'
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        name,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax'
    });
    
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout route
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==========================
// Food Items Routes
// ==========================

// Get all food items
app.get('/api/food-items', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM food_items');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single food item
app.get('/api/food-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM food_items WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new food item (admin only)
app.post('/api/food-items', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price, image, category, description, isVegetarian } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO food_items (name, price, image, category, description, isVegetarian) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, image, category, description, isVegetarian || false]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      price,
      image,
      category,
      description,
      isVegetarian: isVegetarian || false
    });
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a food item (admin only)
app.put('/api/food-items/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, category, description, isVegetarian } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE food_items SET name = ?, price = ?, image = ?, category = ?, description = ?, isVegetarian = ? WHERE id = ?',
      [name, price, image, category, description, isVegetarian || false, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    res.status(200).json({
      id: parseInt(id),
      name,
      price,
      image,
      category,
      description,
      isVegetarian: isVegetarian || false
    });
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a food item (admin only)
app.delete('/api/food-items/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM food_items WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==========================
// Cart Routes
// ==========================

// Get user's cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.execute(`
      SELECT c.id, c.food_id, c.quantity, f.name, f.price, f.image, f.category, f.description, f.isVegetarian
      FROM cart c
      JOIN food_items f ON c.food_id = f.id
      WHERE c.user_id = ?
    `, [userId]);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, quantity } = req.body;
    
    // Check if item already exists in cart
    const [existingItems] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ? AND food_id = ?',
      [userId, foodId]
    );
    
    if (existingItems.length > 0) {
      // Update quantity if item exists
      const newQuantity = existingItems[0].quantity + quantity;
      
      await pool.execute(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND food_id = ?',
        [newQuantity, userId, foodId]
      );
    } else {
      // Add new item to cart
      await pool.execute(
        'INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, ?)',
        [userId, foodId, quantity]
      );
    }
    
    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
app.put('/api/cart/:itemId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await pool.execute(
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [itemId, userId]
      );
      
      return res.status(200).json({ message: 'Item removed from cart' });
    }
    
    // Update quantity
    const [result] = await pool.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, itemId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
app.delete('/api/cart/:itemId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await pool.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==========================
// Order Routes
// ==========================

// Create a new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { deliveryAddress, paymentMethod, deliveryFee, discount } = req.body;
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Get cart items
      const [cartItems] = await connection.execute(`
        SELECT c.food_id, c.quantity, f.price
        FROM cart c
        JOIN food_items f ON c.food_id = f.id
        WHERE c.user_id = ?
      `, [userId]);
      
      if (cartItems.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: 'Cart is empty' });
      }
      
      // Calculate total amount
      let totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Apply discount if provided
      if (discount) {
        totalAmount -= discount;
      }
      
      // Add delivery fee if provided
      if (deliveryFee) {
        totalAmount += deliveryFee;
      }
      
      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (user_id, total_amount, payment_method, delivery_address, delivery_fee, discount)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, totalAmount, paymentMethod, deliveryAddress, deliveryFee || 0, discount || 0]
      );
      
      const orderId = orderResult.insertId;
      
      // Insert order items
      for (const item of cartItems) {
        const subtotal = item.price * item.quantity;
        
        await connection.execute(
          `INSERT INTO order_items (order_id, food_id, quantity, price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.food_id, item.quantity, item.price, subtotal]
        );
      }
      
      // Clear cart
      await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
      
      // Commit transaction
      await connection.commit();
      
      res.status(201).json({
        orderId,
        totalAmount,
        message: 'Order placed successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Get order items for each order
    for (let i = 0; i < orders.length; i++) {
      const [orderItems] = await pool.execute(`
        SELECT oi.*, f.name, f.image, f.category
        FROM order_items oi
        JOIN food_items f ON oi.food_id = f.id
        WHERE oi.order_id = ?
      `, [orders[i].id]);
      
      orders[i].items = orderItems;
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific order
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get order details
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [orderItems] = await pool.execute(`
      SELECT oi.*, f.name, f.image, f.category
      FROM order_items oi
      JOIN food_items f ON oi.food_id = f.id
      WHERE oi.order_id = ?
    `, [order.id]);
    
    order.items = orderItems;
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 