export interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  isVegetarian: boolean;
}

const foodData: Food[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pizza",
    description: "Classic delight with 100% real mozzarella cheese and a tasty tomato sauce on a hand-tossed crust.",
    isVegetarian: true,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pizza",
    description: "Loaded with spicy pepperoni slices and extra cheese for that perfect pizza experience.",
    isVegetarian: false,
  },
  {
    id: 3,
    name: "Vegan Buddha Bowl",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Bowls",
    description: "Nutritious mix of fresh vegetables, quinoa, avocado, and a tangy tahini dressing.",
    isVegetarian: true,
  },
  {
    id: 4,
    name: "Chicken Burger",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Burgers",
    description: "Juicy grilled chicken patty with lettuce, tomato, and our special sauce on a toasted bun.",
    isVegetarian: false,
  },
  {
    id: 5,
    name: "Veggie Burger",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Burgers",
    description: "Plant-based patty with fresh vegetables, avocado, and chipotle mayo on a whole grain bun.",
    isVegetarian: true,
  },
  {
    id: 6,
    name: "Pasta Carbonara",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pasta",
    description: "Creamy sauce with pancetta, eggs, parmesan cheese, and freshly ground black pepper.",
    isVegetarian: false,
  },
  {
    id: 7,
    name: "Chocolate Brownie",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Desserts",
    description: "Rich, fudgy brownie topped with vanilla ice cream and chocolate sauce.",
    isVegetarian: true,
  },
  {
    id: 8,
    name: "Caesar Salad",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Salads",
    description: "Crisp romaine lettuce, croutons, parmesan cheese, and our homemade Caesar dressing.",
    isVegetarian: false,
  },
  {
    id: 9,
    name: "Chicken Tikka Masala",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Curry",
    description: "Tender chicken pieces in a rich, creamy tomato sauce with aromatic spices. Served with rice.",
    isVegetarian: false,
  },
  {
    id: 10,
    name: "Vegetable Biryani",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Rice",
    description: "Fragrant basmati rice cooked with mixed vegetables, herbs, and aromatic spices.",
    isVegetarian: true,
  },
  {
    id: 11,
    name: "Sushi Platter",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Sushi",
    description: "Assorted sushi rolls with fresh salmon, tuna, and avocado. Served with wasabi and soy sauce.",
    isVegetarian: false,
  },
  {
    id: 12,
    name: "Mango Smoothie",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1623848094797-f5bde52615a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Drinks",
    description: "Refreshing blend of fresh mango, yogurt, and a hint of honey.",
    isVegetarian: true,
  },
];

export default foodData; 