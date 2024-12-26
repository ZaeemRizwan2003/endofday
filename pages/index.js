import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/Components/HomeNavbar';
import axios from 'axios';

export default function HomePage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const restaurantId = '6763e9dcbaa80cbd274e04fc'; 
    axios
    .get(`/api/Customer/restaurantreviews?restaurantId=${restaurantId}`)
      .then((response) => {
        setReviews(response.data.reviews);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  return (
    <div className="bg-cover bg-center min-h-screen text-gray-900" >
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center"style={{ backgroundImage: 'url(/freepik__expand__83854.png)' }}>
        <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
          <h2 className="text-5xl font-bold text-white mb-4 animate-fadeIn">Affordable and Delicious Meals Delivered</h2>
          <p className="text-white text-lg mb-6 animate-fadeIn">Experience the taste of fresh and fast food delivery.</p>
          <a href="/Login" className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all">Explore Menu</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-100 py-12">
        <h3 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12">
          <div className="p-6 bg-white shadow-lg rounded-lg text-center transform hover:scale-105 transition-all">
            <h4 className="text-xl font-bold mb-2">Reducing Food Waste</h4>
            <p>We prioritize optimizing food resources to minimize waste and promote sustainability.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg text-center transform hover:scale-105 transition-all">
            <h4 className="text-xl font-bold mb-2">Affordable Meals</h4>
            <p>Quality meals at prices that everyone can afford without compromising taste or quality.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg text-center transform hover:scale-105 transition-all">
            <h4 className="text-xl font-bold mb-2">Sustainable Practices</h4>
            <p>We employ eco-friendly practices at every stage of our operations.</p>
          </div>
        </div>
      </section>

      {/* Popular Partners */}
      <section id="menu" className="bg-purple-50 py-12">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-8">Our Popular Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['partner1.jpg', 'partner2.jpg', 'partner3.png', 'partner4.jpg'].map((partner, index) => (
              <div key={index} className="p-4 bg-white shadow-lg rounded-lg text-center hover:shadow-xl transition-all">
                <div className="w-[300px] h-[200px] mx-auto overflow-hidden rounded-lg">
                  <Image src={`/${partner}`} alt={`Partner ${index + 1}`} width={300} height={200} layout="responsive" objectFit="cover" />
                </div>
                <h4 className="text-xl font-bold mt-4">Partner {index + 1}</h4>
                <p className="text-gray-600">Trusted by top food providers.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-100 py-12">
        <h3 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h3>
        <div className="flex flex-col md:flex-row gap-6 justify-center px-12">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="p-4 bg-white shadow-md rounded-md">
                <p>"{review.review}"</p>
                <p className="font-bold mt-2">- {review.userName}</p>
                <p className="text-yellow-500">Rating: {review.rating} ★</p>
              </div>
            ))
          ) : (
            <p className="text-center">No reviews available yet.</p>
          )}
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="bg-purple-50 py-12">
        <h3 className="text-3xl font-bold text-center mb-8">Customer Support</h3>
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-6">Need help? Our support team is available 24/7 to assist you with any inquiries or issues.</p>
          <a href="/CustomerSupport/Contact" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all">Contact Support</a>
        </div>
      </section>
    </div>
  );
}
