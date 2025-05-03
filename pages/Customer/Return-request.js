import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashNav from "@/Components/CustomerNavbar";

export default function ReturnRequest() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    orderId: "",
    reason: "",
    comments: "",
    contactNumber: "",
    evidence: null,
  });

  useEffect(() => {
    if (router.isReady) {
      const { orderId } = router.query;
      if (orderId) {
        setForm((prev) => ({ ...prev, orderId }));
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "evidence") {
      setForm((prev) => ({ ...prev, evidence: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    let base64Evidence = "";
    if (form.evidence) {
      try {
        base64Evidence = await convertToBase64(form.evidence);
      } catch (error) {
        console.error("Error encoding file", error);
        alert("Failed to encode the file. Please try again.");
        return;
      }
    }

    const payload = {
      orderId: form.orderId,
      userId,
      reason: form.reason,
      details: form.comments,
      contactNumber: form.contactNumber,
      images: base64Evidence,
    };

    try {
      const res = await fetch("/api/Customer/return-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setShowPopup(true);
      } else {
        alert(result.message || "Failed to submit return request.");
      }
    } catch (err) {
      console.error("Return request failed", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <DashNav />
      <div className="pt-24 px-6 md:px-24 min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Return Request Form
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="orderId" value={form.orderId} />

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Reason for Return <span className="text-red-500">*</span>
              </label>
              <select
                name="reason"
                required
                value={form.reason}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select a reason</option>
                <option value="Wrong item delivered">Wrong item delivered</option>
                <option value="Damaged item">Damaged item</option>
                <option value="Late delivery">Late delivery</option>
                <option value="Poor quality">Poor quality</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Additional Comments
              </label>
              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Upload Evidence <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="evidence"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
            >
              Submit Return Request
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md text-center animate-fade-in-up">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Return Request Submitted
            </h2>
            <p className="text-gray-600 mb-6">
              Please wait for the admin's response. You will be notified via email regarding the status of your request.
            </p>
            <button
              onClick={() => router.push("/Customer/Return")}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
