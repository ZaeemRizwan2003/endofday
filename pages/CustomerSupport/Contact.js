import { useState } from "react";
import Navbar from "@/Components/HomeNavbar";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setError("Something went wrong, please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-200">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg border border-gray-200 transform transition-all hover:scale-105"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">
            Contact Us
          </h2>
          {success && (
            <p className="text-green-600 mb-4 font-medium">
              Your message has been sent!
            </p>
          )}
          {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
          <div className="mb-6">
            <label className="block text-gray-600 font-medium">
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium">
              Message:
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows="4"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactForm;
