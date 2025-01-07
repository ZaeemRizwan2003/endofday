import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import AdminLayout from "@/Components/AdminLayout";

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [updatedCustomer, setUpdatedCustomer] = useState({
    name: "",
    email: "",
  });
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/Admin/Customer/manageCustomer");
        if (response.data.success) {
          setCustomers(response.data.customers);
          setFilteredCustomers(response.data.customers); 
        } else {
          console.error("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterCustomers(e.target.value); // Filter customers based on search query
  };

  const filterCustomers = (query) => {
    if (!query) {
      setFilteredCustomers(customers); // Show all customers if no query
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowercasedQuery) ||
          customer.email.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredCustomers(filtered); // Update filtered customers
    }
  };


  const handleDeleteCustomer = async (customerId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this customer? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `/api/Admin/Customer/deleteCustomers?userId=${customerId}`
      );
      if (response.data.success) {
        setCustomers((prev) =>
          prev.filter((customer) => customer._id !== customerId)
        );
        alert("Customer deleted successfully!");
      } else {
        alert("Failed to delete customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("An error occurred while deleting the customer.");
    }
  };

  const openEditModal = (customer) => {
    setCurrentCustomer(customer);
    setUpdatedCustomer({ name: customer.name, email: customer.email });
    setEditModalOpen(true);
  };

  const handleEditCustomer = async () => {
    const payload = {
      userId: currentCustomer._id,
    };
  
    // Only include fields that have been updated
    if (updatedCustomer.name !== currentCustomer.name) {
      payload.name = updatedCustomer.name;
    }
    if (updatedCustomer.email !== currentCustomer.email) {
      payload.email = updatedCustomer.email;
    }
  
    if (Object.keys(payload).length === 1) {
      alert("No changes detected.");
      return;
    }
  
    try {
      const response = await axios.put("/api/Admin/Customer/editCustomer", payload);
      if (response.data.success) {
        alert("Customer updated successfully!");
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === currentCustomer._id ? { ...c, ...response.data.updatedUser } : c
          )
        );
        setEditModalOpen(false);
      } else {
        alert("Failed to update customer.");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("An error occurred while updating the customer.");
    }
  };

  return (
  <AdminLayout>
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Title */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Manage Customers
        </h1>
        <Link legacyBehavior 
          href="/Admin/AdminDashboard"
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
          />
        </div>


      {/* Loading State */}
      {loading ? (
        <div className="text-center mt-12">
          <p className="text-lg text-gray-500 animate-pulse">
            Loading customers...
          </p>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* Icons for Edit and Delete */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => openEditModal(customer)}
                  className="text-blue-500 hover:text-blue-700 transition"
                  title="Edit Customer"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer._id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Delete Customer"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>

              {/* Customer Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {customer.name}
                  </h2>
                  <p className="text-gray-500">{customer.email}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Orders:{" "}
                      <span className="font-semibold text-gray-700">
                        {customer.orderCount}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Created On:{" "}
                      <span className="font-semibold text-gray-700">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <div className=" mt-5 flex space-x-2">
                    <Link legacyBehavior 
                      href={`/Admin/ManageCustomers/Customer-orders?userId=${customer._id}`}
                      className="text-blue-500 hover:text-blue-700 font-medium transition text-underline"
                    >
                      View Orders
                    </Link>
                    <Link legacyBehavior 
                      href={`/Admin/ManageCustomers/Customer-reviews?userId=${customer._id}`}
                      className="text-green-500 hover:text-green-700 font-medium transition"
                    >
                      View Reviews
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600">No customers found.</p>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Edit Customer
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={updatedCustomer.name}
                onChange={(e) =>
                  setUpdatedCustomer({
                    ...updatedCustomer,
                    name: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={updatedCustomer.email}
                onChange={(e) =>
                  setUpdatedCustomer({
                    ...updatedCustomer,
                    email: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCustomer}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
