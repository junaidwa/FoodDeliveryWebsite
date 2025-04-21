<<<<<<< HEAD
# FoodDeliveryWebsite
=======
# TastyBites Food Delivery Website

A modern, responsive online food delivery website built with React, Tailwind CSS, and MySQL.

## Features

- **Responsive Design**: Fully responsive for mobile, tablet, and desktop views
- **Animated UI**: Smooth animations and transitions using Framer Motion
- **User-Friendly Interface**: Intuitive navigation and interactive elements
- **Database Integration**: Backend API with MySQL for persistent storage
- **Cart Management**: Add, update, and remove items from cart
- **Admin Panel**: Add, edit, and manage food items (admin only)
- **Order Processing**: Complete order flow with checkout

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- React Icons

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- bcrypt for password hashing

## Project Structure

```
food-delivery/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   │   ├── Admin/          # Admin panel components
│   │   ├── FoodCard.tsx    # Food item card component
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── Footer.tsx      # Footer component
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Home page
│   │   ├── Menu.tsx        # Menu page
│   │   ├── Cart.tsx        # Shopping cart
│   │   └── Contact.tsx     # Contact page
│   ├── data/               # Mock data (frontend only)
│   ├── lib/                # Utility functions
│   │   └── db.ts           # Database connection
│   ├── assets/             # Static assets
│   │   ├── images/         # Image files
│   │   └── videos/         # Video files
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── server/                 # Backend server
│   ├── index.js            # Express server
│   └── package.json        # Server dependencies
├── database/               # Database scripts
│   └── schema.sql          # MySQL schema and sample data
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Frontend dependencies
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MySQL Server

### Frontend Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Access the application at http://localhost:5173

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install server dependencies:
   ```
   npm install
   ```
3. Update the database configuration in `server/index.js` with your MySQL credentials
4. Start the server:
   ```
   npm run dev
   ```
5. The API will be available at http://localhost:5000

### Database Setup
1. Create a MySQL database
2. Run the SQL script in `database/schema.sql` to create tables and sample data
3. Make sure the database configuration in the server matches your setup

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Food Items
- `GET /api/food-items` - Get all food items
- `GET /api/food-items/:id` - Get a specific food item
- `POST /api/food-items` - Add a new food item (admin only)
- `PUT /api/food-items/:id` - Update a food item (admin only)
- `DELETE /api/food-items/:id` - Delete a food item (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get a specific order

## Customization

- Edit `tailwind.config.js` to customize colors, fonts, etc.
- Replace images and videos in the `src/assets` directory
- Modify food data in `src/data/foodData.ts` for frontend testing

## License

This project is MIT licensed.

## Acknowledgements

- Food images from [Unsplash](https://unsplash.com)
- Icons from [React Icons](https://react-icons.github.io/react-icons/) 
>>>>>>> d48e501 (This is my First Commit)
