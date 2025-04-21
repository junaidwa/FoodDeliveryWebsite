// This file will be used for the MySQL database connection
// Note: In a real application, you'd need to use a Node.js server for database connection
// This is just a placeholder for the future backend integration

import mysql from 'mysql2/promise';

// Database connection configuration
// In a real app, store these in environment variables
export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'food_delivery_db',
};

// Create a connection pool
export const createPool = async () => {
  try {
    const pool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('Database pool created successfully');
    return pool;
  } catch (error) {
    console.error('Error creating database pool:', error);
    throw error;
  }
};

// Example query function
export const executeQuery = async (query: string, params: any[] = []) => {
  const pool = await createPool();
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Example of food item CRUD operations for future backend integration

// Get all food items
export const getAllFoodItems = async () => {
  const query = 'SELECT * FROM food_items';
  return executeQuery(query);
};

// Get a single food item by ID
export const getFoodItemById = async (id: number) => {
  const query = 'SELECT * FROM food_items WHERE id = ?';
  const results = await executeQuery(query, [id]);
  return results[0];
};

// Add a new food item
export const createFoodItem = async (foodItem: any) => {
  const query = `
    INSERT INTO food_items (name, price, image, category, description, isVegetarian) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    foodItem.name,
    foodItem.price,
    foodItem.image,
    foodItem.category,
    foodItem.description,
    foodItem.isVegetarian
  ];
  return executeQuery(query, params);
};

// Update a food item
export const updateFoodItem = async (id: number, foodItem: any) => {
  const query = `
    UPDATE food_items 
    SET name = ?, price = ?, image = ?, category = ?, description = ?, isVegetarian = ? 
    WHERE id = ?
  `;
  const params = [
    foodItem.name,
    foodItem.price,
    foodItem.image,
    foodItem.category,
    foodItem.description,
    foodItem.isVegetarian,
    id
  ];
  return executeQuery(query, params);
};

// Delete a food item
export const deleteFoodItem = async (id: number) => {
  const query = 'DELETE FROM food_items WHERE id = ?';
  return executeQuery(query, [id]);
}; 