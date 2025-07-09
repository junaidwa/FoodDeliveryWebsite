const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
// const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'DBProject'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');

    // Check if Menu_Items table needs to be updated with description field
    connection.query(
        "SHOW COLUMNS FROM Menu_Items LIKE 'description'",
        (err, results) => {
            if (err) {
                console.error('Error checking for description column:', err);
                return;
            }

            // If description column doesn't exist, add it
            if (results.length === 0) {
                connection.query(
                    "ALTER TABLE Menu_Items ADD COLUMN description TEXT",
                    (err, results) => {
                        if (err) {
                            console.error('Error adding description column:', err);
                            return;
                        }
                        console.log('Added description column to Menu_Items table');
                    }
                );
            }
        }
    );
});

// User Registration
app.post('/register', (req, res) => {
    const { username, password, email, phone, user_type } = req.body;
    
    // Validate input
    if (!username || !password || !email || !phone || !user_type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash password
    // bcrypt.hash(password, saltRounds, (err, hash) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(500).json({ error: 'Error hashing password' });
    //     }

        const sql = 'INSERT INTO Users (username, password, email, phone, user_type) VALUES (?, ?, ?, ?, ?)';
        connection.query(sql, [username, password, email, phone, user_type], (err, result) => {
            if (err) {
                console.error(err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Error registering user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM Users WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        
        // Direct password comparison (without bcrypt)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Remove password before sending user data
        const { password: _, ...userData } = user;
        res.json({ message: 'Login successful', user: userData });
    });
});

// Add a new product (Admin only)
app.post('/products', (req, res) => {
    const { restaurant_id, name, category, price, is_available, description } = req.body;
    
    // Check if all required fields are provided
    if (!restaurant_id || !name || !price) {
        return res.status(400).json({ error: 'Restaurant ID, name, and price are required' });
    }
    
    // Insert product into database
    const sql = 'INSERT INTO Menu_Items (restaurant_id, name, category, price, is_available, description) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [
        restaurant_id, 
        name, 
        category || null, 
        price, 
        is_available !== undefined ? is_available : true, 
        description || null
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding product' });
        }
        
        // Fetch the newly created product to return to client
        const getProductSql = 'SELECT * FROM Menu_Items WHERE item_id = ?';
        connection.query(getProductSql, [result.insertId], (err, productResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error retrieving added product' });
            }
            
            res.status(201).json({ 
                message: 'Product added successfully',
                product: productResults[0] || { item_id: result.insertId }
            });
        });
    });
});

// Get all products
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM Menu_Items';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching products' });
        }
        
        res.json(results);
    });
});

// Get products by restaurant
app.get('/restaurants/:restaurantId/products', (req, res) => {
    const { restaurantId } = req.params;
    
    const sql = 'SELECT * FROM Menu_Items WHERE restaurant_id = ?';
    connection.query(sql, [restaurantId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching products' });
        }
        
        res.json(results);
    });
});

// Get all users (Admin only)
app.get('/users', (req, res) => {
    // This endpoint should be protected in production
    const sql = 'SELECT user_id, username, email, phone, user_type, created_at FROM Users';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching users' });
        }
        
        res.json(results);
    });
});

// Get a single user by ID
app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    
    const sql = 'SELECT user_id, username, email, phone, user_type, created_at FROM Users WHERE user_id = ?';
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(results[0]);
    });
});

// Delete a user and their associated data (Admin only)
app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;
    
    // Start a transaction to ensure data consistency
    connection.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        
        // Get user orders to find their order IDs for cascading deletes
        const getOrdersSql = 'SELECT order_id FROM Orders WHERE user_id = ?';
        connection.query(getOrdersSql, [userId], (err, orderResults) => {
            if (err) {
                return connection.rollback(() => {
                    console.error('Error getting user orders:', err);
                    res.status(500).json({ error: 'Failed to delete user' });
                });
            }
            
            const orderIds = orderResults.map(order => order.order_id);
            
            const deleteOperations = [];
            
            // If there are orders, delete related records
            if (orderIds.length > 0) {
                // Delete from Order_Items first (foreign key constraint)
                const deleteOrderItemsSql = 'DELETE FROM Order_Items WHERE order_id IN (?)';
                deleteOperations.push(
                    new Promise((resolve, reject) => {
                        connection.query(deleteOrderItemsSql, [orderIds], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    })
                );
                
                // Delete from Reviews if they exist
                const deleteReviewsSql = 'DELETE FROM Reviews WHERE order_id IN (?) OR user_id = ?';
                deleteOperations.push(
                    new Promise((resolve, reject) => {
                        connection.query(deleteReviewsSql, [orderIds, userId], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    })
                );
                
                // Delete the Orders
                const deleteOrdersSql = 'DELETE FROM Orders WHERE user_id = ?';
                deleteOperations.push(
                    new Promise((resolve, reject) => {
                        connection.query(deleteOrdersSql, [userId], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    })
                );
            }
            
            // Delete Contact messages
            const deleteContactsSql = 'DELETE FROM Contacts WHERE user_id = ?';
            deleteOperations.push(
                new Promise((resolve, reject) => {
                    connection.query(deleteContactsSql, [userId], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                })
            );
            
            // Execute all delete operations
            Promise.all(deleteOperations)
                .then(() => {
                    // Finally delete the user
                    const deleteUserSql = 'DELETE FROM Users WHERE user_id = ?';
                    connection.query(deleteUserSql, [userId], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error('Error deleting user:', err);
                                res.status(500).json({ error: 'Failed to delete user' });
                            });
                        }
                        
                        if (result.affectedRows === 0) {
                            return connection.rollback(() => {
                                res.status(404).json({ error: 'User not found' });
                            });
                        }
                        
                        // Commit the transaction
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    res.status(500).json({ error: 'Failed to delete user' });
                                });
                            }
                            
                            res.json({ message: 'User and all associated data deleted successfully' });
                        });
                    });
                })
                .catch(err => {
                    connection.rollback(() => {
                        console.error('Error deleting user data:', err);
                        res.status(500).json({ error: 'Failed to delete user data' });
                    });
                });
        });
    });
});

