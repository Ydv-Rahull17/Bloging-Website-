import { useState, useEffect } from "react";
import { 
  HiOutlineUser, 
  HiOutlineLockClosed, 
  HiOutlineTrash, 
  HiOutlineMail,
  HiOutlinePencilAlt,
  HiOutlineCloudUpload,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from "react-icons/hi";

const MyProfile = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUser(user);
      setNewUsername(user.username);
    }
  }, []);

  const handleProfileImageChange = (e) => {
    setNewProfileImage(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    if (!loggedInUser) return;
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("id", loggedInUser.id);
    formData.append("username", newUsername);
    if (newProfileImage) {
      formData.append("profile_image", newProfileImage);
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/updateProfile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Profile updated successfully!");
        const updatedUser = {
          ...loggedInUser,
          username: newUsername,
          profile_image: data.profile_image,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setLoggedInUser(updatedUser);
        setNewProfileImage(null);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/changePassword", {
        method: "POST",
        body: JSON.stringify({
          id: loggedInUser.id,
          oldPassword,
          newPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  const handleDeleteAccount = async () => {
    if (!loggedInUser) return;

    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/deleteAccount/${loggedInUser.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else {
          setError("Failed to delete account");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong!");
      }
    }
  };

  if (!loggedInUser) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Loading your profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen mesh-gradient-blue py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Account Settings</h1>
          <p className="text-slate-500 text-xl font-medium italic opacity-80">Refine your digital presence and security preferences.</p>
        </div>

        {(error || success) && (
          <div className={`mb-10 p-6 rounded-[2rem] border-2 animate-in slide-in-from-top-8 duration-500 flex items-center gap-4 shadow-2xl ${
            success ? 'bg-white/80 border-green-200 text-green-700 shadow-green-500/10' : 'bg-white/80 border-red-200 text-red-700 shadow-red-500/10'
          } backdrop-blur-xl`}>
            {success ? <HiOutlineCheckCircle className="w-8 h-8 shrink-0" /> : <HiOutlineExclamationCircle className="w-8 h-8 shrink-0" />}
            <p className="text-lg font-bold">{success || error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-10">
            <div className="glass p-10 rounded-[3rem] shadow-2xl shadow-blue-500/5 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                <div className="relative group/avatar">
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-[2.5rem] opacity-20 group-hover/avatar:opacity-40 blur-xl transition-opacity duration-700"></div>
                  <img
                    src={newProfileImage ? URL.createObjectURL(newProfileImage) : (loggedInUser.profile_image?.startsWith('http') ? loggedInUser.profile_image : `http://localhost:5000${loggedInUser.profile_image?.startsWith('/') ? '' : '/'}${loggedInUser.profile_image}`)}
                    alt="Profile"
                    className="w-56 h-56 rounded-[2rem] object-cover ring-4 ring-white shadow-2xl relative z-10 transition-transform duration-700 group-hover/avatar:scale-[1.02]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${loggedInUser.username}&background=random&size=200`;
                    }}
                  />
                  <label className="absolute -bottom-4 -right-4 w-14 h-14 bg-white border border-slate-100 rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-300 z-20 active:scale-90 group/edit">
                    <HiOutlineCloudUpload className="w-7 h-7" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 space-y-8 w-full text-center md:text-left">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Profile Information</h3>
                    <p className="text-slate-500 mt-2 font-medium">Manage how you appear to the community.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Display Identity</label>
                      <div className="relative group/field">
                        <HiOutlineUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-blue-600 transition-colors w-6 h-6" />
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 pl-14 pr-6 py-4.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xl font-bold text-slate-800"
                          placeholder="Your identity"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Verified Email</label>
                      <div className="relative bg-slate-100/30 border border-slate-100/50 pl-14 pr-6 py-4.5 rounded-2xl text-slate-400 select-none backdrop-blur-sm">
                        <HiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 opacity-40" />
                        <span className="font-bold italic text-lg">{loggedInUser.email}</span>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-slate-200/50 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">Locked</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveChanges}
                    className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.05] flex items-center justify-center gap-3 active:scale-95 group"
                  >
                    <HiOutlinePencilAlt className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Confirm Updates
                  </button>
                </div>
              </div>
              
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -z-0 -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
            </div>

            <div className="glass p-10 rounded-[3rem] shadow-2xl shadow-red-500/5 border border-red-50/50 group">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-red-50 text-red-600 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                  <HiOutlineExclamationCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Danger Zone</h3>
                  <p className="text-lg font-medium text-slate-400 mt-1">Irreversible account actions.</p>
                </div>
              </div>
              
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-center gap-4 bg-red-50/50 text-red-600 font-black px-8 py-5 rounded-[1.5rem] border-2 border-red-100 hover:bg-red-600 hover:text-white transition-all duration-300 group/delete active:scale-95"
              >
                <HiOutlineTrash className="w-6 h-6 group-hover/delete:animate-bounce" />
                Delete My Account Permanently
              </button>
            </div>
          </div>

          {/* Security Sidebar */}
          <div className="space-y-10">
            <div className="glass p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-white sticky top-28 overflow-hidden group">
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem]">
                  <HiOutlineLockClosed className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security</h3>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 mb-8 relative z-10 backdrop-blur-sm">
                <p className="text-slate-500 text-lg font-medium leading-relaxed italic opacity-80">
                  "Ensure your account stays protected by updating your credentials regularly."
                </p>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Active Credentials</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-white/50 border border-slate-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-lg shadow-inner"
                    placeholder="Current Password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">New Secret Key</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/50 border border-slate-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-lg shadow-inner"
                    placeholder="New Password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.2em]">Confirm Secret</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/50 border border-slate-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono text-lg shadow-inner"
                    placeholder="Repeat Password"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full bg-gradient-to-r from-slate-800 to-indigo-900 hover:from-indigo-600 hover:to-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl transition-all hover:scale-[1.02] mt-6 active:scale-95"
                >
                  Update Passkey
                </button>
              </div>

              {/* Decorative Accent */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-0 translate-y-1/2 -translate-x-1/2 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
