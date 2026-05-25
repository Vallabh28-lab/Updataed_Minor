import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons breaking in React/Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper component to smoothly handle panning when coordinates change
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 14, { animate: true });
    }
  }, [position, map]);
  return null;
}

function LegalMap({ initialLat, initialLng, prefillSearch }) {
  // Defaulting base coordinates to Bhosari, Pune (18.6122, 73.8488)
  const [center, setCenter] = useState({ lat: initialLat || 18.6122, lng: initialLng || 73.8488 });
  const [lawyers, setLawyers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [radius, setRadius] = useState(3000); // UI default: 3000 meters
  const [searchCity, setSearchCity] = useState(prefillSearch || "");
  const [userInput, setUserInput] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🏙️ Search by City Name (Uses Free OpenStreetMap Nominatim Geocoding)
  const handleCitySearch = async (manualCity) => {
    const city = manualCity || searchCity;
    if (!city) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCenter({ lat, lng });
        fetchLawyers(lat, lng, radius);
      } else {
        console.error("Location not found:", city);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  // 📍 Get User Location via Device GPS Sensor
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCenter({ lat, lng });
      fetchLawyers(lat, lng, radius);
    }, (err) => {
      console.warn("Geolocation failed:", err);
      fetchLawyers(center.lat, center.lng, radius);
    });
  };

  // 🚀 Rule-Based Category Detection
  const detectCategory = (text) => {
    const input = text.toLowerCase();
    if (input.includes("divorce") || input.includes("marriage")) return { category: "family lawyer", msg: "Searching for family law specialists..." };
    if (input.includes("land") || input.includes("rent") || input.includes("property")) return { category: "property lawyer", msg: "Searching for property legal experts..." };
    if (input.includes("police") || input.includes("arrest")) return { category: "criminal lawyer", msg: "Searching for criminal defense counsel..." };
    if (input.includes("fraud") || input.includes("hacking")) return { category: "cyber crime lawyer", msg: "Finding cyber law experts..." };
    if (input.includes("business") || input.includes("company")) return { category: "corporate lawyer", msg: "Searching for corporate legal advisors..." };
    return { category: "lawyer", msg: "Finding general legal professionals near you." };
  };

  const handleAiSearch = () => {
    if (!userInput) return;
    const { category, msg } = detectCategory(userInput);
    setAiMessage(msg);
    
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setCenter({ lat, lng });
      // FIX: Now explicitly passes detected category keyword down to request handler
      fetchLawyers(lat, lng, radius, category);
    }, () => {
      fetchLawyers(center.lat, center.lng, radius, category);
    });
  };

  // 🌐 Dynamic Fetch Handler - Aligned with FastAPI main.py GET Structure
  const fetchLawyers = (lat, lng, currentRadius, keyword = "lawyer") => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    
    // Shifted route target from '/lawyers/nearby' POST to '/lawyers' GET structure with query parameters
    const url = `${API_URL}/lawyers?lat=${lat}&lng=${lng}&radius=${currentRadius}&keyword=${encodeURIComponent(keyword)}`;
    
    console.log("📡 Fetching live Overpass elements from:", url);

    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Backend server error mapping coordinates");
        return res.json();
      })
      .then(data => {
        setLawyers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Map pipeline extraction failure:", err);
        setLawyers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRadiusSelection = (e) => {
    const targetRadius = Number(e.target.value);
    setRadius(targetRadius);
    fetchLawyers(center.lat, center.lng, targetRadius);
  };

  useEffect(() => {
    if (prefillSearch) {
      handleCitySearch(prefillSearch);
    } else if (initialLat && initialLng) {
      setCenter({ lat: initialLat, lng: initialLng });
      fetchLawyers(initialLat, initialLng, radius);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCenter({ lat, lng });
        fetchLawyers(lat, lng, radius);
      }, (error) => {
        console.error("Geolocation blocked/timed out. Reverting to base Bhosari coordinates:", error);
        fetchLawyers(18.6122, 73.8488, 3000); 
      });
    }
  }, [initialLat, initialLng, prefillSearch]);

  return (
    <div className="w-full text-slate-800">
      
      {/* 🤖 AI LAWYER FINDER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">AI Lawyer Finder</h3>
        <p className="text-slate-500 text-sm font-medium mb-4">Describe your legal problem and we'll find the right specialist for your location.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Describe your legal problem (e.g. My landlord is not returning my deposit...)" 
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
          />
          <button 
            onClick={handleAiSearch}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
          >
            {loading ? 'Processing...' : 'Find Lawyer'}
          </button>
        </div>

        {aiMessage && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <span className="text-xl">🤖</span>
            <p className="text-blue-900 font-bold text-sm leading-relaxed">{aiMessage}</p>
          </div>
        )}
      </div>

      {/* 🔍 Controls Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
        <div className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Search by Court Location (e.g. Pune Court)" 
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
          />
          <button 
            onClick={() => handleCitySearch()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button 
            type="button"
            onClick={getLocation}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 hover:bg-black transition-colors whitespace-nowrap"
          >
            📍 My Location
          </button>

          <select 
            value={radius}
            onChange={handleRadiusSelection}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
          >
            <option value={1000}>1 KM Radius</option>
            <option value={3000}>3 KM Radius</option>
            <option value={5000}>5 KM Radius</option>
            <option value={10000}>10 KM Radius</option>
          </select>
        </div>
      </div>

      {/* 🗺️ Free OpenStreetMap Leaflet Container */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative z-10" style={{ height: "500px" }}>
        <MapContainer center={[center.lat, center.lng]} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <RecenterMap position={center} />

          {/* User Location Center Pinpoint Marker */}
          <Marker position={[center.lat, center.lng]}>
            <Popup><div className="font-bold text-blue-600 text-xs">Search Center Axis</div></Popup>
          </Marker>

          {/* Lawyers Dynamic Markers Array */}
          {lawyers.map((lawyer, index) => {
            const lat = lawyer.lat;
            const lng = lawyer.lng;
            if (!lat || !lng) return null;

            return (
              <Marker 
                key={`marker-${lawyer.id || index}`} 
                position={[lat, lng]} 
                eventHandlers={{ click: () => setSelected(lawyer) }}
              >
                <Popup>
                  <div className="p-1 max-w-xs">
                    <h3 className="font-bold text-sm text-slate-950 mb-0.5">{lawyer.name}</h3>
                    <p className="text-[11px] text-blue-600 font-bold mb-1">{keyword !== "lawyer" ? keyword : "Legal Specialist"}</p>
                    <p className="text-xs text-slate-600 mb-1">{lawyer.address || lawyer.vicinity}</p>
                    <p className="text-xs font-semibold text-emerald-700">📞 Phone: {lawyer.phone}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* 📜 Dynamic Grid List View */}
      <div className="mt-8 space-y-4">
        <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-3">
          <span>📋</span> Nearby Specialists Found ({lawyers.length})
        </h4>
        
        {lawyers.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm">
              {loading ? "Fetching active OpenStreetMap nodes..." : "No specialists discovered in this radius yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyers.map((lawyer, index) => {
              return (
                <div 
                  key={`list-item-${lawyer.id || index}`} 
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selected?.id === lawyer.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  onClick={() => {
                    setSelected(lawyer);
                    setCenter({ lat: lawyer.lat, lng: lawyer.lng });
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-black text-slate-900 uppercase tracking-tight max-w-[80%]">{lawyer.name}</h5>
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-black tracking-widest">
                      ⭐ {lawyer.rating || "4.5"}
                    </span>
                  </div>
                  <p className="text-blue-600 text-[11px] font-bold mb-1">{keyword !== "lawyer" ? keyword : "Legal Counsel"}</p>
                  <p className="text-slate-500 text-xs font-medium mb-3">{lawyer.address || lawyer.vicinity}</p>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">📍 Focus on Map View</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default LegalMap;