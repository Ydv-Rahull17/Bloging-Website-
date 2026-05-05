import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  const team = [
    {
      name: "RAHUL YADUVANSHI",
      role: "Frontend Developer",
      desc: "Passionate about creating engaging UI designs with a smooth user experience.",
      email: "rahulyaduvanshi@example.com",
      image: "/images/virat.webp",
    },
    {
      name: "VIVEK TIWARI",
      role: "Backend Developer",
      desc: "Focused on building secure and scalable web applications.",
      email: "vivektiwari@example.com",
      image: "/images/vivek.png.jpeg",
    },
    {
      name: "YUGMI KHAKHAR",
      role: "Designer",
      desc: "Expert in crafting visually appealing and intuitive designs.",
      email: "yugmikhakhar@example.com",
      image: "/images/shiva.jpg",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative bg-gray-700 text-white text-center py-16">
        <button
          className="absolute top-5 left-5 text-white text-2xl hover:text-gray-300"
          onClick={() => window.history.back()} // Going back to previous page
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-4xl font-bold">About Us Page</h1>
        <p className="mt-4 text-lg">Welcome to our blogging platform, where ideas come to life!</p>
        <p className="mt-2 text-lg">We are passionate about sharing knowledge, experiences, and stories.</p>
      </div>

      <h2 className="text-3xl font-bold text-center my-10">Our Team</h2>
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {team.map((member) => (
          <div
            key={member.name}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-80 transform transition duration-300 hover:scale-105"
          >
            <img src={member.image} alt={member.name} className="w-full h-60 object-cover" />
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-gray-600 font-semibold">{member.role}</p>
              <p className="mt-2 text-sm">{member.desc}</p>
              <p className="mt-2 text-sm">{member.email}</p>
              <Link
                to={`/contact?name=${encodeURIComponent(member.name)}`}
                className="block bg-black text-white rounded-md py-2 mt-4 hover:bg-gray-800 transition"
              >
                Contact
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
