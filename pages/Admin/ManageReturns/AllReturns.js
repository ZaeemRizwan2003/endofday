import { useEffect, useState } from "react";
import AdminLayout from "@/Components/AdminLayout";

export default function AdminRefundRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/Admin/Customer/allreturns");
        const data = await res.json();
        if (res.ok) {
          setRequests(data);
        } else {
          alert("Failed to fetch refund requests.");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleReject = async (id) => {
    try {
      const res = await fetch("/api/Admin/Customer/refundapproval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: id, status: "rejected" }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Request rejected successfully.");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: "rejected" } : req
          )
        );
      } else {
        alert(result.message || "Action failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  const handleApproveClick = (id) => {
    setCurrentRequestId(id);
    setRefundAmount("");
    setShowModal(true);
  };

  const confirmApprove = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch("/api/Admin/Customer/refundapproval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: currentRequestId,
          status: "approved",
          refundAmount: parseFloat(refundAmount),
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Request approved successfully.");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === currentRequestId
              ? { ...req, status: "approved" }
              : req
          )
        );
      } else {
        alert(result.message || "Action failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setShowModal(false);
      setCurrentRequestId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">Refund Requests</h1>
        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No refund requests found.</p>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow-md rounded-lg p-6 border"
              >
                <p><strong>Order ID:</strong> {req.orderId}</p>
                <p><strong>User ID:</strong> {req.userId}</p>
                <p><strong>Reason:</strong> {req.reason}</p>
                <p><strong>Details:</strong> {req.details || "—"}</p>
                <p><strong>Contact Number:</strong> {req.contactNumber}</p>
                <p><strong>Total Amount:</strong> Rs.{req.totalAmount}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      req.status === "approved"
                        ? "text-green-600"
                        : req.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {req.status || "Pending"}
                  </span>
                </p>

                {req.images && (
                  <div className="mt-3">
                    <strong>Evidence:</strong>
                    <img
                      src={req.images}
                      alt="Evidence"
                      className="mt-2 w-48 h-auto border rounded cursor-pointer hover:opacity-80 transition"
                      onClick={() => setSelectedImage(req.images)}
                    />
                  </div>
                )}

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleApproveClick(req._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={req.status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={req.status === "rejected"}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Full View"
                className="rounded shadow-lg max-h-[90vh] object-contain"
              />
              <button
                className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded shadow hover:bg-gray-100"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-xl font-bold mb-4">Refund as Loyalty Points</h2>
              <input
                type="number"
                min="1"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Enter loyalty points to add"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCurrentRequestId(null);
                    setRefundAmount("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApprove}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={!refundAmount || parseFloat(refundAmount) <= 0}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
