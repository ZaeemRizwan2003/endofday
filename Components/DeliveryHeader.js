"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser, FaTimes } from "react-icons/fa";

const DeliveryHeader = () => {
  const [details, setDetails] = useState();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    let data = sessionStorage.getItem("delivery");
    if (!data && pathName === "/Delivery/deliverydashboard") {
      router.push("/Delivery/deliverypartner");
    } else if (data && pathName === "/Delivery/deliverypartner") {
      router.push("/Delivery/deliverydashboard");
    } else {
      setDetails(JSON.parse(data));
    }
  }, [pathName, router]);

  const logout = () => {
    sessionStorage.clear();

    router.push("/Login");
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex justify-between items-center mx-auto p-4">
        {/* Logo */}
        <Link
          href="/Delivery/deliverydashboard"
          className="flex items-center space-x-3"
        >
          <img src="/mainlogo.png" className="h-10" alt="Logo" />
        </Link>

        {/* Account Menu */}
        <div className="relative">
          <FaUser
            className="w-8 h-8 text-purple-800 cursor-pointer"
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          />

          {/* Account Menu Dropdown */}
          {isAccountMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
              <div className="flex justify-between items-center p-2 border-b">
                <h2 className="text-lg font-bold">Account Menu</h2>
                <FaTimes
                  className="w-6 h-6 text-gray-500 cursor-pointer"
                  onClick={() => setIsAccountMenuOpen(false)}
                />
              </div>
              <ul className="py-2">
                {details ? (
                  <>
                    <li>
                      <Link
                        href="/Delivery/account-info"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Account Information
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ForgotPassword/Reset-password"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/Delivery/All-Orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        All Orders
                      </Link>
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={logout}
                    >
                      Logout
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      href="/"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Home
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DeliveryHeader;
