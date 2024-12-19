import Navbar from "@/Components/HomeNavbar";
import React from "react";

const HomePage = () => {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section
        id="hero"
        className="hero section flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 via-pink-200 to-red-500 text-white"
      >
        <div className="container text-center">
          <h1 data-aos="fade-up" className="text-6xl font-extrabold mb-4">
            End of Day
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Reducing food waste while providing access to affordable, quality
            meals from local bakeries and restaurants.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-700 leading-8 mb-4">
                Restaurants, bakeries, and food suppliers often face the
                challenge of excess food inventory at the end of each business
                day, leading to waste and lost revenue.
              </p>
              <p className="text-lg text-gray-700 leading-8">
                Our platform connects businesses with customers who are looking
                for affordable, high-quality meals, allowing them to purchase
                surplus food at discounted prices.
              </p>
            </div>
            <div>
              <img
                src="https://www.theoddcoders.com/blogs-images/7-Best-Food-Delivery-Apps-870x520.jpg.webp"
                className="rounded shadow-lg h-50 w-100"
                alt="About Us"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="features section py-16 bg-gray-100 text-gray-800"
      >
        <div className="container" data-aos="fade-up">
          <h2 className="section-title text-4xl font-bold text-purple-800 mb-8">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-white rounded-lg shadow-lg p-6">
              <div className="icon text-purple-800 text-4xl mb-4">
                <i className="bi bi-recycle"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Promote sustainability by reducing food waste and benefiting the
                environment.
              </p>
            </div>
            <div className="card bg-white rounded-lg shadow-lg p-6">
              <div className="icon text-purple-800 text-4xl mb-4">
                <i className="bi bi-wallet2"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Affordability</h3>
              <p className="text-gray-600">
                Access high-quality meals at discounted prices and save money.
              </p>
            </div>
            <div className="card bg-white rounded-lg shadow-lg p-6">
              <div className="icon text-purple-800 text-4xl mb-4">
                <i className="bi bi-star"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-gray-600">
                Benefit from transparent user reviews and ratings to make
                informed choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="problem section py-16 bg-white">
        <div className="container" data-aos="fade-up">
          <h2 className="section-title text-4xl font-bold text-purple-800 mb-8">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-8 mb-8">
            Every day, bakeries, cafes, and restaurants waste large amounts of
            food because of unsold and surplus products. This leads to
            financial losses and environmental harm. Additionally, consumers
            miss out on high-quality, affordable food options because of time
            constraints or lack of access. Our platform bridges this gap.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="testimonials section py-16 bg-gray-100"
      >
        <div className="container" data-aos="fade-up">
          <h2 className="section-title text-4xl font-bold text-purple-800 mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="testimonial bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "This platform is a game changer! I've saved so much money
                while enjoying delicious meals."
              </p>
              <h4 className="text-purple-800 font-bold">- Jane Doe</h4>
            </div>
            <div className="testimonial bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "I'm glad to support sustainability while getting access to
                amazing food options."
              </p>
              <h4 className="text-purple-800 font-bold">- John Smith</h4>
            </div>
            <div className="testimonial bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "This app has helped our bakery reduce waste and increase
                revenue!"
              </p>
              <h4 className="text-purple-800 font-bold">- Bakery Owner</h4>
            </div>
          </div>
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
