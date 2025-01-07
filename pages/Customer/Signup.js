import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setError(
        "Email must be a valid Gmail address (e.g., example@gmail.com)."
      );
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/Customer/register", {
        name,
        email,
        password,
      });

      if (res.status === 200) {
        sessionStorage.setItem("token", res.data.token);
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
                  placeholder="Allama Iqbal"
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
                className="w-full text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-6 h-6 text-white animate-spin mr-2"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5C100 78.2335 77.6142 100.5 50 100.5C22.3858 100.5 0 78.2335 0 50.5C0 22.7665 22.3858 0.5 50 0.5C77.6142 0.5 100 22.7665 100 50.5ZM9.08166 50.5C9.08166 73.0845 27.7017 91.5 50 91.5C72.2983 91.5 90.9183 73.0845 90.9183 50.5C90.9183 27.9155 72.2983 9.5 50 9.5C27.7017 9.5 9.08166 27.9155 9.08166 50.5Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.041C96.393 38.4039 97.8624 35.9236 97.0079 33.5924C95.2932 29.0914 92.871 24.9874 89.8167 21.4711C85.3077 16.0724 79.2477 12.079 72.3743 9.87624C65.5009 7.67351 58.1089 7.34337 51.0295 8.91136C44.0382 10.4578 37.4635 13.8644 31.8722 18.8181C26.2809 23.7718 21.8668 30.128 19 37.2802C18.0761 39.5922 19.5704 42.0847 21.9997 42.7056C24.429 43.3265 26.911 41.8541 27.8348 39.5422C30.1462 33.7443 33.916 28.6491 38.7757 24.7302C43.6354 20.8113 49.4033 18.2296 55.5072 17.2528C61.6111 16.276 67.8189 16.9378 73.5163 19.1763C79.2136 21.4147 84.1948 25.1403 87.902 30.0314C90.3989 33.3504 92.1585 37.0408 93.9676 41.0086C94.8101 43.0591 97.2406 44.5294 99.6659 43.8914C102.091 43.2533 103.56 40.7729 102.706 38.4418C101.099 33.8705 98.6757 29.7975 95.6157 26.2708C91.1067 20.8721 85.0467 16.8787 78.1733 14.6759C71.2999 12.4731 63.9079 12.143 56.8285 13.711C49.8372 15.2574 43.2625 18.664 37.6712 23.6177C32.0799 28.5714 27.6658 34.9276 24.799 42.0798C23.8751 44.3917 25.3694 46.8842 27.7987 47.5051C30.228 48.126 32.71 46.6536 33.6338 44.3417C35.9452 38.5438 39.715 33.4486 44.5747 29.5297C49.4344 25.6108 55.2023 23.0291 61.3062 22.0523C67.4101 21.0755 73.6179 21.7373 79.3153 23.9758C85.0126 26.2142 89.9938 29.9398 93.701 34.8309C95.1971 36.8096 97.7187 38.1849 100 38.4079C102.281 38.631 103.527 36.779 102.705 34.4418C101.1 29.8705 98.6757 25.7975 95.6157 22.2708C91.1067 16.8721 85.0467 12.8787 78.1733 10.6759C71.2999 8.47306 63.9079 8.14306 56.8285 9.71104C49.8372 11.2574 43.2625 14.664 37.6712 19.6177C32.0799 24.5714 27.6658 30.9276 24.799 38.0798C23.8751 40.3917 25.3694 42.8842 27.7987 43.5051C30.228 44.126 32.71 42.6536 33.6338 40.3417Z"
                        fill="currentColor"
                      />
                    </svg>
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>

              {/* Redirect to Login */}
              <p className="text-sm text-black font-light">
                Already a member?{" "}
                <Link
                  href="/Login"
                  className="font-medium text-black hover:underline"
                >
                  Login
                </Link>
              </p>

              <p className="text-sm text-black font-light">
                Or Signup your Restaurant{" "}
                <Link
                  href="/Restaurants/Signup"
                  className="font-medium text-black hover:underline"
                >
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
