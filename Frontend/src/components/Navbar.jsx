import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state
  const dropdownRef = useRef(null); // Reference for the dropdown
  const user = JSON.parse(localStorage.getItem("user"));
  
  const navigate = useNavigate(); // Using useNavigate for redirecting

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");  // Redirect to home page after logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle the dropdown visibility
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false); // Close the dropdown
  };

  // Close dropdown if click happens outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-300 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          <span className="text-black">MSP</span>
          <span className="text-red-500">Blog</span>
        </Link>

        <div className="flex space-x-6">
          <Link to="/" className="text-black hover:text-blue-500">HOME</Link>
          <Link to="/blogs" className="text-black hover:text-blue-500">BLOGS</Link>
          <Link to="/CreateBlog" className="text-black hover:text-blue-500">CREATE-BLOG</Link>
          <Link to="/about" className="text-black hover:text-blue-500">ABOUT</Link>
        </div>

        {/* Right section */}
        <div className="flex space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown} // Toggle dropdown visibility
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg"
              >
                <img
                  src={user.profile_image || "/default-profile.png"} // Fallback to default profile image
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.username}</span>
              </button>

              {isDropdownOpen && ( // Only show dropdown if state is true
                <div
                  ref={dropdownRef} // Attach ref to the dropdown menu
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10"
                >
                  <Link
                    to="/my-blog"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdown} // Close dropdown on click
                  >
                    My Blog
                  </Link>
                  <Link
                    to="/my-profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdown} // Close dropdown on click
                  >
                    My Profile
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      handleLogout();
                      closeDropdown(); // Close dropdown on logout
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                LOGIN
              </button>

              <button
                onClick={openRegister}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                REGISTER
              </button>
            </>
          )}
        </div>
      </div>

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onRegisterClick={openRegister}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onLoginClick={openLogin}
        />
      )}
    </nav>
  );
};

export default Navbar;
