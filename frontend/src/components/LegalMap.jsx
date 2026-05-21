import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "500px"
};

function LegalMap() {
  const [center, setCenter] = useState({ lat: 18.5204, lng: 73.8567 });
  const [lawyers, setLawyers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [radius, setRadius] = useState(3000);

  // 🚀 Auto-fetch data on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      // Test with Pune coordinates for better results
      const lat = 18.5204; // Pune
      const lng = 73.8567; // Pune
      // const lat = position.coords.latitude;
      // const lng = position.coords.longitude;

      setCenter({ lat, lng });

      const res = await fetch(
        `http://localhost:5000/api/lawyers?lat=${lat}&lng=${lng}&radius=5000`
      );

      const data = await res.json();
      setLawyers(data || []); // Fix: Ensure array
    }, (error) => {
      console.error('Geolocation error:', error);
      // Fallback to Pune if geolocation fails
      const lat = 18.5204;
      const lng = 73.8567;
      setCenter({ lat, lng });
      fetchLawyers(lat, lng, 5000);
    });
  }, []);

  // 📍 Get User Location (manual button)
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCenter({ lat, lng });
      fetchLawyers(lat, lng, radius);
    });
  };

  // 🌐 Fetch from Backend
  const fetchLawyers = (lat, lng, radius) => {
    fetch(`http://localhost:5000/api/lawyers?lat=${lat}&lng=${lng}&radius=${radius}`)
      .then(res => res.json())
      .then(data => setLawyers(data || [])) // Fix: Ensure array
      .catch(err => {
        console.error(err);
        setLawyers([]); // Fix: Set empty array on error
      });
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      loading="async"
    >
      
      {/* 🔍 Controls */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={getLocation}>📍 Find Nearby Lawyers</button>

        <select onChange={(e) => setRadius(e.target.value)}>
          <option value="1000">1 KM</option>
          <option value="3000">3 KM</option>
          <option value="5000">5 KM</option>
        </select>
      </div>

      {/* 🗺️ Map */}
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        
        {/* User Location Marker */}
        <Marker 
          position={center} 
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
              </svg>
            `),
            scaledSize: { width: 24, height: 24 }
          }}
        />

        {/* Lawyer Markers */}
        {Array.isArray(lawyers) &&
          lawyers.map((lawyer, index) => (
            <Marker
              key={index}
              position={{
                lat: lawyer.geometry?.location?.lat || lawyer.lat,
                lng: lawyer.geometry?.location?.lng || lawyer.lng,
              }}
              onClick={() => setSelected(lawyer)}
            />
          ))}

        {/* Info Window */}
        {selected && (
          <InfoWindow
            position={{
              lat: selected.geometry?.location?.lat || selected.lat,
              lng: selected.geometry?.location?.lng || selected.lng,
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h3>{selected.name}</h3>
              <p>{selected.vicinity || selected.address || "Address not available"}</p>
              <p>📞 {selected.international_phone_number || selected.phone || "No phone available"}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default LegalMap;