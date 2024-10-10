import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.log("token decoding failed", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        <Link href="/" className="flex items-center rtl:space-x-reverse">
          <img src="/mainlogo.png" className="h-8" alt="Logo" />
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-1 rtl:space-x-reverse">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                className="text-white bg-purple-700 hover:bg-purple-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-purple-700 dark:hover:bg-purple-400 dark:focus:ring-blue-200"
                onClick={handleLogout}
              >
                Logout
              </button>
              <div className="flec items-center">
                <p className="text-black font-medium">
                  {user?.email || "Account"}
                </p>
              </div>
            </>
          ) : (
            <>
              <Link href="/Customer/Clogin" legacyBehavior>
                <button
                  type="button"
                  className="text-white bg-purple-700 hover:bg-purple-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-purple-700 dark:hover:bg-purple-400 dark:focus:ring-blue-200"
                >
                  Login
                </button>
              </Link>

              <Link href="/Customer/Csignup" legacyBehavior>
                <button
                  type="button"
                  className=" text-white bg-purple-700 hover:bg-purple-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-purple-700 dark:hover:bg-purple-400 dark:focus:ring-blue-200"
                >
                  Signup
                </button>
              </Link>
            </>
          )}


          <button
            onClick={toggleMenu}
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-black dark:hover:bg-purple-400 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
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
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex justify-center bg-white p-1 space-x-4 font-medium">
            <li>
              <Link
                href="/ "
                className="py-2 px-3 text-black hover:text-purple-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="py-2 px-3 text-black hover:text-purple-700"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href=" "
                className="py-2 px-3 text-black hover:text-purple-700"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/CustomerSupport/Contact"
                className="py-2 px-3 text-black hover:text-purple-700"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
