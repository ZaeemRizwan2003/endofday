import React, { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUtensils,
  FaUsers,
  FaBicycle,
  FaBlog,
  FaBell,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: <FaHome />,
      link: "/Admin/AdminDashboard",
    },
    {
      id: "manageRestaurants",
      label: "Manage Restaurants",
      icon: <FaUtensils />,
      link: "/Admin/ManageRestaurants/Manage-restaurants",
    },
    {
      id: "manageCustomers",
      label: "Manage Customers",
      icon: <FaUsers />,
      link: "/Admin/ManageCustomers/Manage-customers",
    },
    {
      id: "manageRiders",
      label: "Manage Riders",
      icon: <FaBicycle />,
      link: "/Admin/ManageRiders/manage-delivery-riders",
    },
    {
      id: "manageBlogs",
      label: "Manage Blogs",
      icon: <FaBlog />,
      link: "/Admin/Blogs/ManageBlogs",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />,
      link: "/Admin/Notification/RequestApproval",
    },
    {
      id: "approve bakery requests",
      label: "approve bakery requests",
      link: "/Admin/ManageRestaurants/approve",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-purple-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && (
            <h2 className="text-xl text-white font-bold">Admin Panel</h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none"
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link legacyBehavior key={item.id} href={item.link}>
              <a
                className={`flex items-center p-4 hover:bg-purple-700 transition ${
                  isSidebarOpen ? "justify-start" : "justify-center"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="ml-4 text-sm font-medium">{item.label}</span>
                )}
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-md p-1 flex justify-between items-center pl-3 pr-3">
          <h1 className="text-2xl font-bold text-gray-800 mt-3">
            Admin Dashboard
          </h1>
          <div className="flex space-x-4">
            <Link legacyBehavior href="/">
              <a className="text-blue-600 hover:text-blue-800">Go to Website</a>
            </Link>
            <Link legacyBehavior href="/Admin/Profile">
              <a className="text-gray-600 hover:text-gray-800">Profile</a>
            </Link>
            <Link legacyBehavior href="/Admin/Settings">
              <a className="text-gray-600 hover:text-gray-800">Settings</a>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
