import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
  HiOutlineUserGroup, 
  HiOutlineBookOpen, 
  HiOutlineTrash,
  HiOutlineExclamation
} from 'react-icons/hi';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [view, setView] = useState('users');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const savedView = localStorage.getItem('adminView');
    if (savedView) {
      setView(savedView);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (view === 'users') {
          const userResponse = await axios.get("http://localhost:5000/api/admin/users");
          setUsers(userResponse.data);
        } else if (view === 'blogs') {
          const blogResponse = await axios.get("http://localhost:5000/api/admin/blogs");
          setBlogs(blogResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  // Special effect to listen for localStorage changes (hacky but works for sidebar navigation)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedView = localStorage.getItem('adminView');
      if (savedView && savedView !== view) {
        setView(savedView);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Poll for changes since 'storage' event doesn't fire on same tab
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [view]);

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/blog/${id}`);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (err) {
      console.error("Error deleting blog", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleDeleteConfirm = (id, type) => {
    setDeleteConfirm({ show: true, id, type });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.type === 'user') {
      deleteUser(deleteConfirm.id);
    } else if (deleteConfirm.type === 'blog') {
      deleteBlog(deleteConfirm.id);
    }
    setDeleteConfirm({ show: false, id: null, type: '' });
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: <HiOutlineUserGroup className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Total Blogs', value: blogs.length, icon: <HiOutlineBookOpen className="w-6 h-6" />, color: 'bg-indigo-500' },
  ];

  return (
    <AdminLayout title={view === 'users' ? 'User Management' : 'Blog Management'}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Fetching records...</p>
        </div>
      ) : view === 'users' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">All Registered Users</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {user.profile_image ? (
                        <img
                          src={`http://localhost:5000${user.profile_image}`}
                          alt={user.username}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-50"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-bold ring-4 ring-slate-50">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{user.username}</h3>
                      <p className="text-sm text-slate-500 truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteConfirm(user.id, 'user')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-medium"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                    Remove User
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400">No users found in the database.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">All Published Blogs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group flex flex-col sm:flex-row h-full">
                  <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden">
                    {blog.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${blog.image}`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <HiOutlineBookOpen className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {blog.category || "General"}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{blog.content}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-slate-600">By {blog.author || "Unknown"}</span>
                        <span>•</span>
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleDeleteConfirm(blog.id, 'blog')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-sm font-medium"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400">No blogs found in the database.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirm({ show: false, id: null, type: '' })}></div>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in fade-in duration-300">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <HiOutlineExclamation className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Are you sure?</h3>
            <p className="text-slate-500 text-center mb-8">
              This action cannot be undone. You are about to permanently delete this {deleteConfirm.type}.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Delete it
              </button>
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null, type: '' })}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold transition-all"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPanel;
