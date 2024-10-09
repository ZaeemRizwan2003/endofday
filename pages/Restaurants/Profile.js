import React, { useEffect, useState } from 'react'
import cookie from 'cookie';
import axios from 'axios';
import { LuLoader } from 'react-icons/lu';
const Profile = () => {
  const [userData, setuserData] = useState(null);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const cookies = cookie.parse(document.cookie);
        // const userId = cookies.userId;
        // Log the cookies to check the format
        console.log('Document Cookies:', document.cookie);

        // Parse the cookies from the browser
        const parsedCookies = cookie.parse(document.cookie);
        console.log('Parsed Cookies:', parsedCookies); // Log parsed cookies to see if userId exists

        // Extract the userId from the cookies
        const userId = parsedCookies.userId;

        if (!userId) {
          throw new Error('User ID not found in cookies');
        }
        const response = await axios.get(`/api/user/${userId}`);

        setuserData(response.data);
        setloading(false);
      }
      catch (err) {
        setError(err.message);
        setloading(false);
      }
    };
    fetchUserData();

  }, []);

  if (loading) {
    return <p><LuLoader/></p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Profile
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          This is some information about the user.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Full name
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userData?.name || 'N/A'}
            </dd>
          </div>
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Email address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userData?.email || 'N/A'}
            </dd>
          </div>
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Phone number
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userData?.phone || 'N/A'}
            </dd>
          </div>
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Address
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userData?.address || 'N/A'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Profile
