import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeliveryHeader from "@/Components/DeliveryHeader";
import axios from "axios";

const Page = () => {
  const [myOrders, setMyOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getmyOrders();
  }, []);

  const getmyOrders = async () => {
    const deliveryData = JSON.parse(localStorage.getItem("delivery"));
    if(!deliveryData)return router.push("/Delivery/deliverypartner");

    try{
    const response = await axios.get(
      `/api/deliverypartners/orders-assign?driverId=${deliveryData._id}`
    );

    if (!response.ok) {
      console.error("Failed to fetch orders:", response.statusText);
      return; // Exit the function if there's an error
    }

    // const data = await response.json(); // Parse the JSON response

    if (response.data.success) {
      setMyOrders(response.data.orders);
    } else {
      console.error("Failed to fetch orders:", data.message);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem('delivery'));
    if (!delivery) {
      router.push("/Delivery/deliverypartner");
    }
  }, []);

  // const fetchAssignedOrders = async (driverId) => {
  //   const res = await axios.get(
  //     `/api/deliverypartners/orders-assign?driverId=${driverId}`
  //   );
  //   return res.data;
  // };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        "/api/deliverypartners/update-status",
        {
          orderId,
          status: newStatus,
        }
      );

      getmyOrders();
    
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div>
      <DeliveryHeader />
      <h1 className="p-20">My Order List</h1>
      {myOrders.map((item) => (
        <div key={item._id} className="restaurant-wrapper">
          <h4>Name: {item.userId.name}</h4>
          <div>Amount: {item.totalAmount}</div>
          <div>Address: {item.area}</div>
          <div>Status: {item.status}</div>
          <div>
            Update Status:
            <select
              onChange={(e) => handleStatusChange(item._id, e.target.value)}
            >
              <option>Confirmed</option>
              <option>On The Way</option>
              <option>Delivered</option>
              <option>Failed To Deliver</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
