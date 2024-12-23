import { useState } from "react";
import { useRouter } from "next/router";
import DashNav from "@/Components/Navbar";

export default function NotificationForm() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID is missing. Please log in again.");
        return;
      }

      const res = await fetch("/api/Notification/createresnotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userId: userId,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setShowPopup(true); // Show the popup message
        setTimeout(() => {
          setShowPopup(false); // Automatically close the popup after a few seconds
          router.push("/Restaurants/RDashboard");
        }, 3000); // 3-second delay
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
    <>
      <DashNav />
      <div className="relative pt-20 bg-gradient-to-br from-purple-50 to-purple-100 min-h-screen">
        <button
          onClick={goBackToDashboard}
          className="absolute top-4 right-4 px-6 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
        >
          Go Back to Dashboard
        </button>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100 transform transition-all hover:scale-105"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Notification
          </h2>

          <label className="block mb-2 text-gray-700 font-semibold">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <label className="block mb-2 text-gray-700 font-semibold">
            Message
          </label>
          <textarea
            name="message"
            placeholder="Notification Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-white font-semibold bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          >
            Submit
          </button>
        </form>

        {/* Popup Message */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">
                Notification Submitted!
              </h3>
              <p className="text-gray-700">
                The status of the notification approval will be sent to your
                email shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
