import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/Customer/restaurants')
      .then(res => {
        setRestaurants(res.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      });
  }, []);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {restaurants.map(restaurant => (
        <Link key={restaurant._id} href={`/Customer/restaurant/${restaurant._id}`}>
        <div key={restaurant._id} className="border p-4 rounded cursor-pointer">
            <img src={restaurant.image} alt="restaurant image" className='w-full h-40 object-cover mb-2'/>
          <h2 className="text-xl font-bold">{restaurant.restaurantName}</h2>
          <p><strong>Location:</strong> {restaurant.address}</p>
          <p><strong>Description:</strong> {restaurant.description}</p>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default Restaurants;