// Admin can create a restaurant
app.post('/restaurants', (req, res) => {
    const { owner_id, name, cuisine_type, address, contact_phone } = req.body;
    
    if (!owner_id || !name) {
        return res.status(400).json({ error: 'Owner ID and name are required' });
    }
    
    const sql = 'INSERT INTO Restaurants (owner_id, name, cuisine_type, address, contact_phone) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [owner_id, name, cuisine_type, address, contact_phone], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error creating restaurant' });
        }
        
        res.status(201).json({
            message: 'Restaurant created successfully',
            restaurant_id: result.insertId
        });
    });
});

// Get all restaurants
app.get('/restaurants', (req, res) => {
    const sql = 'SELECT * FROM Restaurants';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching restaurants' });
        }
        
        res.json(results);
    });
});

// Update a product (Admin only)
app.put('/products/:productId', (req, res) => {
    const { productId } = req.params;
    const { restaurant_id, name, category, price, is_available, description } = req.body;
    
    // Check if all required fields are provided
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    
    // Update product in database
    const sql = 'UPDATE Menu_Items SET name = ?, category = ?, price = ?, is_available = ?, description = ? WHERE item_id = ?';
    connection.query(sql, [
        name, 
        category || null, 
        price, 
        is_available !== undefined ? is_available : true,
        description || null,
        productId
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error updating product' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Get the updated product
        const getProductSql = 'SELECT * FROM Menu_Items WHERE item_id = ?';
        connection.query(getProductSql, [productId], (err, productResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error retrieving updated product' });
            }
            
            res.json({ 
                message: 'Product updated successfully',
                product: productResults[0] || { item_id: productId }
            });
        });
    });
});

// Delete a product (Admin only)
app.delete('/products/:productId', (req, res) => {
    const { productId } = req.params;
    
    const sql = 'DELETE FROM Menu_Items WHERE item_id = ?';
    connection.query(sql, [productId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error deleting product' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ 
            message: 'Product deleted successfully'
        });
    });
});

// Contact form submission endpoint
app.post('/contact', (req, res) => {
    const { user_id, name, email, phone, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are required fields' });
    }

    const sql = 'INSERT INTO Contacts (user_id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [user_id || null, name, email, phone || null, subject || null, message], (err, result) => {
        if (err) {
            console.error('Error saving contact message:', err);
            return res.status(500).json({ error: 'Failed to save your message. Please try again later.' });
        }
        
        res.status(201).json({ 
            message: 'Message sent successfully',
            contact_id: result.insertId
        });
    });
});

// Admin can get all contact messages (Admin only)
app.get('/contacts', (req, res) => {
    // In production, this should be protected with authentication middleware to ensure only admins can access
    const sql = 'SELECT * FROM Contacts ORDER BY created_at DESC';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching contact messages:', err);
            return res.status(500).json({ error: 'Failed to fetch contact messages' });
        }
        
        res.json(results);
    });
});

