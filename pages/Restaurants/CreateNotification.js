import { useState } from "react";
import { useRouter } from "next/router";

export default function NotificationForm() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get userId directly from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID is missing. Please log in again.");
        return;
      }

      const res = await fetch("/api/Notification/createresnotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userId: userId, // Send userId in headers
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Notification request submitted successfully!");
        router.push("/Restaurants/RDashboard"); // Redirect on success
      } else {
        alert(data.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    }
  };

  const goBackToDashboard = () => {
    router.push("/Restaurants/RDashboard");
  };

  return (
    <div className="relative">
      <button
        onClick={goBackToDashboard}
        className="absolute top-4 right-4 px-6 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        Go Back to Dashboard
      </button>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Notification
        </h2>

        <label className="block mb-2 text-gray-600 font-medium">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Notification Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block mb-2 text-gray-600 font-medium">Message</label>
        <textarea
          name="message"
          placeholder="Notification Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>

        <button
          type="submit"
          className="w-full py-3 mt-4 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
