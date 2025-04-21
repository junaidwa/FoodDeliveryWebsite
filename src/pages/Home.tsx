import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import foodData from '../data/foodData';

const Home = () => {
  // Get popular dishes (for example, first 4 items)
  const popularDishes = foodData.slice(0, 4);
  
  // Get special offers (for example, items with even ids)
  const specialOffers = foodData.filter(item => item.id % 2 === 0).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          >
            <source src="https://player.vimeo.com/external/414997786.sd.mp4?s=351ab4de93861ea9302daf6be5b4030fb3a86387&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Delicious Food<br />Delivered To Your Door
          </motion.h1>
          <motion.p 
            className="text-xl text-white mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From our kitchen to your table. Experience the taste of excellence with our
            premium quality ingredients and chef-crafted recipes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/menu" 
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full inline-flex items-center btn"
            >
              Order Now <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center font-poppins">
            Popular <span className="text-primary">Dishes</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDishes.map((dish) => (
              <motion.div 
                key={dish.id}
                className="bg-white rounded-lg overflow-hidden shadow-md food-card"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{dish.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">${dish.price.toFixed(2)}</span>
                    <Link 
                      to="/menu" 
                      className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary-dark transition"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/menu" 
              className="text-primary font-semibold inline-flex items-center text-lg hover:underline"
            >
              View Full Menu <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center font-poppins">
            Special <span className="text-primary">Offers</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <motion.div 
                key={offer.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-4 right-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                  20% OFF
                </div>
                <img 
                  src={offer.image} 
                  alt={offer.name} 
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{offer.name}</h3>
                  <div className="flex items-center mb-4">
                    <span className="text-gray-500 line-through mr-2">${(offer.price * 1.2).toFixed(2)}</span>
                    <span className="text-primary font-bold text-lg">${offer.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <Link 
                    to="/menu" 
                    className="block text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                  >
                    Order Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">
            Ready to Enjoy Delicious Food?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Order now and get your favorite meals delivered to your doorstep in minutes.
          </p>
          <Link 
            to="/menu" 
            className="bg-white text-primary font-bold py-3 px-8 rounded-full inline-flex items-center btn hover:bg-gray-100"
          >
            Order Now <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 