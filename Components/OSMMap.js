import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Define the default marker icon
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const OSMMap = ({}) => {
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
const [coords, setCoords] = useState("");
  useEffect(() => {
    setIsClient(true); // Ensure we're running on the client
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setAddress(data.display_name); // Set the fetched address in state
     setCoords(data.display_name);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching address: ", error);
      setLoading(false);
    }
  };

  const handleClick = (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    reverseGeocode(lat, lng); // Get the address based on clicked coordinates
    // setCoords({lat,lng});
  };

  const MyComponent = () => {
    useMapEvents({
      click: handleClick,
    });
    return null;
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          reverseGeocode(lat, lng); // Get address from current location
          // setCoords({lat,lng});

        },
        () => {
          console.error("Error fetching current location");
        }
      );
    }
  };

  return (
    <>
      {isClient && (
        <div>
          <button
            onClick={getUserLocation}
            className="bg-purple-700 text-white px-4 py-2 rounded"
          >
            Use Current Location
          </button>
          <p className="mt-4">
  {coords}
</p>
          <MapContainer
            center={position || [33.6844, 73.0479]} // Default to some location if no position is set
            zoom={13}
            style={{ height: "300px", width: "80%", marginTop: "10px" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && <Marker position={position} />} {/* Conditionally render the marker */}
            <MyComponent />
          </MapContainer>

          {/* Display the selected address */}
          {loading ? (
            <p className="mt-4 text-purple-600 font-medium">Loading address...</p>
          ) : (
            address && (
              <p className="mt-4 text-purple-600 font-medium">
                Selected Address: {address}
              </p>
            )
          )}
        </div>
      )}
    </>
  );
};

export default OSMMap;
