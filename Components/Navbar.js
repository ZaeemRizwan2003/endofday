import React, { useState } from "react";
import Link from "next/link";
import { FaUser, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";

const DashNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false); // State for user account menu
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/Restaurants/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                router.push('/Restaurants/RLogin');
            } else {
                console.error('Logout failed: ', await response.json());
            }
        }
        catch (error) {
            console.error("An error occured during logout:", error);
        }
        setIsAccountMenuOpen(false);

    };

    return (
        <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 ">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link href="/Restaurants/RDashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/mainlogo.png" className="h-8" alt="Logo" />
                </Link>

                {/* Buttons and icons */}
                <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">


                    {/* User Account Menu */}
                    <FaUser
                        className="pl-2 mt-1 w-8 h-8 text-purple-800 cursor-pointer"
                        onClick={() => setIsAccountMenuOpen(true)}
                    />

                    {/* Account Menu */}
                    {isAccountMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsAccountMenuOpen(false)}
                        >
                            <div
                                className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4"
                                onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking inside it
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Account Menu</h2>
                                    <FaTimes
                                        className="w-6 h-6 text-gray-500 cursor-pointer"
                                        onClick={() => setIsAccountMenuOpen(false)}
                                    />
                                </div>
                                <ul className="mt-4">
                                    <li className="mb-3">
                                        <button
                                            className="text-purple-700 hover:underline"
                                            onClick={() => router.push("/Restaurants/RAccount")}
                                        >
                                            Account Information
                                        </button>
                                    </li>
                                    <li className="mb-3">
                                        <button
                                            className="text-purple-700 hover:underline"
                                            onClick={() => router.push("/Restaurants/Change-Password")}
                                        >
                                            Change Password
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Mobile menu toggle button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
                        aria-controls="navbar-sticky"
                        aria-expanded={isMenuOpen ? "true" : "false"}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>

                {/* Main navigation menu, hidden on mobile */}
                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? "block" : "hidden"}`}
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 " aria-current="page">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default DashNav;
