import React, { useState } from "react";

const AddressList = ({ addresses, handleSetDefaultAddress }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const defaultAddress = addresses.find((address) => address.isDefault);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="address-section space-y-2">

      {/* Default Address with Dropdown */}
      <div className="relative">
        <div
          className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
            showDropdown ? "border-purple-500 bg-purple-100" : "border-gray-300 bg-white"
          }`}
          onClick={toggleDropdown}
        >
          <div className="truncate">
            <p className="font-medium text-sm">
              {defaultAddress?.addressLine || "No default address"}
            </p>
            {defaultAddress && (
              <span className="text-green-500 text-xs">Default Address</span>
            )}
          </div>
          <span className="text-gray-500 text-sm">
            {showDropdown ? "▲" : "▼"}
          </span>
        </div>

        {showDropdown && (
          <ul className="absolute bg-white border rounded-lg mt-1 w-72 shadow-lg z-6">
            {addresses.map((address) => (
              <li
                key={address._id}
                className={`p-3 flex justify-between items-center hover:bg-gray-100 ${
                  address.isDefault ? "bg-purple-100" : "bg-white"
                }`}
              >
                <p className="text-sm truncate w-2/3">{address.addressLine},{address.area}, {address.city}</p>
                <button
                  onClick={() => {
                    handleSetDefaultAddress(address._id);
                    setShowDropdown(false); // Close dropdown after setting default
                  }}
                  className={`text-sm underline ${
                    address.isDefault
                      ? "text-green-600 cursor-not-allowed"
                      : "text-purple-600 hover:text-purple-800"
                  }`}
                  disabled={address.isDefault}
                >
                  {address.isDefault ? "Default" : "Set as Default"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddressList;
