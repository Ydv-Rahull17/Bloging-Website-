import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import ForgotPassword from "../pages/forget";

const LoginModal = ({ onClose, onRegisterClick, prefillEmail = "" }) => {
  const [email, setEmail] = useState(prefillEmail); // Pre-fill with email if provided
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.reload();
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
    }

    onClose();
  };

  if (showForgotPassword) {
    return <ForgotPassword onClose={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✖
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">LOGIN</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border rounded-lg px-4 py-3 bg-gray-100">
            <FaEnvelope className="text-red-500 mr-3" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full outline-none bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-4 py-3 bg-gray-100">
            <FaLock className="text-blue-500 mr-3" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
            >
              Login
            </button>
          </div>

          <div className="text-center text-sm mt-4">
            <span>Don't have an account? </span>
            <button
              onClick={onRegisterClick}
              className="text-blue-700 hover:underline"
            >
              Register Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
