import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "India",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      if (response.status === 200) {
        alert("Form submitted successfully ✅");

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          country: "India",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message ❌");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-[1200px] w-full mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-2">
            Have a question about our content or want to collaborate? Reach out today 📩
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="flex justify-center">
            <img
              src="/images/contact-image.jpg"
              alt="Contact"
              className="w-full h-[500px] object-cover rounded-lg shadow-md"
            />
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-gray-700 font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="India">India</option>
                  <option value="Canada">Canada</option>
                  <option value="USA">USA</option>
                  <option value="Nepal">Nepal</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 h-40"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-md"
                >
                  Submit
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;