import { FaFacebook, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 font-poppins text-primary">
              TastyBites<span className="text-secondary">.</span>
            </h2>
            <p className="mb-4 text-gray-300">
              Delicious food delivered straight to your doorstep. Experience the taste of excellence.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-primary transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-primary transition">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 font-poppins">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="mr-2 text-primary" />
                123 Food Street, Flavor City, FC 12345
              </p>
              <p className="flex items-center text-gray-300">
                <FaPhoneAlt className="mr-2 text-primary" />
                +1 (555) 123-4567
              </p>
              <p className="flex items-center text-gray-300">
                <FaEnvelope className="mr-2 text-primary" />
                contact@tastybites.com
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} TastyBites. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 