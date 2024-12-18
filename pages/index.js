import Navbar from "@/Components/HomeNavbar";
import React from "react";

const HomePage = () => {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section
        id="hero"
        className="hero section light-background flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 via-pink-200 to-red-500 text-white"
      >
        <div className="container text-center">
          <h1 data-aos="fade-up" className="text-6xl font-extrabold mb-4">
            End of Day
          </h1>
          <p data-aos="fade-up" data-aos-delay="100" className="text-xl mb-8 max-w-2xl mx-auto">
            Reducing food waste while providing you access to affordable,
            quality meals from local bakeries and restaurants.
          </p>
          <a
            href="/about"
            className="btn-get-started bg-white text-purple-800 py-3 px-8 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition duration-300"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about section py-16 bg-white">
        <div className="container" data-aos="fade-up">
          <h2 className="section-title text-4xl font-bold text-purple-800 mb-8">
            Who Are We?
          </h2>
          <div className="row">
            <div className="col-lg-7" data-aos="fade-up" data-aos-delay="100">
              <p className="text-lg text-gray-700 leading-8 mb-4">
                Restaurants, bakeries, and food suppliers often face the
                challenge of excess food inventory at the end of each business
                day, leading to waste and lost revenue. Our platform connects
                these businesses with customers who are looking for affordable,
                high-quality meals, allowing them to purchase surplus food at
                discounted prices.
              </p>
              <p className="text-lg text-gray-700 leading-8">
                We aim to reduce food waste, help businesses recover from
                financial loss, and provide customers with easy access to
                discounted meals, all while promoting environmental
                sustainability.
              </p>
            </div>
            <div className="col-lg-5" data-aos="fade-up" data-aos-delay="250">
              <img
                src="/assets/img/about.jpg"
                className="img-fluid rounded shadow-lg"
                alt="About Us"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section
        id="problem"
        className="problem section py-16 bg-gray-100"
      >
        <div className="container" data-aos="fade-up">
          <h2 className="section-title text-4xl font-bold text-purple-800 mb-8">
            What We Do
          </h2>
          <p className="text-lg text-gray-700 leading-8 mb-4">
            Every day, bakeries, cafes, and restaurants waste large amounts of
            food because of unsold and surplus products. This leads to
            financial losses and environmental harm. Additionally, consumers
            miss out on high-quality, affordable food options because of time
            constraints or lack of access. Our platform addresses both of these
            issues by connecting businesses with consumers in need of
            discounted meals.
          </p>
        </div>
      </section>

      {/* Solution Objectives */}
      <section id="solution" className="solution section py-16 bg-white">
        <div className="container" data-aos="fade-up">
          <h2 className="section-title text-4xl font-bold text-purple-800 mb-8">
            How We Do It
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-8 mb-4 space-y-4">
            <li>
              <i className="bi bi-recycle mr-2"></i> Optimize surplus food by
              providing suppliers with a platform to sell excess inventory.
            </li>
            <li>
              <i className="bi bi-bell mr-2"></i> Improve access to affordable
              food for customers with personalized recommendations and
              real-time notifications.
            </li>
            <li>
              <i className="bi bi-star mr-2"></i> Enable user reviews and
              ratings to increase transparency and trust.
            </li>
            <li>
              <i className="bi bi-leaf mr-2"></i> Promote sustainability in
              the food service sector and reduce environmental waste.
            </li>
            <li>
              <i className="bi bi-cogs mr-2"></i> Create a user-friendly
              platform that adapts to the needs of the industry.
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="cta"
        className="cta section py-16 bg-purple-500 text-white text-center"
      >
        <div className="container" data-aos="zoom-in">
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
        </div>
      </section>
    </>
  );
};

export default HomePage;
