import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios"

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const[loading,setLoading]=useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/Customer/register", {
        name,
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        setSuccess("signup successful, you can login now");
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          router.push("/Login");
        }, 2000);
      }
    } catch (err) {
      setError("signup failed, please try again later");
    }
  };

  return (
    <section className="bg-gray-50">

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">


        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-3">
          <img
            className="mx-auto h-10 w-auto"
            src="/mainlogo.png"
            alt="EndofDay"
          />
        </div>

        
<div className="absolute underline top-12 right-10">
        <Link
          href="/Delivery/deliverypartner"
          className="text-base font-medium text-purple-800 hover:underline"
        >
          Signup as Driver
        </Link>
      </div>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create your account
            </h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignup}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-black bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>

              {/* Redirect to Login */}
              <p className="text-sm text-black font-light">
                Already a member?{" "}
                <Link href="/Login" className="font-medium text-black hover:underline">
                  Login
                </Link>
              </p>

              <p className="text-sm text-black font-light">
                Or Signup your Restaurant{" "}
                <Link href="/Restaurants/Signup" className="font-medium text-black hover:underline">
                  Signup
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
