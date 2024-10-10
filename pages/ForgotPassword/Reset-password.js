// pages/reset-password.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/ForgotPassword/reset-password', { email, newPassword });
            setMessage(res.data.message);
            if (res.status === 200) {
                router.push('/Customer/Clogin'); // Redirect to login after password reset
            }
        } catch (error) {
            setMessage('Error resetting password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-center text-gray-700">Reset Password</h1>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
                    >
                        Reset Password
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </div>
        </div>
    );
}