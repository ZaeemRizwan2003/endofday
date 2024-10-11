'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import RestaurantFooter from '../_components/RestaurantFooter';
import DeliveryHeader from '../_components/DeliveryHeader';

const Page = () => {
  const [myOrders, setMyOrders] = useState([]);
  const router = useRouter();


  useEffect(() => {
    getmyOrders()
  },[])
    const getmyOrders = async () => {
      const deliveryData = JSON.parse(localStorage.getItem('delivery'));
        let response = await fetch('http://localhost:3000/api/deliverypartners/orders/'+deliveryData._id);
        response = await response.json();
        if (response.success) {
          setMyOrders(response.result);
        } else {
          // Handle failure case
          console.error('Failed to fetch orders:', data.message);
        }}
     

  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem('delivery'));
    if (!delivery) {
      router.push('deliverypartner');
    }
  }, []);


  return (
    <div>
      <DeliveryHeader />
      <h1>My Order List</h1>
      {
        myOrders.map((item) => (
          <div className='restaurant-wrapper' >
            <h4>Name: {item.data.name}</h4>
            <div>Amount: {item.amount}</div>
            <div>Address: {item.data.area}</div>
            <div>Status: {item.status}</div>
            <div>
              Update Status:
              <select>
                <option>Confirmed</option>
                <option>On The Way</option>
                <option>Delivered</option>
                <option>Failed To Deliver</option>
              </select>
            </div>
          </div>
        ))
      }
      <RestaurantFooter />
    </div>
  );
}

export default Page;
