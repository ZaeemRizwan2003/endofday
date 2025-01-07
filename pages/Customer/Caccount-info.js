import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { LuLoader } from "react-icons/lu";

const AccountInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/Login"); // Redirect to login if no token is found
    } else {
      axios
        .get("/api/Customer/user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user); // Set the user data
          setLoading(false); // Stop loading
        })
        .catch(() => {
          router.push("/Login"); // Redirect to login on error
        });
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">
          Error: User not found
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-purple-800">
          Account Information
        </h2>
        <div className="text-left">
          <p className="mb-4">
            <span className="font-semibold text-gray-700">Name:</span>{" "}
            {user.name}
          </p>
          <p className="mb-4">
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            {user.email}
          </p>
          <p className="mb-4">
            <span className="font-semibold text-gray-700">
              Your Loyalty Points:
            </span>{" "}
            {user.loyaltyPoints}
          </p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            router.push("/Login");
          }}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;
