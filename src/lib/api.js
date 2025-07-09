const API_URL = 'http://localhost:3000'; // Updated to match backend port

// Helper for API calls
const apiFetch = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    // Map frontend user data to backend schema
    const backendUserData = {
      username: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      user_type: userData.user_type || 'customer', // Default to customer if not specified
    };

    return apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify(backendUserData),
    });
  },
};

// Restaurant API
export const restaurantAPI = {
  getAll: async () => {
    return apiFetch('/restaurants');
  },

  getById: async (id) => {
    return apiFetch(`/restaurants/${id}`);
  },

  create: async (restaurantData) => {
    return apiFetch('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  },

  update: async (id, restaurantData) => {
    // If backend provides this endpoint in the future
    return apiFetch(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    });
  },

  delete: async (id) => {
    // If backend provides this endpoint in the future
    return apiFetch(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  },
};

// Product (Menu Items) API
export const productAPI = {
  getAll: async () => {
    return apiFetch('/products');
  },

  getByRestaurant: async (restaurantId) => {
    return apiFetch(`/restaurants/${restaurantId}/products`);
  },

  create: async (productData) => {
    return apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id, productData) => {
    return apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id) => {
    return apiFetch(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// User API
export const userAPI = {
  getAll: async () => {
    return apiFetch('/users');
  },
  
  getById: async (userId) => {
    return apiFetch(`/users/${userId}`);
  },
  
  deleteUser: async (userId) => {
    return apiFetch(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
  
  // New methods for customer management
  getAllCustomers: async () => {
    return apiFetch('/customers');
  },
  
  getCustomerDetails: async (customerId) => {
    return apiFetch(`/customers/${customerId}`);
  }
};

// Cart functionality (frontend state management since backend doesn't have cart endpoints)
export const cartAPI = {
  // These methods will manage cart in localStorage for now
  // Can be updated when backend cart endpoints are created
  getCart: () => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.user_id || 'guest';
    
    // Use user-specific cart key
    const cart = localStorage.getItem(`cart_${userId}`);
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  },

  addToCart: (product, quantity = 1) => {
    const cart = cartAPI.getCart();
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.product_id === product.item_id);
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product_id: product.item_id,
        restaurant_id: product.restaurant_id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      });
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.user_id || 'guest';
    
    // Save to user-specific localStorage
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    return cart;
  },

  updateCartItem: (productId, quantity) => {
    const cart = cartAPI.getCart();
    const itemIndex = cart.items.findIndex(item => item.product_id === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }
      
      // Recalculate total
      cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.user_id || 'guest';
      
      // Save to user-specific localStorage
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
    
    return cart;
  },

  removeFromCart: (productId) => {
    return cartAPI.updateCartItem(productId, 0);
  },

  clearCart: () => {
    const emptyCart = { items: [], total: 0 };
    
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.user_id || 'guest';
    
    // Save empty cart to user-specific localStorage
    localStorage.setItem(`cart_${userId}`, JSON.stringify(emptyCart));
    return emptyCart;
  },
};

// Orders API
export const orderAPI = {
  createOrder: async (orderData) => {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  getUserOrders: async (userId) => {
    return apiFetch(`/users/${userId}/orders`);
  },
  
  getAllOrders: async () => {
    return apiFetch('/orders');
  },
  
  updateOrderStatus: async (orderId, status) => {
    return apiFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
};

export default {
  auth: authAPI,
  restaurants: restaurantAPI,
  products: productAPI,
  users: userAPI,
  cart: cartAPI,
  orders: orderAPI,
}; 