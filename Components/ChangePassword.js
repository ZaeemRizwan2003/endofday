// /components/ChangePassword.jsx

import React, { useState } from 'react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        const { currentPassword, newPassword, confirmNewPassword } = formData;

        // Frontend validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/changepassword', { // Ensure this matches your API route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                });
            } else {
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border border-gray-300 rounded shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-6  text-purple-800 text-center">Change Password</h2>
            {message && <p className="mb-4 text-green-600 text-center">{message}</p>}
            {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-gray-700 mb-2">
                        Current Password:
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label htmlFor="confirmNewPassword" className="block text-gray-700 mb-2">
                        Confirm New Password:
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 bg-purple-700 text-white font-semibold rounded hover:bg-purple-800 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isLoading ? 'Updating...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
