import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet";
import { useMap } from "react-leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MoveToCurrentLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location.lat && location.lng) {
      map.setView([location.lat, location.lng], 13); // Move to user's location
    }
  }, [location, map]);

  return null; 
};

const MapModal = ({ onClose, onSaveLocation }) => {
  const [location, setLocation] = useState({ lat: 33.6844, lng: 73.0479 });
  const [address, setAddress] = useState(""); 

  useEffect(() => {
    if(typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
      console.log("User's current location:", position.coords);
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
        setLocation(userLocation);
        reverseGeocode(userLocation.lat, userLocation.lng);
      },

      (error) => {
        console.error("Error getting location", error);
      }
    );
}
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name );
      } else {
        setAddress("Unable to fetch address");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  const LocationMarker = () => {
    const map = useMap();
    useMapEvents({
      click(e) {
        setLocation(e.latlng); // Set location when user clicks on the map
        reverseGeocode(e.latlng.lat, e.latlng.lng); 
        map.setView(e.latlng, map.getZoom());
      },
    });

    console.log("Current location state:", location);

    return location.lat && location.lng ? <Marker position={[location.lat, location.lng]} /> : null;
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5">
        <h2 className="text-lg font-semibold mb-4">Select Location</h2>
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: "70%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
            <MoveToCurrentLocation location={location} />
          <LocationMarker />
        </MapContainer>
        <div className="mt-4">
          <p className="text-sm font-semibold">Selected Address:</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-300 py-2 px-4 rounded-lg mr-4"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={() => {
              console.log("Save Location clicked. Current location:", location);onSaveLocation({...location, address});
            }}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
