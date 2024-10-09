// components/ContactForm.js
import { useState } from 'react';

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
        <form onSubmit={handleSubmit}>
            <h2>Contact Us</h2>
            {success && <p>Your message has been sent!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Message:
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </label>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
};

export default ContactForm;
