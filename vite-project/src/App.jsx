import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 18.5204, // Pune
  lng: 73.8567,
};

function App() {
  return (
    <div>
      <h1>Legal Directory - Nearby Lawyers</h1>

      <LoadScript googleMapsApiKey={import.meta.env.AIzaSyB36BJxilWHU9WAHENhQbOLH2v_F9s0_2U}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;