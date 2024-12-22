import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AdminLayout from "@/Components/AdminLayout";

export default function RiderDetails({ query }) {
  const { userId } = query;
  const [rider, setRider] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiderDetails = async () => {
      try {
        const response = await axios.get(`/api/Admin/Riders/getRiderDetails?userId=${userId}`);
        if (response.data.success) {
          setRider(response.data.rider);
          setOrders(response.data.orders);
        } else {
          console.error("Failed to fetch rider details");
        }
      } catch (error) {
        console.error("Error fetching rider details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRiderDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-12">
          <p className="text-lg text-gray-500 animate-pulse">Loading rider details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!rider) {
    return (
      <AdminLayout>
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600">Rider not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-6">
          <Link href="/Admin/ManageRiders/Manage-riders" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Riders
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Rider Details</h1>

        {/* Rider Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-2">{rider.name}</h2>
          <p><strong>Contact:</strong> {rider.contact}</p>
          <p><strong>Area:</strong> {rider.area}</p>
          <p><strong>City:</strong> {rider.city}</p>
          <p><strong>Total Orders:</strong> {orders.length}</p>
        </div>

        {/* Orders List */}
        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
        {orders.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Order Number</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Total Amount</th>
                  <th className="p-2 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">{order._id}</td>
                    <td className="p-2 border text-center">{order.status}</td>
                    <td className="p-2 border text-center">Rs. {order.totalAmount}</td>
                    <td className="p-2 border text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No orders found for this rider.</p>
        )}
      </div>
    </AdminLayout>
  );
}

RiderDetails.getInitialProps = async ({ query }) => {
  return { query };
};
