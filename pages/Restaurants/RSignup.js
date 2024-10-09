import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmpassword: '',
        address: '',
        number: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.password !== formData.confirmpassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/Restaurants/signup', {
                restrauntName: formData.name,
                email: formData.email,
                password: formData.password,
                confirmpassword: formData.confirmpassword,
                address: formData.address,
                number: formData.number,
            });

            if (response.status === 200) {
                setSuccess('Signup successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/Restaurants/RLogin');
                }, 2000);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
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
                {/* Adjusted the width to be wider */}
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {/* Use grid to create two columns layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                        Restaurant name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Tehzeeb Bakers"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="bakeryname@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmpassword" className="block mb-2 text-sm font-medium text-gray-900 ">
                                        Confirm password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmpassword"
                                        id="confirmpassword"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={formData.confirmpassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                                        Restaurant address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Location of restaurant"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="number"
                                        id="number"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="+92 0000000000"
                                        value={formData.number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-50 text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center justify-center"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create an account'}
                            </button>

                            {error && <p className="text-red-500">{error}</p>}
                            {success && <p className="text-green-500">{success}</p>}

                            <p className="text-sm font-light text-black ">
                                Already have an account?{' '}
                                <Link href="/Restaurants/RLogin" className="font-medium text-black hover:underline">
                                    Login here
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
