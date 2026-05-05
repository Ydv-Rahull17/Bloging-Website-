import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";  // Social Icons

const Footer = () => {
  return (
    <footer className="bg-blue-300 text-gray-800 py-10 px-5 shadow-lg">
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Left Section - Logo and Description */}
        <div>
          <h1 className="flex items-center text-2xl font-bold mb-4">
            <span className="bg-black text-white px-2 py-1 rounded">MSP</span>
            <span className="text-red-500 ml-2">Blog</span>
            <span className="text-red-500">.</span>
          </h1>
          <p className="text-sm">
            Did you come here for something in particular or just general Riker
          </p>
        </div>

        {/* Blogs Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Blogs</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-600">Travel</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Technology</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Lifestyle</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Fashion</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Business</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-600">FAQ</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Terms & Conditions</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Support</Link></li>
            <li><Link to="/" className="hover:text-blue-600">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter and Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe For Newsletter</h3>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 border rounded-l-md outline-none"
            />
            <button className="w-full p-2 bg-black text-white px-4 rounded-r-md hover:bg-gray-800">
              Subscribe
            </button>
          </div>

          <h3 className="text-lg font-semibold mt-6">Follow On:</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="text-gray-700 text-2xl hover:text-blue-500" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF className="text-gray-700 text-2xl hover:text-blue-500" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="text-gray-700 text-2xl hover:text-pink-500" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <FaGithub className="text-gray-700 text-2xl hover:text-black" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="text-center text-gray-600 mt-8">
        <p>&copy; {new Date().getFullYear()} MSPBlog. All Rights Reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
