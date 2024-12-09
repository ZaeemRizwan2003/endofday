import Navbar from "@/Components/HomeNavbar";
import React from "react";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-800">
        {/* Hero Section */}
        <section className="relative w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-pink-200 to-red-500 text-white">
          <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
            End of Day
          </h1>
          <p className="text-xl mb-8 text-center max-w-2xl animate-fadeInDown">
            Reducing food waste while providing you access to affordable,
            quality meals from local bakeries and restaurants.
          </p>
          <a
            href="/about"
            className="bg-white text-purple-800 py-3 px-8 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition duration-300 animate-bounce"
          >
            Learn More
          </a>
        </section>

        {/* About Us Section */}
        <div className="pl-12 pr-12">
          <section
            id="about"
            className="container w-100 p-10 mt-16 bg-white shadow-lg rounded-lg animate-fadeInRight"
          >
            <h2 className="text-4xl font-bold text-purple-800 mb-6 flex items-center">
              <i className="fas fa-utensils mr-2"></i> Who are we?
            </h2>
            <p className="text-lg text-gray-700 leading-8 mb-4">
              Restaurants, bakeries, and food suppliers often face the challenge
              of excess food inventory at the end of each business day, leading to
              waste and lost revenue. Our platform connects these businesses with
              customers who are looking for affordable, high-quality meals,
              allowing them to purchase surplus food at discounted prices.
            </p>
            <p className="text-lg text-gray-700 leading-8">
              We aim to reduce food waste, help businesses recover from financial
              loss, and provide customers with easy access to discounted meals,
              all while promoting environmental sustainability.
            </p>
          </section>


          {/* Problem Statement */}
          <section className="container mx-auto p-10 mt-16 bg-gray-100 rounded-lg shadow-lg animate-fadeInLeft">
            <h2 className="text-4xl font-bold text-purple-800 mb-6 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i> What we do?
            </h2>
            <p className="text-lg text-gray-700 leading-8 mb-4">
              Every day, bakeries, cafes, and restaurants waste large amounts of
              food because of unsold and surplus products. This leads to financial
              losses and environmental harm. Additionally, consumers miss out on
              high-quality, affordable food options because of time constraints or
              lack of access. Our platform addresses both of these issues by
              connecting businesses with consumers in need of discounted meals.
            </p>
          </section>

          {/* Solution Objectives */}
          <section className="container mx-auto p-10 mt-16 bg-white rounded-xl shadow-lg animate-fadeInUp">
            <h2 className="text-4xl font-bold text-purple-800 mb-6 flex items-center">
              <i className="fas fa-lightbulb mr-2"></i> How we do?
            </h2>
            <p className="text-lg text-gray-700 leading-8 mb-4">
              Our platform offers a comprehensive solution to the problem of food
              waste in the food service industry:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 leading-8 mb-4 space-y-2">
              <li>
                <i className="fas fa-recycle mr-2"></i> Optimize surplus food by
                providing suppliers with a platform to sell excess inventory.
              </li>
              <li>
                <i className="fas fa-bell mr-2"></i> Improve access to affordable
                food for customers with personalized recommendations and real-time
                notifications.
              </li>
              <li>
                <i className="fas fa-star mr-2"></i> Enable user reviews and
                ratings to increase transparency and trust.
              </li>
              <li>
                <i className="fas fa-leaf mr-2"></i> Promote sustainability in the
                food service sector and reduce environmental waste.
              </li>
              <li>
                <i className="fas fa-cogs mr-2"></i> Create a user-friendly
                platform that adapts to the needs of the industry.
              </li>
            </ul>
          </section>

          {/* Key Objectives Grid */}
          <section className="container mx-auto p-10 mt-16 bg-gray-50">
            <h2 className="text-4xl font-bold text-purple-800 mb-6 text-center">
              Our goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 shadow-md rounded-lg text-center transform hover:scale-105 transition duration-300">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center justify-center">
                  <i className="fas fa-globe mr-2"></i> Environmental
                </h3>
                <p className="text-lg text-gray-700">
                  Reduce excessive food by 20% and promote sustainable practices
                  in one year.
                </p>
              </div>
              <div className="bg-white p-8 shadow-md rounded-lg text-center transform hover:scale-105 transition duration-300">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center justify-center">
                  <i className="fas fa-users mr-2"></i> Social
                </h3>
                <p className="text-lg text-gray-700">
                  Increase access to affordable food, help reduce food insecurity,
                  and provide special discounts to differently-abled individuals.
                </p>
              </div>
              <div className="bg-white p-8 shadow-md rounded-lg text-center transform hover:scale-105 transition duration-300">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center justify-center">
                  <i className="fas fa-chart-line mr-2"></i> Economic
                </h3>
                <p className="text-lg text-gray-700">
                  Help businesses recover revenue by selling surplus food and
                  increasing customer traffic.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <section className="container mx-auto p-10 text-center mt-16 bg-purple-300 text-white rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold mb-4 animate-pulse">
            Join Us in Optimizing Food Intake
          </h2>
          <p className="text-lg mb-8">
            Together, we can create a more sustainable, affordable, and
            efficient food industry. Sign up today to get started!
          </p>
          <a
            href="/Customer/Signup"
            className="bg-white text-purple-800 py-3 px-8 rounded-full font-semibold hover:bg-gray-100 transition duration-300 animate-bounce"
          >
            Get Started
          </a>
        </section>
      </div>
    </>
  );
};

export default HomePage;