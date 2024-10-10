// components/ContactForm.js
import { useState } from 'react';
import Navbar from '@/Components/HomeNavbar';
const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (res.ok) {
            setSuccess(true);
            setName('');
            setEmail('');
            setMessage('');
        } else {
            setError('Something went wrong, please try again.');
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit} className=" mt-28 max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
                {success && <p className="text-green-500 mb-4">Your message has been sent!</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">
                        Message:
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="4"
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </>
    );
};

export default ContactForm;
