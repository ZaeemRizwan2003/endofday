import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AccountInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token is found
    } else {
      axios
        .get('/api/user-info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user); // Set the user data
          setLoading(false); // Stop loading
        })
        .catch(() => {
          router.push('/login'); // Redirect to login on error
        });
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">Error: User not found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-purple-800">Account Information</h2>
        <div className="text-left">
          <p className="mb-4">
            <span className="font-semibold text-gray-700">Name:</span> {user.name}
          </p>
          <p className="mb-4">
            <span className="font-semibold text-gray-700">Email:</span> {user.email}
          </p>
          {/* Add more user info as needed */}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
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
