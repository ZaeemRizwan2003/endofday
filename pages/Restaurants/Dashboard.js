// /pages/restaurant/dashboard.js
import { useEffect, useState } from "react";
import Navbar from "@/Components/Navbar";

export default function RestaurantDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const bakeryId = sessionStorage.getItem("userId"); // <-- Fetch from sessionStorage

        if (!bakeryId) {
          console.error("Bakery ID not found in session storage");
          return;
        }

        const res = await fetch(`/api/Restaurants/dashboard?bakeryId=${bakeryId}`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-purple-100 to-gray-100 p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-700">
          {stats?.bakeryName || "Bakery"} Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <DashboardCard title="Current Listings" value={stats.currentListings} icon="📋" />
          <DashboardCard title="Total Orders" value={stats.totalOrders} icon="🛒" />
          <DashboardCard title="Current Orders" value={stats.currentOrders} icon="⏳" />
          <DashboardCard title="Total Reviews" value={stats.totalReviews} icon="⭐" />
          <DashboardCard title="Total Earnings (PKR)" value={`Rs. ${stats.totalEarnings}`} icon="🇵🇰" />
          </div>
      </div>
    </>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transform transition duration-300 ease-in-out">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-gray-500 text-lg">{title}</div>
      <div className="text-3xl font-bold text-gray-900 mt-2">{value}</div>
    </div>
  );
}
