import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "./cartcontext";
import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import DashNav from "@/Components/CustomerNavbar";
import { loadStripe } from "@stripe/stripe-js";
import { fetchAddresses, addNewAddress, setDefaultAddress } from "./Addresses";
import AddressList from "@/Components/AddressList";
import dynamic from "next/dynamic";

const MapModal = dynamic(() => import("@/Components/MapModal"), {
  ssr: false,
});

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Checkout = () => {
  const {
    cart,
    setCart,
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
    area: "",
    postalCode: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    contact: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [pointsApplied, setPointsApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const router = useRouter();

  // Fetch addresses and user info on component mount
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`/api/Customer/checkout?userId=${userId}`);
        const { addresses, userInfo } = res.data;

        setAddresses(addresses);

        if (addresses.length > 0) {
          const defaultAddress =
            addresses.find((address) => address.isDefault) || addresses[0];
          setSelectedAddress(defaultAddress._id);
        }

        setUserInfo({ ...userInfo, contact: "" });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCheckoutData();
  }, []);

  const handleNewAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!newAddress.city || !newAddress.area || !newAddress.addressLine) {
      alert("Please provide all required address fields.");
      return;
    }

    try {
      const addedAddress = await addNewAddress(userId, newAddress);
      setAddresses([...addresses, { ...addedAddress, isDefault: false }]);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add new address", error);
      alert("Failed to add new address. Please try again.");
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    const userId = localStorage.getItem("userId");
    await setDefaultAddress(userId, addressId);
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr._id === addressId,
      }))
    );
    setSelectedAddress(addressId);
  };

  const handleSaveLocation = async (location) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID is missing from localStorage");
      return;
    }

    const addressLine = location.address || "Unnamed Address";
    const city = location.city || "Unknown";
    const area = location.subarea || extractAreaFromAddress(addressLine);
    const postalCode = location.postalCode || "";

    try {
      const response = await axios.post("/api/Customer/map-address", {
        userId,
        location: { ...location, address: addressLine, city, area, postalCode },
      });
      console.log("API response:", response.data);

      if (response.data.success && response.data.newAddress) {
        setAddresses((prevAddresses) => [
          ...prevAddresses,
          response.data.newAddress,
        ]);
        setShowMapModal(false);
        alert("Location saved successfully!");
      } else {
        console.error("Unexpected API response:", response.data);
        alert("Failed to save location. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save location", error);
      alert("Failed to save location. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const totalAmount = calculateTotalAmount();
    const finalAmount = totalAmount - discountAmount;

    if (!selectedAddress) {
      alert("Please select an address.");
      return;
    }

    if (!userInfo.contact) {
      alert("Please fill in your contact and city details.");
      return;
    }

    const selectedAddrObj = addresses.find(
      (address) => address._id === selectedAddress
    );

    if (!selectedAddrObj) {
      alert("Selected address not found.");
      return;
    }

    const orderData = {
      userId,
      items: cart,
      totalAmount: finalAmount,
      addressId: selectedAddress,
      contact: userInfo.contact,
      city: selectedAddrObj.city,
      area: selectedAddrObj.area,
      pointsRedeemed: pointsApplied ? discountAmount : 0,
    };

    console.log("Order data being sent:", orderData);
    try {
      const response = await axios.post("/api/Customer/order", orderData);
      const orderId = response.data.order._id;

      localStorage.setItem("lastOrderId", orderId);

      clearCart();
      setCart([]);
      localStorage.removeItem("cart");

      router.push(`/Customer/OrderConfirm?id=${orderId}`);
    } catch (err) {
      console.error(
        "Order submission failed",
        err.response?.data || err.message
      );
    }
  };

  const handleStripePayment = async () => {
    const stripe = await stripePromise;
    const userId = localStorage.getItem("userId");
    const totalAmount = calculateTotalAmount();
    const finalAmount = totalAmount - discountAmount;
    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    if (!userInfo.contact) {
      alert("Please provide your contact number.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/Customer/create-checkout-session",
        {
          userId,
          items: cart,
          totalAmount: finalAmount,
          addressId: selectedAddress,
          contact: userInfo.contact,
          pointsRedeemed: pointsApplied ? discountAmount : 0,
        }
      );
      console.log("API Response:", response.data);
      // const sessionId = response.data.id;

      const { sessionId } = response.data;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe payment failed", error);
    }
  };

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `/api/Customer/loyalty?userId=${userId}`
        );
        setLoyaltyPoints(response.data.loyaltyPoints);
      } catch (error) {
        console.error("Failed to fetch loyalty points:", error);
      }
    };

    fetchLoyaltyPoints();
  }, []);

  const handleApplyLoyaltyPoints = () => {
    if (pointsApplied) {
      setPointsApplied(false);
      setDiscountAmount(0);
    } else {
      const discount = Math.min(loyaltyPoints, calculateTotalAmount());
      setDiscountAmount(discount);
      setPointsApplied(true);
    }
  };

  const calculateTotalAmount = () => {
    return (
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 150
    );
  };

  return (
    <div>
      <DashNav isCheckout={true} />
      <div className="checkout-page max-w-4xl mx-auto p-4 mt-16">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Checkout</h1>

        {/* Address Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black">Select Address</h2>
          <AddressList
            addresses={addresses}
            handleSetDefaultAddress={handleSetDefaultAddress}
          />

          <button
            className="mt-4 p-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            onClick={() => setShowModal(true)}
          >
            Add New Address
          </button>

          <button
            className="bg-blue-600 mt-4 ml-2 p-2  text-white rounded hover:bg-blue-700"
            onClick={() => setShowMapModal(true)}
          >
            Use Maps
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
            name="contact"
            value={userInfo.contact}
            onChange={(e) =>
              setUserInfo({ ...userInfo, contact: e.target.value })
            }
            className="p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Contact"
          />
          {/* <input
            type="text"
            name="city"
            value={userInfo.city}
            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
            className="p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="City"
          /> */}
        </div>

        {/* Loyalty Points */}

        <h2 className="text-xl font-semibold text-black mt-8">
          Loyalty Points
        </h2>
        <div>
          {/* <p>You have <strong>{loyaltyPoints}</strong> points available.</p> */}
          <button
            onClick={handleApplyLoyaltyPoints}
            className={`mt-2 p-2 rounded ${
              pointsApplied ? "bg-red-600" : "bg-purple-600"
            } text-white`}
          >
            {pointsApplied ? "Remove Loyalty Points" : "Use Loyalty Points"}
          </button>
          {pointsApplied && (
            <p className="mt-2 text-purple-700">
              {discountAmount} points applied. You saved Rs.{discountAmount}!
            </p>
          )}
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
                <p className="text-sm text-gray-500">
                  Rs.{item.price * item.quantity}{" "}
                </p>
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
            <p>Discount Applied: Rs.{discountAmount}</p>
            <p className="text-lg font-bold">
              Total: Rs.{calculateTotalAmount() - discountAmount}
            </p>
          </div>
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

      {showMapModal && (
        <MapModal
          onClose={() => setShowMapModal(false)} // Close modal
          onSaveLocation={(location) => {
            console.log("Selected location from MapModal:", location);
            handleSaveLocation(location);
          }}
        />
      )}

      {/* // Modal for New Address */}
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

            {/* Dropdown for Area Selection */}
            {newAddress.city && (
              <select
                value={newAddress.area}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, area: e.target.value })
                }
                className="w-full p-3 border border-purple-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
              >
                <option value="">Select Area</option>
                {newAddress.city === "Islamabad" &&
                  [
                    "E-7, Islamabad",
                    "E-8, Islamabad",
                    "E-9, Islamabad",
                    "E-10, Islamabad",
                    "E-11, Islamabad",
                    "E-12, Islamabad",
                    "E-16, Islamabad",
                    "E-17, Islamabad",
                    "F-5, Islamabad",
                    "F-6, Islamabad",
                    "F-7",
                    "F-8, Islamabad",
                    "F-9",
                    "F-10, Islamabad",
                    "F-11, Islamabad",
                    "F-12, Islamabad",
                    "F-15, Islamabad",
                    "F-17, Islamabad",
                    "I-8, Islamabad",
                    "I-9, Islamabad",
                    "I-10, Islamabad",
                    "I-11, Islamabad",
                  ].map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                {newAddress.city === "Rawalpindi" &&
                  ["A block", "B block", "D block", "Satellite town"].map(
                    (area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    )
                  )}
              </select>
            )}

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
    </div>
  );
};

export default Checkout;
