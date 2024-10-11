import Navbar from '@/Components/HomeNavbar';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const FoodEducation = () => {
  const [isExpanded, setIsExpanded] = useState(false); // state to track content visibility

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-6'>
        <h1 className='text-4xl font-bold text-center mb-8 mt-20'>Food Education and Blogs</h1>

        {/* Section FE-1: Educational Content */}
        <section className='mb-12'>
          <h2 className='text-3xl font-semibold mb-4'>Learn About Food</h2>
          <p className='text-gray-700 mb-6'>
            Get access to various articles, videos, and infographics on topics like nutrition, cooking tips, and food safety.
          </p>

          {/* Conditionally render entire content */}
          {isExpanded ? (
            <>
              {/* Nutrition Section */}
              <div className='mb-12'>
                <h3 className='text-2xl font-semibold mb-4'>Nutrition</h3>

                {/* Article with preview */}
                <article className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>Understanding Macronutrients and Micronutrients</h4>
                  <p className='text-gray-600 mb-4'>
                    Macronutrients, which include carbohydrates, proteins, and fats, are the primary sources of energy for our bodies. Each plays a crucial role:
                  </p>
                  <ul className='list-disc list-inside'>
                    <li><strong>Carbohydrates:</strong> Our body's main energy source.</li>
                    <li><strong>Proteins:</strong> Essential for tissue growth and repair.</li>
                    <li><strong>Fats:</strong> Vital for hormone production and nutrient absorption.</li>
                  </ul>
                  <p className='text-gray-600 mt-4'>
                    Micronutrients like vitamins and minerals, though required in smaller amounts, are key to overall health. For instance, <strong>Vitamin D</strong> helps maintain healthy bones, and <strong>Iron</strong> supports the creation of red blood cells.
                  </p>
                </article>

                {/* Infographic */}
                <div className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>Daily Nutritional Guidelines</h4>
                  <Image src="https://th.bing.com/th/id/OIG1.lx86Zj3ySHU0iHRXwRe9?w=270&h=270&c=6&r=0&o=5&dpr=1.5&pid=ImgGn" alt="Nutritional Guidelines Infographic" width={300} height={200} />
                  <p className='text-gray-600 mt-2'>This infographic shows recommended daily servings for proteins, fruits, vegetables, grains, and dairy, along with hydration tips.</p>
                </div>

                {/* Video */}
                <div className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>Balancing Your Plate: Simple Nutritional Tips</h4>
                  <iframe
                    className='w-full md:w-96 h-56'
                    src="https://www.youtube.com/embed/8O1awvhACZ4"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                  </iframe>
                  <p className='text-gray-600 mt-2'>Watch this video to learn how to create a balanced meal that includes all essential food groups for optimal health.</p>
                </div>
              </div>

              {/* Cooking Tips Section */}
              <div className='mb-12'>
                <h3 className='text-2xl font-semibold mb-4'>Cooking Tips</h3>

                {/* Article */}
                <article className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>5 Essential Cooking Techniques Every Home Chef Should Know</h4>
                  <ul className='list-disc list-inside'>
                    <li><strong>Sautéing:</strong> Cooking food quickly in a small amount of oil. Great for vegetables and small cuts of meat.</li>
                    <li><strong>Roasting:</strong> Slow-cooking food in the oven to develop rich flavors. Ideal for meats and root vegetables.</li>
                    <li><strong>Blanching:</strong> Briefly boiling food before submerging it in ice water to preserve color and texture.</li>
                    <li><strong>Grilling:</strong> Cooking food over an open flame or grill pan to achieve smoky flavors.</li>
                    <li><strong>Braising:</strong> Slow-cooking food in a small amount of liquid.</li>
                  </ul>
                </article>

                {/* Infographic */}
                <div className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>Common Cooking Methods & Their Benefits</h4>
                  <Image src="https://th.bing.com/th/id/OIG3.1A56SUIQM9ryEgOjheaU?w=270&h=270&c=6&r=0&o=5&dpr=1.5&pid=ImgGn" alt="Common Cooking Methods Infographic" width={300} height={200} />
                  <p className='text-gray-600 mt-2'>A quick visual guide to cooking methods like grilling, steaming, frying, and poaching.</p>
                </div>

                {/* Video */}
                <div className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>Kitchen Basics: Knife Skills for Beginners</h4>
                  <iframe
                    className='w-full md:w-96 h-56'
                    src="https://www.youtube.com/embed/msEg_9RACVY"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                  </iframe>
                  <p className='text-gray-600 mt-2'>Master essential knife skills to improve your efficiency and safety in the kitchen.</p>
                </div>
              </div>

              {/* Food Safety Section */}
              <div className='mb-12'>
                <h3 className='text-2xl font-semibold mb-4'>Food Safety</h3>

                {/* Article */}
                <article className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>The Importance of Proper Food Handling and Storage</h4>
                  <ul className='list-disc list-inside'>
                    <li><strong>Cross-Contamination:</strong> Always use separate cutting boards for raw meats and vegetables to prevent bacteria spread.</li>
                    <li><strong>Temperature Danger Zone:</strong> Food should be kept at temperatures below 40°F (4°C) or above 140°F (60°C) to prevent bacterial growth.</li>
                    <li><strong>Storage:</strong> Use airtight containers for storing leftovers, and label them with the date to ensure food is consumed before it spoils.</li>
                  </ul>
                </article>

                {/* Infographic */}
                <div className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>Safe Food Temperatures for Cooking & Storage</h4>
                  <Image src="https://th.bing.com/th/id/OIG4.yXfYBeeAB6LkHfVB5uL3?w=270&h=270&c=6&r=0&o=5&dpr=1.5&pid=ImgGn" alt="Safe Food Temperatures Infographic" width={300} height={200} />
                  <p className='text-gray-600 mt-2'>This infographic illustrates the correct internal cooking temperatures for meats and other perishable foods.</p>
                </div>

                {/* Video */}
                <div className='mb-8'>
                  <h4 className='text-xl font-semibold mb-2'>Preventing Cross-Contamination in the Kitchen</h4>
                  <iframe
                    className='w-full md:w-96 h-56'
                    src="https://www.youtube.com/embed/_Kj21r6C1vI"
                    title="Cross contamination"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                  </iframe>
                  <p className='text-gray-600 mt-2'>Learn simple strategies to keep your kitchen safe from harmful bacteria and viruses.</p>
                </div>
              </div>
            </>
          ) : (
            <p className='text-gray-600 mb-4'>
              Explore our rich content on nutrition, cooking tips, and food safety. Read more to access articles, videos, and infographics.
            </p>
          )}

          {/* Toggle button */}
          <button
            onClick={toggleContent}
            className={`text-blue-600 font-semibold py-2 px-4 rounded-lg 
              transition-all duration-300 ease-in-out transform hover:scale-105 
              hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 
              focus:ring-opacity-50`}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>

        </section>

        {/* Section FE-2: Blog Section */}
        <section className='bg-gray-100 py-12'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>Our Blog</h2>

          <div className='space-y-8 max-w-4xl mx-auto'>
            <article className='bg-white shadow-md rounded-lg p-6'>
              <h3 className='text-2xl font-semibold text-gray-700 mb-4'>Updates</h3>
              <p className='text-gray-600'>
                Stay tuned for our latest offerings, from new products to seasonal treats.
              </p>
            </article>
            <article className='bg-white shadow-md rounded-lg p-6'>
              <h3 className='text-2xl font-semibold text-gray-700 mb-4'>Collaborations</h3>
              <p className='text-gray-600'>
                We are thrilled to announce our new partnership with <em className='font-semibold text-gray-800'>Artisan Bakery</em>, known for its organic, handcrafted pastries. Starting next week, you can enjoy their premium cakes and breads at unbeatable prices. Keep an eye on our blog for exclusive interviews with bakers, behind-the-scenes content, and upcoming partnerships!
              </p>
            </article>

            <article className='bg-white shadow-md rounded-lg p-6'>
              <h3 className='text-2xl font-semibold text-gray-700 mb-4'>Achievements</h3>
              <p className='text-gray-600'>
                We've hit a milestone! Over 100,000 items sold from top bakeries, helping you enjoy high-quality products while reducing food waste. Thanks to our loyal customers and partners for making this possible.
              </p>
            </article>

            <article className='bg-white shadow-md rounded-lg p-6'>
              <h3 className='text-2xl font-semibold text-gray-700 mb-4'>Industry News</h3>
              <p className='text-gray-600'>
                Did you know the bakery industry is focusing more on sustainability? Learn how our partner cafes are adopting eco-friendly packaging and practices, like composting and reducing carbon footprints, while we continue to offer their delicious items at a discount.
              </p>
            </article>
          </div>
        </section>


        {/* Section FE-3: Allergens and Nutrition Info */}
        <section className='bg-gray-100 py-12 px-4'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-4'>Allergens and Nutrition Facts</h2>
          <p className='text-lg text-center text-gray-600 mb-8'>
            Find information on common allergens, dietary restrictions, and nutritional facts for various food items.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
            <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col'>
              <h4 className='text-xl font-semibold text-gray-800 mb-2'>Gluten-Free</h4>
              <p className='text-gray-600'>
                Many of our bakery products contain gluten, but we also offer gluten-free options from select cafes. Check out our gluten-free alternatives for customers with gluten intolerance.
              </p>
            </div>

            <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col'>
              <h4 className='text-xl font-semibold text-gray-800 mb-2'>Nut Allergies</h4>
              <p className='text-gray-600'>
                We categorize products based on allergens. If you have a nut allergy, rest assured you can safely enjoy our nut-free options by checking our nut-free labels.
              </p>
            </div>

            <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col'>
              <h4 className='text-xl font-semibold text-gray-800 mb-2'>Nutritional Facts</h4>
              <p className='text-gray-600'>
                Each product comes with a detailed breakdown of calories, fats, proteins, and sugars, so you can make informed choices while enjoying your favorite treats.
              </p>
            </div>
          </div>
        </section>


        {/* Section FE-4: Food Storage and Waste Reduction */}
        <section className='bg-gray-100 py-12 px-4'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>Sustainability and Food Waste</h2>
          <p className='text-lg text-center text-gray-600 mb-8'>
            Learn about food storage tips, shelf life, and best practices to reduce food waste and promote responsible consumption.
          </p>

          <div className='space-y-8 max-w-4xl mx-auto'>
            <article className='bg-white shadow-md rounded-lg p-6'>
              <h3 className='text-2xl font-semibold text-gray-700 mb-4'>Storage Tips</h3>
              <p className='text-gray-600'>
                Keep bread fresh for up to 2 days in a paper bag at room temperature or freeze for longer storage. Cakes with buttercream can last up to 5 days in the fridge, or be frozen in airtight containers.
              </p>
            </article>

            <article className='bg-white shadow-md rounded-lg p-6'>
              <h3 className='text-2xl font-semibold text-gray-700 mb-4'>Shelf Life</h3>
              <p className='text-gray-600'>
                Our product listings include shelf life details so you can plan your purchases wisely. For example, sourdough bread lasts up to 5 days, while cookies can last up to a week if stored properly.
              </p>
            </article>

            <article className='bg-white shadow-md rounded-lg p-6'>
              <h3 className='text-2xl font-semibold text-gray-700 mb-4'>Minimizing Food Waste</h3>
              <p className='text-gray-600'>
                Use stale bread for homemade croutons, bread pudding, or repurpose pastries by reheating or creating layered desserts to avoid waste.
              </p>
            </article>
          </div>
        </section>

      </div>
    </>
  );
};

export default FoodEducation;