// Admin can update contact message status (Admin only)
app.put('/contacts/:contactId', (req, res) => {
    const { contactId } = req.params;
    const { status } = req.body;
    
    if (!status || !['unread', 'read', 'responded'].includes(status)) {
        return res.status(400).json({ error: 'Valid status is required (unread, read, or responded)' });
    }
    
    const sql = 'UPDATE Contacts SET status = ? WHERE contact_id = ?';
    connection.query(sql, [status, contactId], (err, result) => {
        if (err) {
            console.error('Error updating contact status:', err);
            return res.status(500).json({ error: 'Failed to update contact status' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact message not found' });
        }
        
        res.json({ message: 'Contact status updated successfully' });
    });
});

// Place a new order
app.post('/orders', (req, res) => {
    const { user_id, restaurant_id, items, total_amount, delivery_address } = req.body;
    
    if (!user_id || !items || !items.length || !total_amount || !delivery_address) {
        return res.status(400).json({ error: 'Missing required order information' });
    }

    // Start a transaction to ensure data consistency
    connection.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Failed to create order' });
        }

        console.log('Creating new order with data:', {
            user_id,
            restaurant_id,
            items_count: items.length,
            total_amount
        });

        // Create the order record
        const orderSql = 'INSERT INTO Orders (user_id, restaurant_id, order_status, total_amount, delivery_address) VALUES (?, ?, ?, ?, ?)';
        connection.query(orderSql, [user_id, restaurant_id, 'pending', total_amount, delivery_address], (err, orderResult) => {
            if (err) {
                console.error('Error creating order record:', err);
                return connection.rollback(() => {
                    console.error('Error creating order:', err);
                    res.status(500).json({ error: 'Failed to create order' });
                });
            }
            
            const order_id = orderResult.insertId;
            console.log(`Order created with ID: ${order_id}`);
            
            // Insert order items
            const orderItemSql = 'INSERT INTO Order_Items (order_id, item_id, quantity, price) VALUES ?';
            const orderItemValues = items.map(item => [
                order_id,
                item.item_id,
                item.quantity,
                item.price
            ]);
            
            console.log('Adding order items:', orderItemValues);
            
            connection.query(orderItemSql, [orderItemValues], (err) => {
                if (err) {
                    console.error('Error adding order items:', err);
                    return connection.rollback(() => {
                        console.error('Error adding order items:', err);
                        res.status(500).json({ error: 'Failed to add order items' });
                    });
                }
                
                // Commit the transaction
                console.log('Committing transaction for order:', order_id);
                connection.commit(err => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        return connection.rollback(() => {
                            console.error('Error committing transaction:', err);
                            res.status(500).json({ error: 'Failed to complete order' });
                        });
                    }
                    
                    console.log('Order successfully created:', order_id);
                    res.status(201).json({
                        message: 'Order placed successfully',
                        order_id: order_id
                    });
                });
            });
        });
    });
});

// Get all orders for admin
app.get('/orders', (req, res) => {
    console.log('Fetching all orders for admin');
    
    const sql = `
        SELECT o.*, 
               u.username, 
               u.email, 
               u.phone,
               r.name AS restaurant_name
        FROM Orders o
        JOIN Users u ON o.user_id = u.user_id
        LEFT JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        ORDER BY o.order_date DESC
    `;
    
    connection.query(sql, (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }
        
        console.log(`Found ${orders.length} orders`);
        
        // Get order items for each order
        const orderIds = orders.map(order => order.order_id);
        
        if (orderIds.length === 0) {
            return res.json([]);
        }
        
        // Use a better query with explicit JOINs and ensure all required fields
        const itemsSql = `
            SELECT oi.order_item_id, oi.order_id, oi.item_id, oi.quantity, oi.price,
                   mi.name, mi.category, mi.image_url, mi.description
            FROM Order_Items oi
            JOIN Menu_Items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})
        `;
        
        connection.query(itemsSql, orderIds, (err, allItems) => {
            if (err) {
                console.error('Error fetching order items:', err);
                console.error('Order IDs:', orderIds);
                console.error('SQL Query:', itemsSql);
                return res.status(500).json({ error: 'Failed to fetch order items' });
            }
            
            console.log(`Found ${allItems.length} order items for ${orderIds.length} orders`);
            
            // Group items by order_id
            const itemsByOrder = allItems.reduce((acc, item) => {
                if (!acc[item.order_id]) {
                    acc[item.order_id] = [];
                }
                acc[item.order_id].push(item);
                return acc;
            }, {});
            
            // Check which orders have items and which don't
            orderIds.forEach(orderId => {
                const items = itemsByOrder[orderId] || [];
                console.log(`Order ${orderId} has ${items.length} items`);
            });
            
            // Attach items to their respective orders
            const ordersWithItems = orders.map(order => {
                const orderItems = itemsByOrder[order.order_id] || [];
                return {
                    ...order,
                    items: orderItems
                };
            });
            
            res.json(ordersWithItems);
        });
    });
});

