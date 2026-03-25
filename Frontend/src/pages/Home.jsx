import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold font-poppins">Welcome to MSP-Blog</h1>
      <p className="mt-4">Explore the latest blogs and meet the creators.</p>
    </div>
  );
};
const TravelBlog = () => {
  return (
    <div className="flex flex-col  md:flex-row gap-10 p-8">
      <div className="w-full md:w-2/2">
        <div className="bg-white shadow-md p-5 rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-bold">Beautiful Beach</h2>
          <h5 className="text-gray-500">Title description, Dec 7, 2025</h5>
          <img
            src="/images/shivrajpure01.avif"
            alt="Beach"
            className="w-full h-64 object-cover rounded-lg mt-3 "
          />
          <p className="mt-2">Experience the serene beauty of the ocean.</p>
        </div>
        <div className="bg-white shadow-md p-5 rounded-lg mt-5 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-bold">Mountain Adventure</h2>
          <h5 className="text-gray-500">Title description, Sep 2, 2025</h5>
          <img
            src="/images/img1 (5).jpg"
            alt="Mountain"
            className="w-full h-64 object-cover rounded-lg mt-3"
          />
          <p className="mt-2">Explore the breathtaking mountain landscapes.</p>
        </div>
      </div>
      <div className="w-full md:w-1/6 flex flex-col gap-5">
        <div className="bg-white shadow-md p-5 rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-bold">About Me</h2>
          <a href="About.jsx">
            <img
              src="/images/aboutme.webp"
              alt="Profile"
              className="h-24 mx-auto rounded-lg mt-3"
            />
            <p className="mt-2 text-center">
              Traveler and blogger sharing the best destinations.
            </p>
          </a>
        </div>
        <div className="bg-white shadow-md p-5 rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-bold">Popular Posts</h2>
          <img
            src="/images/img1 (1).jpg"
            alt="Popular Post"
            className="w-full h-32 object-cover rounded-lg mt-3"
          />
          <p className="mt-2 text-center">
            Traveler and blogger sharing the best destinations.
          </p>
        </div>
        <div className="bg-white shadow-md p-5 rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xl font-bold">Follow Me</h2>
          <img
            src="/images/Follow.jpeg"
            alt="Popular Post"
            className="w-full h-32 object-cover rounded-lg mt-3"
          />
        </div>
      </div>
    </div>
  );
};

const data = [
  {
    title: "Cyber Security",
    author: "RAHUL YADUVANSHI",
    category: "Technology",
    image: "/images/tech_image.jpg",
    link : "/blog/1#/blog/1"
  },
  {
    title: "Virat Kohli",
    author: "RAHUL YADUVANSHI",
    category: "Sports",
    image: "/images/virat.webp",
    link:"/blog/1#/blog/1"
  },
  {
    title: "Plant-Based Food",
    author: "vivek tiwari",
    category: "Health",
    image: "/images/food.jpg",
    link: "/blog/1#/blog/1"
  },
  {
    title: "Plant-Based Food",
    author: "vivek tiwari",
    category: "Health",
    image: "/images/food.jpg",
    link: "/blog/1#/blog/1"
  },
];

const Card = ({ title, author, category, image, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-5 w-full md:w-1/5 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-60 object-cover rounded-lg "
      />
      <div className="mt-4">
        <span className="text-white text-sm px-3 py-1 rounded-full bg-red-500">
          #{category}
        </span>
        <h2 className="text-xl font-bold mt-2">{title}</h2>
        <p className="text-gray-600 mt-1">
          Explore more details about this topic.
        </p>
        <div className="flex items-center justify-center mt-3">
          <FaUser className="text-gray-600 mr-2" />
          <p className="text-gray-700">{author}</p>
        </div>
        <button
          className="mt-4 bg-green-500 text-white py-2 px-5 rounded-full shadow-md transform transition duration-300 hover:bg-red-600 hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Read More →
        </button>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const images = [
    "/images/img1 (2).jpg",
    "/images/img1 (3).jpg",
    "/images/img1 (5).jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[450px] overflow-hidden flex items-center">
      <button
        className="absolute left-4  text-white p-4 rounded-full shadow-lg z-10 "
        onClick={prevImage}
      >
        <IoIosArrowBack size={28} />
      </button>
      <img
        src={images[currentImage]}
        className="w-full h-full object-cover transition-opacity duration-1000"
        alt="Hero"
      />
      <button
        className="absolute right-4  text-white p-4 rounded-full shadow-lg z-10 "
        onClick={nextImage}
      >
        <IoIosArrowForward size={28} />
      </button>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center">
        <h1 className="font-bold text-5xl leading-tight font-poppins">
          Ideas, Stories & Insights That
          <br />
          Inspire
        </h1>
        <p className="lead text-xl mt-2">
          Dive into a world of creativity, knowledge, and thought-provoking
          discussions.
        </p>
        <p className="text-xl mt-2">
          <FaUser className="inline mr-2" /> By RAHUL YADUVANSHI
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [popularBlogs, setPopularBlogs] = useState([]);

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs/popular-blogs");
        setPopularBlogs(response.data || []);
      } catch (error) {
        console.error("Error fetching popular blogs:", error);
      }
    };

    fetchPopularBlogs();
  }, []);

  const displayedBlogs = popularBlogs.length > 0 ? popularBlogs : data;

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <HeroSection />
      <Home />
      <TravelBlog />
      <div className="text-center mt-8 mb-4">
        <h2 className="text-3xl font-bold">Popular Blogs</h2>
      </div>
      <div className="flex justify-center gap-6 mt-5 flex-wrap">
        {displayedBlogs.map((item, index) => {
          const link = item.link || `/blog-details/${item.id}`;
          const imageSrc = item.image
            ? item.image.startsWith("http")
              ? item.image
              : `http://localhost:5000/uploads/${item.image}`
            : "/images/tech_image.jpg";
          return (
            <Card
              key={item.id || index}
              title={item.title}
              author={item.author || item.username || "Unknown"}
              category={item.category || "General"}
              image={imageSrc}
              link={link}
            />
          );
        })}
      </div>
    </div>
  );
}
