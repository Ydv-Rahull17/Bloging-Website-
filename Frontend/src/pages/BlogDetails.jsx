import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams for dynamic routing
import { FaHeart, FaRegComment, FaSun, FaMoon } from 'react-icons/fa';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton
} from 'react-share';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import axios from 'axios';

const BlogDetails = () => {
  const [blog, setBlog] = useState(null); // To store the fetched blog data
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
const user = JSON.parse(localStorage.getItem("user"));
  
  // Get the blog ID from the URL
  const { id } = useParams();

  // Fetch the blog data by ID when the component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Add a console log to debug the request
        console.log(`Fetching blog data for ID: ${id}`);
        const response = await axios.get(`http://localhost:5000/api/blogs/blog-details/${id}`);
        
        // Check if the response contains the expected data
        console.log('Response data:', response.data);
        
        if (response.data) {
          setBlog(response.data); // Set the fetched blog data
        } else {
          console.error('No data found for this blog');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        alert('Error loading blog. Please try again later.');
      }
    };

    fetchBlog();
  }, [id]);

  // Handle Like button
  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  // Handle Comment Submission
  const handleCommentSubmit = () => {4
    console.log(user)
    if (newComment.trim()) {
      const timestamp = new Date().toLocaleString();
      const newCommentObj = {
        text: newComment,
        timestamp,
        username: user.username 
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      console.log(comments)
    }
  };

  // Toggle Dark/Light Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Share URL & Title
  const shareUrl = window.location.href; 
  const title = blog ? blog.title : "Check out this amazing blog on MSPBlog!";

  if (!blog) {
    return <div>Loading...</div>; // Show loading text while fetching the blog data
  }

  return (
    <div className={`min-h-screen p-10 transition duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight">{blog.title}</h1>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 bg-blue-500 text-white px-5 py-3 rounded-full hover:bg-blue-600 transition transform hover:scale-105 shadow-lg"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />} 
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="flex items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <img
            src={blog.profile_image || '/images/user.png'}
            alt="Author"
            className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-lg"
          />
          <div>
            <p className="font-bold text-xl text-black">{blog.username || blog.author_name|| "unknown"}</p>
            <p className="text-sm text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-10">
          <img
            src={blog.blog_image} // Updated to use the correct image URL from backend
            alt={blog.title}
            className="w-full h-[600px] object-cover rounded-xl shadow-lg transition transform hover:scale-105"
          />
        </div>

        <div className={`mt-12 p-10 rounded-lg shadow-lg transition ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
          <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>
          <p className="leading-relaxed text-lg">{blog.content}</p>
        </div>

        <div className="flex justify-between items-center mt-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-3 text-2xl transition ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
          >
            <FaHeart />
            <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <div className="flex items-center gap-3 text-2xl text-gray-500">
            <FaRegComment />
            <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Leave a Comment</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`w-full p-4 border rounded-lg focus:outline-none shadow-md transition ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-600'}`}
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-lg"
            >
              Post
            </button>
          </div>
        </div>

        <ul className="mt-8 space-y-6">
          {comments.map((comment, index) => (
            <li
              key={index}
              className={`p-6 rounded-lg shadow-md transition transform hover:scale-105 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              <p className="font-bold">{comment.username}</p>
              <p className="text-sm text-gray-500">{comment.timestamp}</p>
              <p className="mt-3">{comment.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6">Share this blog</h3>
          <div className="flex gap-6">
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={50} round />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={50} round />
            </TwitterShareButton>

            <LinkedinShareButton url={shareUrl} title={title}>
              <LinkedinIcon size={50} round />
            </LinkedinShareButton>

            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={50} round />
            </WhatsappShareButton>

            <EmailShareButton url={shareUrl} subject={title} body="Check out this amazing blog!">
              <EmailIcon size={50} round />
            </EmailShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
