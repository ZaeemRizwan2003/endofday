import React, { useState, useEffect } from "react";
import AdminLayout from "@/Components/AdminLayout";
import { FaUsers, FaUtensils, FaShoppingCart, FaBicycle, FaBlog } from "react-icons/fa";
import Chart from "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRiders: 0,
    totalBlogs: 0,
    lastMonthOrders: 0,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate.toISOString());
        if (endDate) params.append("endDate", endDate.toISOString());

        const response = await fetch(`/api/Admin/dashboardStats?${params.toString()}`);
        const data = await response.json();
        setStats(data);
        renderCharts(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }
    fetchStats();
  }, [startDate, endDate]);

  const renderCharts = (data) => {
    // Bar Chart for Orders
    const ctx = document.getElementById("ordersChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Total Orders", "Last Month Orders"],
        datasets: [
          {
            label: "Orders",
            data: [data.totalOrders, data.lastMonthOrders],
            backgroundColor: ["#4F46E5", "#818CF8"],
          },
        ],
      },
    });

    // Pie Chart for Customers vs Restaurants
    const ctxPie = document.getElementById("customersRestaurantsChart").getContext("2d");
    new Chart(ctxPie, {
      type: "pie",
      data: {
        labels: ["Customers", "Restaurants"],
        datasets: [
          {
            label: "Users vs Restaurants",
            data: [data.totalCustomers, data.totalRestaurants],
            backgroundColor: ["#34D399", "#60A5FA"],
          },
        ],
      },
    });
  };

  return (
    <AdminLayout>
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Stats</h1>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border border-gray-300 rounded-md p-2"
              placeholderText="Select Start Date"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border border-gray-300 rounded-md p-2"
              placeholderText="Select End Date"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<FaUsers className="text-green-500 text-4xl" />}
        />
        <StatCard
          title="Total Restaurants"
          value={stats.totalRestaurants}
          icon={<FaUtensils className="text-blue-500 text-4xl" />}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart className="text-yellow-500 text-4xl" />}
        />
        <StatCard
          title="Total Riders"
          value={stats.totalRiders}
          icon={<FaBicycle className="text-purple-500 text-4xl" />}
        />
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs}
          icon={<FaBlog className="text-red-500 text-4xl" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Orders Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h2>
          <canvas id="ordersChart"></canvas>
        </div>

        {/* Customers vs Restaurants Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Customers vs Restaurants</h2>
          <canvas id="customersRestaurantsChart"></canvas>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-2xl font-bold text-gray-600">{value}</p>
      </div>
    </div>
  );
}
