import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const currentUser = JSON.parse(localStorage.getItem("currentUser")); // assuming login info is stored like this
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };

    fetchBlogs();

    const savedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${userId}`)) || [];
    setBookmarks(savedBookmarks);
  }, [userId]);

  const toggleBookmark = (blog) => {
    let updatedBookmarks;
    const isBookmarked = bookmarks.some((b) => b.id === blog.id);

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((b) => b.id !== blog.id);
    } else {
      updatedBookmarks = [...bookmarks, blog];
    }

    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updatedBookmarks));
  };

  const filteredBlogs = blogs
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedCategory === "All" || item.category === selectedCategory
    );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Explore Blogs</h1>
        <Link
          to="/saved-blogs"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          View Saved Blogs
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {["All", ...new Set(blogs.map((blog) => blog.category).filter(Boolean))].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-blue-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 relative"
          >
            <Link to={`/blog/${blog.id}`}>
              <img
                src={`http://localhost:5000/uploads/${blog.image}`}
                alt={blog.title}
                className="w-full h-52 object-cover rounded-t-lg"
              />
              <div className="p-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">{blog.title}</h3>
                  <span className="text-sm text-gray-500 italic">
                    by {blog.author_name || "Unknown"}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-3">{blog.content}</p>
                <div className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm inline-block">
                  {blog.category || "General"}
                </div>
              </div>
            </Link>

            <button
              onClick={() => toggleBookmark(blog)}
              className="absolute top-4 right-4 text-2xl"
            >
              {bookmarks.some((b) => b.id === blog.id) ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FaRegBookmark className="text-gray-500" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`mx-2 px-4 py-2 rounded-lg ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
