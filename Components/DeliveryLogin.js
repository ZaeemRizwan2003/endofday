import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const DeliveryLogin = () => {
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem('delivery'));
    if (delivery) {
      router.push('deliverydashboard');
    }
  }, []);

  const handleLogin = async () => {
    if (!loginMobile || !loginPassword) {
      setError(true);
      return;
    }
    setError(false);
    let response = await fetch("/api/deliverypartners/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile: loginMobile, password: loginPassword })
    });

    response = await response.json();

    if (response.success) {
      const { userData, token } = response;
      delete userData.password;
      localStorage.setItem("delivery", JSON.stringify(userData));
      localStorage.setItem("deliveryToken", token);
      alert("Login successful");
      router.push('/Delivery/deliverydashboard');
    } else {
      alert("Login failed. Please try again with a valid Mobile Number and Password.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-20 w-auto" src="/mainlogo.png" alt="EndofDay" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-purple-800">
          Rider Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back to your delivery dashboard
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-4 text-start" onSubmit={(e) => e.preventDefault()}>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-purple-800 ml-2"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="text"
                value={loginMobile}
                onChange={(e) => setLoginMobile(e.target.value)}
                required
                className="block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {error && !loginMobile && (
                <p className="text-red-600 text-sm mt-1">Please enter a valid mobile number</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-purple-800 ml-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {error && !loginPassword && (
                <p className="text-red-600 text-sm mt-1">Please enter a password</p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 focus:outline-none"
              >
                Log in
              </button>
            </div>

          </form>
{/* 
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="/Delivery/deliverysignup" className="text-purple-700 hover:underline">
                Sign up
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DeliveryLogin;