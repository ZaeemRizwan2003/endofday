import React from "react";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import { useCart } from "@/pages/cartcontext";
import Cart from "./Cart";

const DashNav = ({ search, setSearch, isCheckout }) => {
  const { cart , setCart} = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const saveCartToServer = async (userId, cart) => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cart: cart })
    });
  };

  const handleLogout = async() => {
    const userId = user?.id;  
    if (userId) {
      await saveCartToServer(userId, cart);
    }

    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);

    // setCart({});  
    router.push("/login");
  };


  const getCartItemCount = () => {
    return Object.keys(cart).length;
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        <Link href="/" className="flex items-center rtl:space-x-reverse">
          <img src="/mainlogo.png" className="h-8" alt="Logo" />
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-1 rtl:space-x-reverse">
          {!isCheckout && (
            <>
          <form className="flex items-center max-w-sm mx-auto">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                placeholder="Search your craving.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-white bg-purple-800 rounded-lg border border-purple-700 hover:bg-blue-800 focus:ring-4 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>

          <div className="relative">
            <FaCartShopping
              className="pl-1 mt-1 w-8 h-8 text-purple-800 cursor-pointer"
              onClick={() => setIsCartOpen(!isCartOpen)}
            />

            {getCartItemCount() > 0 && (
              <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                {getCartItemCount()}
              </span>
            )}
          </div>

          {isCartOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsCartOpen(false)}
            >
              <div
                className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Cart />
                <FaTimes
                  className="w-6 h-6 text-gray-500 cursor-pointer"
                  onClick={() => setIsCartOpen(false)}
                />
              </div>
            </div>
          )}
          </>
          )}

          {isCheckout && (
            <button
            className="p-2.5 text-sm font-medium text-purple-800 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none"
            onClick={() => router.push("/dashboard")}
          >
            Continue Browsing
          </button>
        )}

<FaUser
            className="pl-2 mt-1 w-8 h-8 text-purple-800 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          />

          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4"
                onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking inside it
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Account Menu</h2>
                  <FaTimes
                    className="w-6 h-6 text-gray-500 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  />
                </div>
                <ul className="mt-4">
                  <li className="mb-3">
                    <button
                      className="text-purple-700 hover:underline"
                      onClick={() => router.push("/account-info")}
                    >
                      Account Information
                    </button>
                  </li>
                  <li className="mb-3">
                    <button
                      className="text-purple-700 hover:underline"
                      onClick={() => router.push("/forgotpass")}
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
        </div>
      </div>
    </nav>
  );
};

export default DashNav;
