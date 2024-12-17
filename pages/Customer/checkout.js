import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "./cartcontext";
import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import DashNav from "@/Components/CustomerNavbar";
import dynamic from "next/dynamic";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// Dynamically import OSMMap to ensure it's client-side rendered
const OSMMap = dynamic(() => import("../../Components/OSMMap"), {
  ssr: false,
});

const Checkout = () => {
  const {
    cart,
    incrementItemQuantity,
    decrementItemQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    city: "",
    postalCode: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false); // For new address modal
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [geoLocation, setGeoLocation] = useState(null);

  const router = useRouter();

  // Fetch addresses and user info on component mount
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`/api/Customer/checkout?userId=${userId}`);
        const { addresses, userInfo } = res.data;

        setAddresses(addresses);
        setUserInfo({ ...userInfo, phone: "", city: "" }); // Let the user input phone and city
      } catch (err) {
        console.error(err);
      }
    };

    fetchCheckoutData();
  }, []);

  const handleLocationSelect = (coords) => {
    // Set the geoLocation state from OSMMap component
    console.log("coords reahed");
    setGeoLocation(coords);
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleNewAddress = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post("/api/Customer/address", {
        userId,
        newAddress: {
          addressLine: newAddress.addressLine,
          city: newAddress.city,
          postalCode: newAddress.postalCode,
        },
      });
      setAddresses([...addresses, res.data.newAddress]);
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Failed to add new address", error);
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (!selectedAddress) {
      alert("Please select an address.");
      return;
    }

    const orderData = {
      userId,

      items: cart,
      totalAmount,
      addressId: selectedAddress, // Corrected key
    };

    console.log("Order data being sent:", orderData);
    try {
      const response = await axios.post("/api/Customer/order", orderData);
      const orderId = response.data._id;

      router.push(`/Customer/OrderConfirm?id=${orderId}`);
      clearCart(); // Clear cart after successful order placement
    } catch (err) {
      console.error(
        "Order submission failed",
        err.response?.data || err.message
      );
    }
  };

  const handleSaveCurrentLocation = async () => {
    if (!geoLocation) {
      console.log("No location selected");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const { latitude, longitude } = geoLocation;
      const addressLine = `Lat: ${latitude}, Long: ${longitude}`;

      const res = await axios.post("/api/Customer/address", {
        userId,
        newAddress: {
          addressLine,
          city: "Current Location",
          postalCode: "",
        },
      });

      setAddresses((prevAddresses) => [...prevAddresses, res.data.newAddress]);
      setSelectedAddress(res.data.newAddress._id);
      setShowMapModal(false); // Close the map modal after saving
    } catch (error) {
      console.error("Failed to save current location", error);
    }
  };

  const handleStripePayment = async () => {
    const stripe = await stripePromise;
    const userId = localStorage.getItem("userId");

    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    try {
      const response = await axios.post(
        "/api/Customer/create-checkout-session",
        {
          userId,
          items: cart,
          totalAmount: totalCartPrice,
          addressId: selectedAddress,
        }
      );

      const sessionId = response.data.id;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe payment failed", error);
    }
  };

  const totalCartPrice = cart
    .reduce((total, item) => total + 150 + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div>
      <DashNav isCheckout={true} />
      <div className="checkout-page max-w-4xl mx-auto p-4 mt-16">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Checkout</h1>

        {/* Address Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black">Select Address</h2>
          <div className="mt-2">
            <select
              value={selectedAddress}
              onChange={handleAddressChange}
              className="w-full p-3 border border-purple-300 rounded-lg text-black bg-white focus:outline-none focus:border-purple-500"
            >
              <option key="" value="">Select Address</option>
              {addresses.length > 0 ? (
                addresses.map((address, index) => (
                  <>
                  
                  <option key={index} value={address._id}>
                    {address.addressLine}, {address.city}, {address.postalCode}
                  </option>
                  </>
                ))
              ) : (
                <option value="">No addresses available</option>
              )}
            </select>
          </div>

          <button
            className="mt-4 p-2 bg-purple-700 text-white rounded hover:bg-purple-700"
            onClick={() => setShowModal(true)} // Show modal for new address
          >
            Add New Address
          </button>
          <button
            className="mt-4 ml-4 p-2 bg-purple-700 text-white rounded hover:bg-purple-700"
            onClick={() => setShowMapModal(true)} // Show modal for current location
          >
            Use Current Location
          </button>
        </div>

        {/* User Info Section */}
        <h2 className="text-xl font-semibold text-black mt-8">User Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            className="p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            className="p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
            className="p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Phone"
          />
          <input
            type="text"
            name="city"
            value={userInfo.city}
            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
            className="p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="City"
          />
        </div>

        {/* Payment Method Section */}
        <h2 className="text-xl font-semibold text-black mt-8">
          Payment Method
        </h2>
        <div className="flex gap-4 mt-2">
          <label
            className={`flex items-center justify-center border-2 rounded-lg p-4 w-full text-center cursor-pointer ${
              paymentMethod === "COD"
                ? "border-purple-700 bg-purple-100"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="hidden"
            />
            Cash on Delivery (COD)
          </label>

          <label
            onClick={handleStripePayment}
            className="flex items-center justify-center border-2 rounded-lg p-4 w-full text-center cursor-pointer border-gray-300 hover:border-purple-700 hover:bg-purple-100"
          >
            Pay Online
          </label>
        </div>

        {/* Cart Info Section */}
        <h2 className="text-xl font-semibold text-black mt-8">Cart Items</h2>
        <div className="cart-items mt-4">
          {cart.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500">Rs.{item.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decrementItemQuantity(item.itemId)}>
                  <FaRegMinusSquare className="text-purple-600" />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => incrementItemQuantity(item.itemId)}>
                  <FaRegPlusSquare className="text-purple-600" />
                </button>
                <button onClick={() => removeFromCart(item.itemId)}>
                  <RiDeleteBin2Line className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right">
            <p>+ Delivery Charges: Rs.150</p>
            <p className="text-lg font-semibold">Total: Rs.{totalCartPrice}</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            className="bg-purple-700 text-white py-3 px-8 rounded-lg hover:bg-purple-800"
          >
            Confirm Order
          </button>
        </div>
      </div>

      // Modal for New Address
{showModal && (
  <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
      
      <input
        type="text"
        placeholder="Address Line"
        value={newAddress.addressLine}
        onChange={(e) =>
          setNewAddress({ ...newAddress, addressLine: e.target.value })
        }
        className="w-full p-3 border border-purple-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
      />
      
      {/* Dropdown for City Selection */}
      <select
        value={newAddress.city}
        onChange={(e) =>
          setNewAddress({ ...newAddress, city: e.target.value })
        }
        className="w-full p-3 border border-purple-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
      >
        <option value="">Select City</option>
        <option value="Rawalpindi">Rawalpindi</option>
        <option value="Islamabad">Islamabad</option>
      </select>

      <input
        type="text"
        placeholder="Postal Code"
        value={newAddress.postalCode}
        onChange={(e) =>
          setNewAddress({ ...newAddress, postalCode: e.target.value })
        }
        className="w-full p-3 border border-purple-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
      />
      
      <div className="text-right">
        <button
          className="bg-gray-300 text-black py-2 px-4 rounded-lg mr-4"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-purple-700 text-white py-2 px-4 rounded-lg"
          onClick={handleNewAddress}
        >
          Save Address
        </button>
      </div>
    </div>
  </div>
)}

      {/* Modal for Map Selection */}
      {showMapModal && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">
              Select Your Current Location
            </h2>
            <div className="w-full h-96">
              {/* Render the OSM Map component */}
              <OSMMap onLocationSelect={handleLocationSelect} />
            </div>
            <div className="text-right mt-4">
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded-lg mr-4"
                onClick={() => setShowMapModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-700 text-white py-2 px-4 rounded-lg"
                onClick={handleSaveCurrentLocation}
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
