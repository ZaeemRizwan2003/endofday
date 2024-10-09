import React, { useState } from 'react';

const Geolocation = ({ onLocationSelect }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null, error: null });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude, error: null });
          onLocationSelect({ latitude, longitude });
        },
        (error) => {
          setLocation({ ...location, error: error.message });
        }
      );
    } else {
      setLocation({ ...location, error: "Geolocation is not supported by this browser." });
    }
  };

  return (
    <div>
      {location.latitude && location.longitude && (
        <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>
      )}
      {location.error && <p>Error: {location.error}</p>}
    </div>
  );
};

export default Geolocation;
