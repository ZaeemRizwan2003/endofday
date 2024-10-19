import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const DeliverySignUp = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem('delivery'));
    if (delivery) {
      router.push('/Delivery/deliverydashboard')
    }
  }, [])

  const handleSignup = async () => {
    if (!contact || !password || !confirmPassword || !name || password !== confirmPassword || contact.length !== 11) {
      setError(true)
      return false

    } else {
      setError(false)
    }
    console.log(contact, password, c_password, name, area);
    let response = await fetch("/api/deliverypartners/signup", {
      method: "POST",
      body: JSON.stringify({ contact, password, name, area, confirmPassword })
    })
    response = await response.json();
    if (response.success) {
      const { result } = response;
      delete result.password;
      localStorage.setItem("delivery", JSON.stringify(result));
      alert("Success");
      router.push('/Delivery/deliverydashboard')
    } else {
      alert("Failed to Signup" + response.message);
    }
  }

  return (
    <div className="mt-6 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/mainlogo.png"
          alt="EndofDay"
        />
      </div>
      <div className="flex min-h-full flex-col justify-center px-6 py-10 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            RIDER SIGNUP
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Contact Number
              </label>
              <div className="mt-2">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && !contact && <p className="text-red-500">Please enter valid contact</p>}
              {error && contact && contact.length !== 11 && <p className="text-red-500">Contact Number Must be 11 digit long.</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && !password && <p className="text-red-500">Please enter valid password</p>}
              {error && password && password !== confirmPassword && <p className="text-red-500">Password and Confirm Password do not match</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="c_password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt- 2">
                <input
                  id="c_password"
                  name="c_password"
                  type="password"
                  value={c_password}
                  onChange={(e) => setC_password(e.target.value)}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && !confirmPassword && <p className="text-red-500">Please enter valid confirm password</p>}
              {error && c_password && password !== c_password && <p className="text-red-500">Password and Confirm Password do not match</p>}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && !name && <p className="text-red-500">Please enter valid name</p>}
            </div>

            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Area
              </label>
              <div className="mt-2">
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error && !area && < p className="text-red-500">Please enter valid area</p>}
            </div>

            <div>
              <button
                type="button"
                onClick={handleSignup}
                className="flex w-full justify-center rounded-md bg-purple-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>

            {/* <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?
              <Link
                href="/delivery/deliverypartner"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliverySignUp;