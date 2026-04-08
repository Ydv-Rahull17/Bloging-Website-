import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlinePencilAlt, 
  HiOutlineCloudUpload, 
  HiOutlineCheckCircle, 
  HiOutlineX,
  HiOutlineCollection,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineArrowLeft
} from "react-icons/hi";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: '', content: '', category: '', image: '' });
  const [preview, setPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "Technology", icon: "💻" },
    { value: "Lifestyle", icon: "✨" },
    { value: "Health", icon: "🌿" },
    { value: "Education", icon: "📚" },
    { value: "Travel", icon: "✈️" },
    { value: "Sports", icon: "🏆" }
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/blog-details/${id}`);
        setBlog(res.data);
        if (res.data.image) {
          setPreview(`http://localhost:5000/uploads/${res.data.image}`);
        }
      } catch (err) {
        console.error("Error fetching blog data:", err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('content', blog.content);
      formData.append('category', blog.category);
      if (blog.image instanceof File) {
        formData.append('image', blog.image);
      }

      const response = await axios.put(`http://localhost:5000/api/blogs/${id}`, formData);
      
      if (response.status === 200) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("❌ Error updating blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlog({ ...blog, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient-blue py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-lg hover:bg-white transition-all active:scale-95 text-slate-500 hover:text-blue-600"
            >
              <HiOutlineArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-outfit">Edit Publication</h1>
              <p className="text-slate-500 mt-1 text-lg font-medium opacity-80 max-w-md truncate">Refining: {blog.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Editing Mode</p>
                <p className="text-xs text-slate-400 font-medium italic">Changes will be saved to server</p>
             </div>
             <button 
                onClick={() => navigate(-1)}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all active:scale-90"
                title="Cancel editing"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Component */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden group transition-all hover:shadow-2xl hover:shadow-blue-500/5">
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 ml-1 mb-2 block uppercase tracking-[0.25em]">Post Title</label>
                    <input
                      type="text"
                      placeholder="Give your story a catchy heading..."
                      value={blog.title}
                      onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                      className="w-full bg-slate-50/20 border-b-2 border-slate-100 focus:border-blue-500 py-4 rounded-none focus:outline-none transition-all text-3xl font-black text-slate-800 placeholder:text-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-400 ml-1 mb-2 block uppercase tracking-[0.25em]">The Story Content</label>
                    <textarea
                      placeholder="Start refining your masterpiece..."
                      value={blog.content}
                      onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                      rows="14"
                      className="w-full bg-slate-50/30 border border-slate-100/50 p-6 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all text-lg leading-relaxed text-slate-700 resize-none shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <HiOutlineCheckCircle className="w-6 h-6" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar / Configuration */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 delay-150">
            {/* Category & Details */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/60 space-y-6">
              <h3 className="text-xl font-black text-slate-800 font-outfit">Configuration</h3>
              
              <div>
                <label className="text-[11px] font-black text-slate-400 ml-1 mb-3 block uppercase tracking-[0.25em]">Genre Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setBlog({ ...blog, category: cat.value })}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                        blog.category === cat.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm' 
                        : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-blue-200'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 ml-1 mb-3 block uppercase tracking-[0.25em]">Cover Artwork</label>
                <label className="relative flex flex-col items-center justify-center w-full bg-slate-50/30 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-6 cursor-pointer transition-all overflow-hidden backdrop-blur-sm group/img">
                  {preview ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                        <p className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-lg backdrop-blur-md">Change Artwork</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <HiOutlinePhotograph className="w-10 h-10 text-slate-300 group-hover/img:text-blue-500 transition-colors mb-2" />
                      <span className="text-slate-400 font-bold text-sm text-center">Click to upload new cover</span>
                    </>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Recommended: 1200x630px</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
               <h3 className="text-xl font-black mb-4 font-outfit">Post Info</h3>
               <div className="space-y-4 text-slate-400 text-sm font-medium">
                 <div className="flex justify-between">
                   <span>Post ID:</span>
                   <span className="text-blue-400">#{id.substring(0, 8)}...</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Visibility:</span>
                   <span className="text-green-400">Public</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Last Updated:</span>
                   <span className="text-slate-300">{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Draft'}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl border-white animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <HiOutlineCheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-3 font-outfit">Update Success!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed font-medium">Your changes have been reflected across the platform. Ready to head back?</p>
            <button
              onClick={() => navigate("/my-blog")}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              Back to My Blogs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBlog;

