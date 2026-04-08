import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = (e) => {
    e.preventDefault();
    console.log("OTP sent to:", email);
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    console.log("OTP Verified:", otp);
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      console.log("Password reset successful for:", email);
      onClose();
    } else {
      alert("Passwords do not match!");
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
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-sm text-center text-gray-600 mb-4">
              Enter your email address to receive an OTP.
            </p>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
              <FaEnvelope className="text-red-500 mr-3" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-center text-gray-600 mb-4">
              Enter the OTP sent to your email.
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border rounded px-3 py-2 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-center text-gray-600 mb-4">
              Enter your new password.
            </p>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
              <FaLock className="text-blue-500 mr-3" />
              <input
                type="password"
                placeholder="New Password"
                className="w-full outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
              <FaLock className="text-blue-500 mr-3" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
