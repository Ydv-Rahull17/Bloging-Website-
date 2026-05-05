import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";

const RegisterModal = ({ onClose, onLoginClick }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // for preview only

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        onClose();
        onLoginClick();
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert("Something went wrong!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // for showing preview
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">REGISTER</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
            <FaUser className="text-green-500 mr-3" />
            <input
              type="text"
              placeholder="USERNAME"
              className="w-full outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
            <FaEnvelope className="text-red-500 mr-3" />
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
            <FaLock className="text-blue-500 mr-3" />
            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
            <FaCamera className="text-gray-500 mr-3" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full outline-none"
            />
          </div>

          {previewImage && (
            <div className="mt-4 text-center">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full mx-auto"
              />
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </button>

            <button
              onClick={onLoginClick}
              className="text-blue-700 hover:underline"
              type="button"
            >
              Login Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
