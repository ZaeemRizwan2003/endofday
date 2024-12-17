// AdminDashboard.js
import React from "react";
import Link from "next/link"; // Link component from Next.js for navigation

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Manage Restaurants"
          color="bg-blue-500"
          link="/Admin/Manage-restaurants"
        />
        <DashboardCard
          title="Manage Customers"
          color="bg-green-500"
          link="/manage-customers"
        />
        <DashboardCard
          title="Manage Delivery Riders"
          color="bg-yellow-500"
          link="/manage-delivery-riders"
        />
        <DashboardCard
          title="Manage Notification Requests"
          color="bg-purple-500"
          link="/Admin/RequestApproval"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, color, link }) {
  return (
    <Link href={link}>
      <div
        className={`p-8 ${color} text-white rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer`}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </Link>
  );
}