// Get orders for a specific user
app.get('/users/:userId/orders', (req, res) => {
    const { userId } = req.params;
    
    const sql = `
        SELECT o.*, 
               r.name AS restaurant_name
        FROM Orders o
        LEFT JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC
    `;
    
    connection.query(sql, [userId], (err, orders) => {
        if (err) {
            console.error('Error fetching user orders:', err);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }
        
        // Get order items for each order
        const orderIds = orders.map(order => order.order_id);
        
        if (orderIds.length === 0) {
            return res.json([]);
        }
        
        const itemsSql = `
            SELECT oi.*, mi.name, mi.category, mi.image_url 
            FROM Order_Items oi
            JOIN Menu_Items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})
        `;
        
        connection.query(itemsSql, orderIds, (err, allItems) => {
            if (err) {
                console.error('Error fetching order items:', err);
                console.error('Order IDs:', orderIds);
                console.error('SQL Query:', itemsSql);
                return res.status(500).json({ error: 'Failed to fetch order items' });
            }
            
            console.log(`Found ${allItems.length} order items for user ${userId}`);
            if (allItems.length > 0) {
                console.log('Sample order item:', allItems[0]);
            }
            
            // Group items by order_id
            const itemsByOrder = allItems.reduce((acc, item) => {
                if (!acc[item.order_id]) {
                    acc[item.order_id] = [];
                }
                acc[item.order_id].push(item);
                return acc;
            }, {});
            
            // Attach items to their respective orders
            const ordersWithItems = orders.map(order => ({
                ...order,
                items: itemsByOrder[order.order_id] || []
            }));
            
            res.json(ordersWithItems);
        });
    });
});

// Update order status (for admin)
app.put('/orders/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Valid status is required' });
    }
    
    const sql = 'UPDATE Orders SET order_status = ? WHERE order_id = ?';
    connection.query(sql, [status, orderId], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Failed to update order status' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ message: 'Order status updated successfully' });
    });
});

// Get all customers (Admin only)
app.get('/customers', (req, res) => {
    const sql = `
        SELECT u.user_id, u.username, u.email, u.phone, u.created_at,
               COUNT(DISTINCT o.order_id) as total_orders,
               SUM(CASE WHEN o.order_status = 'delivered' THEN o.total_amount ELSE 0 END) as total_spent
        FROM Users u
        LEFT JOIN Orders o ON u.user_id = o.user_id
        WHERE u.user_type = 'customer'
        GROUP BY u.user_id
        ORDER BY u.created_at DESC
    `;
    
    connection.query(sql, (err, customers) => {
        if (err) {
            console.error('Error fetching customers:', err);
            return res.status(500).json({ error: 'Failed to fetch customers' });
        }
        
        res.json(customers);
    });
});

// Get customer details with order history (Admin only)
app.get('/customers/:customerId', (req, res) => {
    const { customerId } = req.params;
    
    // Get customer basic information
    const userSql = 'SELECT user_id, username, email, phone, created_at FROM Users WHERE user_id = ? AND user_type = "customer"';
    
    connection.query(userSql, [customerId], (err, userResults) => {
        if (err) {
            console.error('Error fetching customer:', err);
            return res.status(500).json({ error: 'Failed to fetch customer details' });
        }
        
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        const customer = userResults[0];
        
        // Get customer's orders
        const ordersSql = `
            SELECT o.*, r.name AS restaurant_name
            FROM Orders o
            LEFT JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
            WHERE o.user_id = ?
            ORDER BY o.order_date DESC
        `;
        
        connection.query(ordersSql, [customerId], (err, orders) => {
            if (err) {
                console.error('Error fetching customer orders:', err);
                return res.status(500).json({ error: 'Failed to fetch customer orders' });
            }
            
            // Get order items for each order if any orders exist
            if (orders.length > 0) {
                const orderIds = orders.map(order => order.order_id);
                
                const itemsSql = `
                    SELECT oi.*, mi.name, mi.category, mi.image_url 
                    FROM Order_Items oi
                    JOIN Menu_Items mi ON oi.item_id = mi.item_id
                    WHERE oi.order_id IN (${orderIds.map(() => '?').join(',')})
                `;
                
                connection.query(itemsSql, orderIds, (err, allItems) => {
                    if (err) {
                        console.error('Error fetching order items:', err);
                        return res.status(500).json({ error: 'Failed to fetch order items' });
                    }
                    
                    // Group items by order_id
                    const itemsByOrder = allItems.reduce((acc, item) => {
                        if (!acc[item.order_id]) {
                            acc[item.order_id] = [];
                        }
                        acc[item.order_id].push(item);
                        return acc;
                    }, {});
                    
                    // Attach items to their respective orders
                    const ordersWithItems = orders.map(order => ({
                        ...order,
                        items: itemsByOrder[order.order_id] || []
                    }));
                    
                    // Return complete customer data with orders
                    customer.orders = ordersWithItems;
                    res.json(customer);
                });
            } else {
                // If no orders, return customer with empty orders array
                customer.orders = [];
                res.json(customer);
            }
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});