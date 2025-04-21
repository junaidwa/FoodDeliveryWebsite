-- Create the database
CREATE DATABASE IF NOT EXISTS food_delivery_db;
USE food_delivery_db;

-- Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  isVegetarian BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_fee DECIMAL(5, 2) DEFAULT 0.00,
  discount DECIMAL(5, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (food_id) REFERENCES food_items(id)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (food_id) REFERENCES food_items(id),
  UNIQUE KEY (user_id, food_id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (food_id) REFERENCES food_items(id)
);

-- Sample Data Insertion for Food Items
INSERT INTO food_items (name, price, image, category, description, isVegetarian) VALUES
('Margherita Pizza', 12.99, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', 'Pizza', 'Classic delight with 100% real mozzarella cheese', TRUE),
('Pepperoni Pizza', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 'Pizza', 'Loaded with spicy pepperoni slices and extra cheese', FALSE),
('Vegan Buddha Bowl', 10.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'Bowls', 'Nutritious mix of fresh vegetables, quinoa, and avocado', TRUE),
('Chicken Burger', 11.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Burgers', 'Juicy grilled chicken patty with lettuce and tomato', FALSE);

-- Create an admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');