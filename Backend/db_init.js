const mysql = require('mysql');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345678'
};

// First connect without database to create it if needed
const initialConnection = mysql.createConnection(dbConfig);

initialConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  
  console.log('Connected to MySQL server');
  
  // Create database if it doesn't exist
  initialConnection.query('CREATE DATABASE IF NOT EXISTS DBProject', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    
    console.log('Database created or already exists');
    initialConnection.end();
    
    // Connect to the database
    const connection = mysql.createConnection({
      ...dbConfig,
      database: 'DBProject'
    });
    
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return;
      }
      
      console.log('Connected to DBProject database');
      
      // Create users table
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          phone VARCHAR(20) NOT NULL,
          user_type ENUM('admin', 'customer') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Create restaurants table
      const createRestaurantsTable = `
        CREATE TABLE IF NOT EXISTS Restaurants (
          restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
          owner_id INT,
          name VARCHAR(100) NOT NULL,
          cuisine_type VARCHAR(50),
          address TEXT,
          contact_phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE SET NULL
        )
      `;
      
      // Create menu items table
      const createMenuItemsTable = `
        CREATE TABLE IF NOT EXISTS Menu_Items (
          item_id INT AUTO_INCREMENT PRIMARY KEY,
          restaurant_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          category VARCHAR(50),
          price DECIMAL(10, 2) NOT NULL,
          description TEXT,
          is_available BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
        )
      `;
      
      // Create orders table
      const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS Orders (
          order_id INT AUTO_INCREMENT PRIMARY KEY,
          customer_id INT,
          restaurant_id INT,
          total_price DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE SET NULL,
          FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE SET NULL
        )
      `;
      
      // Create order items table
      const createOrderItemsTable = `
        CREATE TABLE IF NOT EXISTS Order_Items (
          order_item_id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          item_id INT NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
          FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE
        )
      `;
      
      // Execute table creation queries
      connection.query(createUsersTable, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          return;
        }
        console.log('Users table created or already exists');
        
        connection.query(createRestaurantsTable, (err) => {
          if (err) {
            console.error('Error creating restaurants table:', err);
            return;
          }
          console.log('Restaurants table created or already exists');
          
          connection.query(createMenuItemsTable, (err) => {
            if (err) {
              console.error('Error creating menu items table:', err);
              return;
            }
            console.log('Menu_Items table created or already exists');
            
            connection.query(createOrdersTable, (err) => {
              if (err) {
                console.error('Error creating orders table:', err);
                return;
              }
              console.log('Orders table created or already exists');
              
              connection.query(createOrderItemsTable, (err) => {
                if (err) {
                  console.error('Error creating order items table:', err);
                  return;
                }
                console.log('Order_Items table created or already exists');
                
                // Check if there's an admin user
                connection.query('SELECT * FROM users WHERE user_type = "admin" LIMIT 1', (err, results) => {
                  if (err) {
                    console.error('Error checking for admin user:', err);
                    return;
                  }
                  
                  // Create default admin if none exists
                  if (results.length === 0) {
                    const adminUser = {
                      username: 'Admin',
                      password: 'admin123',
                      email: 'admin@example.com',
                      phone: '1234567890',
                      user_type: 'admin'
                    };
                    
                    connection.query('INSERT INTO users SET ?', adminUser, (err) => {
                      if (err) {
                        console.error('Error creating default admin user:', err);
                        return;
                      }
                      console.log('Default admin user created');
                    });
                  }
                  
                  // Insert a test restaurant if none exists
                  connection.query('SELECT * FROM Restaurants LIMIT 1', (err, results) => {
                    if (err) {
                      console.error('Error checking for restaurants:', err);
                      return;
                    }
                    
                    if (results.length === 0) {
                      // First get the admin user ID
                      connection.query('SELECT user_id FROM users WHERE user_type = "admin" LIMIT 1', (err, users) => {
                        if (err || users.length === 0) {
                          console.error('Error getting admin user ID:', err);
                          return;
                        }
                        
                        const adminId = users[0].user_id;
                        
                        // Add test restaurant
                        const testRestaurant = {
                          owner_id: adminId,
                          name: 'Test Restaurant',
                          cuisine_type: 'Mixed',
                          address: '123 Test Street',
                          contact_phone: '555-555-5555'
                        };
                        
                        connection.query('INSERT INTO Restaurants SET ?', testRestaurant, (err, result) => {
                          if (err) {
                            console.error('Error creating test restaurant:', err);
                            return;
                          }
                          
                          const restaurantId = result.insertId;
                          console.log('Test restaurant created with ID:', restaurantId);
                          
                          // Add some sample menu items
                          const menuItems = [
                            {
                              restaurant_id: restaurantId,
                              name: 'Margherita Pizza',
                              category: 'Pizza',
                              price: 12.99,
                              description: 'Classic pizza with tomato sauce, mozzarella, and basil',
                              is_available: true
                            },
                            {
                              restaurant_id: restaurantId,
                              name: 'Veggie Burger',
                              category: 'Burger',
                              price: 9.99,
                              description: 'Plant-based patty with fresh vegetables and vegan mayo',
                              is_available: true
                            },
                            {
                              restaurant_id: restaurantId,
                              name: 'Caesar Salad',
                              category: 'Salad',
                              price: 8.99,
                              description: 'Fresh romaine lettuce, croutons, parmesan, and Caesar dressing',
                              is_available: true
                            }
                          ];
                          
                          // Insert menu items one by one
                          menuItems.forEach(item => {
                            connection.query('INSERT INTO Menu_Items SET ?', item, (err) => {
                              if (err) {
                                console.error('Error creating sample menu item:', err);
                              } else {
                                console.log(`Sample menu item '${item.name}' created`);
                              }
                            });
                          });
                        });
                      });
                    }
                  });
                });
                
                console.log('Database initialization completed');
              });
            });
          });
        });
      });
    });
  });
}); 