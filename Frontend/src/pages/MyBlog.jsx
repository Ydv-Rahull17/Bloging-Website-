import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlinePlus, 
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineCollection
} from "react-icons/hi";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/blogs/user/${userId}`
        );
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBlogs();
    }
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Loading your masterpieces...</p>
    </div>
  );

  return (
    <div className="min-h-screen mesh-gradient-blue py-20 px-6 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">My Publications</h1>
            <p className="text-slate-500 mt-2 text-xl font-medium italic opacity-80">You have published {blogs.length} stories so far.</p>
          </div>
          <Link 
            to="/CreateBlog"
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white font-black px-10 py-5 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.05] shrink-0 active:scale-95 group"
          >
            <HiOutlinePlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            Create New Story
          </Link>
        </div>

      {blogs.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[2rem] border border-dashed border-slate-300 shadow-inner">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineBookOpen className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No stories yet</h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">Your creative journey starts here. Share your first story with the world today!</p>
          <Link 
            to="/CreateBlog"
            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
          >
            Start writing now <HiOutlinePlus />
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                {blog.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${blog.image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <HiOutlineBookOpen className="w-16 h-16 opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  {blog.category || "General"}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                      <HiOutlineCalendar className="w-4 h-4 text-blue-500/50" />
                      {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                      <HiOutlineCollection className="w-4 h-4 text-indigo-500/50" />
                      {Math.ceil(blog.content.split(' ').length / 200)} min read
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {blog.content}
                  </p>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-50">
                  <button
                    onClick={() => handleEdit(blog.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold py-3 rounded-2xl transition-all text-sm border border-transparent hover:border-blue-100"
                  >
                    <HiOutlinePencilAlt className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold py-3 rounded-2xl transition-all text-sm border border-transparent hover:border-red-100"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default MyBlog;
